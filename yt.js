/* ================= Học chép chính tả qua video YouTube / TikTok ================= */
const isCJK=s=>/[㐀-鿿]/.test(s);
function ytId(u){const m=(u||"").match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/);return m?m[1]:""}
function ttId(u){const m=(u||"").match(/tiktok\.com\/.*\/video\/(\d+)/);return m?m[1]:""}
function tsec(s){s=s.replace(",",".");const p=s.split(":").map(Number);return p.length===3?p[0]*3600+p[1]*60+p[2]:p.length===2?p[0]*60+p[1]:+p[0]}
const fmtT=t=>t==null?"":Math.floor(t/60)+":"+String(Math.floor(t%60)).padStart(2,"0");
function parseTr(txt){
  const lines=txt.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);const segs=[];let pt=null,pe=null;
  const T="((?:\\d{1,2}:)?\\d{1,2}:\\d{2}(?:[.,]\\d{1,3})?)";
  for(let i=0;i<lines.length;i++){let l=lines[i];
    if(/^WEBVTT|^NOTE\b|^Kind:|^Language:/i.test(l))continue;
    if(/^\d+$/.test(l)&&lines[i+1]&&/-->/.test(lines[i+1]))continue;
    if(/^\d+\s*(giây|seconds?|phút|minutes?)/i.test(l))continue;
    let m=l.match(new RegExp("^"+T+"\\s*-->\\s*"+T));
    if(m){pt=tsec(m[1]);pe=tsec(m[2]);continue}
    m=l.match(new RegExp("^\\[?"+T+"\\]?\\s*(.*)$"));
    if(m){pt=tsec(m[1]);pe=null;l=m[2].trim();if(!l)continue}
    l=l.replace(/<[^>]+>/g,"").trim();if(!l)continue;
    if(isCJK(l)){
      if(pt!=null){segs.push({t:pt,e:pe,zh:l,vi:""});pt=null;pe=null}
      else{const parts=splitSent(l);parts.forEach(p=>segs.push({t:null,e:null,zh:p,vi:""}))}
    }else if(segs.length){const s=segs[segs.length-1];s.vi=s.vi?s.vi+" "+l:l}
  }
  segs.forEach((s,i)=>{if(s.t!=null&&s.e==null){const n=segs.slice(i+1).find(x=>x.t!=null);s.e=n?n.t:s.t+6}});
  return segs;
}

/* ---------- tạo bài ---------- */
function vCreateDlg(){
  openModal(`<h3>🎬 Tạo bài nghe – chép từ video</h3><p class="muted">Dán link YouTube hoặc TikTok và lời thoại tiếng Trung.</p>
  <form onsubmit="event.preventDefault();vSave()">
   <label class="field"><span>Link video (YouTube / TikTok)</span><input id="vl" placeholder="https://www.youtube.com/watch?v=… hoặc https://www.tiktok.com/@…/video/…" oninput="vPrev()"></label>
   <div id="vprev" class="muted" style="font-size:13px;margin-top:4px"></div>
   <label class="field"><span>Tên bài</span><input id="vt" required maxlength="80" placeholder="VD: Sách bài tập HSK6 – File nghe bài 8"></label>
   <label class="field"><span>Cấp độ</span><select id="vlv" style="width:100%;height:44px;margin-top:5px">${[1,2,3,4,5,6,7].map(l=>`<option value="${l}">${LV_INFO[l].n}</option>`).join("")}<option value="0" selected>Không xác định</option></select></label>
   <label class="field"><span>Lời thoại (có mốc thời gian càng tốt)</span><textarea id="vz" rows="8" required oninput="vPrev()" placeholder="0:03&#10;第八课 遇见原来的我&#10;0:07&#10;一、听力…"></textarea></label>
   <details style="margin-top:8px"><summary class="lnk">❓ Lấy lời thoại YouTube thế nào?</summary><div class="note">Mở video trên YouTube (máy tính) → bấm <b>…Thêm</b> dưới video → <b>Hiện bản chép lời</b> → bôi đen toàn bộ bản chép lời → Ctrl+C → dán vào ô trên. Web tự nhận mốc thời gian để phát đúng từng câu. Có thể dán file phụ đề .srt/.vtt. Nếu phụ đề song ngữ (Trung + Việt), dòng tiếng Việt tự được dùng làm nghĩa.<br>TikTok không cho điều khiển tua từng câu, nên câu sẽ được đọc bằng giọng máy.</div></details>
   <label class="field"><span>Nghĩa tiếng Việt (không bắt buộc, mỗi câu một dòng)</span><textarea id="vv" rows="3"></textarea></label>
   <button class="gbtn" style="width:100%;margin-top:14px;height:46px">Tạo bài</button>
  </form>
  <details style="margin-top:12px"><summary class="lnk">📥 Nhập bài từ mã chia sẻ</summary><textarea id="vimp" rows="3" class="dta" style="font-size:13px;font-family:monospace;margin-top:8px" placeholder="Dán mã bài…"></textarea><button class="pill" style="margin-top:8px" onclick="vImport()">Nhập</button></details>`);
}
function vPrev(){const u=$("#vl").value,z=$("#vz").value;const y=ytId(u),t=ttId(u);const segs=z?parseTr(z):[];const timed=segs.filter(s=>s.t!=null).length;
  $("#vprev").innerHTML=(u?(y?"✅ Video YouTube":t?"✅ Video TikTok (đọc câu bằng giọng máy)":/vm\.tiktok|vt\.tiktok/.test(u)?"⚠️ Hãy mở link TikTok rút gọn rồi dán link đầy đủ có /video/…":"⚠️ Link chưa đúng"):"")+(segs.length?` · ${segs.length} câu${timed?` (${timed} câu có mốc thời gian)`:""}`:"")}
