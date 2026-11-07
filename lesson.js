/* ================= Trang bài học: Shadowing · Phát âm · Luyện nghe · Bài tập ================= */
/* --- tiện ích: tách từ & pinyin --- */
let WSET=null,WMAX=4;
function wset(){if(WSET)return WSET;WSET=new Set();LVS.forEach(l=>VOCAB[l].forEach(w=>{if(w[0].length<=6)WSET.add(w[0])}));return WSET}
function segWords(s){const W=wset(),out=[];let i=0;const ch=[...s];
  while(i<ch.length){if(!isCJK(ch[i])){let j=i;while(j<ch.length&&!isCJK(ch[j]))j++;out.push(ch.slice(i,j).join(""));i=j;continue}
    let f=1;for(let L=Math.min(WMAX,ch.length-i);L>1;L--){const w=ch.slice(i,i+L).join("");if(W.has(w)){f=L;break}}out.push(ch.slice(i,i+f).join(""));i+=f}
  return out}
let __ppReq=null;
function needPinyin(){if(window.pinyinPro)return Promise.resolve();if(!__ppReq)__ppReq=new Promise(r=>{const s=document.createElement("script");s.src="pinyinpro.js";s.onload=r;s.onerror=r;document.head.appendChild(s)});return __ppReq}
const PUNV={"，":",","。":".","！":"!","？":"?","、":",","；":";","：":":","“":"\"","”":"\""};
function autoPy(s){if(!window.pinyinPro)return "";try{const arr=pinyinPro.pinyin(s,{type:"array",toneType:"symbol",nonZh:"spaced"});const ch=[...s];let i=0;const out=[];
  segWords(s).forEach(w=>{const n=[...w].length;if(isCJK(w)){out.push(arr.slice(i,i+n).join(""))}else{const t=w.trim();if(t)out.push([...t].map(c=>PUNV[c]||c).join(""))}i+=n});
  return out.join(" ").replace(/\s+([,.!?;:])/g,"$1")}catch(e){return ""}}
const pyOf=s=>s.py||autoPy(s.zh);

/* --- lấy bài --- */
function getLesson(id){return buildDLib().find(x=>x.id===id)}
let LX=null;
const LTABS=[["sh","🎬","Shadowing"],["pa","🎙️","Phát âm"],["ln","🎧","Luyện nghe"],["bt","📝","Bài tập"]];
const LMODES={ct:["Chép chính tả","Nghe và gõ lại nội dung để cải thiện độ chính xác khi nghe","#00c16a","📖"],dt:["Điền từ","Nghe từng câu và điền những từ vựng quan trọng còn thiếu","#3b82f6","🤖"],ld:["Luyện dịch","Hiểu ngữ cảnh, dùng từ chuẩn như người bản xứ","#f0974a","🌐"]};

function renderL(id,tab){
  const x=getLesson(id);if(!x){go("chinhta");return}
  if(LX&&LX.tm)clearInterval(LX.tm);
  const P=dProg()[id]||{};
  LX={x,id,tab:tab||store.get("ltab","ln"),mode:store.get("lmode","ct"),i:0,per:store.get("vper",1),res:P.res||[],easy:store.get("veasy",false),hint:0,checked:false,yp:null,ready:false,showSub:true,hideV:false,
      sub:{},rec:{},recog:null};
  const f=x.sent.findIndex((_,k)=>!LX.res[k]||LX.res[k].score<90);LX.i=f<0?0:f;
  const timed=x.yt&&x.sent.some(s=>s.t!=null);
  $("#app").innerHTML=`<div class="lhd"><button class="pill" onclick="go('chinhta')">←</button><b class="lht">${esc(x.title)}${x.lv&&x.lv!=="tc"?` | HSK${x.lv}`:""}</b>
    <div class="ltabs">${LTABS.map(([k,ic,t])=>`<button class="ltab ${LX.tab===k?"on":""}" data-t="${k}" onclick="lTab('${k}')">${ic} ${t}</button>`).join("")}</div>
    ${x.custom?`<span class="lhx"><button class="tg" onclick="vExport('${id}')">📤</button><button class="tg" onclick="vDelete('${id}')">🗑</button></span>`:""}</div>
  <div class="vlay">
   <div>
    <div id="vbox" class="vbox">${x.yt?`<div class="ytw"><div id="ytp"></div></div>`:x.tt?`<div class="ttw"><iframe src="https://www.tiktok.com/embed/v2/${x.tt}" allow="encrypted-media;fullscreen" allowfullscreen></iframe></div>`:`<div class="dplayer" style="background:linear-gradient(135deg,${GRADS[id.length%GRADS.length].join(",")})"><div class="demo big">${x.emo||"🎧"}</div><div class="dsub hz" id="lcap">▶</div></div>`}</div>
    ${!timed&&(x.yt||x.tt)?`<div class="note">ℹ️ Không có mốc thời gian${x.tt?" / TikTok không cho tua từng câu":""} – câu được đọc bằng giọng máy.</div>`:""}
    <section class="card sec" style="margin-top:14px"><h3>Phụ đề <span class="muted" id="vcnt"></span><span class="r"><button class="tg" id="vsubt" onclick="LX.showSub=!LX.showSub;lSubs()">⌃ Ẩn</button></span></h3><div id="vsubs" class="vsubs"></div></section>
   </div>
   <section class="card sec vpanel" id="lpanel"></section>
  </div>`;
  document.title=x.title+" – Hán Tự Việt";
  if(x.yt){ytAPI().then(()=>{LX.yp=new YT.Player("ytp",{videoId:x.yt,playerVars:{rel:0,playsinline:1,modestbranding:1,cc_load_policy:0,iv_load_policy:3},events:{onReady:()=>{LX.ready=true}}})})}
  needPinyin().then(()=>{if(LX&&LX.id===id){lPanel();lSubs()}});
  lPanel();lSubs();
  if(LX.tab==="ln"&&!store.get("lmodeSet",false))setTimeout(lModeDlg,200);
}
function lTab(k){if(k==="ln"){LX.tab="ln";store.set("ltab","ln");document.querySelectorAll(".ltab").forEach(b=>b.classList.toggle("on",b.dataset.t===k));lModeDlg();return}
  LX.tab=k;store.set("ltab",k);document.querySelectorAll(".ltab").forEach(b=>b.classList.toggle("on",b.dataset.t===k));stopRecog();LX.i=0;LX.hint=0;LX.checked=false;lPanel();lSubs()}
