/* ================= Phòng luyện nói trực tuyến =================
   Danh sách phòng + tin nhắn: ntfy.sh (kênh công khai, không cần tài khoản)
   Giọng nói: WebRTC ngang hàng qua PeerJS (máy chủ tín hiệu công cộng 0.peerjs.com)
*/
const TK={ns:"hantuviet-x7k2",lobby:null,rooms:{},es:null,ok:false,room:null};
const TOPICS=["Tự giới thiệu bản thân","Gia đình của tôi","Sở thích","Công việc – học tập","Du lịch","Ăn uống – món ăn yêu thích","Mua sắm","Thời tiết – mùa","Luyện thi HSKK","Tự do trò chuyện"];
let __uid=null;function getUid(){if(!__uid){let u=null;try{u=JSON.parse(localStorage.getItem("htv_uid"))}catch(e){}if(!u){u=Math.random().toString(36).slice(2,10);try{localStorage.setItem("htv_uid",JSON.stringify(u))}catch(e){}}__uid=u}return __uid}
const myName=()=>{const u=store.get("user",null);return (u&&u.name)||store.get("talkName","")};
const ntfyURL=t=>"https://ntfy.sh/"+TK.ns+"-"+t;
async function ntfyPub(topic,obj){try{await fetch(ntfyURL(topic),{method:"POST",body:JSON.stringify(obj)})}catch(e){}}
function ntfySub(topic,since,onMsg,onOpen,onErr){
  let es;try{es=new EventSource(ntfyURL(topic)+"/sse?since="+since)}catch(e){onErr&&onErr();return null}
  es.onopen=()=>onOpen&&onOpen();es.onerror=()=>onErr&&onErr();
  es.onmessage=e=>{try{const m=JSON.parse(e.data);if(m.event==="message"&&m.message){onMsg(JSON.parse(m.message),m.time*1000)}}catch(x){}};
  return es;
}
const isArtifact=()=>/claude|claudeusercontent|anthropic/.test(location.hostname)||location.protocol==="file:";

/* ---------- Trang chọn chế độ luyện nói ---------- */
function openSpeak(){
  openModal(`<h3>🎤 Luyện nói</h3><p class="muted">Chọn cách luyện nói</p>
   <div class="spk2">
    <div class="spkc" onclick="closeModal();go('hskk')"><div class="ic">🧑‍🎓</div><b>Phần 1 · Luyện nói một mình</b><p>31 đề HSKK cao cấp có đồng hồ, nhập vai hội thoại HSK 1–3, nghe – nhắc lại.</p></div>
    <div class="spkc hot" onclick="closeModal();go('phongnoi')"><div class="ic">🎙️</div><b>Phần 2 · Phòng luyện nói trực tuyến <i class="bdg pink">LIVE</i></b><p>Tạo phòng, mời bạn bè vào nói chuyện bằng giọng nói trực tiếp, kèm gợi ý chủ đề.</p></div>
   </div>`);
}

/* ---------- Sảnh phòng ---------- */
function lobbyConnect(){
  if(TK.es)return;
  TK.ok=false;
  TK.es=ntfySub("lobby","3m",(m,t)=>{
    if(m.t==="room"){TK.rooms[m.code]={...m,seen:Date.now()}}
    else if(m.t==="close"){delete TK.rooms[m.code]}
    if(location.hash==="#phongnoi")drawRooms();
  },()=>{TK.ok=true;drawStatus()},()=>{TK.ok=false;drawStatus()});
  clearInterval(TK.sweep);TK.sweep=setInterval(()=>{const now=Date.now();let ch=false;for(const k in TK.rooms)if(now-TK.rooms[k].seen>100000){delete TK.rooms[k];ch=true}if(ch&&location.hash==="#phongnoi")drawRooms()},10000);
}
function drawStatus(){const el=$("#tkst");if(!el)return;const n=Object.values(TK.rooms).filter(r=>!r.priv).length;
  el.innerHTML=TK.ok?`<span class="dot g"></span> Đã kết nối máy chủ · ${n} phòng đang mở`:`<span class="dot r"></span> Đang kết nối máy chủ…`}