function vSave(){const u=$("#vl").value.trim(),y=ytId(u),t=ttId(u);const segs=parseTr($("#vz").value);if(!segs.length){toast("Chưa có câu tiếng Trung nào");return}
  const vis=$("#vv").value.split(/\n+/).map(s=>s.trim()).filter(Boolean);segs.forEach((s,i)=>{if(!s.vi&&vis[i])s.vi=vis[i]});
  const c={id:"tc"+Date.now().toString(36),title:$("#vt").value.trim(),lvl:+$("#vlv").value,sub:y?"Video YouTube":t?"Video TikTok":"Đoạn văn tự nhập",src:"Bài của bạn",emo:"🎬",yt:y,tt:t,url:u,sent:segs.map(s=>({zh:s.zh,py:"",vi:s.vi,t:s.t,e:s.e}))};
  store.set("dcustom",[...store.get("dcustom",[]),c]);DLIB.list=null;closeModal();toast("Đã tạo bài "+segs.length+" câu");go("vd-"+c.id)}
function vExport(id){const c=store.get("dcustom",[]).find(x=>x.id===id);if(!c)return;const code=btoa(unescape(encodeURIComponent(JSON.stringify(c))));
  openModal(`<h3>📤 Chia sẻ bài</h3><p class="muted">Gửi mã này cho học viên. Họ vào <b>Chép chính tả → Tự chọn → Tạo bài → Nhập bài từ mã</b>.</p><textarea class="dta" rows="6" style="font-size:12px;font-family:monospace" onclick="this.select()" readonly>${code}</textarea><div class="ctl"><button class="gbtn sm" onclick="navigator.clipboard.writeText(document.querySelector('#modal textarea').value).then(()=>toast('Đã sao chép mã'),()=>toast('Hãy bôi đen và Ctrl+C'))">📋 Sao chép mã</button></div>`)}
function vImport(){try{const c=JSON.parse(decodeURIComponent(escape(atob($("#vimp").value.trim()))));if(!c.sent)throw 0;c.id="tc"+Date.now().toString(36);store.set("dcustom",[...store.get("dcustom",[]),c]);DLIB.list=null;closeModal();toast("Đã nhập bài");go("vd-"+c.id)}catch(e){toast("Mã bài không hợp lệ")}}
function vDelete(id){if(!window.__delOk){window.__delOk=1;toast("Bấm Xoá lần nữa để xác nhận");setTimeout(()=>window.__delOk=0,3000);return}store.set("dcustom",store.get("dcustom",[]).filter(x=>x.id!==id));const P=dProg();delete P[id];store.set("dprog",P);DLIB.list=null;go("chinhta")}