function lModeDlg(){openModal(`<div style="text-align:center"><h2 style="font-size:24px">Chọn chế độ học</h2><p class="muted">Chọn cách bạn muốn luyện tập với bài này</p></div>
  <div class="lmodes">${Object.entries(LMODES).map(([k,[t,d,c,ic]])=>`<div class="lmode" style="--c:${c}"><div class="lmi">${ic}</div><b>${t}</b><p>${d}</p><button style="background:${c}" onclick="lSetMode('${k}')">Chọn</button></div>`).join("")}</div>`);
  $("#modal").classList.add("wide")}
function lSetMode(k){LX.mode=k;store.set("lmode",k);store.set("lmodeSet",true);closeModal();$("#modal").classList.remove("wide");LX.tab="ln";LX.i=LX.mode==="ct"?LX.i:0;LX.hint=0;LX.checked=false;lPanel();lSubs()}

/* --- phát âm thanh --- */
function lRange(){const n=LX.x.sent.length,a=LX.i,b=LX.tab==="ln"&&LX.mode==="ct"?Math.min(n,a+LX.per):a+1;return [a,b]}
const lRef=()=>{const [a,b]=lRange();return LX.x.sent.slice(a,b).map(s=>s.zh).join("")};
function lPlay(slow,cb){const [a,b]=lRange(),S=LX.x.sent,s0=S[a],s1=S[b-1];const cap=$("#lcap");if(cap)cap.textContent=LX.tab==="ln"?"🎧 Câu "+(a+1):s0.zh;
  if(LX.yp&&LX.ready&&s0.t!=null){const st=Math.max(0,s0.t-0.15),en=(s1.e!=null?s1.e:s1.t+6)+0.2;try{LX.yp.setPlaybackRate(slow?0.75:1);LX.yp.seekTo(st,true);LX.yp.playVideo()}catch(e){}
    clearInterval(LX.tm);LX.tm=setInterval(()=>{try{if(LX.yp.getCurrentTime()>=en){LX.yp.pauseVideo();clearInterval(LX.tm);cb&&cb((en-st)*1000)}}catch(e){clearInterval(LX.tm)}},100)}
  else{try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(lRef());u.lang="zh-CN";u.rate=slow?.55:.85;const cn=voices.filter(v=>/CN|cmn/i.test(v.lang));if(cn.length)u.voice=cn[0];const t0=Date.now();u.onend=()=>cb&&cb(Date.now()-t0);speechSynthesis.speak(u)}catch(e){}}}

