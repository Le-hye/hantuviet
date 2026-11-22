import ssl, os, sys, asyncio, subprocess, time
import edge_tts, edge_tts.communicate as _c
from h import key
_ca=os.path.expanduser("~/.ccr/ca-bundle.crt")
if os.path.exists(_ca): _c._SSL_CTX=ssl.create_default_context(cafile=_ca)
VOICE={"M":"zh-CN-YunyangNeural","L":"zh-CN-XiaoxiaoNeural"}
RATE={"HSK1":"-5%","HSK2":"-2%","HSK3":"+1%","HSK4":"+4%","HSK5":"+7%","HSK6":"+10%","HSK7-9":"+13%"}
OUT=sys.argv[2]; CONC=int(sys.argv[3]) if len(sys.argv)>3 else 10
items=[l.rstrip('\n').split('\t') for l in open(sys.argv[1],encoding='utf-8') if l.strip()]
todo=[]
for lv,who,t in items:
    k=key(who,t); p=f"{OUT}/{k[:2]}/{k}.mp3"
    if not os.path.exists(p): todo.append((lv,who,t,p))
print("todo",len(todo),"of",len(items),flush=True)
done=0; fail=0; t0=time.time()
async def one(lv,who,t,p,sem):
    global done,fail
    async with sem:
        os.makedirs(os.path.dirname(p),exist_ok=True); tmp=p+".raw.mp3"
        for a in range(4):
            try:
                await edge_tts.Communicate(t,VOICE[who],rate=RATE.get(lv,"+1%")).save(tmp)
                if os.path.getsize(tmp)>500: break
            except Exception as e:
                await asyncio.sleep(2+a*3)
        else:
            fail+=1; return
        proc=await asyncio.create_subprocess_exec("ffmpeg","-y","-loglevel","error","-i",tmp,"-af","silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse","-ac","1","-ar","24000","-b:a","32k",p)
        await proc.wait(); os.remove(tmp); done+=1
        if done%200==0: print(f"{done} ok {fail} fail {time.time()-t0:.0f}s",flush=True)
async def main():
    sem=asyncio.Semaphore(CONC)
    await asyncio.gather(*[one(*x,sem) for x in todo])
asyncio.run(main()); print("END",done,fail,flush=True)