/* ---------- học ---------- */
let VX=null;
function ytAPI(){return new Promise(r=>{if(window.YT&&YT.Player)return r();const prev=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{prev&&prev();r()};if(!document.getElementById("ytapi")){const s=document.createElement("script");s.id="ytapi";s.src="https://www.youtube.com/iframe_api";document.head.appendChild(s)}})}
function renderVLesson(id){
  const L=store.get("dcustom",[]).find(x=>x.id===id);if(!L){go("chinhta");return}
  const P=dProg()[id]||{};if(VX&&VX.tm)clearInterval(VX.tm);
  VX={L,i:0,per:store.get("vper",1),res:P.res||[],easy:store.get("veasy",false),hideV:false,hint:0,showSub:true,checked:false,yp:null};
  const first=L.sent.findIndex((_,k)=>!VX.res[k]||VX.res[k].score<90);VX.i=first<0?0:first;
  const timed=L.yt&&L.sent.some(s=>s.t!=null);
  $("#app").innerHTML=`<div class="crumb"><button class="pill" onclick="go('chinhta')">← Thư viện</button><b style="flex:1;font-size:17px">${esc(L.title)}</b>
   <button class="pill" onclick="vExport('${id}')">📤 Chia sẻ</button><button class="pill" style="color:var(--red2)" onclick="vDelete('${id}')">🗑 Xoá</button></div>
  <div class="vlay">
   <div>
    <div id="vbox" class="vbox">${L.yt?`<div class="ytw"><div id="ytp"></div></div>`:L.tt?`<div class="ttw"><iframe src="https://www.tiktok.com/embed/v2/${L.tt}" allow="encrypted-media;fullscreen" allowfullscreen></iframe></div>`:`<div class="dplayer" style="background:linear-gradient(135deg,#a855f7,#ec4899)"><div class="demo big">🎧</div><div class="dsub">Nghe bằng giọng máy</div></div>`}</div>
    ${!timed&&(L.yt||L.tt)?`<div class="note">ℹ️ Lời thoại không có mốc thời gian${L.tt?" / TikTok không cho tua từng câu":""} – câu sẽ được đọc bằng giọng máy. Xem video ở trên để nghe giọng thật.</div>`:""}
    <section class="card sec" style="margin-top:14px"><h3>Phụ đề <span class="muted" id="vcnt"></span><span class="r"><button class="tg" onclick="VX.showSub=!VX.showSub;vDrawSubs()" id="vsubt">⌃ Ẩn</button></span></h3><div id="vsubs" class="vsubs"></div></section>
   </div>
   <section class="card sec vpanel">
    <div style="display:flex;align-items:center;gap:10px"><b>Chép chính tả</b><span class="pill" style="margin-left:auto;height:30px" id="vpos"></span></div>
    <div class="qbar"><i id="vbar"></i></div>
    <div class="ctl" style="margin-top:4px"><button class="tg" id="vhide" onclick="vHideVideo()">🙈 Ẩn video</button><button class="tg" onclick="vKeys()">⌨️ Phím tắt</button><button class="tg ${VX.easy?"on":""}" id="veasy" style="margin-left:auto" onclick="VX.easy=!VX.easy;store.set('veasy',VX.easy);this.classList.toggle('on');vDraw()">${"Chế độ dễ"}</button></div>
    <div class="vrow"><small class="muted">CÂU</small><span style="margin-left:auto" class="muted" >SỐ CÂU/LƯỢT</span>${[1,2,3,4,5].map(n=>`<button class="vper ${VX.per===n?"on":""}" onclick="VX.per=${n};store.set('vper',${n});vDraw()">${n}</button>`).join("")}</div>
    <div class="vdots-w"><button class="vnav" onclick="vGo(-1)">‹</button><div class="vdots" id="vdots"></div><button class="vnav" onclick="vGo(1)">›</button></div>
    <div class="vin"><textarea id="vans" rows="3" placeholder="Nhập những gì bạn nghe được…"></textarea>
     <div class="vmask"><div class="vtools"><button title="Gợi ý thêm 1 chữ (Ctrl+H)" onclick="vHint()">💡</button><button title="Nghe bằng giọng máy" onclick="vTTS()">🔈</button><button title="Xem nghĩa tiếng Việt" onclick="vShowVi()">🌐</button></div><div id="vmask" class="hz"></div><div id="vvi" class="vi" style="display:none"></div></div>
     <div id="vres"></div></div>
    <div class="vbot"><button class="pill" onclick="vPlay()">▶ Phát lại</button><button class="pill" title="Làm lại câu" onclick="vRedo()">↻</button><button class="gbtn" style="flex:1" id="vnext" onclick="vMain()">Kiểm tra</button></div>
   </section>
  </div>`;
  document.title=L.title+" – Chép chính tả video";
  const ta=$("#vans");ta.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey&&!e.ctrlKey){e.preventDefault();vMain()}});
  vDraw();
  if(L.yt){ytAPI().then(()=>{VX.yp=new YT.Player("ytp",{videoId:L.yt,playerVars:{rel:0,playsinline:1,modestbranding:1,cc_load_policy:0,iv_load_policy:3},events:{onReady:()=>{VX.ready=true}}})})}
}
const vGroup=()=>{const n=VX.L.sent.length;const a=VX.i,b=Math.min(n,a+VX.per);return [a,b]};
function vRef(){const [a,b]=vGroup();return VX.L.sent.slice(a,b).map(s=>s.zh).join("")}
function vDraw(){const L=VX.L,n=L.sent.length,[a,b]=vGroup();const done=VX.res.filter(r=>r&&r.score>=90).length;
  $("#vpos").textContent=`${a+1}${b-a>1?"–"+b:""}/${n}`;$("#vbar").style.width=(done/n*100)+"%";
  document.querySelectorAll(".vper").forEach((x,k)=>x.classList.toggle("on",k+1===VX.per));
  $("#vdots").innerHTML=L.sent.map((s,k)=>{const r=VX.res[k];const cls=k>=a&&k<b?"cur":r?(r.score>=90?"ok":"bad"):"";return `<button class="vdot ${cls}" onclick="VX.i=${k};VX.hint=0;VX.checked=false;vDraw();vPlay()">${r&&r.score>=90&&!(k>=a&&k<b)?"✓":k+1}</button>`}).join("");
  const cur=$("#vdots .cur");if(cur)cur.scrollIntoView({inline:"center",block:"nearest",behavior:"smooth"});
  $("#vans").value="";$("#vres").innerHTML="";VX.checked=false;$("#vnext").textContent="Kiểm tra";
  $("#vvi").style.display="none";$("#vvi").textContent=L.sent.slice(a,b).map(s=>s.vi).filter(Boolean).join(" ")||"(Chưa có nghĩa tiếng Việt)";
  vMask();vDrawSubs();setTimeout(()=>$("#vans")&&$("#vans").focus(),50);
}
function vMask(){const ref=vRef();let k=0;const html=[...ref].map(c=>{if(!isCJK(c)&&!/[a-zA-Z0-9]/.test(c))return `<span class="vp">${esc(c)}</span>`;k++;const show=k<=VX.hint;return `<span class="vc ${show?"sh":""}">${show?c:"*"}</span>`}).join("");
  let py="";if(VX.easy){const [a,b]=vGroup();py=VX.L.sent.slice(a,b).map(s=>s.py).filter(Boolean).join(" ")}
  $("#vmask").innerHTML=`<div class="vchars">${html}</div>${VX.easy?`<div class="muted" style="font-size:13px;margin-top:6px">Chế độ dễ: ${[...ref].filter(isCJK).length} chữ${py?" · "+esc(py):""}</div>`:""}`}
