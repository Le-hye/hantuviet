"""Chữ Hán -> pinyin hiển thị (kiểu giáo trình): biến điệu 一/不, thanh nhẹ, thanh 3 giữ gốc.
Dùng: python3 pinyin_vn.py "你好！我不是老师。" [--mark3]"""
import re, sys, logging
import warnings; warnings.filterwarnings("ignore")
import jieba; jieba.setLogLevel(logging.ERROR)
from pypinyin import pinyin, Style

# Ghi đè: mỗi chữ một âm tiết, cách nhau dấu cách; 儿化 viết "r".
FIX = {
 "东西":"dōng xi","朋友":"péng you","衣服":"yī fu","时候":"shí hou","喜欢":"xǐ huan","认识":"rèn shi",
 "休息":"xiū xi","漂亮":"piào liang","意思":"yì si","先生":"xiān sheng","舒服":"shū fu","便宜":"pián yi",
 "名字":"míng zi","客气":"kè qi","麻烦":"má fan","事情":"shì qing","明白":"míng bai","告诉":"gào su",
 "什么":"shén me","怎么":"zěn me","这么":"zhè me","那么":"nà me","多少":"duō shao","地方":"dì fang",
 "窗户":"chuāng hu","凉快":"liáng kuai","热闹":"rè nao","啰嗦":"luō suo","咳嗽":"ké sou","眼睛":"yǎn jing",
 "耳朵":"ěr duo","关系":"guān xi","姑娘":"gū niang","丈夫":"zhàng fu","打算":"dǎ suan","商量":"shāng liang",
 "聪明":"cōng ming","暖和":"nuǎn huo","清楚":"qīng chu","厉害":"lì hai","马虎":"mǎ hu","豆腐":"dòu fu",
 "点心":"diǎn xin","太阳":"tài yang","月亮":"yuè liang","尾巴":"wěi ba","哪里":"nǎ li","觉得":"jué de",
 "哪儿":"nǎ r","那儿":"nà r","这儿":"zhè r","一会儿":"yí huì r","一点儿":"yì diǎn r","有点儿":"yǒu diǎn r",
 "聊天儿":"liáo tiān r","玩儿":"wán r","事儿":"shì r","银行":"yín háng","行李":"xíng li","还是":"hái shi",
 "睡觉":"shuì jiào","长大":"zhǎng dà","可爱":"kě ài","生意":"shēng yi","学生":"xué sheng","买卖":"mǎi mai",
 "知道":"zhī dao","衣裳":"yī shang","胳膊":"gē bo","头发":"tóu fa","萝卜":"luó bo","葡萄":"pú tao","早上":"zǎo shang","古时候":"gǔ shí hou","过去":"guò qù","那时候":"nà shí hou","小时候":"xiǎo shí hou","宋国":"Sòng guó","舍不得":"shě bu de","吃不上":"chī bu shàng","找不到":"zhǎo bu dào","睡不着":"shuì bu zháo","说不出":"shuō bu chū","看不见":"kàn bu jiàn","听不懂":"tīng bu dǒng","做不完":"zuò bu wán","来不及":"lái bu jí","对不起":"duì bu qǐ","了不起":"liǎo bu qǐ","发现":"fā xiàn","自己":"zì jǐ","实在":"shí zài","并不":"bìng bù","变得":"biàn de","美得":"měi de","长时间":"cháng shí jiān","有时候":"yǒu shí hou","落下":"luò xià","好觉":"hǎo jiào","睡觉":"shuì jiào","上个":"shàng ge","下个":"xià ge","这个":"zhè ge","那个":"nà ge","每个":"měi ge","路上":"lù shang","晚上":"wǎn shang","觉得":"jué de","记得":"jì de","懂得":"dǒng de","值得":"zhí de","长大":"zhǎng dà","成长":"chéng zhǎng","长期":"cháng qī","很长":"hěn cháng","长城":"Cháng chéng","还是":"hái shi","还有":"hái yǒu","还要":"hái yào","行李":"xíng li","银行":"yín háng","一行":"yì háng","重新":"chóng xīn","重要":"zhòng yào","晚上":"wǎn shang","石头":"shí tou","邻居":"lín jū","庄稼":"zhuāng jia","力气":"lì qi","心里":"xīn li","家里":"jiā li","这里":"zhè li","那里":"nà li",
}
SPLIT = {"一个","两个","几个","这是","那是","不太","不想","吃饭","不会","不能","不用","很好","不错"} - set()
NAMES = {"下龙湾":"Xiàlóngwān","越南":"Yuènán","中国":"Zhōngguó","河内":"Hénèi","胡志明":"Húzhìmíng","北京":"Běijīng","上海":"Shànghǎi","汉语":"Hànyǔ","中文":"Zhōngwén","微信":"Wēixìn","春节":"Chūnjié","小明":"Xiǎo Míng","小兰":"Xiǎo Lán"}
NEUTRAL = set("的了吗呢吧啊么着过们呀哇啦嘛")
REDUP = set("妈爸哥姐弟妹奶爷婆公叔姑舅宝星谢看试想听说走坐尝聊问等找")
T = {"a":"āáǎà","e":"ēéěè","i":"īíǐì","o":"ōóǒò","u":"ūúǔù","ü":"ǖǘǚǜ"}
def tone(s):
    for m in T.values():
        for i, c in enumerate(m):
            if c in s: return i + 1
    return 5
