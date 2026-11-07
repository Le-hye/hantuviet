/* ================= v3: dữ liệu giáo trình ================= */
const LV_INFO={1:{n:"HSK 1",c:"#8b7cf6",src:"Chuẩn HSK 3.0 (GF0025-2021) cấp 1 + từ mới Giáo trình chuẩn HSK 1 (15 bài)",goal:500},2:{n:"HSK 2",c:"#38bdf8",src:"Từ vựng HSK 2 tiêu chuẩn mới (file giáo trình) + đối chiếu chuẩn HSK 3.0",goal:772},3:{n:"HSK 3",c:"#f97316",src:"970 từ vựng HSK 3 mới (file giáo trình) + đối chiếu chuẩn HSK 3.0",goal:973},4:{n:"HSK 4",c:"#2fbf8f",src:"Từ vựng HSK 4 khung 9 bậc (file giáo trình) + đối chiếu chuẩn HSK 3.0",goal:1000},5:{n:"HSK 5",c:"#ec4899",src:"Từ vựng HSK 5 khung 9 bậc (file giáo trình); nghĩa Việt từ từ điển Trung–Việt CVDICT",goal:1071},6:{n:"HSK 6",c:"#a855f7",src:"Chuẩn HSK 3.0 (GF0025-2021) cấp 6; từ đa âm tách mục riêng; nghĩa Việt từ CVDICT",goal:1140},7:{n:"HSK 7–9",c:"#f5b83d",src:"Chuẩn HSK 3.0 bậc 7–9 (vocabulary_band789 – GF0025-2021) + từ mới giáo trình 顶石中文; nghĩa Việt từ CVDICT",goal:5636}};
const LVS=Object.keys(VOCAB).sort((a,b)=>a-b);
let __stx=null;function needStrokes(chars,cb){if(chars.every(c=>STROKES[c])||window.__STX){cb();return}if(!__stx){__stx=[];const sc=document.createElement("script");sc.src="strokes_ext.js";sc.onload=()=>{const q=__stx;__stx=[];q.forEach(f=>f())};document.head.appendChild(sc)}__stx.push(cb)}
const POSN={"dt.":"Danh từ","đgt.":"Động từ","tt.":"Tính từ","phó.":"Phó từ","đt.":"Đại từ","lượng.":"Lượng từ","số.":"Số từ","trợ.":"Trợ từ","liên.":"Liên từ","giới.":"Giới từ","ct.":"Thán từ","đtnn.":"Động từ năng nguyện","sl.":"Số lượng từ"};
const posName=p=>(p||"").split("/").map(x=>POSN[x]||x).filter(Boolean).join(" / ");
const WIDX={};LVS.forEach(l=>VOCAB[l].forEach((w,i)=>{if(!WIDX[w[0]])WIDX[w[0]]=[+l,i]}));
const wget=(l,i)=>{const w=VOCAB[l][i];return{w:w[0],py:w[1],pos:w[2],m:w[3],les:(l==1||l==7)&&w[4]?w[4]:null,lt:l==7?w[5]:"",zh:l==7?w[6]:"",en:w[7]||"",ex:(l==3||l==4)&&typeof w[4]=="string"&&w[4]?[w[4],w[5],w[6]]:null,lv:+l,i}};
const mLabel=l=>"Nghĩa";
function wordHref(w){if(w.length===1&&IDX[w]!=null)return"c-"+IDX[w];const x=WIDX[w];return x?`w-${x[0]}-${x[1]}`:null}
function goWord(w){const h=wordHref(w);if(h)go(h);else speak(w)}
const isHz=c=>/[一-鿿]/.test(c);
function hzLinks(s,hit){return [...s].map(c=>isHz(c)&&wordHref(c)?`<span class="hzl ${hit&&hit.includes(c)?"hit":""}" onclick="event.stopPropagation();goWord('${c}')">${c}</span>`:esc(c)).join("")}

/* tìm câu ví dụ trong toàn bộ dữ liệu */
function findExamples(w,max=6){
  const out=[],seen=new Set();
  const add=(zh,py,vi,src)=>{if(seen.has(zh)||out.length>=max)return;seen.add(zh);out.push([zh,py,vi,src])};
  const x=WIDX[w];if(x&&(x[0]===3||x[0]===4)){const v=VOCAB[x[0]][x[1]];if(typeof v[4]=="string"&&v[4])add(v[4],v[5],v[6],"Từ vựng HSK "+x[0])}
  [1,2,3].forEach(lv=>CONVS[lv].forEach(L=>L.s.forEach(s=>s.l.forEach(l=>{if(out.length<max&&l[1].includes(w)&&l[1].length<60)add(l[1],l[2],l[3],"Hội thoại HSK "+lv+" – Bài "+L.n)}))));
  Object.values(GRAMMAR).forEach(g=>g.forEach(p=>p[3].forEach(e=>{if(e[0].includes(w)&&/[。？！]/.test(e[0]))add(e[0],e[1],e[2],"Ngữ pháp")})));
  ["3","4"].forEach(l=>VOCAB[l].forEach(v=>{if(out.length<max&&typeof v[4]=="string"&&v[4].includes(w))add(v[4],v[5],v[6],"Từ vựng HSK "+l)}));
  return out;
}
function exHtml(e,w){return `<div class="ex"><div class="acts"><button onclick="speak('${esc(e[0])}')">${ICO_SP}</button><button class="slow" onclick="speak('${esc(e[0])}',{slow:1})">🐢</button></div>
  <div><div class="hz exzh">${esc(e[0]).split(w).join(`<b class="hit">${w}</b>`)}</div><div class="expy">${esc(e[1])}</div><div class="vi">${esc(e[2])}</div>${e[3]?`<small class="muted">Nguồn: ${e[3]}</small>`:""}</div></div>`}