function vDrawSubs(){const L=VX.L,el=$("#vsubs");if(!el)return;$("#vcnt").textContent=`(${VX.res.filter(r=>r&&r.score>=90).length}/${L.sent.length})`;$("#vsubt").textContent=VX.showSub?"⌃ Ẩn":"⌄ Hiện";
  if(!VX.showSub){el.innerHTML="";return}const [a,b]=vGroup();
  el.innerHTML=L.sent.map((s,k)=>{const r=VX.res[k],ok=r&&r.score>=90;return `<div class="vsub ${k>=a&&k<b?"cur":""} ${ok?"ok":""}" onclick="VX.i=${k};VX.hint=0;vDraw();vPlay()"><div class="vsh"><span class="vn">${k+1}</span><b>CÂU ${k+1}</b>${s.t!=null?`<small class="muted">${fmtT(s.t)}</small>`:""}${ok?`<span class="vdone">Đã hoàn thành</span>`:r?`<span class="vdone bad">${r.score}%</span>`:""}</div>
   ${ok?`<div class="hz" style="font-size:18px">${hzLinks(s.zh)}</div>${s.vi?`<div class="muted" style="border-top:1px dashed var(--line2);margin-top:6px;padding-top:6px">${esc(s.vi)}</div>`:""}`:`<div class="muted">${"＿".repeat(Math.min(16,[...s.zh].filter(isCJK).length))}</div>`}</div>`}).join("")}
function vPlay(slow){const [a,b]=vGroup(),S=VX.L.sent;const s0=S[a],s1=S[b-1];
  if(VX.yp&&VX.ready&&s0.t!=null){const st=Math.max(0,s0.t-0.15),en=(s1.e!=null?s1.e:s1.t+6)+0.2;try{VX.yp.setPlaybackRate(slow?0.75:1);VX.yp.seekTo(st,true);VX.yp.playVideo()}catch(e){}
    clearInterval(VX.tm);VX.tm=setInterval(()=>{try{if(VX.yp.getCurrentTime()>=en){VX.yp.pauseVideo();clearInterval(VX.tm)}}catch(e){clearInterval(VX.tm)}},100)}
  else speak(vRef(),{slow})}