def plain(s):
    for v, m in T.items():
        for c in m: s = s.replace(c, v)
    return s
def retone(s, t):
    s = plain(s)
    if t == 5: return s
    for v in ("a", "e", "ou"):
        if v in s: return s.replace(v[0], T[v[0]][t - 1], 1)
    k = max(s.rfind(v) for v in "iouü"); return s[:k] + T[s[k]][t - 1] + s[k + 1:]
isH = lambda c: '一' <= c <= '鿿'

def convert(text, mark3=False):
    for w in FIX: jieba.add_word(w, 10**6)
    words = []
    for w in jieba.cut(text, HMM=False):
        if re.match(r'^[一两几这那每][个]', w) and len(w) > 2: words += [w[:2], w[2:]]; continue
        if w.startswith('非常') and len(w) > 2: words += ['非常', w[2:]]; continue
        if w in SPLIT or (w not in FIX and len(w) == 2 and w[0] in "这那" and w[1] == "是"): words += list(w)
        else: words.append(w)
    # 1) âm tiết theo chữ + đánh dấu ghi đè + ranh giới từ
    ch, sy, fx, wid = [], [], [], []
    for n, w in enumerate(words):
        if w in FIX: ps, f = FIX[w].split(), True
        else:
            ps = [p[0] if isH(c) else c for c, p in zip(w, pinyin(w, style=Style.TONE, errors=lambda x: [[c] for c in x]))]; f = False
            # pypinyin có thể trả về cụm nhiều chữ cho dấu câu
            if len(ps) != len(w): ps = [p[0] for p in pinyin(list(w), style=Style.TONE, errors=lambda x: [[c] for c in x])]
        for c, p in zip(w, ps): ch.append(c); sy.append(p); fx.append(f); wid.append(n)
    base = sy[:]
    H = lambda j: 0 <= j < len(ch) and isH(ch[j])
    # 2) thanh nhẹ
    for j, c in enumerate(ch):
        if fx[j] or not H(j): continue
        if c in NEUTRAL: sy[j] = plain(sy[j])
        elif j and ch[j-1] == c and c in REDUP and not (j > 1 and ch[j-2] == c): sy[j] = plain(sy[j])
        elif c == "个" and H(j-1): sy[j] = "ge"
        elif c == "子" and H(j-1) and wid[j-1] == wid[j]: sy[j] = "zi"
        elif c == "头" and H(j-1) and wid[j-1] == wid[j] and ch[j-1] in "里外上下前后石骨枕馒木舌念甜苦": sy[j] = "tou"
    # 2b) 得 / 地 trợ từ
    for j, c in enumerate(ch):
        if not H(j) or fx[j]: continue
        alone = (j == 0 or wid[j-1] != wid[j]) and (j + 1 >= len(ch) or wid[j+1] != wid[j])
        if c == '得' and alone and H(j-1) and not (j + 1 < len(ch) and ch[j+1] == '到'): sy[j] = 'de'
        if c == '地' and alone and H(j-1) and j + 1 < len(ch) and H(j+1): sy[j] = 'de'
    # 3) 一 / 不
    for j, c in enumerate(ch):
        if c not in "一不" or (fx[j] and c != "一"): continue
        if fx[j]: continue
        nt = tone(base[j+1]) if H(j+1) else 0
        p = ch[j-1] if H(j-1) else ""; q = ch[j+1] if H(j+1) else ""
        if c == "一":
            if not q or (p and p in "第十统唯初万周期") or q in "月号日楼层二三四五六七八九十零〇百千万": sy[j] = "yī"
            elif p and p == q: sy[j] = "yi"                       # 看一看
            else: sy[j] = "yí" if nt == 4 or q == "个" else "yì"
        else:
            if p and q and (p == q or (q in "起及懂见到完动清" and p not in "们我你他她它咱")): sy[j] = "bu"   # 好不好, 对不起, 听不懂
            else: sy[j] = "bú" if nt == 4 else "bù"
    # 4) thanh 3 (chỉ khi --mark3)
    if mark3:
        for j in range(len(sy) - 1):
            if H(j) and H(j+1) and tone(sy[j]) == 3 and tone(sy[j+1]) == 3: sy[j] = retone(sy[j], 2)
    # 5) ghép: liền trong từ, cách giữa từ, 儿 dính vào trước, ' trước a/e/o
    out, prev_w, start = "", None, True
    P = {"，":", ","。":". ","！":"! ","？":"? ","：":": ","、":", ","；":"; ","“":" \"","”":"\" ","（":" (","）":") ","…":"…","—":"—"}
    for j, c in enumerate(ch):
        s = sy[j]
        if not H(j):
            out = out.rstrip() + P.get(c, c)
            if c in "。！？": start = True
            prev_w = None; continue
        if s == "r" or (c == "儿" and wid[j] == prev_w and H(j-1)): out += "r"; continue
        same = wid[j] == prev_w
        if same and plain(s)[0] in "aeo": s = "'" + s
        if start: s = s[0].upper() + s[1:]; start = False
        out += s if same or not out or out[-1] in " \"(" else " " + s
        prev_w = wid[j]
    out = re.sub(r"\s+", " ", out).strip()
    for k, v in NAMES.items():
        if k in text: out = re.sub(r"(?i)" + re.escape(v), v, out)
    return out

if __name__ == "__main__":
    for t in [x for x in sys.argv[1:] if not x.startswith("--")]: print(convert(t, "--mark3" in sys.argv))