/* --- danh sách phụ đề --- */
function lSubs(){const x=LX.x,el=$("#vsubs");if(!el)return;const done=x.sent.filter((_,k)=>LX.res[k]&&LX.res[k].score>=90).length;$("#vcnt").textContent=`(${done}/${x.sent.length})`;$("#vsubt").textContent=LX.showSub?"⌃ Ẩn":"⌄ Hiện";
  if(!LX.showSub){el.innerHTML="";return}const [a,b]=lRange();const hide=LX.tab==="ln"||LX.tab==="bt";
  el.innerHTML=x.sent.map((s,k)=>{const r=LX.res[k],ok=r&&r.score>=90,show=!hide||ok;return `<div class="vsub ${k>=a&&k<b?"cur":""} ${ok?"ok":""}" onclick="LX.i=${k};LX.hint=0;LX.checked=false;lPanel();lSubs();lPlay()"><div class="vsh"><span class="vn">${k+1}</span><b>CÂU ${k+1}</b>${s.t!=null?`<small class="muted">${fmtT(s.t)}</small>`:""}${ok?`<span class="vdone">Đã hoàn thành</span>`:r?`<span class="vdone bad">${r.score}%</span>`:""}</div>
   ${show?`<div class="hz" style="font-size:18px">${hzLinks(s.zh)}</div><div class="expy">${esc(pyOf(s))}</div>${s.vi?`<div class="muted" style="border-top:1px dashed var(--line2);margin-top:6px;padding-top:6px">${esc(s.vi)}</div>`:""}`:`<div class="muted">${"＿".repeat(Math.min(16,[...s.zh].filter(isCJK).length))}</div>`}</div>`}).join("");
  const c=el.querySelector(".cur");if(c&&el.scrollHeight>el.clientHeight)c.scrollIntoView({block:"nearest"})}

/* --- khung phải --- */
function lDots(){const x=LX.x,[a,b]=lRange();return `<div class="vdots-w"><button class="vnav" onclick="lGo(-1)">‹</button><div class="vdots">${x.sent.map((s,k)=>{const r=LX.res[k];const cls=k>=a&&k<b?"cur":r?(r.score>=90?"ok":"bad"):"";return `<button class="vdot ${cls}" onclick="LX.i=${k};LX.hint=0;LX.checked=false;lPanel();lSubs();lPlay()">${r&&r.score>=90&&!(k>=a&&k<b)?"✓":k+1}</button>`}).join("")}</div><button class="vnav" onclick="lGo(1)">›</button></div>`}
function lGo(d){const n=LX.x.sent.length,[a,b]=lRange();let i=LX.i+d*(b-a);if(i>=n){lFinish();return}LX.i=Math.max(0,i);LX.hint=0;LX.checked=false;stopRecog();lPanel();lSubs()}
function lPanel(){const el=$("#lpanel");if(!el)return;const t=LX.tab;
  if(t==="sh")el.innerHTML=shPanel();else if(t==="pa")el.innerHTML=paPanel();else if(t==="bt")el.innerHTML=btPanel();
  else el.innerHTML=LX.mode==="dt"?fillPanel():LX.mode==="ld"?ldPanel():ctPanel();
  const c=el.querySelector(".vdot.cur");if(c)c.scrollIntoView({inline:"center",block:"nearest"});
  const ta=el.querySelector("textarea,.fin");if(ta){setTimeout(()=>ta.focus(),30)}
  el.querySelectorAll("textarea").forEach(x=>x.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();(LX.mode==="ld"&&t==="ln"?ldCheck:ctMain)()}}));
  el.querySelectorAll(".fin").forEach(x=>x.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();fillCheck()}}));
}
const lHead=(title,extra="")=>{const x=LX.x,n=x.sent.length,done=x.sent.filter((_,k)=>LX.res[k]&&LX.res[k].score>=90).length,[a,b]=lRange();
  return `<div style="display:flex;align-items:center;gap:10px"><b>${title}</b>${extra}<span class="pill" style="margin-left:auto;height:30px">${a+1}${b-a>1?"–"+b:""}/${n}</span></div><div class="qbar"><i style="width:${done/n*100}%"></i></div>`};
const curS=()=>LX.x.sent[LX.i];