function vTTS(){speak(vRef(),{slow:1})}
function vShowVi(){const v=$("#vvi");v.style.display=v.style.display==="none"?"block":"none"}
function vHint(){VX.hint++;vMask()}
function vMain(){if(VX.checked){vGo(1);setTimeout(vPlay,250);return}
  const ans=$("#vans").value.trim();if(!ans){vPlay();return}
  const ref=vRef(),d=dDiff(ans,ref),[a,b]=vGroup();for(let k=a;k<b;k++)VX.res[k]={score:d.score};
  if(d.score>=90)addPts(10*(b-a));vSaveP();VX.checked=true;
  $("#vres").innerHTML=`<div class="dres2"><b style="color:${d.score>=90?"var(--grn)":d.score>=60?"var(--yel)":"var(--red2)"}">${d.score>=90?"✅ Chính xác!":d.score>=60?"🙂 Gần đúng":"❌ Nghe lại nhé"} ${d.score}%</b><div class="hz dcmp">${d.html}</div></div>`;
  VX.hint=99;vMask();$("#vvi").style.display="block";$("#vnext").textContent=b>=VX.L.sent.length?"Hoàn thành 🎉":"Tiếp ›";
  document.querySelectorAll(".vdot").forEach((x,k)=>{if(k>=a&&k<b)x.classList.add(d.score>=90?"ok":"bad")});vDrawSubs();$("#vbar").style.width=(VX.res.filter(r=>r&&r.score>=90).length/VX.L.sent.length*100)+"%"}
function vGo(d){const n=VX.L.sent.length;let i=VX.i+d*VX.per;if(i>=n){vFinish();return}VX.i=Math.max(0,i);VX.hint=0;vDraw()}
function vRedo(){const [a,b]=vGroup();for(let k=a;k<b;k++)VX.res[k]=null;vSaveP();VX.hint=0;vDraw();vPlay()}
function vSaveP(){const P=dProg(),n=VX.L.sent.length,rs=VX.res.filter(Boolean);P[VX.L.id]={res:VX.res,done:VX.L.sent.every((_,k)=>VX.res[k]),score:Math.round(rs.reduce((a,r)=>a+r.score,0)/n),t:Date.now()};store.set("dprog",P)}
function vFinish(){const n=VX.L.sent.length,sc=Math.round(VX.res.reduce((a,r)=>a+(r?r.score:0),0)/n);openModal(`<div class="soonbox"><div class="ic">🎉</div><h3>Hoàn thành bài!</h3><div class="qq" style="font-family:inherit;font-weight:800">${sc}%</div><p class="muted">${VX.res.filter(r=>r&&r.score>=90).length}/${n} câu chính xác</p><div class="ctl" style="justify-content:center"><button class="gbtn" onclick="closeModal();const P=dProg();delete P['${VX.L.id}'];store.set('dprog',P);renderVLesson('${VX.L.id}')">↻ Làm lại cả bài</button><button class="pill" onclick="closeModal();go('chinhta')">Về thư viện</button></div></div>`)}
function vHideVideo(){VX.hideV=!VX.hideV;$("#vbox").classList.toggle("hid",VX.hideV);$("#vhide").textContent=VX.hideV?"👁 Hiện video":"🙈 Ẩn video"}
function vKeys(){openModal(`<h3>⌨️ Phím tắt</h3><table class="vt"><tbody>
 <tr><td><span class="kbd">Enter</span></td><td>Kiểm tra / sang câu tiếp (ô trống: phát lại)</td></tr>
 <tr><td><span class="kbd">Ctrl + Space</span></td><td>Phát lại câu</td></tr>
 <tr><td><span class="kbd">Ctrl + ↓</span></td><td>Phát chậm</td></tr>
 <tr><td><span class="kbd">Ctrl + H</span></td><td>Gợi ý thêm 1 chữ</td></tr>
 <tr><td><span class="kbd">Ctrl + → / ←</span></td><td>Câu tiếp / câu trước</td></tr></tbody></table>`)}
document.addEventListener("keydown",e=>{if(!VX||!/^#vd-/.test(location.hash)||!e.ctrlKey)return;
  const k=e.key;if(k===" "){e.preventDefault();vPlay()}else if(k==="ArrowDown"){e.preventDefault();vPlay(1)}else if(k.toLowerCase()==="h"){e.preventDefault();vHint()}else if(k==="ArrowRight"){e.preventDefault();vGo(1);vPlay()}else if(k==="ArrowLeft"){e.preventDefault();vGo(-1);vPlay()}});
