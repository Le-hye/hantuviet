M=0xFFFFFFFF
def imul(a,b): return (a*b)&M
def cyrb53(s,seed=0):
    h1=0xdeadbeef^seed; h2=0x41c6ce57^seed
    b=s.encode('utf-16-le')
    for i in range(0,len(b),2):
        ch=b[i]|(b[i+1]<<8)
        h1=imul(h1^ch,2654435761); h2=imul(h2^ch,1597334677)
    h1=imul(h1^(h1>>16),2246822507); h1^=imul(h2^(h2>>13),3266489909)
    h2=imul(h2^(h2>>16),2246822507); h2^=imul(h1^(h1>>13),3266489909)
    return 4294967296*(2097151&h2)+(h1&M)
def b36(n):
    a='0123456789abcdefghijklmnopqrstuvwxyz';o=''
    while n: n,r=divmod(n,36); o=a[r]+o
    return o or '0'
def key(who,text): return b36(cyrb53(who+'|'+text))