function renderLobby(){
  if(isArtifact()){$("#app").innerHTML=`<section class="card sec" style="margin:24px 0"><h3>🎙️ Phòng luyện nói trực tuyến</h3><p class="gex">Phòng luyện nói cần micro và kết nối mạng, chỉ hoạt động trên trang web chính:</p><p><a class="lnk" href="https://le-hye.github.io/hantuviet/#phongnoi">https://le-hye.github.io/hantuviet/#phongnoi</a></p></section>`;return}
  lobbyConnect();
  $("#app").innerHTML=`<div class="lob card">
   <div class="lobh"><div class="lobi">⚡</div><div><h2>Sảnh Phòng Luyện Nói & Trò Chuyện</h2><div class="tkst" id="tkst"></div></div>
    <button class="pill" style="margin-left:auto" onclick="go('hskk')">🧑‍🎓 Phần 1: Luyện nói một mình</button></div>
   <div class="lobb">
    <div class="mk"><div><b>Tự Tạo Phòng Luyện Nói Riêng Của Bạn 🎙️</b><p>Đặt tên phòng, chọn chủ đề đàm thoại và mời bạn bè vào nói chuyện trực tiếp</p></div><button class="gbtn" onclick="createRoomDlg()">＋ Tạo Phòng Mới</button></div>
    <div class="qj"><span style="color:var(--pur);font-weight:800">#</span> <b>Vào nhanh bằng mã:</b><input id="jcode" placeholder="VD: TALK-888" onkeydown="if(event.key==='Enter')joinByCode()"><button class="gbtn sm" onclick="joinByCode()">Vào Phòng</button></div>
    <div class="qs"><input id="rq" placeholder="🔍 Tìm kiếm phòng theo tên hoặc chủ đề…" oninput="drawRooms()"><button class="pill" onclick="TK.es&&TK.es.close();TK.es=null;TK.rooms={};lobbyConnect();drawRooms()" title="Làm mới">⟳</button></div>
    <div id="rlist"></div>
   </div></div>`;
  drawStatus();drawRooms();document.title="Phòng luyện nói – Hán Tự Việt";
}
function drawRooms(){
  const el=$("#rlist");if(!el)return;drawStatus();
  const q=strip(($("#rq")||{}).value||"");
  const rs=Object.values(TK.rooms).filter(r=>!r.priv&&(!q||strip(r.name+" "+r.topic+" "+r.code).includes(q))).sort((a,b)=>b.seen-a.seen);
  el.innerHTML=rs.length?`<div class="rgrid">${rs.map(r=>`<div class="rc"><div class="rct"><b>${esc(r.name)}</b><span class="lvb">${esc(r.level||"Mọi cấp")}</span></div>
    <div class="muted">💬 ${esc(r.topic)}</div><div class="muted">👤 Chủ phòng: ${esc(r.host||"")}</div>
    <div class="rcf"><span class="code">${r.code}</span><span>👥 ${r.count||1}/${r.max||8}</span><button class="gbtn sm" ${(r.count||1)>=(r.max||8)?"disabled":""} onclick="enterRoom('${r.code}')">${(r.count||1)>=(r.max||8)?"Đầy":"Vào phòng"}</button></div></div>`).join("")}</div>`
   :`<div class="empty2"><div style="font-size:44px">🎙️</div><b>Chưa có phòng luyện nói nào đang mở</b><p class="muted">Các phòng học sẽ tự động được dọn dẹp khi thành viên rời đi.<br>Hãy tạo phòng mới ngay để bắt đầu luyện nói nhé!</p><button class="gbtn" onclick="createRoomDlg()">＋ Tạo Phòng Mới Ngay</button></div>`;
}
function createRoomDlg(){
  openModal(`<h3>🎙️ Tạo phòng luyện nói</h3>
   <form onsubmit="event.preventDefault();createRoom()">
    <label class="field"><span>Tên của bạn</span><input id="rnm" required maxlength="24" value="${esc(myName())}" placeholder="VD: Huyền"></label>
    <label class="field"><span>Tên phòng</span><input id="rname" required maxlength="40" placeholder="VD: Luyện nói HSK 2 buổi tối"></label>
    <label class="field"><span>Chủ đề đàm thoại</span><select id="rtopic" style="width:100%;height:44px;margin-top:5px">${TOPICS.map(t=>`<option>${t}</option>`).join("")}</select></label>
    <div style="display:flex;gap:10px"><label class="field" style="flex:1"><span>Trình độ</span><select id="rlv" style="width:100%;height:44px;margin-top:5px"><option>Mọi cấp</option>${LVS.map(l=>`<option>${LV_INFO[l].n}</option>`).join("")}</select></label>
     <label class="field" style="flex:1"><span>Số người tối đa</span><select id="rmax" style="width:100%;height:44px;margin-top:5px">${[2,3,4,5,6,8].map(n=>`<option ${n===6?"selected":""}>${n}</option>`).join("")}</select></label></div>
    <label style="display:flex;gap:8px;align-items:center;margin-top:12px"><input type="checkbox" id="rpriv"> Phòng riêng (không hiện trong danh sách, chỉ vào bằng mã)</label>
    <button class="gbtn" style="width:100%;margin-top:16px;height:46px">Tạo phòng & vào ngay</button></form>
   <div class="note">Phòng dùng micro của bạn. Tên phòng và tin nhắn đi qua dịch vụ công cộng – đừng chia sẻ thông tin riêng tư.</div>`);
}
function createRoom(){
  const nm=$("#rnm").value.trim();store.set("talkName",nm);
  const code="TALK-"+(100+Math.random()*900|0);
  const r={t:"room",code,name:$("#rname").value.trim(),topic:$("#rtopic").value,level:$("#rlv").value,max:+$("#rmax").value,priv:$("#rpriv").checked,host:nm,count:1};
  TK.pending=r;closeModal();ntfyPub("lobby",r);TK.rooms[code]={...r,seen:Date.now()};go("phong-"+code);
}
function joinByCode(){let c=($("#jcode").value||"").trim().toUpperCase().replace(/\s/g,"");if(!c)return;if(/^\d+$/.test(c))c="TALK-"+c;if(!/^TALK-\d+$/.test(c)){toast("Mã phòng dạng TALK-123");return}enterRoom(c)}
function enterRoom(code){go("phong-"+code)}