/* ===== Luyện nghe: 1) Chép chính tả ===== */
function ctPanel(){const ref=lRef();let k=0;const mask=[...ref].map(c=>{if(!isCJK(c)&&!/[a-zA-Z0-9]/.test(c))return `<span class="vp">${esc(c)}</span>`;k++;const sh=k<=LX.hint;return `<span class="vc ${sh?"sh":""}">${sh?c:"*"}</span>`}).join("");
  const [a,b]=lRange(),r=LX.res[a];
  return lHead("Chép chính tả",`<button class="tg" style="margin-left:8px" onclick="lModeDlg()">⇄ Đổi chế độ</button>`)+
  `<div class="ctl" style="margin-top:4px"><button class="tg" onclick="lHideV()">${LX.hideV?"👁 Hiện video":"🙈 Ẩn video"}</button><button class="tg" onclick="vKeys()">⌨️ Phím tắt</button><button class="tg ${LX.easy?"on":""}" style="margin-left:auto" onclick="LX.easy=!LX.easy;store.set('veasy',LX.easy);lPanel()">Chế độ dễ</button></div>
  <div class="vrow"><small class="muted">CÂU</small><span style="margin-left:auto" class="muted">SỐ CÂU/LƯỢT</span>${[1,2,3,4,5].map(n=>`<button class="vper ${LX.per===n?"on":""}" onclick="LX.per=${n};store.set('vper',${n});lPanel();lSubs()">${n}</button>`).join("")}</div>${lDots()}
  <div class="vin"><textarea id="vans" rows="3" placeholder="Nhập những gì bạn nghe được…"></textarea>
   <div class="vmask"><div class="vtools"><button title="Gợi ý 1 chữ" onclick="LX.hint++;lPanel()">💡</button><button title="Giọng máy" onclick="speak(lRef(),{slow:1})">🔈</button><button title="Nghĩa" onclick="const v=$('#lvi');v.style.display=v.style.display==='none'?'block':'none'">🌐</button></div>
    <div class="vchars">${mask}</div>${LX.easy?`<div class="muted" style="font-size:13px;margin-top:6px">${[...ref].filter(isCJK).length} chữ · ${esc(LX.x.sent.slice(a,b).map(pyOf).join(" "))}</div>`:""}
    <div id="lvi" class="vi" style="display:${LX.checked?"block":"none"}">${esc(LX.x.sent.slice(a,b).map(s=>s.vi).filter(Boolean).join(" ")||"(Chưa có nghĩa)")}</div></div>
   <div id="vres">${LX.checked&&r?`<div class="dres2"><b style="color:${r.score>=90?"var(--grn)":r.score>=60?"var(--yel)":"var(--red2)"}">${r.score>=90?"✅ Chính xác!":r.score>=60?"🙂 Gần đúng":"❌ Nghe lại nhé"} ${r.score}%</b><div class="hz dcmp">${r.html||""}</div></div>`:""}</div></div>
  <div class="vbot"><button class="pill" onclick="lPlay()">▶ Phát lại</button><button class="pill" onclick="lPlay(1)">🐢</button><button class="pill" title="Làm lại" onclick="lRedo()">↻</button><button class="gbtn" style="flex:1" onclick="ctMain()">${LX.checked?"Tiếp ›":"Kiểm tra"}</button></div>`}
function ctMain(){if(LX.checked){lGo(1);setTimeout(()=>lPlay(),250);return}const ta=$("#vans");const ans=ta?ta.value.trim():"";if(!ans){lPlay();return}
  const d=dDiff(ans,lRef()),[a,b]=lRange();for(let k=a;k<b;k++)LX.res[k]={score:d.score,html:k===a?d.html:""};if(d.score>=90)addPts(10*(b-a));lSave();LX.checked=true;LX.hint=99;lPanel();lSubs()}
function lRedo(){const [a,b]=lRange();for(let k=a;k<b;k++)LX.res[k]=null;lSave();LX.hint=0;LX.checked=false;lPanel();lSubs();lPlay()}
function lSave(){const P=dProg(),n=LX.x.sent.length,rs=LX.res.filter(Boolean);P[LX.id]={res:LX.res.map(r=>r?{score:r.score}:null),done:LX.x.sent.every((_,k)=>LX.res[k]),score:Math.round(rs.reduce((a,r)=>a+r.score,0)/n),t:Date.now()};store.set("dprog",P);DLIB.list&&0}
function lHideV(){LX.hideV=!LX.hideV;$("#vbox").classList.toggle("hid",LX.hideV);lPanel()}
function lFinish(){const n=LX.x.sent.length,sc=Math.round(LX.res.reduce((a,r)=>a+(r?r.score:0),0)/n);
  openModal(`<div class="soonbox"><div class="ic">🎉</div><h3>Hết bài!</h3>${LX.tab==="ln"&&LX.mode==="ct"?`<div class="qq" style="font-family:inherit;font-weight:800">${sc}%</div>`:""}<div class="ctl" style="justify-content:center"><button class="gbtn" onclick="closeModal();LX.i=0;lPanel();lSubs()">↻ Làm lại từ đầu</button><button class="pill" onclick="closeModal();dNextLesson2()">Bài tiếp ›</button><button class="pill" onclick="closeModal();go('chinhta')">Thư viện</button></div></div>`)}
function dNextLesson2(){const L=buildDLib();const i=L.findIndex(y=>y.id===LX.id);const nx=L.slice(i+1).find(y=>y.lv===LX.x.lv);if(nx)go((nx.custom?"vd-":"ct-")+nx.id)}

