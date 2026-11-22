/** TẠM: tìm câu chưa có file giọng đọc (云扬/晓晓) → ghi vào trang _TTS */
function tamXemMC() {
  const ss = SpreadsheetApp.getActive();
  const idx = new Set(UrlFetchApp.fetch('https://le-hye.github.io/hantuviet/sotay-audio/idx.txt?t=' + Date.now()).getContentText().split(/\s+/));
  const key = s => { let h1 = 0xdeadbeef, h2 = 0x41c6ce57; for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); h1 = Math.imul(h1 ^ c, 2654435761); h2 = Math.imul(h2 ^ c, 1597334677); }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507); h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909); h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507); h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36); };
  const LV = ['HSK1','HSK2','HSK3','HSK4','HSK5','HSK6','HSK7-9'];
  const norm = l => { l = String(l || '').toUpperCase().replace(/\s/g, ''); if (/[789]/.test(l)) return 'HSK7-9'; const m = l.match(/HSK([1-6])/); return m ? 'HSK' + m[1] : 'HSK3'; };
  const clean = t => String(t || '').replace(/^\s*[•·\-①-⑳]\s*/, '').replace(/^\s*\[[^\]]*\]\s*/, '').replace(/^[ABC][:：]\s*/, '').trim();
  const H = /[一-鿿]/, M = new Map();
  const add = (lv, who, t) => { t = clean(t); if (!t || !H.test(t) || t.length > 300) return; const k = who + '|' + t; if (idx.has(key(k))) return; const o = M.get(k); if (!o || LV.indexOf(lv) < LV.indexOf(o)) M.set(k, lv); };
  const rows = (name, first, nc) => { const sh = ss.getSheetByName(name); if (!sh || sh.getLastRow() < first) return []; return sh.getRange(first, 1, sh.getLastRow() - first + 1, nc).getDisplayValues(); };
  const lines = s => String(s || '').split('\n');
  rows('Sổ từ vựng', 8, 14).forEach(r => { const lv = norm(r[12]); add(lv, 'L', r[3]); lines(r[8]).forEach(l => add(lv, 'L', l)); });
  const wl = {}; rows('Từ vựng mẫu', 7, 5).forEach(r => { const lv = norm(r[1]); if (r[4]) { add(lv, 'L', r[4]); wl[r[4].trim()] = lv; } });
  rows('_VD', 3, 4).forEach(r => { const lv = wl[String(r[0]).trim()] || 'HSK4'; add(lv, 'L', r[1]); add(lv, 'L', r[3]); });
  rows('Mẫu câu giao tiếp', 4, 11).forEach(r => { const lv = norm(r[1]); add(lv, 'L', r[3]); lines(r[10]).forEach(l => { const p = l.split('|'); if (p.length >= 2) add(lv, p[0].trim() === 'B' ? 'L' : 'M', p[1]); }); });
  rows('Đoạn thoại', 4, 9).forEach(r => add(norm(r[1]), String(r[3]).trim() === 'B' ? 'L' : 'M', r[5]));
  ['Động từ ly hợp','Lượng từ','Thương mại – Logistics','Công xưởng','Công nghệ AI'].forEach(n => rows(n, 7, 10).forEach(r => { const lv = norm(r[1]); add(lv, 'L', r[4]); lines(r[9]).forEach(l => { if (H.test(l)) add(lv, 'L', l); }); }));
  rows('Cấu trúc ngữ pháp', 4, 5).forEach(r => lines(r[4]).forEach(l => add(norm(r[0]), 'L', l)));
  rows('_Luyện đọc dữ liệu', 3, 7).forEach(r => lines(r[6]).forEach(l => add(norm(r[3]), 'L', l)));
  let out = ss.getSheetByName('_TTS'); if (!out) { out = ss.insertSheet('_TTS'); out.hideSheet(); } out.clear();
  const data = [...M].map(([k, lv]) => { const i = k.indexOf('|'); return [lv, k.slice(0, i), k.slice(i + 1)]; });
  if (data.length) out.getRange(1, 1, data.length, 3).setNumberFormat('@').setValues(data);
  for (let i = 0; i < data.length; i += 100) Logger.log('TSV\n' + data.slice(i, i + 100).map(r => r.join('\t')).join('\n'));
  Logger.log('Thiếu file giọng đọc: ' + data.length + ' câu (đã ghi vào trang _TTS)');
}