/* ---------- Trong phòng ---------- */
function renderRoom(code){
  if(isArtifact()){renderLobby();return}
  if(TK.room&&TK.room.code===code){drawRoom();return}
  if(TK.room)leaveRoom(true);
  if(!myName()){openModal(`<h3>Bạn tên là gì?</h3><form onsubmit="event.preventDefault();store.set('talkName',$('#nm2').value.trim());closeModal();renderRoom('${code}')"><label class="field"><input id="nm2" required maxlength="24" placeholder="Tên hiển thị trong phòng"></label><button class="gbtn" style="width:100%;margin-top:12px">Vào phòng ${code}</button></form>`);$("#app").innerHTML="";return}
  const info=TK.pending&&TK.pending.code===code?TK.pending:(TK.rooms[code]||{code,name:"Phòng "+code,topic:"Tự do trò chuyện",level:"Mọi cấp",max:8});
  TK.room={code,info,host:!!(TK.pending&&TK.pending.code===code),members:{},chat:[],peer:null,stream:null,calls:{},muted:false,joined:Date.now()};
  TK.pending=null;
  drawRoom();startRoom();
}
function drawRoom(){
  const R=TK.room;if(!R)return;const i=R.info;
  $("#app").innerHTML=`<div class="crumb"><button class="pill" onclick="leaveRoom();go('phongnoi')">← Rời phòng</button><div class="path"><a onclick="go('phongnoi')">🎙️ Sảnh phòng</a>›<b>${esc(i.name)}</b></div><span class="pill blue">${R.code}</span><button class="pill" onclick="copyCode()">📋 Sao chép lời mời</button></div>
  <div class="rmg">
   <section class="card sec"><h3>🎙️ ${esc(i.name)}</h3><p class="muted">💬 ${esc(i.topic)} · ${esc(i.level||"Mọi cấp")} · tối đa ${i.max||8} người</p>
    <div id="mstat" class="note" style="margin:10px 0">Đang bật micro…</div>
    <div class="mems" id="mems"></div>
    <div class="ctl" style="justify-content:center;margin-top:16px"><button class="gbtn" id="mbtn" onclick="toggleMute()">🎤 Tắt micro</button><button class="pill" onclick="leaveRoom();go('phongnoi')" style="border-color:var(--red);color:var(--red2)">📞 Rời phòng</button></div>
    <div id="auds" style="display:none"></div>
    <h5>💡 Gợi ý câu hỏi luyện nói</h5><div id="sug"></div><button class="pill" onclick="drawSug()">🎲 Gợi ý khác</button>
   </section>
   <section class="card sec chatb"><h3>💬 Trò chuyện</h3><div class="chat" id="chat"></div>
    <form class="chf" onsubmit="event.preventDefault();sendChat()"><input id="chin" maxlength="300" placeholder="Nhắn tin (gõ được tiếng Trung)…" autocomplete="off"><button class="gbtn sm">Gửi</button></form></section>
  </div>`;
  drawMembers();drawChat();drawSug();document.title=i.name+" – Phòng luyện nói";
}
function drawSug(){const el=$("#sug");if(!el)return;const pool=[];
  CONVS[1].concat(CONVS[2],CONVS[3]).forEach(L=>L.s.forEach(s=>s.l.forEach(l=>{if(/[？?]$/.test(l[1])&&l[1].length>4)pool.push([l[1],l[2],l[3]])})));
  HSKK.forEach(d=>d[1].forEach(q=>pool.push(q)));
  const lv=(TK.room&&TK.room.info.level)||"";const P=/7/.test(lv)?HSKK.flatMap(d=>d[1]):pool;
  el.innerHTML=shuffle(P).slice(0,3).map(q=>`<div class="ex"><div class="acts"><button onclick="speak('${esc(q[0])}')">${ICO_SP}</button></div><div><div class="hz exzh">${hzLinks(q[0])}</div><div class="expy">${esc(q[1])}</div><div class="vi">${esc(q[2])}</div></div></div>`).join("")}