/* ===== Luyện nghe: 2) Điền từ ===== */
function blanksFor(s){const ws=segWords(s.zh);const cand=ws.map((w,i)=>[w,i]).filter(([w])=>isCJK(w)&&wset().has(w)&&!/^[的了吗呢吧啊是在有和也都很不]$/.test(w));
  cand.sort((p,q)=>q[0].length-p[0].length||p[1]-q[1]);const nb=Math.max(1,Math.min(3,Math.round(ws.filter(isCJK).length/4)));
  let pick=cand.slice(0,nb).map(c=>c[1]);if(!pick.length){const cj=ws.map((w,i)=>[w,i]).filter(([w])=>isCJK(w));if(cj.length)pick=[cj[Math.floor(cj.length/2)][1]]}
  return {ws,pick:new Set(pick)}}
function fillPanel(){const s=curS();if(!LX.sub.dt||LX.sub.dt.i!==LX.i)LX.sub.dt={i:LX.i,...blanksFor(s),ans:{},ok:null};const D=LX.sub.dt;let bi=0;
  const line=D.ws.map((w,i)=>{if(!D.pick.has(i))return `<span>${esc(w)}</span>`;const k=bi++;const st=D.ok?D.ok[k]:null;
    return `<span class="fbox"><input class="fin ${st===true?"ok":st===false?"no":""}" data-k="${k}" style="width:${w.length*1.25+1.2}em" value="${esc(D.ans[k]||"")}" ${D.ok?"readonly":""} oninput="LX.sub.dt.ans[${k}]=this.value">${D.ok&&st===false?`<small class="hz">${esc(w)}</small>`:""}${LX.hint>k&&!D.ok?`<small>${esc(autoPy(w))}</small>`:""}</span>`}).join("");
  return lHead("Điền từ",`<button class="tg" style="margin-left:8px" onclick="lModeDlg()">⇄ Đổi chế độ</button>`)+lDots()+
  `<div class="vin"><div class="muted" style="margin-bottom:8px">Nghe câu và điền từ còn thiếu (gõ chữ Hán)</div><div class="hz fline">${line}</div>
   ${D.ok?`<div class="dres2"><b style="color:${D.ok.every(Boolean)?"var(--grn)":"var(--red2)"}">${D.ok.every(Boolean)?"✅ Chính xác!":"❌ Còn từ sai"}</b><div class="expy">${esc(pyOf(s))}</div><div class="vi">${esc(s.vi||"")}</div></div>`:""}
   <div class="vtools" style="border:none;margin-top:10px"><button title="Gợi ý pinyin" onclick="LX.hint++;lPanel()">💡</button><button title="Giọng máy" onclick="speak(curS().zh,{slow:1})">🔈</button></div></div>
  <div class="vbot"><button class="pill" onclick="lPlay()">▶ Phát lại</button><button class="pill" onclick="lPlay(1)">🐢</button><button class="pill" onclick="LX.sub.dt=null;LX.res[LX.i]=null;LX.hint=0;lPanel()">↻</button><button class="gbtn" style="flex:1" onclick="${D.ok?"lGo(1);setTimeout(()=>lPlay(),250)":"fillCheck()"}">${D.ok?"Tiếp ›":"Kiểm tra"}</button></div>`}
function fillCheck(){const D=LX.sub.dt;if(D.ok){lGo(1);setTimeout(()=>lPlay(),250);return}document.querySelectorAll(".fin").forEach(i=>D.ans[i.dataset.k]=i.value);
  const words=D.ws.filter((_,i)=>D.pick.has(i));D.ok=words.map((w,k)=>normZ(D.ans[k]||"")===normZ(w));const sc=Math.round(D.ok.filter(Boolean).length/D.ok.length*100);
  LX.res[LX.i]={score:sc};if(sc===100)addPts(5);lSave();lPanel();lSubs()}