/* ---------- trang danh sách từ vựng ---------- */
let TV={q:"",les:"",n:60};
const LWI={};Object.keys(LESSONS).forEach(l=>LESSONS[l].forEach((L,k)=>L.w.forEach(i=>LWI[l+"_"+i]=k+1)));
function renderVocabList(lv){
  const all=VOCAB[lv].map((w,i)=>wget(lv,i));
  const q=TV.q.trim(),qs=strip(q),qp=plain(q);
  const lf=x=>{const t=TV.les||"";if(!t)return true;if(t[0]==="b")return LWI[lv+"_"+x.i]===+t.slice(1);if(t==="x")return !x.les;if(t[0]==="s")return x.les===+t.slice(1);return true};
  let list=all.filter(x=>lf(x)&&(!q||x.w.includes(q)||plain(x.py).startsWith(qp)&&qp||strip(x.m).includes(qs)));
  const total=list.length;list=list.slice(0,TV.n);
  $("#app").innerHTML=`
  <div class="hhead"><div><span class="lvpill" style="background:${LV_INFO[lv].c}">${LV_INFO[lv].n}</span><h1>Từ vựng ${LV_INFO[lv].n}</h1><p>Từ mới của cấp: <b>${all.length}</b> (chuẩn ${LV_INFO[lv].goal}) · Tích lũy đến ${LV_INFO[lv].n}: <b>${cumV(lv).toLocaleString("vi-VN")}</b> (chuẩn ${cumG(lv).toLocaleString("vi-VN")})</p><p class="muted">Nguồn: ${LV_INFO[lv].src}</p></div>
   <div class="hfil">${LVS.map(l=>`<button class="pill ${l==lv?"blue":""}" onclick="TV={q:'',les:'',n:60};go('tv-${l}')">${LV_INFO[l].n}</button>`).join("")}</div></div>
  <div class="card tvbar"><input id="tvq" placeholder="Lọc theo chữ Hán, pinyin hoặc nghĩa…" value="${esc(TV.q)}" oninput="TV.q=this.value;TV.n=60;renderVocabList(${lv});const i=$('#tvq');i.focus();i.setSelectionRange(i.value.length,i.value.length)">
   <select onchange="TV.les=this.value;TV.n=60;renderVocabList(${lv})"><option value="">Tất cả bài</option><optgroup label="Giáo trình HSK 3.0 – theo chủ đề">${LESSONS[lv].map((L,k)=>`<option value="b${k+1}" ${TV.les==="b"+(k+1)?"selected":""}>Bài ${k+1}: ${L.t} (${L.w.length} từ)</option>`).join("")}</optgroup>${lv==1?`<optgroup label="Sách Giáo trình chuẩn HSK 1 (bản cũ)">${Array.from({length:15},(_,k)=>`<option value="s${k+1}" ${TV.les==="s"+(k+1)?"selected":""}>Sách – Bài ${k+1} (${all.filter(x=>x.les===k+1).length} từ)</option>`).join("")}<option value="x" ${TV.les==="x"?"selected":""}>Không có trong sách (${all.filter(x=>!x.les).length} từ)</option></optgroup>`:""}</select>
   ${TV.les&&TV.les[0]==="b"?`<button class="pill blue" onclick="go('lop-${lv}-${TV.les.slice(1)}')">📘 Mở bài học</button>`:""}
   <button class="pill" onclick="openQuizLv(${lv})">🎯 Ôn ${LV_INFO[lv].n}</button><button class="pill" onclick="openFlash(${lv})">🃏 Thẻ ghi nhớ</button></div>
  <p class="muted" style="margin:10px 2px">Hiển thị ${list.length}/${total} từ</p>

  <div class="vgrid">${list.map(x=>`<div class="card vc" onclick="go('w-${lv}-${x.i}')">
    <button class="vsp" onclick="event.stopPropagation();speak('${x.w}')">${ICO_SP}</button>
    ${notes.includes(x.w)?'<span class="s">★</span>':""}
    <div class="hz">${x.w}</div><div class="p">${esc(x.py)}</div><div class="m">${esc(x.m)}</div>${x.les?`<small class="muted">Bài ${x.les}</small>`:""}</div>`).join("")}</div>
  ${total>list.length?`<div style="text-align:center;margin:18px 0 30px"><button class="pill blue" onclick="TV.n+=120;renderVocabList(${lv})">Xem thêm ${Math.min(120,total-list.length)} từ</button></div>`:"<div style='height:30px'></div>"}`;
  document.title=`Từ vựng ${LV_INFO[lv].n} – Hán Tự Việt`;
}

