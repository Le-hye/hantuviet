/* ================= Thư viện chép chính tả (Phần 2) ================= */
const DLIB={list:null,lv:"all",st:"all"};
const DEMO={greet:"👋",shop:"🛒",food:"🍜",home:"🏠",school:"🏫",work:"💼",travel:"🚕",nature:"🌤️",body:"🏥",hobby:"⚽",family:"👨‍👩‍👧",time:"⏰",phone:"📞",read:"📖",listen:"🎧",gram:"📐"};
function sceneEmoji(vi){vi=(vi||"").toLowerCase();
  if(/điện thoại/.test(vi))return DEMO.phone;if(/bệnh viện|bệnh/.test(vi))return DEMO.body;if(/cửa hàng|siêu thị|mua|bách hóa/.test(vi))return DEMO.shop;
  if(/quán|nhà hàng|cà phê|bánh|trái cây/.test(vi))return DEMO.food;if(/lớp|trường|thư viện/.test(vi))return DEMO.school;if(/công ty|văn phòng|họp/.test(vi))return DEMO.work;
  if(/đường|bến|sân bay|ga|khách sạn|xe/.test(vi))return DEMO.travel;if(/núi|công viên/.test(vi))return DEMO.nature;if(/sân vận động|thể dục|karaoke/.test(vi))return DEMO.hobby;
  if(/nhà|phòng/.test(vi))return DEMO.home;if(/đoạn văn/.test(vi))return DEMO.read;return "💬"}
const GRADS=[["#3b6cf6","#38bdf8"],["#a855f7","#ec4899"],["#f97316","#f5b83d"],["#2fbf8f","#38bdf8"],["#ec4899","#f0506e"],["#8b7cf6","#3b6cf6"],["#0ea5e9","#2fbf8f"]];
function splitSent(t){return (t.match(/[^。！？!?；]+[。！？!?；]?/g)||[t]).map(s=>s.trim()).filter(s=>s.replace(/[，。！？、；：“”‘’（）\s]/g,"").length>0)}
function buildDLib(){
  if(DLIB.list)return DLIB.list;const L=[];
  [1,2,3].forEach(lv=>CONVS[lv].forEach(B=>B.s.forEach((s,k)=>{
    const lines=s.l.flatMap(l=>l[0]==="叙"?splitSent(l[1]).map((x,j,a)=>[x,"",j===0?l[3]:""]):[[l[1],l[2],l[3]]]);
    L.push({id:`c${lv}-${B.n}-${k}`,lv,title:B.t[0],sub:`Bài ${B.n} · đoạn ${k+1}: ${s.p[0]==="短文"?"Đoạn văn":(s.p[1]||"Hội thoại")}`,src:`Giáo trình chuẩn HSK ${lv}`,emo:sceneEmoji(s.p[1]),sent:lines.map(x=>({zh:x[0],py:x[1]||"",vi:x[2]||""}))})})));
  // HSK 4: câu ví dụ từ vựng, 8 câu/bài
  const s4=VOCAB[4].filter(v=>typeof v[4]=="string"&&v[4].length>=6&&v[4].length<=30).map(v=>({zh:v[4],py:v[5],vi:v[6],w:v[0]}));
  for(let i=0;i<s4.length;i+=8){const g=s4.slice(i,i+8);if(g.length<5)break;L.push({id:"v4-"+(i/8+1),lv:4,title:`Nghe câu HSK 4 – số ${i/8+1}`,sub:"Trọng tâm: "+g.map(x=>x.w).join("、"),src:"Từ vựng HSK 4 (khung 9 bậc)",emo:"🎧",sent:g})}
  // HSK 5: ví dụ ngữ pháp
  const s5=GRAMMAR[5].flatMap(p=>p[3].map(e=>({zh:e[0],py:e[1],vi:"",w:p[0]}))).filter(x=>x.zh.length>=6&&x.zh.length<=40);
  for(let i=0;i<s5.length;i+=8){const g=s5.slice(i,i+8);if(g.length<5)break;L.push({id:"g5-"+(i/8+1),lv:5,title:`Nghe câu HSK 5 – số ${i/8+1}`,sub:"Ngữ pháp: "+[...new Set(g.map(x=>x.w))].slice(0,3).join(" · "),src:"Tổng hợp ngữ pháp HSK 5",emo:"📐",sent:g})}
  // HSK 6: đoạn nghe sách bài tập
  LISTEN6.forEach(o=>o.p.forEach((p,k)=>{const ss=splitSent(p[0]);L.push({id:`n6-${o.n}-${k}`,lv:6,title:`Bài ${o.n} – đoạn ${k+1}`,sub:(o.t||"").replace(/^[^一-鿿“]+/,"")||"Nghe hiểu HSK 6",src:"Sách bài tập HSK 6 (phần ghi âm)",emo:"🎧",sent:ss.map(s=>({zh:s,py:"",vi:""}))})}));
  // Tự chọn
  store.get("dcustom",[]).forEach(c=>L.push({...c,lv:"tc",custom:1,emo:c.emo||"🎬"}));
  DLIB.list=L;return L;
}
function dStat(id){const p=store.get("dprog",{})[id];if(!p)return"todo";return p.done?"done":"doing"}
function dProg(){return store.get("dprog",{})}

