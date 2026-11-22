import sys,json,re
sys.argv=[sys.argv[0]]+sys.argv[1:]
from pinyin_vn import convert
src=sys.argv[1]; out={}
cur=None
for l in open(src,encoding='utf-8'):
    l=l.rstrip('\n')
    if not l.strip(): continue
    if l.startswith('@'): cur=l[1:].strip(); out[cur]={'han':[],'py':[],'vi':[],'w':''}; continue
    if l.startswith('W='): out[cur]['w']=l[2:].strip(); continue
    z,v=l.split('|',1); out[cur]['han'].append(z.strip()); out[cur]['vi'].append(v.strip()); out[cur]['py'].append(convert(z.strip()))
for k,o in out.items(): print(k,len(o['han']),'câu',sum(len(re.sub(r'\W','',h)) for h in o['han']),'chữ')
json.dump(out,open(src+'.json','w',encoding='utf-8'),ensure_ascii=False)