/* ---------- trang chi tiết từ ---------- */
let wWriters=[];
function renderWord(lv,i){
  const x=wget(lv,i);if(!x.w){go("home");return}
  const chars=[...x.w].filter(isHz);
  const exs=findExamples(x.w);
  const rel=[];const rs=new Set([x.w]);
  LVS.forEach(l=>VOCAB[l].forEach((v,j)=>{if(rel.length<16&&!rs.has(v[0])&&chars.some(c=>v[0].includes(c))){rs.add(v[0]);rel.push([+l,j,v])}}));
  const saved=notes.includes(x.w),prev=i>0,next=i<VOCAB[lv].length-1;
  $("#app").innerHTML=`
  <div class="crumb">
    <button class="pill" onclick="history.length>1?history.back():go('tv-${lv}')">← Quay lại</button>
    <div class="path"><a onclick="go('home')">🏠 Trang chủ</a>›<a onclick="go('tv-${lv}')">Từ vựng ${LV_INFO[lv].n}</a>›<b>Từ vựng: <span class="hz">${x.w}</span></b></div>
    <button class="pill qk" onclick="focusSearch()">🔍 Tra nhanh từ khác <span class="kbd">Ctrl+K</span></button>
    <span class="pill blue" style="background:${LV_INFO[lv].c};border-color:${LV_INFO[lv].c}">${LV_INFO[lv].n}</span>
    <button class="pill" ${prev?"":"disabled"} onclick="go('w-${lv}-${i-1}')">‹ Từ trước</button>
    <button class="pill" ${next?"":"disabled"} onclick="go('w-${lv}-${i+1}')">Từ sau ›</button>
  </div>
  <section class="card hero">
    <div class="hl"><div class="hl-top">
      <div class="bigc ${x.w.length>1?"long":""}" onclick="speak('${x.w}')">${x.w}</div>
      <div><div class="pyrow"><span class="py">${esc(x.py)}</span><span class="lv" style="background:${LV_INFO[lv].c}">${LV_INFO[lv].n}</span>
        <button class="au" onclick="speak('${x.w}',{male:1})">${ICO_SP} Nam</button><button class="au" onclick="speak('${x.w}')">${ICO_SP} Nữ</button></div>
        <div class="mean">${esc(x.m)}</div>${x.en&&x.en!==x.m?`<div class="muted" style="margin-top:4px"><span class="lab en" style="font-size:10.5px;font-weight:700;padding:1px 5px;border-radius:4px;margin-right:6px">EN</span>${esc(x.en)}</div>`:""}${x.zh?`<div class="muted" style="margin-top:4px"><span class="lab vi" style="font-size:10.5px;font-weight:700;padding:1px 5px;border-radius:4px;margin-right:6px">中</span><span class="hz">${hzLinks(x.zh)}</span></div>`:""}${x.lt?`<div class="muted" style="margin-top:6px">顶石中文 – Bài ${x.les}: <span class="hz">${esc(x.lt)}</span></div>`:""}</div></div>
      <div class="chips">${x.pos?`<span class="chip c-grn">Loại từ: <b>${posName(x.pos)}</b></span>`:""}
        <span class="chip c-blu">Số chữ: <b>${chars.length}</b></span>${x.les&&lv==1?`<span class="chip c-yel" style="cursor:pointer" onclick="go('bai-${x.les}')">Giáo trình: <b>Bài ${x.les}</b></span>`:""}
        ${chars.filter(c=>IDX[c]!=null).map(c=>`<span class="chip c-red" style="cursor:pointer" onclick="go('c-${IDX[c]}')">Phân tích chữ <b class="hz">${c}</b> →</span>`).join("")}</div>
    </div>
    <div class="box"><h4>Thứ tự nét bút <span id="nstk">${chars.length} chữ</span></h4>
      <div class="wwr">${chars.map((c,k)=>`<div class="wcell"><div class="wbox">${GRID}<div id="ww${k}"></div></div><div class="ctl" style="justify-content:center;margin-top:6px"><button class="tg" onclick="wWriters[${k}]&&wWriters[${k}].animateCharacter()">▶</button><button class="tg" onclick="openWrite('${c}')">✏️</button>${wordHref(c)&&c!==x.w?`<button class="tg" onclick="goWord('${c}')">🔎</button>`:""}</div></div>`).join("")}</div></div>
    <div class="tools">
      <span class="lbl">CÔNG CỤ HỌC NHANH:</span>
      <button class="tb t1 ${saved?"on":""}" onclick="toggleNote('${x.w}')">${saved?"★ Đã lưu":"☆ Lưu sổ tay"}</button>
      <button class="tb t2" onclick="openWrite('${chars[0]}')">✏️ Luyện viết</button>
      <button class="tb t3" onclick="openQuizLv(${lv},'${x.w}')">🎯 Luyện tập</button>
      <button class="tb t4" onclick="speak('${x.w}',{slow:1})">🎙️ Phát âm chậm</button>
      ${exs.length?`<button class="tb t5" onclick="speak(${JSON.stringify(exs.map(e=>e[0]).join('。')).replace(/"/g,"&quot;")})">🔊 Nghe ví dụ</button>`:""}
    </div>
  </section>
  <section class="card sec" style="margin:18px 0"><h3>📝 Câu ví dụ (${exs.length})</h3>
    ${exs.length?`<div class="exs" style="border:none;margin:0;padding:0">${exs.map(e=>exHtml(e,x.w)).join("")}</div>`:`<p class="muted">Chưa có câu ví dụ trong giáo trình cho từ này.</p>`}</section>
  <section class="card sec" style="margin-bottom:18px"><h3>🏷️ Từ liên quan (cùng chữ)</h3>
    <div class="wgrid">${rel.length?rel.map(([l,j,v])=>`<div class="w" onclick="go('w-${l}-${j}')"><div class="hz">${[...v[0]].map(c=>chars.includes(c)?`<em>${c}</em>`:c).join("")}</div><div class="p">${esc(v[1])}</div><div class="m">${esc(v[3])}</div><small class="muted">${LV_INFO[l].n}</small></div>`).join(""):`<p class="muted">Không có.</p>`}</div></section>`;
  document.title=`${x.w} (${x.py}) – ${x.m} | Hán Tự Việt`;
  wWriters=[];
  needStrokes(chars,()=>chars.forEach((c,k)=>{const el=$("#ww"+k);if(!el||!STROKES[c])return;
    wWriters[k]=HanziWriter.create(el,c,{width:el.clientWidth||130,height:el.clientWidth||130,padding:10,charDataLoader:loader,delayBetweenStrokes:200,...hwColors()});
    setTimeout(()=>wWriters[k]&&wWriters[k].animateCharacter(),400+k*1500)}));
}

/* ---------- hội thoại (HSK 1–3) ---------- */
let HT={py:true,vi:true,lv:1};
const CSRC={1:"Giáo trình chuẩn HSK 1",2:"Giáo trình chuẩn HSK 2",3:"Giáo trình chuẩn HSK 3"};
const spkB=(L,sp)=>{const sps=[...new Set(L.s.flatMap(s=>s.l.map(l=>l[0])))];return sp==="B"||sp==="叙"?sp==="B":sps.indexOf(sp)%2===1};
const spkShort=sp=>sp.length>2?sp.slice(-2):sp;
function renderConvList(lv){lv=+(lv||HT.lv||1);HT.lv=lv;const C=CONVS[lv];
  $("#app").innerHTML=`<div class="hhead"><div><h1>💬 Hội thoại HSK ${lv}</h1><p>${C.length} bài – ${C.reduce((a,l)=>a+l.s.length,0)} đoạn · nguồn: ${CSRC[lv]} (bản tiếng Việt)${lv==3?" · bài 18 thiếu trang trong file scan":""}</p></div>
   <div class="hfil">${[1,2,3].map(l=>`<button class="pill ${l==lv?"blue":""}" onclick="go('hoithoai-${l}')">HSK ${l}</button>`).join("")}</div></div>
  <div class="lgrid">${C.map(L=>`<div class="card lc" onclick="go('ht-${lv}-${L.n}')"><span class="ln" style="background:${LV_INFO[lv].c}">Bài ${L.n}</span><div class="hz lt">${L.t[0]}</div><div class="p">${L.t[1]}</div><div class="m">${L.t[2]}</div>
   <div class="scn">${L.s.map(s=>s.p[1]?`<span>${s.p[1]}</span>`:"").join("")}</div></div>`).join("")}</div>`;
  document.title=`Hội thoại HSK ${lv} – Hán Tự Việt`;
}
function lineHtml(L,l,k,j){const B=spkB(L,l[0]),N=l[0]==="叙";return N?`<div class="ex" id="ln-${k}-${j}" style="background:var(--card2)"><div style="flex:1"><div class="rz">${hzLinks(l[1])}</div>${HT.py?`<div class="expy">${esc(l[2])}</div>`:""}${HT.vi?`<div class="vi">${esc(l[3])}</div>`:""}</div><button class="bsp" onclick="speak('${esc(l[1])}')">${ICO_SP}</button></div>`:`<div class="bub ${B?"r":""}" id="ln-${k}-${j}"><span class="who ${B?"b":""}" title="${esc(l[0])}" style="${l[0].length>1?"width:auto;padding:0 8px;border-radius:12px;font-size:13px":""}">${esc(spkShort(l[0]))}</span>
  <div class="bt"><div class="sent">${hzLinks(l[1])}</div>${HT.py?`<div class="expy">${esc(l[2])}</div>`:""}${HT.vi?`<div class="vi">${esc(l[3])}</div>`:""}</div>
  <button class="bsp" onclick="speak('${esc(l[1])}',{male:${B?0:1}})">${ICO_SP}</button></div>`}
const getL=(lv,n)=>CONVS[lv].find(x=>x.n===n);
function renderConv(lv,n){lv=+lv;const C=CONVS[lv],L=getL(lv,n);if(!L){go("hoithoai-"+lv);return}HT.lv=lv;const i=C.indexOf(L);
  const words=lv==1?VOCAB[1].filter(w=>w[4]===n):[];
  $("#app").innerHTML=`<div class="crumb"><button class="pill" onclick="go('hoithoai-${lv}')">← Danh sách bài</button><div class="path"><a onclick="go('home')">🏠 Trang chủ</a>›<a onclick="go('hoithoai-${lv}')">Hội thoại HSK ${lv}</a>›<b>Bài ${n}</b></div>
   <button class="pill" ${i>0?"":"disabled"} onclick="go('ht-${lv}-${i>0?C[i-1].n:n}')">‹ Bài trước</button><button class="pill" ${i<C.length-1?"":"disabled"} onclick="go('ht-${lv}-${i<C.length-1?C[i+1].n:n}')">Bài sau ›</button></div>
  <section class="card sec"><div class="lhead"><span class="lnum" style="background:${LV_INFO[lv].c}">${n}</span><div><small class="muted">HSK ${lv}</small><div class="hz" style="font-size:30px;color:var(--red2)">${L.t[0]}</div><div class="p" style="color:var(--cyan)">${L.t[1]}</div><b>${L.t[2]}</b></div></div>
   <div class="ctl"><button class="tg ${HT.py?"on":""}" onclick="HT.py=!HT.py;renderConv(${lv},${n})">👁 Pinyin</button><button class="tg ${HT.vi?"on":""}" onclick="HT.vi=!HT.vi;renderConv(${lv},${n})">👁 Nghĩa Việt</button>
    <button class="tg" onclick="playLesson(${lv},${n})">▶ Nghe cả bài</button><button class="tg" onclick="openRole(${lv},${n})">🎭 Nhập vai</button>${lv==1?`<button class="tg" onclick="go('bai-${n}')">📘 Từ mới bài ${n}</button>`:""}</div></section>
  ${L.s.map((s,k)=>`<section class="card sec dlg"><h3><span class="dn">${k+1}</span>${s.p[0]&&s.p[0]!=="短文"?`<span class="hz">${s.p[0]}</span> · ${s.p[1]}`:s.p[1]||"Hội thoại "+(k+1)}<span class="r"><button class="tg" onclick="playScene(${lv},${n},${k})">▶ Nghe đoạn này</button></span></h3>
   ${s.l.map((l,j)=>lineHtml(L,l,k,j)).join("")}</section>`).join("")}
  ${words.length?`<section class="card sec" style="margin:18px 0 24px"><h3>📗 Từ mới bài ${n} (${words.length})</h3><div class="wgrid">${words.map(w=>`<div class="w" onclick="goWord('${w[0]}')"><div class="hz">${w[0]}</div><div class="p">${w[1]}</div><div class="m">${esc(w[3])}</div></div>`).join("")}</div></section>`:`<div style="height:24px"></div>`}`;
  document.title=`Hội thoại HSK ${lv} bài ${n}: ${L.t[0]} – Hán Tự Việt`;
}
let playQ=[];
function playLines(lines){try{speechSynthesis.cancel()}catch(e){}playQ=lines.slice();step()
  function step(){document.querySelectorAll(".play").forEach(b=>b.classList.remove("play"));const it=playQ.shift();if(!it)return;
    const el=$("#"+it.id);if(el){el.classList.add("play");el.scrollIntoView({block:"center",behavior:"smooth"})}
    try{const u=new SpeechSynthesisUtterance(it.t);u.lang="zh-CN";u.rate=.85;u.pitch=it.m?.75:1.15;const cn=voices.filter(v=>/CN|cmn/i.test(v.lang));if(cn.length)u.voice=it.m?cn[cn.length-1]:cn[0];u.onend=()=>setTimeout(step,350);speechSynthesis.speak(u)}catch(e){}}}
function playScene(lv,n,k){const L=getL(lv,n),s=L.s[k];playLines(s.l.map((l,j)=>({t:l[1],m:!spkB(L,l[0]),id:`ln-${k}-${j}`})))}
function playLesson(lv,n){const L=getL(lv,n);playLines(L.s.flatMap((s,k)=>s.l.map((l,j)=>({t:l[1],m:!spkB(L,l[0]),id:`ln-${k}-${j}`}))))}
function openRole(lv,n){const L=getL(lv,n);const sps=[...new Set(L.s.flatMap(s=>s.l.map(l=>l[0])))].filter(x=>x!=="叙");
  openModal(`<h3>🎭 Nhập vai – HSK ${lv} bài ${n}</h3><p class="muted">Chọn vai của bạn. Lời của bạn sẽ bị che, hãy tự nói rồi bấm để xem đáp án.</p>
  <div class="ctl" style="justify-content:center;margin:16px 0">${sps.map(sp=>`<button class="tb t2" onclick="HT.role='${sp}';roleRun(${lv},${n})"><span class="hz">${sp}</span></button>`).join("")}</div>`)}
function roleRun(lv,n){const L=getL(lv,n);openModal(`<h3>🎭 Bạn là <span class="hz">${HT.role}</span> – Bài ${n}</h3>${L.s.map((s,k)=>`<h5>${s.p[1]||"Hội thoại "+(k+1)}</h5>`+s.l.filter(l=>l[0]!=="叙").map(l=>{const B=spkB(L,l[0]);return l[0]===HT.role?`<div class="bub ${B?"r":""}"><span class="who ${B?"b":""}">${esc(spkShort(l[0]))}</span><div class="bt hidden" onclick="this.classList.remove('hidden');speak('${esc(l[1])}')"><div class="vi">🇻🇳 ${esc(l[3])}</div><div class="sent hz">${esc(l[1])}</div><div class="expy">${esc(l[2])}</div></div></div>`:`<div class="bub ${B?"r":""}"><span class="who ${B?"b":""}">${esc(spkShort(l[0]))}</span><div class="bt"><div class="sent hz">${esc(l[1])}</div><div class="expy">${esc(l[2])}</div></div><button class="bsp" onclick="speak('${esc(l[1])}')">${ICO_SP}</button></div>`}).join("")).join("")}`)}

/* ---------- giáo trình (Hán ngữ) ---------- */
function renderCourse(){
  $("#app").innerHTML=`<div class="hhead"><div><h1>📘 Giáo trình chuẩn HSK 1</h1><p>15 bài · mỗi bài gồm từ mới, hội thoại, luyện tập</p></div><div class="hfil"><button class="pill" onclick="go('nguphap-1')">📐 Ngữ pháp</button></div></div>
  <div class="lgrid">${CONV.map(L=>{const c=VOCAB[1].filter(w=>w[4]===L.n).length;return `<div class="card lc" onclick="go('bai-${L.n}')"><span class="ln">Bài ${L.n}</span><div class="hz lt">${L.t[0]}</div><div class="m">${L.t[2]}</div><div class="scn"><span>📗 ${c} từ mới</span><span>💬 ${L.s.length} hội thoại</span></div></div>`}).join("")}</div>`;
  document.title="Giáo trình HSK 1 – Hán Tự Việt";
}
function renderLesson(n){
  const L=CONV.find(x=>x.n===n);if(!L){go("giaotrinh");return}
  const words=VOCAB[1].map((w,i)=>[w,i]).filter(([w])=>w[4]===n);
  $("#app").innerHTML=`<div class="crumb"><button class="pill" onclick="go('giaotrinh')">← Giáo trình</button><div class="path"><a onclick="go('home')">🏠 Trang chủ</a>›<a onclick="go('giaotrinh')">Giáo trình HSK 1</a>›<b>Bài ${n}</b></div>
   <button class="pill" ${n>1?"":"disabled"} onclick="go('bai-${n-1}')">‹ Bài trước</button><button class="pill" ${n<15?"":"disabled"} onclick="go('bai-${n+1}')">Bài sau ›</button></div>
  <section class="card sec"><div class="lhead"><span class="lnum">${n}</span><div><div class="hz" style="font-size:30px;color:var(--red2)">${L.t[0]}</div><div class="p" style="color:var(--cyan)">${L.t[1]}</div><b>${L.t[2]}</b></div></div>
   <div class="ctl"><button class="tb t2" onclick="go('ht-1-${n}')">💬 Học hội thoại</button><button class="tb t3" onclick="openQuizWords(VOCAB[1].filter(w=>w[4]===${n}).map(w=>w[0]),'Bài ${n}')">🎯 Luyện tập từ mới</button><button class="tb t5" onclick="speak(VOCAB[1].filter(w=>w[4]===${n}).map(w=>w[0]).join('，'),{slow:1})">🔊 Nghe từ mới</button></div></section>
  <section class="card sec" style="margin:18px 0 24px"><h3>📗 Từ mới (${words.length})</h3>
   <table class="vt"><thead><tr><th>Từ</th><th>Pinyin</th><th>Từ loại</th><th>Nghĩa</th><th></th></tr></thead><tbody>
   ${words.map(([w,i])=>`<tr onclick="goWord('${w[0]}')"><td class="hz">${w[0]}</td><td style="color:var(--cyan)">${w[1]}</td><td class="muted">${w[2]}</td><td>${esc(w[3])}</td><td><button class="tg" onclick="event.stopPropagation();speak('${w[0]}')">${ICO_SP}</button></td></tr>`).join("")}</tbody></table></section>`;
  document.title=`Bài ${n}: ${L.t[0]} – Hán Tự Việt`;
}

/* ---------- ngữ pháp ---------- */
function renderGrammar(lv){
  const g=GRAMMAR[lv];
  $("#app").innerHTML=`<div class="hhead"><div><h1>📐 Ngữ pháp HSK ${lv}</h1><p>${g.length} điểm ngữ pháp · nguồn: file ${lv>3?"Tổng hợp ngữ pháp":"Ngữ pháp"} HSK ${lv} trong giáo trình${lv>3?" (ví dụ chỉ có tiếng Trung, pinyin tạo tự động)":""}</p></div>
   <div class="hfil">${Object.keys(GRAMMAR).map(l=>`<button class="pill ${l==lv?"blue":""}" onclick="go('nguphap-${l}')">HSK ${l}</button>`).join("")}</div></div>
  <div class="gtoc card">${g.map((p,k)=>`<a onclick="document.getElementById('gp${k}').scrollIntoView({behavior:'smooth'})">${k+1}. ${esc(p[0])}</a>`).join("")}</div>
  ${g.map((p,k)=>`<section class="card sec gp" id="gp${k}"><h3><span class="dn">${k+1}</span>${esc(p[0])}</h3>
   ${p[1]?`<div class="gst">${hzLinks(p[1])}</div>`:""}<p class="gex">${esc(p[2])}</p>
   <div class="exs" style="border:none;padding:0">${p[3].map(e=>exHtml(e,"")).join("")}</div></section>`).join("")}<div style="height:24px"></div>`;
  document.title=`Ngữ pháp HSK ${lv} – Hán Tự Việt`;
}

/* ---------- luyện đọc ---------- */
let DH={p:0,py:false,vi:false};
function renderReading(){
  const S=VOCAB[3].filter(v=>v[4]&&v[4].length>5);const per=10,pages=Math.ceil(S.length/per);DH.p=Math.min(DH.p,pages-1);
  const cur=S.slice(DH.p*per,DH.p*per+per);
  const DW=CONVS[3].flatMap(L=>L.s.filter(s=>s.p[0]==="短文").map(s=>[L,s.l[0]]));
  $("#app").innerHTML=`<div class="hhead"><div><h1>📰 Luyện đọc hiểu</h1><p>${DW.length} bài đọc đoạn văn HSK 3 (giáo trình chuẩn) + ${S.length} câu đọc</p></div></div>
  <section class="card sec"><h3>📖 Bài đọc đoạn văn – Giáo trình chuẩn HSK 3</h3>${DW.map(([L,l],k)=>`<details class="rd"><summary><b>Bài ${L.n}</b> · <span class="hz">${esc(l[1].slice(0,22))}…</span></summary>
   <div class="rz" style="margin-top:8px">${hzLinks(l[1])}</div><div class="expy blur" onclick="this.classList.remove('blur')">${esc(l[2])}</div><div class="vi blur" onclick="this.classList.remove('blur')">${esc(l[3])}</div>
   <div class="ctl"><button class="tg" onclick="speak(CONVS[3].find(x=>x.n===${L.n}).s.find(s=>s.p[0]==='短文').l[0][1])">▶ Nghe</button><button class="tg" onclick="go('ht-3-${L.n}')">💬 Xem cả bài ${L.n}</button></div></details>`).join("")}</section>
  <div class="hhead" style="margin-top:12px"><div><h1 style="font-size:22px">Luyện đọc câu</h1><p>${S.length} câu đọc HSK 3 từ giáo trình · đọc chữ Hán trước, rồi mở pinyin và nghĩa để kiểm tra</p></div></div>
  <section class="card sec"><div class="ctl" style="margin:0"><b style="align-self:center">Bài đọc ${DH.p+1}/${pages}</b>
   <button class="tg ${DH.py?"on":""}" onclick="DH.py=!DH.py;renderReading()">👁 Pinyin</button><button class="tg ${DH.vi?"on":""}" onclick="DH.vi=!DH.vi;renderReading()">👁 Nghĩa Việt</button>
   <button class="tg" onclick="speak(${JSON.stringify(cur.map(v=>v[4]).join('')).replace(/"/g,"&quot;")})">▶ Nghe cả bài</button>
   <span style="margin-left:auto;display:flex;gap:6px"><button class="pill" ${DH.p?"":"disabled"} onclick="DH.p--;renderReading()">‹</button><select onchange="DH.p=+this.value;renderReading()">${Array.from({length:pages},(_,k)=>`<option value="${k}" ${k===DH.p?"selected":""}>Bài ${k+1}</option>`).join("")}</select><button class="pill" ${DH.p<pages-1?"":"disabled"} onclick="DH.p++;renderReading()">›</button></span></div></section>
  <section class="card sec" style="margin:18px 0">${cur.map((v,k)=>`<div class="rline"><span class="no">${DH.p*per+k+1}</span><div style="flex:1">
    <div class="sent rz">${hzLinks(v[4],v[0])}</div>
    <div class="expy ${DH.py?"":"blur"}" onclick="this.classList.remove('blur')">${esc(v[5])}</div>
    <div class="vi ${DH.vi?"":"blur"}" onclick="this.classList.remove('blur')">${esc(v[6])}</div>
    <small class="muted">Từ trọng tâm: <a class="lnk" onclick="goWord('${v[0]}')">${v[0]} (${v[1]})</a></small></div>
    <button class="bsp" onclick="speak('${esc(v[4])}')">${ICO_SP}</button></div>`).join("")}</section>
  <section class="card sec" style="margin-bottom:24px"><h3>✅ Kiểm tra đọc hiểu</h3><p class="muted">Chọn nghĩa đúng cho câu.</p><div class="ctl"><button class="tb t3" onclick="readQuiz(${DH.p})">Làm 5 câu hỏi</button></div></section>`;
  document.title="Luyện đọc hiểu – Hán Tự Việt";
}
function readQuiz(p){const S=VOCAB[3].filter(v=>v[4]&&v[4].length>5);const cur=shuffle(S.slice(p*10,p*10+10)).slice(0,5);
  runTest(cur.map(v=>{const wr=shuffle(S.filter(x=>x!==v)).slice(0,3);return{q:`<div class="hz" style="font-size:24px;line-height:1.6">${esc(v[4])}</div><p class="muted">Câu này có nghĩa là gì?</p>`,o:shuffle([v,...wr]).map(x=>[x[6],x===v]),say:v[4]}}),"Đọc hiểu – bài "+(p+1))}

/* ---------- ôn luyện & thi thử ---------- */
const qWord=(w,l)=>({w:w[0],py:w[1],m:w[3]});
function poolLv(lv){return VOCAB[lv].map(w=>qWord(w))}
function mkQ(x,pool,type){
  const wr=shuffle(pool.filter(y=>y.w!==x.w&&y.m!==x.m)).slice(0,3),os=shuffle([x,...wr]);
  if(type==="m")return{q:`<div class="qq">${x.w}</div><p class="muted" style="text-align:center">Từ này có nghĩa là gì?</p>`,o:os.map(o=>[o.m,o===x]),say:x.w};
  if(type==="p")return{q:`<div class="qq">${x.w}</div><p class="muted" style="text-align:center">Từ này đọc là gì?</p>`,o:os.map(o=>[o.py,o===x]),say:x.w};
  if(type==="r")return{q:`<div style="text-align:center;font-size:22px;font-weight:700;margin:18px 0">${esc(x.m)}</div><p class="muted" style="text-align:center">Chọn từ tiếng Trung đúng</p>`,o:os.map(o=>[`<span class="hz" style="font-size:22px">${o.w}</span>`,o===x]),say:x.w};
  return{q:`<div style="text-align:center;margin:18px 0"><button class="tb t2" style="height:60px;font-size:17px" onclick="speak('${x.w}')">${ICO_SP} Nghe</button></div><p class="muted" style="text-align:center">Chọn từ bạn vừa nghe</p>`,o:os.map(o=>[`<span class="hz" style="font-size:22px">${o.w}</span> <span class="muted">${o.py}</span>`,o===x]),say:x.w,auto:x.w};
}
function openQuizLv(lv,focus){const pool=poolLv(lv);let qs=shuffle(pool).slice(0,10);if(focus){qs=qs.filter(x=>x.w!==focus);qs.unshift(pool.find(x=>x.w===focus))}
  runTest(qs.slice(0,10).map((x,k)=>mkQ(x,pool,["m","p","r","l"][k%4])),"Ôn tập "+LV_INFO[lv].n)}
function openQuizWords(ws,title){const pool=poolLv(1).concat(poolLv(2));const qs=ws.map(w=>pool.find(x=>x.w===w)).filter(Boolean);runTest(shuffle(qs).slice(0,10).map((x,k)=>mkQ(x,pool,["m","r","l","p"][k%4])),"Luyện tập "+title)}
function clozeQ(lv){
  // câu điền từ: lấy câu chứa từ cấp lv
  const pool=poolLv(lv);let src=[];
  if(lv==3||lv==4)src=VOCAB[lv].filter(v=>v[4]&&v[4].includes(v[0])).map(v=>[v[4],v[0],v[6]]);
  else if(lv==5)src=GRAMMAR[5].flatMap(p=>p[3]).map(e=>{const w=VOCAB[5].find(v=>v[0].length>1&&e[0].includes(v[0]));return w?[e[0],w[0],""]:null}).filter(Boolean);
  else{const ws=VOCAB[lv].filter(w=>w[0].length>=1);(CONVS[lv]||CONV).forEach(L=>L.s.forEach(s=>s.l.forEach(l=>{const c=ws.filter(w=>w[0].length>1&&l[1].includes(w[0]));if(c.length)src.push([l[1],c[0][0],l[3]])})));
    if(lv==2)src=src.concat(GRAMMAR[2].flatMap(p=>p[3]).filter(e=>/[。？！]/.test(e[0])).map(e=>{const w=VOCAB[2].find(v=>v[0].length>1&&e[0].includes(v[0]));return w?[e[0],w[0],e[2]]:null}).filter(Boolean))}
  const it=src[Math.random()*src.length|0];if(!it)return mkQ(shuffle(pool)[0],pool,"m");
  const x=pool.find(p=>p.w===it[1])||{w:it[1],py:"",m:""};const wr=shuffle(pool.filter(p=>p.w!==x.w&&p.w.length===x.w.length)).slice(0,3);
  return{q:`<div class="hz" style="font-size:24px;line-height:1.7;text-align:center">${esc(it[0]).replace(x.w,'<span class="blank">＿＿</span>')}</div><p class="muted" style="text-align:center">${esc(it[2])}</p><p class="muted" style="text-align:center">Chọn từ điền vào chỗ trống</p>`,o:shuffle([x,...wr]).map(o=>[`<span class="hz" style="font-size:22px">${o.w}</span>`,o===x]),say:it[0]};
}
function startExam(lv){
  const pool=poolLv(lv);const pick=shuffle(pool).slice(0,15);
  const qs=[...pick.slice(0,5).map(x=>mkQ(x,pool,"l")),...pick.slice(5,10).map(x=>mkQ(x,pool,"m")),...pick.slice(10,15).map(x=>mkQ(x,pool,"r")),...Array.from({length:5},()=>clozeQ(lv))];
  qs.forEach((q,k)=>q.part=k<5?"Phần 1 · Nghe":k<10?"Phần 2 · Đọc – chọn nghĩa":k<15?"Phần 3 · Đọc – chọn từ":"Phần 4 · Điền từ vào câu");
  runTest(qs,"Thi thử "+LV_INFO[lv].n,true);
}
let T=null;
function runTest(qs,title,exam){T={qs,title,k:0,score:0,ans:[],exam,t0:Date.now()};tq()}
function tq(){
  if(T.k>=T.qs.length){const sec=Math.round((Date.now()-T.t0)/1000),pct=Math.round(T.score/T.qs.length*100);store.set("tests",[...store.get("tests",[]),{t:T.title,s:T.score,n:T.qs.length,d:Date.now()}].slice(-30));
    openModal(`<h3>🏆 ${esc(T.title)}</h3><div class="qq" style="font-family:inherit;font-size:54px;font-weight:800">${T.score}/${T.qs.length}</div>
    <p style="text-align:center" class="muted">${pct}% · ${Math.floor(sec/60)} phút ${sec%60} giây · ${pct>=80?"Xuất sắc!":pct>=60?"Đạt – cố thêm chút nữa!":"Chưa đạt – hãy ôn lại nhé."}</p>
    <h5>Xem lại câu sai</h5>${T.ans.filter(a=>!a.ok).map(a=>`<div class="rk"><div style="flex:1">${a.q.replace(/<button[\s\S]*?<\/button>/g,"")}<div>✅ ${a.right}</div></div></div>`).join("")||`<p class="muted">Không sai câu nào 🎉</p>`}
    <div class="ctl" style="justify-content:center"><button class="pill" onclick="closeModal()">Đóng</button></div>`);return}
  const q=T.qs[T.k];
  openModal(`<h3>${esc(T.title)} · Câu ${T.k+1}/${T.qs.length}</h3>${q.part?`<span class="tag" style="margin-top:6px">${q.part}</span>`:""}<div class="qbar"><i style="width:${T.k/T.qs.length*100}%"></i></div>${q.q}
   ${q.o.map((o,j)=>`<button class="qopt" data-ok="${o[1]?1:0}" onclick="tans(this)">${o[0]}</button>`).join("")}`);
  if(q.auto)setTimeout(()=>speak(q.auto),250);
}
function tans(btn){const q=T.qs[T.k],ok=btn.dataset.ok==="1";document.querySelectorAll(".qopt").forEach(b=>{b.disabled=true;if(b.dataset.ok==="1")b.classList.add("ok")});
  if(ok){T.score++;addPts(10)}else btn.classList.add("no");
  T.ans.push({ok,q:q.q,right:q.o.find(o=>o[1])[0]});if(q.say)speak(q.say);T.k++;setTimeout(tq,ok?900:1600)}
function renderExamHub(){
  const hist=store.get("tests",[]).slice(-6).reverse();
  $("#app").innerHTML=`<div class="hhead"><div><h1>📝 Luyện thi HSK</h1><p>Đề tạo ngẫu nhiên từ từ vựng, hội thoại và câu ví dụ trong giáo trình – mỗi lần làm là một đề mới</p></div></div>
  <div class="lgrid">${LVS.map(l=>`<div class="card lc"><span class="ln" style="background:${LV_INFO[l].c}">${LV_INFO[l].n}</span><h3 style="margin:8px 0">Đề thi thử ${LV_INFO[l].n}</h3><small class="muted">${VOCAB[l].length} từ trong ngân hàng đề</small>
   <div class="m">20 câu · 4 phần: Nghe (5) · Chọn nghĩa (5) · Chọn từ (5) · Điền từ vào câu (5)</div>
   <div class="ctl"><button class="pill blue" onclick="startExam(${l})">▶ Làm đề mới</button><button class="pill" onclick="openQuizLv(${l})">Ôn nhanh 10 câu</button></div></div>`).join("")}</div>
  <section class="card sec" style="margin:18px 0 24px"><h3>🕘 Kết quả gần đây</h3>${hist.length?hist.map(h=>`<div class="rk"><b class="big">${h.s}/${h.n}</b><div><b>${esc(h.t)}</b><div class="muted">${new Date(h.d).toLocaleString("vi-VN")}</div></div></div>`).join(""):`<p class="muted">Chưa có bài thi nào.</p>`}</section>`;
  document.title="Luyện thi HSK – Hán Tự Việt";
}

/* thẻ ghi nhớ */
let FC=null;
function openFlash(lv){FC={l:shuffle(VOCAB[lv]).slice(0,20),k:0,f:false,lv};fcShow()}
function fcShow(){const w=FC.l[FC.k];openModal(`<h3>🃏 Thẻ ghi nhớ ${LV_INFO[FC.lv].n} · ${FC.k+1}/${FC.l.length}</h3>
  <div class="flash ${FC.f?"f":""}" onclick="FC.f=!FC.f;fcShow()">${FC.f?`<div class="hz" style="font-size:44px">${w[0]}</div><div style="color:var(--cyan);font-size:20px">${w[1]}</div><div style="font-size:18px;margin-top:6px">${esc(w[3])}</div>`:`<div class="hz" style="font-size:64px">${w[0]}</div><small class="muted">Bấm để lật thẻ</small>`}</div>
  <div class="ctl" style="justify-content:center"><button class="pill" ${FC.k?"":"disabled"} onclick="FC.k--;FC.f=false;fcShow()">‹ Trước</button><button class="pill" onclick="speak('${w[0]}')">${ICO_SP}</button><button class="pill" onclick="toggleNote('${w[0]}');fcShow()">${notes.includes(w[0])?"★":"☆"}</button><button class="pill blue" ${FC.k<FC.l.length-1?"":"disabled"} onclick="FC.k++;FC.f=false;fcShow()">Sau ›</button></div>`)}

/* ---------- HSKK luyện nói ---------- */
function renderHSKK(){
  $("#app").innerHTML=`<div class="hhead"><div><h1>🎤 Luyện nói HSKK cao cấp</h1><p>${HSKK.length} đề thi thật (${HSKK.reduce((a,d)=>a+d[1].length,0)} câu hỏi) · phần 三、回答问题 · nguồn: Đề thi thật HSKK cao cấp đến năm 2025</p></div></div>
  <section class="card sec"><p class="gex">Mỗi câu: đọc đề → bấm <b>Bắt đầu nói</b> để có 2,5 phút trả lời (theo phần Trả lời câu hỏi của HSKK cao cấp). Bấm vào chữ để tra nghĩa.</p>
   <div class="ctl"><button class="tb t3" onclick="hskkRandom()">🎲 Bốc đề ngẫu nhiên</button></div></section>
  ${HSKK.map((d,k)=>`<section class="card sec gp"><h3><span class="dn">${k+1}</span>Đề ngày ${d[0]}</h3>${d[1].map((q,j)=>`<div class="ex"><div class="acts"><button onclick="speak('${esc(q[0])}')">${ICO_SP}</button></div><div style="flex:1"><div class="exzh hz">${hzLinks(q[0])}</div><div class="expy">${esc(q[1])}</div><div class="vi">${esc(q[2])}</div>
    <div class="ctl"><button class="tg" onclick="speakTimer(${k},${j})">⏱ Bắt đầu nói</button></div></div></div>`).join("")}</section>`).join("")}<div style="height:24px"></div>`;
  document.title="Luyện nói HSKK – Hán Tự Việt";
}
function hskkRandom(){const k=Math.random()*HSKK.length|0;speakTimer(k,Math.random()*HSKK[k][1].length|0)}
let SPT=null;
function speakTimer(k,j){const q=HSKK[k][1][j];clearInterval(SPT);let t=150;
  openModal(`<h3>🎤 Đề ${HSKK[k][0]} – câu ${j+1}</h3><div class="hz" style="font-size:22px;margin:12px 0">${esc(q[0])}</div><div class="vi">${esc(q[2])}</div>
   <div class="qq" style="font-family:inherit;font-weight:800" id="spt">2:30</div><p class="muted" style="text-align:center">Chuẩn bị ý: mở bài – 2, 3 luận điểm – ví dụ – kết luận.</p>
   <div class="ctl" style="justify-content:center"><button class="pill" onclick="speak('${esc(q[0])}')">${ICO_SP} Nghe đề</button><button class="pill blue" onclick="hskkRandom()">Đề khác</button></div>`);
  SPT=setInterval(()=>{t--;const el=$("#spt");if(!el||!$("#mask").classList.contains("on")){clearInterval(SPT);return}el.textContent=Math.floor(t/60)+":"+String(t%60).padStart(2,"0");if(t<=0){clearInterval(SPT);el.textContent="Hết giờ!";toast("Hết giờ!")}},1000)}

/* ---------- Nghe hiểu HSK 6 ---------- */
let NG={show:false,py:false};
function renderListenList(){
  $("#app").innerHTML=`<div class="hhead"><div><h1>🎧 Nghe hiểu HSK 6</h1><p>${LISTEN6.length} bài · ${LISTEN6.reduce((a,o)=>a+o.p.length,0)} đoạn nghe · nguồn: Đáp án sách bài tập HSK 6 (quyển thượng & hạ – phần ghi âm)</p></div></div>
  <div class="lgrid">${LISTEN6.map(o=>`<div class="card lc" onclick="go('nghe6-${o.n}')"><span class="ln" style="background:#ec4899">Bài ${o.n}</span><div class="hz lt" style="font-size:19px">${esc((o.t||"").replace(/^[^\\u4e00-\\u9fff“]+/,"")||"Bài "+o.n)}</div><div class="scn"><span>🎧 ${o.p.length} đoạn</span></div></div>`).join("")}</div>`;
  document.title="Nghe hiểu HSK 6 – Hán Tự Việt";
}
function renderListen(n){const o=LISTEN6.find(x=>x.n===n);if(!o){go("nghe6");return}const i=LISTEN6.indexOf(o);
  $("#app").innerHTML=`<div class="crumb"><button class="pill" onclick="go('nghe6')">← Danh sách</button><div class="path"><a onclick="go('home')">🏠 Trang chủ</a>›<a onclick="go('nghe6')">Nghe hiểu HSK 6</a>›<b>Bài ${n}</b></div>
   <button class="pill" ${i>0?"":"disabled"} onclick="go('nghe6-${i>0?LISTEN6[i-1].n:n}')">‹ Bài trước</button><button class="pill" ${i<LISTEN6.length-1?"":"disabled"} onclick="go('nghe6-${i<LISTEN6.length-1?LISTEN6[i+1].n:n}')">Bài sau ›</button></div>
  <section class="card sec"><h3>🎧 Bài ${n}${o.t?` · <span class="hz">${esc(o.t.replace(/^[^\\u4e00-\\u9fff“]+/,""))}</span>`:""}</h3><p class="gex">Nghe trước, đoán nội dung, rồi mới mở lời văn để kiểm tra.</p>
   <div class="ctl"><button class="tg ${NG.show?"on":""}" onclick="NG.show=!NG.show;renderListen(${n})">👁 Hiện lời văn</button><button class="tg ${NG.py?"on":""}" onclick="NG.py=!NG.py;renderListen(${n})">👁 Pinyin</button></div></section>
  ${o.p.map((p,k)=>`<section class="card sec gp"><h3><span class="dn">${k+1}</span>Đoạn ${k+1}<span class="r"><button class="tg" onclick="speak(LISTEN6[${i}].p[${k}][0])">▶ Nghe</button><button class="tg" onclick="speak(LISTEN6[${i}].p[${k}][0],{slow:1})">🐢 Chậm</button></span></h3>
   <div class="rz ${NG.show?"":"blur"}" onclick="this.classList.remove('blur')">${hzLinks(p[0])}</div>${NG.py?`<div class="expy" style="margin-top:6px">${esc(p[1])}</div>`:""}</section>`).join("")}<div style="height:24px"></div>`;
  document.title=`Nghe hiểu HSK 6 – bài ${n}`;
}

/* ---------- Giáo trình HSK 3.0 theo chủ đề ---------- */
function renderCourse3(lv){lv=+(lv||1);const Ls=LESSONS[lv];
  $("#app").innerHTML=`<div class="hhead"><div><span class="lvpill" style="background:${LV_INFO[lv].c}">${LV_INFO[lv].n}</span><h1>📘 Giáo trình ${LV_INFO[lv].n} – chuẩn HSK 3.0</h1><p>${Ls.length} bài theo chủ đề · ${VOCAB[lv].length} từ (chuẩn ${LV_INFO[lv].goal}) · mỗi bài xếp từ thông dụng nhất đến ít dùng</p></div>
   <div class="hfil">${LVS.map(l=>`<button class="pill ${l==lv?"blue":""}" onclick="go('lop-${l}')">${LV_INFO[l].n}</button>`).join("")}</div></div>
  <div class="lgrid">${Ls.map((L,k)=>`<div class="card lc" onclick="go('lop-${lv}-${k+1}')"><span class="ln" style="background:${LV_INFO[lv].c}">Bài ${k+1}</span><div class="lt" style="font-size:18px;font-weight:700;color:var(--tx)">${esc(L.t)}</div><div class="hz" style="color:var(--red2)">${L.z}</div>
   <div class="m hz" style="margin-top:6px">${L.w.slice(0,8).map(i=>VOCAB[lv][i][0]).join("、")}…</div><div class="scn"><span>📗 ${L.w.length} từ</span></div></div>`).join("")}</div>
  ${lv==1?`<p class="muted" style="margin-bottom:24px">Muốn học theo sách cũ <i>Giáo trình chuẩn HSK 1</i> (15 bài, có hội thoại)? <a class="lnk" onclick="go('giaotrinh')">Mở tại đây</a>.</p>`:""}`;
  document.title=`Giáo trình ${LV_INFO[lv].n} (HSK 3.0) – Hán Tự Việt`;
}
function renderLesson3(lv,n){lv=+lv;const Ls=LESSONS[lv],L=Ls[n-1];if(!L){go("lop-"+lv);return}
  const ws=L.w.map(i=>[VOCAB[lv][i],i]);
  const ex=[],seen=new Set();for(const [w] of ws){if(ex.length>=10)break;for(const e of findExamples(w[0],3)){if(!seen.has(e[0])&&e[0].length<=40){seen.add(e[0]);ex.push([...e,w[0]]);break}}}
  $("#app").innerHTML=`<div class="crumb"><button class="pill" onclick="go('lop-${lv}')">← Danh sách bài</button><div class="path"><a onclick="go('home')">🏠 Trang chủ</a>›<a onclick="go('lop-${lv}')">Giáo trình ${LV_INFO[lv].n}</a>›<b>Bài ${n}</b></div>
   <button class="pill" ${n>1?"":"disabled"} onclick="go('lop-${lv}-${n-1}')">‹ Bài trước</button><button class="pill" ${n<Ls.length?"":"disabled"} onclick="go('lop-${lv}-${n+1}')">Bài sau ›</button></div>
  <section class="card sec"><div class="lhead"><span class="lnum" style="background:${LV_INFO[lv].c}">${n}</span><div><small class="muted">${LV_INFO[lv].n} · chuẩn HSK 3.0</small><div style="font-size:24px;font-weight:800">${esc(L.t)}</div><div class="hz" style="color:var(--red2);font-size:20px">${L.z}</div></div></div>
   <div class="ctl"><button class="tb t5" onclick="speak(LESSONS[${lv}][${n-1}].w.map(i=>VOCAB[${lv}][i][0]).join('，'),{slow:1})">🔊 Nghe từ mới</button><button class="tb t2" onclick="fcLesson(${lv},${n})">🃏 Thẻ ghi nhớ</button><button class="tb t3" onclick="openQuizWords(LESSONS[${lv}][${n-1}].w.map(i=>VOCAB[${lv}][i][0]),'${LV_INFO[lv].n} – Bài ${n}')">🎯 Luyện tập</button><button class="tb t1" onclick="openWrite('${[...ws[0][0][0]][0]}')">✏️ Luyện viết</button></div></section>
  <section class="card sec" style="margin:18px 0"><h3>📗 Từ mới (${ws.length})</h3>
   <table class="vt"><thead><tr><th>#</th><th>Từ</th><th>Pinyin</th><th>Từ loại</th><th>Nghĩa</th><th></th></tr></thead><tbody>
   ${ws.map(([w,i],k)=>`<tr onclick="go('w-${lv}-${i}')"><td class="muted">${k+1}</td><td class="hz">${w[0]}</td><td style="color:var(--cyan)">${esc(w[1])}</td><td class="muted">${esc(w[2]||"")}</td><td>${esc(w[3])}</td><td><button class="tg" onclick="event.stopPropagation();speak('${w[0]}')">${ICO_SP}</button></td></tr>`).join("")}</tbody></table></section>
  <section class="card sec" style="margin-bottom:24px"><h3>📝 Câu ví dụ dùng từ của bài (${ex.length})</h3>${ex.length?`<div class="exs" style="border:none;margin:0;padding:0">${ex.map(e=>exHtml(e,e[4])).join("")}</div>`:`<p class="muted">Chưa có câu ví dụ trong giáo trình cho các từ của bài này.</p>`}</section>`;
  document.title=`${LV_INFO[lv].n} – Bài ${n}: ${L.t} – Hán Tự Việt`;
}
function fcLesson(lv,n){FC={l:LESSONS[lv][n-1].w.map(i=>VOCAB[lv][i]),k:0,f:false,lv};fcShow()}