function drawMembers(){const R=TK.room,el=$("#mems");if(!R||!el)return;
  const ms=[{uid:getUid(),name:myName(),me:1,muted:R.muted},...Object.values(R.members)];
  el.innerHTML=ms.map(m=>`<div class="mem ${m.speaking?"spk":""}"><div class="av">${esc((m.name||"?")[0].toUpperCase())}</div><b>${esc(m.name)}${m.me?" (bạn)":""}</b><small>${m.muted?"🔇":"🎤"} ${m.me?"":(R.calls[m.uid]?"đã kết nối":"đang kết nối…")}</small></div>`).join("");
  const n=ms.length;if(R.info)R.info.count=n}
function drawChat(){const el=$("#chat");if(!el)return;const R=TK.room;
  el.innerHTML=R.chat.map(c=>c.sys?`<div class="cs">${esc(c.text)}</div>`:`<div class="cm ${c.uid===getUid()?"me":""}"><b>${esc(c.name)}</b><div>${hzLinks(c.text)}</div></div>`).join("")||`<div class="cs">Chưa có tin nhắn. Hãy chào mọi người: 大家好！</div>`;el.scrollTop=el.scrollHeight}
function sysMsg(t){if(!TK.room)return;TK.room.chat.push({sys:1,text:t});drawChat()}
function sendChat(){const v=$("#chin").value.trim();if(!v||!TK.room)return;$("#chin").value="";ntfyPub("r-"+TK.room.code,{t:"chat",uid:getUid(),name:myName(),text:v})}
function copyCode(){const R=TK.room;const t=`Vào phòng luyện nói tiếng Trung "${R.info.name}" cùng mình: https://le-hye.github.io/hantuviet/#phong-${R.code} (mã ${R.code})`;try{navigator.clipboard.writeText(t).then(()=>toast("Đã sao chép lời mời"),()=>toast(R.code))}catch(e){toast(R.code)}}