/* ===== Luyện nghe: 3) Luyện dịch ===== */
function ldPanel(){const s=curS();const hasVi=!!s.vi;const R=LX.sub.ld&&LX.sub.ld.i===LX.i?LX.sub.ld:null;
  return lHead("Luyện dịch",`<button class="tg" style="margin-left:8px" onclick="lModeDlg()">⇄ Đổi chế độ</button>`)+lDots()+
  `<div class="vin">${hasVi?`<div class="muted">Dịch câu sau sang tiếng Trung:</div><div class="ldq">🇻🇳 ${esc(s.vi)}</div>`:`<div class="muted">Nghe câu và dịch sang tiếng Việt:</div><div class="ldq hz">${hzLinks(s.zh)}</div><div class="expy">${esc(pyOf(s))}</div>`}
   <textarea id="ldans" rows="3" placeholder="${hasVi?"Gõ câu tiếng Trung…":"Gõ bản dịch tiếng Việt…"}" style="margin-top:10px" ${R?"readonly":""}>${R?esc(R.a):""}</textarea>
   ${R?(hasVi?`<div class="dres2"><b style="color:${R.score>=80?"var(--grn)":R.score>=50?"var(--yel)":"var(--red2)"}">Độ khớp với bản gốc: ${R.score}%</b><div class="muted">Đáp án:</div><div class="hz dcmp" style="font-size:22px">${R.html}</div><div class="expy">${esc(pyOf(s))}</div><p class="muted" style="font-size:12.5px">Cách dịch khác vẫn có thể đúng – hãy so cách dùng từ với câu gốc.</p></div>`
     :`<div class="dres2"><div class="muted">Tham khảo: hãy tự so sánh với nghĩa của các từ (bấm vào chữ Hán để tra).</div><div class="ctl"><button class="pill" onclick="LX.res[LX.i]={score:100};lSave();lGo(1)">👍 Tôi dịch đúng</button><button class="pill" onclick="LX.res[LX.i]={score:50};lSave();lGo(1)">🤔 Chưa chắc</button></div></div>`):""}</div>
  <div class="vbot"><button class="pill" onclick="lPlay()">▶ Nghe câu</button><button class="pill" onclick="LX.sub.ld=null;lPanel()">↻</button><button class="gbtn" style="flex:1" onclick="ldCheck()">${R?"Tiếp ›":"Kiểm tra"}</button></div>`}
function ldCheck(){const s=curS();if(LX.sub.ld&&LX.sub.ld.i===LX.i){lGo(1);return}const a=($("#ldans").value||"").trim();if(!a){toast("Hãy gõ bản dịch");return}
  if(s.vi){const d=dDiff(a,s.zh);LX.sub.ld={i:LX.i,a,score:d.score,html:d.html};LX.res[LX.i]={score:d.score};lSave();if(d.score>=80)addPts(10)}else LX.sub.ld={i:LX.i,a};
  lPanel();lSubs();lPlay()}

/* ===== Shadowing ===== */
function shPanel(){const s=curS(),R=LX.rec[LX.i];
  return lHead("Shadowing – nghe & nói đuổi")+lDots()+
  `<div class="vin shb"><div class="hz" style="font-size:28px;line-height:1.5">${hzLinks(s.zh)}</div><div class="expy" style="font-size:15px">${esc(pyOf(s))}</div><div class="vi">${esc(s.vi||"")}</div></div>
  <div class="ctl" style="justify-content:center;margin-top:12px"><button class="gbtn" onclick="lPlay()">▶ Nghe</button><button class="pill" onclick="lPlay(1)">🐢 Chậm</button>
   <button class="pill ${LX.recOn?"recon":""}" onclick="shRec()">${LX.recOn?"⏹ Dừng ghi":"🎙️ Ghi âm giọng tôi"}</button>${R?`<button class="pill" onclick="new Audio(LX.rec[${LX.i}]).play()">🔁 Nghe lại giọng tôi</button>`:""}</div>
  <div class="note" style="margin-top:12px">Cách luyện: nghe câu → bấm <b>Ghi âm</b> và nói đuổi theo (bắt chước ngữ điệu, tốc độ) → nghe lại giọng mình để so sánh.</div>
  <div class="vbot"><button class="pill" onclick="shAuto()">${LX.auto?"⏸ Dừng tự động":"🔁 Tự động: nghe – nhại cả bài"}</button><button class="gbtn" style="flex:1" onclick="lGo(1);setTimeout(()=>lPlay(),250)">Câu tiếp ›</button></div>`}
async function shRec(){if(LX.recOn){try{LX.mr.stop()}catch(e){}return}
  try{const st=await navigator.mediaDevices.getUserMedia({audio:true});const mr=new MediaRecorder(st);const ch=[];LX.mr=mr;LX.recOn=true;lPanel();
    mr.ondataavailable=e=>ch.push(e.data);mr.onstop=()=>{st.getTracks().forEach(t=>t.stop());LX.rec[LX.i]=URL.createObjectURL(new Blob(ch,{type:mr.mimeType}));LX.recOn=false;LX.res[LX.i]=LX.res[LX.i]||null;lPanel()};mr.start();setTimeout(()=>{if(mr.state==="recording")mr.stop()},20000)}
  catch(e){toast("Không bật được micro – hãy cho phép micro trong trình duyệt")}}
function shAuto(){LX.auto=!LX.auto;lPanel();if(!LX.auto)return;const step=()=>{if(!LX.auto||LX.tab!=="sh")return;lPlay(false,ms=>{setTimeout(()=>{if(!LX.auto)return;if(LX.i>=LX.x.sent.length-1){LX.auto=false;lPanel();return}LX.i++;lPanel();lSubs();step()},Math.max(1500,ms*1.4))})};step()}