function openDictChoose(){
  openModal(`<h3>🎬 Chép chính tả</h3><p class="muted">Chọn cách luyện</p><div class="spk2">
   <div class="spkc" onclick="closeModal();openDictation()"><div class="ic">✍️</div><b>Phần 1 · Nghe – chép từ</b><p>Nghe 8 từ ngẫu nhiên, gõ chữ Hán hoặc pinyin, chấm điểm ngay.</p></div>
   <div class="spkc hot" onclick="closeModal();go('chinhta')"><div class="ic">🎞️</div><b>Phần 2 · Thư viện bài nghe – chép chính tả <i class="bdg red">NEW</i></b><p>Hàng trăm bài hội thoại & đoạn văn HSK 1–6, nghe từng câu rồi chép lại, lưu tiến độ Đã làm / Đang làm.</p></div>
   <div class="spkc" onclick="closeModal();DLIB.lv='tc';go('chinhta')"><div class="ic">🎬</div><b>Phần 3 · Học qua video YouTube / TikTok <i class="bdg pink">MỚI</i></b><p>Dán link video và lời thoại, nghe từng câu trong video rồi chép lại – giống luyện nghe Shadowing.</p></div></div>`);
}
function renderDLib(){
  const L=buildDLib(),P=dProg();
  const byLv=L.filter(x=>DLIB.lv==="all"||String(x.lv)===String(DLIB.lv));
  const cnt={all:byLv.length,done:byLv.filter(x=>dStat(x.id)==="done").length,doing:byLv.filter(x=>dStat(x.id)==="doing").length};cnt.todo=cnt.all-cnt.done-cnt.doing;
  const show=byLv.filter(x=>DLIB.st==="all"||dStat(x.id)===DLIB.st);
  const groups={};show.forEach(x=>(groups[x.lv]=groups[x.lv]||[]).push(x));
  const lvName=l=>l==="tc"?"Tự chọn":"HSK "+l, lvCol=l=>l==="tc"?"#64748b":(LV_INFO[l]||{}).c;
  const LIM=DLIB.lim||12;
  $("#app").innerHTML=`<div class="hhead"><div><h1>🎞️ Thư viện chép chính tả</h1><p>${L.length} bài nghe từ giáo trình · nghe từng câu, gõ lại, máy chấm từng chữ</p></div><div class="hfil"><button class="pill" onclick="openDictation()">✍️ Phần 1: Nghe – chép từ</button></div></div>
  <div class="dtabs card">${[["all","Tất cả"],[1,"HSK 1"],[2,"HSK 2"],[3,"HSK 3"],[4,"HSK 4"],[5,"HSK 5"],[6,"HSK 6"],["tc","Tự chọn"]].map(([k,t])=>`<button class="${String(DLIB.lv)===String(k)?"on":""}" onclick="DLIB.lv='${k}';DLIB.lim=12;renderDLib()">${t}</button>`).join("")}</div>
  <div class="dtabs card st">${[["all","▦ Tất cả",cnt.all],["done","✓ Đã làm",cnt.done],["doing","↻ Đang làm",cnt.doing],["todo","○ Chưa làm",cnt.todo]].map(([k,t,n])=>`<button class="${DLIB.st===k?"on":""} s-${k}" onclick="DLIB.st='${k}';renderDLib()">${t} <span class="nb2">${n}</span></button>`).join("")}</div>
  ${DLIB.lv==="tc"?`<div class="card sec" style="margin-bottom:18px"><div class="mk" style="margin:0"><div><b>Học qua video YouTube / TikTok 🎬</b><p>Dán link video + lời thoại (bản chép lời YouTube, file .srt…) – web chia từng câu theo thời gian để nghe và chép.</p></div><button class="gbtn" onclick="vCreateDlg()">＋ Tạo bài từ video</button></div></div>`:""}
  ${Object.keys(groups).sort((a,b)=>(a==="tc")-(b==="tc")||a-b).map(l=>{const g=groups[l];const lim=DLIB.lv==="all"?6:LIM;return `<div class="dgh"><span class="lvp" style="background:${lvCol(l)}">${lvName(l)}</span><span class="muted">${g.length} bài học</span>${DLIB.lv==="all"&&g.length>lim?`<a class="lnk" style="margin-left:auto" onclick="DLIB.lv='${l}';DLIB.lim=12;renderDLib()">Xem tất cả →</a>`:""}</div>
   <div class="dgrid">${g.slice(0,lim).map((x,k)=>dCard(x,k)).join("")}</div>${DLIB.lv!=="all"&&g.length>lim?`<div style="text-align:center;margin:6px 0 20px"><button class="pill blue" onclick="DLIB.lim=${lim+24};renderDLib()">Xem thêm ${Math.min(24,g.length-lim)} bài</button></div>`:""}`}).join("")||`<div class="empty2"><div style="font-size:40px">🎞️</div><b>Chưa có bài nào ở mục này</b>${DLIB.lv==="tc"?`<button class="gbtn" onclick="vCreateDlg()">＋ Tạo bài từ video</button>`:""}</div>`}<div style="height:24px"></div>`;
  document.title="Chép chính tả – Hán Tự Việt";
}
function dCard(x,k){const st=dStat(x.id),p=dProg()[x.id],gr=GRADS[(String(x.id).length+k)%GRADS.length];
  const yt=x.yt?`https://i.ytimg.com/vi/${x.yt}/hqdefault.jpg`:"";
  return `<div class="dcard" onclick="go('${x.custom?"vd-":"ct-"}${x.id}')"><div class="dthumb" style="background:${yt?`url(${yt}) center/cover`:`linear-gradient(135deg,${gr[0]},${gr[1]})`}">
   ${yt?"":`<div class="demo">${x.emo}</div><div class="dbub hz">${esc(x.sent[0].zh.slice(0,14))}${x.sent[0].zh.length>14?"…":""}</div>`}
   <span class="dst ${st}">${st==="done"?"✓ Đã làm":st==="doing"?"↻ Đang làm":"○ Chưa làm"}</span><span class="dfree">${x.custom?"Của bạn":"Miễn phí"}</span>
   <span class="dlen">🎧 ${x.sent.length} câu</span></div>
   <div class="dbody"><b><span class="hz">${esc(x.title)}</span> | ${x.lv==="tc"?"Tự chọn":"HSK"+x.lv}</b><div class="muted">${esc(x.sub)}</div>
   <div class="dft"><span class="muted">📚 ${esc(x.src||"")}</span><span class="lnk">${st==="done"?`${p.score}% · Làm lại`:st==="doing"?"Làm tiếp":"Luyện tập"} ›</span></div></div></div>`}