const peerId=(code,u)=>TK.ns+"-"+code.replace("TALK-","")+"-"+u;
async function startRoom(){
  const R=TK.room;
  try{R.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true}})}
  catch(e){$("#mstat").innerHTML="⚠️ Không bật được micro. Bạn vẫn nghe và nhắn tin được; hãy cho phép micro trong trình duyệt rồi vào lại phòng.";R.stream=null}
  // tín hiệu phòng
  R.es=ntfySub("r-"+R.code,"2m",(m)=>{if(TK.room!==R)return;onRoomMsg(m)},null,null);
  // peer
  if(!window.Peer){await new Promise(res=>{const s=document.createElement("script");s.src="peerjs.min.js";s.onload=res;s.onerror=res;document.head.appendChild(s)})}
  if(!window.Peer){$("#mstat").textContent="⚠️ Không tải được bộ kết nối giọng nói. Kiểm tra mạng rồi thử lại.";return}
  R.peer=new Peer(peerId(R.code,getUid()),{config:{iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:stun1.l.google.com:19302"}]}});
  R.peer.on("open",()=>{if(TK.room!==R)return;if(R.stream)$("#mstat").innerHTML="✅ Micro đang bật. Mọi người trong phòng sẽ nghe thấy bạn.";hello("join");});
  R.peer.on("call",call=>{call.answer(R.stream||undefined);wireCall(R,call,call.peer.split("-").pop())});
  R.peer.on("error",e=>{if(e.type==="unavailable-id"){$("#mstat").textContent="⚠️ Bạn đang mở phòng này ở tab khác."}});
  R.hb=setInterval(()=>hello("here"),40000);
  addEventListener("beforeunload",leaveRoomQuick);
}
function hello(kind){const R=TK.room;if(!R)return;ntfyPub("r-"+R.code,{t:kind,uid:getUid(),name:myName(),muted:R.muted});
  if(R.host||kind!=="join"||Object.keys(R.members).length===0){const i=R.info;ntfyPub("lobby",{t:"room",code:R.code,name:i.name,topic:i.topic,level:i.level,max:i.max,priv:!!i.priv,host:i.host||myName(),count:1+Object.keys(R.members).length})}
  const now=Date.now();for(const k in R.members)if(now-R.members[k].seen>100000){dropMember(k)}}
function onRoomMsg(m){const R=TK.room;if(m.uid===getUid())return;
  if(m.t==="room-info"&&!R.host){R.info={...R.info,...m.info};drawRoom();return}
  if(m.t==="join"||m.t==="here"){const isNew=!R.members[m.uid];R.members[m.uid]={...(R.members[m.uid]||{}),uid:m.uid,name:m.name,muted:m.muted,seen:Date.now()};
    if(isNew){sysMsg(m.name+" đã vào phòng");if(m.t==="join")hello("here");if(R.host&&m.t==="join")ntfyPub("r-"+R.code,{t:"room-info",uid:getUid(),info:R.info})}
    if(R.peer&&R.peer.open&&!R.calls[m.uid]&&getUid()<m.uid){const c=R.peer.call(peerId(R.code,m.uid),R.stream||silentStream());if(c)wireCall(R,c,m.uid)}
    drawMembers()}
  else if(m.t==="leave"){if(R.members[m.uid])sysMsg(R.members[m.uid].name+" đã rời phòng");dropMember(m.uid)}
  else if(m.t==="chat"){R.chat.push(m);if(R.chat.length>200)R.chat.shift();drawChat()}
  else if(m.t==="mute"&&R.members[m.uid]){R.members[m.uid].muted=m.muted;drawMembers()}
}
function silentStream(){const ac=new (window.AudioContext||window.webkitAudioContext)();const d=ac.createMediaStreamDestination();return d.stream}
function wireCall(R,call,u){R.calls[u]=call;
  call.on("stream",st=>{let a=document.getElementById("au-"+u);if(!a){a=document.createElement("audio");a.id="au-"+u;a.autoplay=true;a.playsInline=true;const box=$("#auds");(box||document.body).appendChild(a)}a.srcObject=st;a.play&&a.play().catch(()=>toast("Bấm vào trang để nghe âm thanh"));watchLevel(u,st);drawMembers()});
  call.on("close",()=>{delete R.calls[u];drawMembers()});call.on("error",()=>{delete R.calls[u];drawMembers()})}
function watchLevel(u,st){try{const ac=new (window.AudioContext||window.webkitAudioContext)();const an=ac.createAnalyser();ac.createMediaStreamSource(st).connect(an);const buf=new Uint8Array(an.frequencyBinCount);
  const tick=()=>{const R=TK.room;if(!R||!R.members[u])return;an.getByteFrequencyData(buf);const v=buf.reduce((a,b)=>a+b,0)/buf.length;const s=v>12;if(s!==!!R.members[u].speaking){R.members[u].speaking=s;drawMembers()}setTimeout(tick,250)};tick()}catch(e){}}
function dropMember(u){const R=TK.room;if(!R)return;delete R.members[u];if(R.calls[u]){try{R.calls[u].close()}catch(e){}delete R.calls[u]}const a=document.getElementById("au-"+u);if(a)a.remove();drawMembers()}
function toggleMute(){const R=TK.room;if(!R||!R.stream)return;R.muted=!R.muted;R.stream.getAudioTracks().forEach(t=>t.enabled=!R.muted);$("#mbtn").textContent=R.muted?"🔇 Bật micro":"🎤 Tắt micro";ntfyPub("r-"+R.code,{t:"mute",uid:getUid(),muted:R.muted});drawMembers()}
function leaveRoomQuick(){const R=TK.room;if(!R)return;try{navigator.sendBeacon&&navigator.sendBeacon(ntfyURL("r-"+R.code),JSON.stringify({t:"leave",uid:getUid(),name:myName()}))}catch(e){}
  if(Object.keys(R.members).length===0){try{navigator.sendBeacon(ntfyURL("lobby"),JSON.stringify({t:"close",code:R.code}))}catch(e){}}}
function leaveRoom(silent){const R=TK.room;if(!R)return;
  ntfyPub("r-"+R.code,{t:"leave",uid:getUid(),name:myName()});
  if(Object.keys(R.members).length===0)ntfyPub("lobby",{t:"close",code:R.code});
  clearInterval(R.hb);try{R.es&&R.es.close()}catch(e){}Object.values(R.calls).forEach(c=>{try{c.close()}catch(e){}});
  try{R.peer&&R.peer.destroy()}catch(e){}if(R.stream)R.stream.getTracks().forEach(t=>t.stop());
  document.querySelectorAll("[id^=au-]").forEach(a=>a.remove());removeEventListener("beforeunload",leaveRoomQuick);TK.room=null;
  if(!silent)toast("Đã rời phòng")}