/* ===== Phát âm (nhận dạng giọng nói) ===== */
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
function paPanel(){const s=curS(),R=LX.sub.pa&&LX.sub.pa.i===LX.i?LX.sub.pa:null;
  return lHead("Phát âm – đọc to và chấm điểm")+lDots()+
  `<div class="vin shb"><div class="hz" style="font-size:28px;line-height:1.5">${R&&R.html?R.html:hzLinks(s.zh)}</div><div class="expy" style="font-size:15px">${esc(pyOf(s))}</div><div class="vi">${esc(s.vi||"")}</div></div>
  ${SR?`<div style="text-align:center;margin-top:14px"><button class="micb ${LX.listening?"on":""}" onclick="paStart()">${LX.listening?"⏺":"🎤"}</button><div class="muted" style="margin-top:6px">${LX.listening?"Đang nghe… hãy đọc to câu trên":"Bấm micro rồi đọc to câu trên"}</div></div>
   ${R?`<div class="dres2" style="text-align:center"><b style="font-size:20px;color:${R.score>=85?"var(--grn)":R.score>=60?"var(--yel)":"var(--red2)"}">${R.score}% ${R.score>=85?"Phát âm tốt!":R.score>=60?"Khá – luyện thêm chữ màu đỏ":"Hãy nghe mẫu và đọc lại"}</b><div class="muted">Máy nghe được: <span class="hz">${esc(R.heard)}</span></div></div>`:""}`
   :`<div class="note" style="margin-top:12px">Trình duyệt này chưa hỗ trợ chấm phát âm tự động (hãy dùng <b>Google Chrome</b> hoặc <b>Edge</b>). Bạn vẫn có thể luyện bằng cách ghi âm ở mục Shadowing.</div>`}
  <div class="vbot"><button class="pill" onclick="lPlay()">▶ Nghe mẫu</button><button class="pill" onclick="lPlay(1)">🐢</button><button class="gbtn" style="flex:1" onclick="lGo(1)">Câu tiếp ›</button></div>`}
function stopRecog(){try{LX&&LX.recog&&LX.recog.abort()}catch(e){}if(LX)LX.listening=false}
function paStart(){if(LX.listening){stopRecog();lPanel();return}const r=new SR();r.lang="zh-CN";r.interimResults=false;r.maxAlternatives=3;LX.recog=r;LX.listening=true;lPanel();
  r.onresult=e=>{const alts=[...e.results[0]].map(a=>a.transcript);const s=curS();let best=null;alts.forEach(h=>{const d=dDiff(h,s.zh);if(!best||d.score>best.score)best={...d,heard:h}});
    LX.sub.pa={i:LX.i,...best};LX.res[LX.i]=LX.res[LX.i]||null;if(best.score>=85)addPts(5);LX.listening=false;lPanel()};
  r.onerror=e=>{LX.listening=false;lPanel();toast(e.error==="not-allowed"?"Hãy cho phép micro":"Không nghe rõ, thử lại nhé")};r.onend=()=>{if(LX.listening){LX.listening=false;lPanel()}};r.start()}

/* ===== Bài tập ===== */
function btBuild(){const S=LX.x.sent.filter(s=>[...s.zh].filter(isCJK).length>=2);const Q=[];const vis=S.filter(s=>s.vi);
  shuffle(S).slice(0,10).forEach((s,k)=>{const t=k%3;
    if(t===0&&vis.length>=4&&s.vi){const o=shuffle([s,...shuffle(vis.filter(x=>x!==s&&x.vi!==s.vi)).slice(0,3)]);Q.push({type:"nghia",s,opts:o.map(x=>x.vi),ans:o.indexOf(s)})}
    else if(t===1){const ws=segWords(s.zh).filter(w=>w.trim()&&!/^[，。！？、；：,.!?“”]+$/.test(w));if(ws.length>=3&&ws.length<=10)Q.push({type:"xep",s,ws:shuffle(ws.map((w,i)=>({w,i}))),pick:[]});else{const b=blanksFor(s);const idx=[...b.pick][0];if(idx!=null){const w=b.ws[idx];const pool=[...new Set(LX.x.sent.flatMap(x=>segWords(x.zh)).filter(z=>isCJK(z)&&z!==w&&z.length===w.length))];const others=shuffle(pool.length>=3?pool:[...wset()].filter(z=>z.length===w.length&&z!==w)).slice(0,3);const o=shuffle([w,...others]);Q.push({type:"dien",s,ws:b.ws,idx,opts:o,ans:o.indexOf(w)})}}}
    else{const b=blanksFor(s);const idx=[...b.pick][0];if(idx==null)return;const w=b.ws[idx];const pool=[...new Set(LX.x.sent.flatMap(x=>segWords(x.zh)).filter(z=>isCJK(z)&&z!==w&&z.length===w.length))];const others=shuffle(pool.length>=3?pool:[...wset()].filter(z=>z.length===w.length&&z!==w)).slice(0,3);const o=shuffle([w,...others]);Q.push({type:"dien",s,ws:b.ws,idx,opts:o,ans:o.indexOf(w)})}});
  return {Q,k:0,score:0,done:null}}