function dCustomDlg(){openModal(`<h3>✍️ Tạo bài chép chính tả</h3>
  <form onsubmit="event.preventDefault();dCustomSave()"><label class="field"><span>Tên bài</span><input id="dct" required maxlength="60" placeholder="VD: Hội thoại đi chợ"></label>
  <label class="field"><span>Link YouTube (không bắt buộc)</span><input id="dcy" placeholder="https://www.youtube.com/watch?v=..."></label>
  <label class="field"><span>Nội dung tiếng Trung (mỗi câu kết thúc bằng 。！？ hoặc xuống dòng)</span><textarea id="dcz" rows="6" required placeholder="你好！我叫小明。今天天气很好。"></textarea></label>
  <label class="field"><span>Nghĩa tiếng Việt (không bắt buộc, mỗi câu một dòng)</span><textarea id="dcv" rows="3"></textarea></label>
  <button class="gbtn" style="width:100%;margin-top:14px">Lưu bài</button></form><div class="note">Bài tự tạo được lưu trên trình duyệt của bạn. Muốn đưa bài lên cho mọi học viên cùng dùng, hãy gửi nội dung cho người quản trị web.</div>`)}
function dCustomSave(){const z=$("#dcz").value.trim();const sents=z.split(/\n+/).flatMap(splitSent);const vis=$("#dcv").value.split(/\n+/).map(s=>s.trim());
  const m=$("#dcy").value.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/);
  const c={id:"tc"+Date.now().toString(36),title:$("#dct").value.trim(),sub:m?"Video YouTube + lời thoại":"Đoạn văn tự nhập",src:"Bài của bạn",emo:"✍️",yt:m?m[1]:"",sent:sents.map((s,i)=>({zh:s,py:"",vi:vis[i]||""}))};
  store.set("dcustom",[...store.get("dcustom",[]),c]);DLIB.list=null;closeModal();toast("Đã tạo bài");go("ct-"+c.id)}

/* ---------- Làm bài ---------- */
let DX=null;
function renderDLesson(id){const x=buildDLib().find(y=>y.id===id);if(!x){go("chinhta");return}
  const p=dProg()[id]||{};DX={x,k:p.done?0:Math.min(p.k||0,x.sent.length-1),res:p.done?[]:(p.res||[]),py:false,vi:false,show:false};drawDLesson()}
function normZ(s){return s.replace(/[，。！？、；：,.!?;:“”‘’"'（）()\s…—\-]/g,"")}
function dDiff(ans,ref){const a=[...normZ(ans)],r=[...normZ(ref)];let ok=0;const out=r.map((c,i)=>{const g=a[i];if(g===c){ok++;return `<span class="dk">${c}</span>`}return `<span class="dx" title="Bạn gõ: ${esc(g||"(thiếu)")}">${c}</span>`}).join("");
  const extra=a.length>r.length?`<span class="dx">+${esc(a.slice(r.length).join(""))}</span>`:"";return {html:out+extra,score:r.length?Math.round(ok/Math.max(r.length,a.length)*100):0}}
function drawDLesson(){const {x,k}=DX,s=x.sent[k],n=x.sent.length,done=DX.res.filter(Boolean).length,gr=GRADS[x.id.length%GRADS.length];
  const fin=k>=n;
  $("#app").innerHTML=`<div class="crumb"><button class="pill" onclick="go('chinhta')">← Thư viện</button><div class="path"><a onclick="go('chinhta')">🎞️ Chép chính tả</a>›<b>${esc(x.title)}</b></div><span class="pill blue">${x.lv==="tc"?"Tự chọn":"HSK "+x.lv}</span></div>
  <div class="dlay">
   <section class="card sec">
    ${x.yt?`<div class="ytw"><iframe src="https://www.youtube.com/embed/${x.yt}" allowfullscreen allow="autoplay; encrypted-media"></iframe></div>`:`<div class="dplayer" style="background:linear-gradient(135deg,${gr[0]},${gr[1]})"><div class="demo big">${x.emo}</div><div class="dsub hz">${fin?"🎉 完成！":DX.show?esc(s.zh):"▶ Nghe và chép lại"}</div><div class="dprog"><i style="width:${done/n*100}%"></i></div></div>`}
    <div class="ctl" style="justify-content:center;margin-top:12px">${fin?"":`<button class="gbtn" onclick="dPlay()">▶ Nghe câu ${k+1}/${n}</button><button class="pill" onclick="dPlay(1)">🐢 Nghe chậm</button><button class="pill" onclick="dPlayAll()">🔁 Nghe cả bài</button>`}</div>
    ${fin?dSummary():`<div class="dbox"><div class="muted" style="margin-bottom:6px">Câu ${k+1}/${n} · gõ lại bằng chữ Hán (bộ gõ tiếng Trung) – dấu câu không tính điểm</div>
     ${DX.py&&s.py?`<div class="expy" style="margin-bottom:4px">${esc(s.py)}</div>`:""}${DX.vi&&s.vi?`<div class="vi" style="margin-bottom:4px">🇻🇳 ${esc(s.vi)}</div>`:""}
     <form onsubmit="event.preventDefault();dCheck()"><textarea id="dans" rows="2" class="dta" placeholder="Gõ câu bạn nghe được…">${esc((DX.res[k]||{}).a||"")}</textarea>
     <div class="ctl"><button class="gbtn sm">Kiểm tra</button>${s.py?`<button type="button" class="tg ${DX.py?"on":""}" onclick="DX.py=!DX.py;drawDLesson()">💡 Gợi ý pinyin</button>`:""}${s.vi?`<button type="button" class="tg ${DX.vi?"on":""}" onclick="DX.vi=!DX.vi;drawDLesson()">🇻🇳 Nghĩa</button>`:""}<button type="button" class="tg" onclick="DX.show=true;drawDLesson()">👁 Xem đáp án</button><button type="button" class="tg" onclick="dNext(true)">⏭ Bỏ qua</button></div></form>
     <div id="dres">${DX.res[k]?dResHtml(DX.res[k]):""}</div></div>`}
   </section>
   <section class="card sec"><h3>📜 Lời thoại (${done}/${n})</h3><div class="dlines">${x.sent.map((t,i)=>{const r=DX.res[i];return `<div class="dl2 ${i===k?"cur":""}" onclick="DX.k=${i};DX.show=false;drawDLesson()"><span class="no">${i+1}</span><div style="flex:1">${r||fin?`<div class="hz">${esc(t.zh)}</div>${r?`<small style="color:${r.score>=90?"var(--grn)":r.score>=60?"var(--yel)":"var(--red2)"}">${r.skip?"Bỏ qua":r.score+"%"}</small>`:""}`:`<div class="muted">${"＿".repeat(Math.min(12,normZ(t.zh).length))}</div>`}</div><button class="bsp" onclick="event.stopPropagation();speak('${esc(t.zh)}')">${ICO_SP}</button></div>`}).join("")}</div></section>
  </div>`;
  document.title=x.title+" – Chép chính tả";const ta=$("#dans");if(ta){ta.focus();ta.onkeydown=e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();dCheck()}}}
}
function dResHtml(r){return r.skip?`<div class="note">Đã bỏ qua. Đáp án: <span class="hz">${esc(r.ref)}</span></div>`:`<div class="dres2"><b style="color:${r.score>=90?"var(--grn)":r.score>=60?"var(--yel)":"var(--red2)"}">${r.score>=90?"✅ Rất tốt!":r.score>=60?"🙂 Gần đúng":"❌ Cần nghe lại"} ${r.score}%</b><div class="hz dcmp">${r.html}</div><div class="ctl"><button class="gbtn sm" onclick="dNext()">${DX.k+1<DX.x.sent.length?"Câu tiếp ›":"Xem kết quả ›"}</button><button class="tg" onclick="DX.res[DX.k]=null;drawDLesson()">↺ Làm lại câu này</button></div></div>`}
function dPlay(slow){const s=DX.x.sent[DX.k];if(s)speak(s.zh,{slow})}
function dPlayAll(){try{speechSynthesis.cancel()}catch(e){}const ss=DX.x.sent.map(s=>s.zh);let i=0;const nx=()=>{if(i>=ss.length)return;try{const u=new SpeechSynthesisUtterance(ss[i++]);u.lang="zh-CN";u.rate=.85;const cn=voices.filter(v=>/CN|cmn/i.test(v.lang));if(cn.length)u.voice=cn[0];u.onend=()=>setTimeout(nx,500);speechSynthesis.speak(u)}catch(e){}};nx()}
function dCheck(){const a=$("#dans").value.trim();if(!a){toast("Hãy gõ câu bạn nghe được");return}const s=DX.x.sent[DX.k];const d=dDiff(a,s.zh);DX.res[DX.k]={a,score:d.score,html:d.html,ref:s.zh};if(d.score>=90)addPts(10);dSave();drawDLesson()}
function drawLines(){const k=DX.k;drawDLesson();DX.k=k}
function dNext(skip){if(skip){DX.res[DX.k]={skip:1,score:0,ref:DX.x.sent[DX.k].zh}}DX.show=false;DX.py=false;DX.vi=false;
  let k=DX.k+1;while(k<DX.x.sent.length&&DX.res[k])k++;DX.k=k<DX.x.sent.length?k:DX.x.sent.length;dSave();drawDLesson();if(DX.k<DX.x.sent.length)setTimeout(()=>dPlay(),300)}
function dSave(){const P=dProg(),n=DX.x.sent.length,rs=DX.res.filter(Boolean);const done=rs.length>=n&&DX.x.sent.every((_,i)=>DX.res[i]);
  P[DX.x.id]={k:DX.k,res:DX.res.map(r=>r?{a:r.a,score:r.score,html:r.html,ref:r.ref,skip:r.skip}:null),done,score:rs.length?Math.round(rs.reduce((a,r)=>a+r.score,0)/n):0,t:Date.now()};store.set("dprog",P)}
function dSummary(){const n=DX.x.sent.length,sc=Math.round(DX.res.reduce((a,r)=>a+(r?r.score:0),0)/n);
  return `<div class="dbox" style="text-align:center"><div class="qq" style="font-family:inherit;font-weight:800">${sc}%</div><p class="muted">${sc>=90?"Xuất sắc! Bạn nghe rất tốt.":sc>=60?"Khá tốt – nghe lại những câu sai nhé.":"Hãy nghe chậm và luyện lại bài này."}</p>
   <div class="ctl" style="justify-content:center"><button class="gbtn" onclick="const P=dProg();delete P['${DX.x.id}'];store.set('dprog',P);renderDLesson('${DX.x.id}')">↺ Làm lại cả bài</button><button class="pill" onclick="dNextLesson()">Bài tiếp theo ›</button><button class="pill" onclick="go('chinhta')">Về thư viện</button></div></div>`}
function dNextLesson(){const L=buildDLib();const i=L.findIndex(y=>y.id===DX.x.id);const nx=L.slice(i+1).find(y=>y.lv===DX.x.lv&&dStat(y.id)!=="done")||L[i+1];if(nx)go("ct-"+nx.id)}