function btPanel(){if(!LX.sub.bt)LX.sub.bt=btBuild();const B=LX.sub.bt;if(!B.Q.length)return `<b>Bài tập</b><p class="muted">Bài này quá ngắn để tạo bài tập.</p>`;
  if(B.k>=B.Q.length){const P=dProg();P[LX.id+"|bt"]=Math.round(B.score/B.Q.length*100);store.set("dprog",P);return `<b>Bài tập</b><div class="soonbox"><div class="ic">🏆</div><div class="qq" style="font-family:inherit;font-weight:800">${B.score}/${B.Q.length}</div><button class="gbtn" onclick="LX.sub.bt=null;lPanel()">↻ Làm bộ khác</button></div>`}
  const q=B.Q[B.k];let body="";
  if(q.type==="nghia")body=`<div class="muted">Nghe câu và chọn nghĩa đúng</div><div class="ctl" style="justify-content:center"><button class="gbtn" onclick="speak(LX.sub.bt.Q[${B.k}].s.zh)">🔊 Nghe câu</button></div>${q.opts.map((o,i)=>`<button class="qopt ${B.done!=null?(i===q.ans?"ok":i===B.done?"no":""):""}" ${B.done!=null?"disabled":""} onclick="btAns(${i})">${esc(o)}</button>`).join("")}`;
  else if(q.type==="dien")body=`<div class="muted">Chọn từ điền vào chỗ trống</div><div class="hz fline" style="margin:12px 0">${q.ws.map((w,i)=>i===q.idx?`<span class="blank">${B.done!=null?esc(w):"＿＿"}</span>`:esc(w)).join("")}</div>${q.s.vi?`<div class="vi">${esc(q.s.vi)}</div>`:""}${q.opts.map((o,i)=>`<button class="qopt hz ${B.done!=null?(i===q.ans?"ok":i===B.done?"no":""):""}" style="font-size:20px" ${B.done!=null?"disabled":""} onclick="btAns(${i})">${esc(o)}</button>`).join("")}`;
  else{const used=new Set(q.pick);body=`<div class="muted">Sắp xếp thành câu đúng${q.s.vi?": "+esc(q.s.vi):""}</div><div class="xans hz">${q.pick.map((p,j)=>`<span class="chip2" onclick="${B.done!=null?"":`LX.sub.bt.Q[${B.k}].pick.splice(${j},1);lPanel()`}">${esc(q.ws[p].w)}</span>`).join("")||`<span class="muted" style="font-size:14px">Bấm các ô bên dưới theo đúng thứ tự</span>`}</div>
    <div class="xbank hz">${q.ws.map((o,p)=>used.has(p)?"":`<span class="chip2" onclick="LX.sub.bt.Q[${B.k}].pick.push(${p});lPanel()">${esc(o.w)}</span>`).join("")}</div>
    ${B.done!=null?`<div class="dres2"><b style="color:${B.done?"var(--grn)":"var(--red2)"}">${B.done?"✅ Đúng!":"❌ Chưa đúng"}</b><div class="hz" style="font-size:20px">${esc(q.s.zh)}</div></div>`:`<div class="ctl"><button class="gbtn sm" ${q.pick.length<q.ws.length?"disabled":""} onclick="btXep()">Kiểm tra</button><button class="tg" onclick="LX.sub.bt.Q[${B.k}].pick=[];lPanel()">↻ Xếp lại</button></div>`}`}
  return `<div style="display:flex;align-items:center"><b>Bài tập</b><span class="pill" style="margin-left:auto;height:30px">${B.k+1}/${B.Q.length}</span></div><div class="qbar"><i style="width:${B.k/B.Q.length*100}%"></i></div><div class="vin">${body}</div>
   ${B.done!=null?`<div class="vbot"><button class="gbtn" style="flex:1" onclick="LX.sub.bt.k++;LX.sub.bt.done=null;lPanel()">Câu tiếp ›</button></div>`:""}`}
function btAns(i){const B=LX.sub.bt,q=B.Q[B.k];B.done=i;if(i===q.ans){B.score++;addPts(5)}speak(q.s.zh);lPanel()}
function btXep(){const B=LX.sub.bt,q=B.Q[B.k];const got=q.pick.map(p=>q.ws[p].w).join("");const ok=normZ(got)===normZ(segWords(q.s.zh).filter(w=>w.trim()&&!/^[，。！？、；：,.!?“”]+$/.test(w)).join(""));B.done=ok?1:0;if(ok){B.score++;addPts(5)}speak(q.s.zh);lPanel()}
