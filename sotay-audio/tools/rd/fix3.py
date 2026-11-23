import json
d=json.load(open('b3.txt.json'))
G=[('hěnduō','hěn duō'),('Hěnduō','Hěn duō'),('zhècì','zhè cì'),('gōnggòngqìchē','gōnggòng qìchē')]
F={'BD33':[('guonián yídìng yào chījiǎozi','guònián yídìng yào chī jiǎozi'),('Hěnjiǔyǐqián, yǒu yíwèi jiào zhāngzhòngjǐng','Hěn jiǔ yǐqián, yǒu yí wèi jiào Zhāng Zhòngjǐng'),('yìnián dōngtiān','yì nián dōngtiān'),('fàngzài guōlǐzhǔ shú, qièsuì','fàng zài guō li zhǔshú, qiēsuì'),('zhèzhǒng','zhè zhǒng'),('"jiāo ěr"','"jiāo\'ěr"'),('fēngěi','fēn gěi'),('ěrduo shàng de','ěrduo shang de'),('quánjiārén zuòzài','quán jiā rén zuò zài'),('yìméi','yì méi'),('xīn de yìnián huì yǒu hǎoyùnqì','xīn de yì nián huì yǒu hǎo yùnqi'),('háiyǒu sù','hái yǒu sù'),('Zhōngguó rén láishuō','Zhōngguórén lái shuō'),('bù zhǐshì yìzhǒng','bù zhǐ shì yì zhǒng')],
'BD35':[('yíbù shǒujī','yí bù shǒujī'),('shāngpǐnzhǒnglèi','shāngpǐn zhǒnglèi'),('zuìhéshì','zuì héshì'),('hěnkuài','hěn kuài'),('qītiān','qī tiān'),('jiàgépiányi','jiàgé piányi'),('yòngbúshàng','yòng bu shàng'),('Háiyǒu','Hái yǒu'),('Zǒngdeláishuō','Zǒng de lái shuō'),('shěngqián','shěng qián')],
'BD38':[('Xiàge yuè wǒ yào cānjiāHSK sìjí','Xià ge yuè wǒ yào cānjiā HSK sì jí'),('dìyīcì','dì-yī cì'),('fùxíjìhuà','fùxí jìhuà'),('bànge','bàn ge'),('bǎifēnzhīqīshí','bǎi fēn zhī qīshí'),('tí tàiduō, wǒ de liànxí','tí tài duō, wǒ děi liànxí'),('zuòyítào','zuò yí tào'),('běnzi shàng','běnzi shang'),('yǒuméiyǒu','yǒu méiyǒu'),('qiányìtiān','qián yì tiān'),("dì'èrtiān","dì-èr tiān"),('tōngguo','tōngguò')],
'BD41':[('Shàngzhōu, yìjiā','Shàng zhōu, yì jiā'),('gāngānjìngjìng','gānganjìngjìng'),('shēngchǎnliúchéng','shēngchǎn liúchéng'),('xiāndài','xiān dài'),('hěngǎnxìngqù','hěn gǎn xìngqù'),('bútàishúxī','bú tài shúxī'),('háisuàn','hái suàn'),('liáodé','liáo de'),('Yíge yuè','Yí ge yuè'),('dìyīfèn','dì-yī fèn'),('Tōngguo','Tōngguò'),('zuòshēngyì','zuò shēngyi')],
'BD61':[('chéngshì lǐ','chéngshì li'),('yíduàn zhǐyǒu wǔgōnglǐ','yí duàn zhǐ yǒu wǔ gōnglǐ'),('yíge duō','yí ge duō'),('xīnqíng bùhǎo','xīnqíng bù hǎo'),('chēliàng tàiduō','chēliàng tài duō'),('kōngqìwūrǎn','kōngqì wūrǎn'),('gōngjiāochē dào','gōngjiāo chēdào'),('gōnggòngjiāotōng','gōnggòng jiāotōng'),('Yíliàng','Yí liàng'),('jǐshíge','jǐshí ge'),('jǐliàng','jǐ liàng'),('jǐnliàngshǎo','jǐnliàng shǎo'),('bùyuǎn','bù yuǎn'),('duànliànshēntǐ','duànliàn shēntǐ'),('guochéng','guòchéng'),('gòngtóngnǔlì','gòngtóng nǔlì')],
'BD62':[('Zàigōngzuòzhōng','Zài gōngzuò zhōng'),('bùhǎoyìsī','bù hǎoyìsi'),('hěnwǎn','hěn wǎn'),('Shíjiān zhǎng le','Shíjiān cháng le'),('tàidà','tài dà'),('bìngbù shì bùlǐmào','bìng bú shì bù lǐmào'),('Měige','Měi ge'),('suǒyǒurén','suǒyǒu rén'),('"wǒ hěn','"Wǒ hěn'),('jīntiān de xiān','jīntiān děi xiān'),('zhèfèn','zhè fèn'),('kěnéng dehuà','kěnéng de huà'),('bìngbùděngyú','bìng bù děngyú'),('zhēnde','zhēn de'),('nòngqīngchǔ','nòng qīngchu'),('yào buyào','yào bu yào'),('cáinéng gènghǎo','cái néng gèng hǎo')]}
for k,rs in F.items():
  for a,b in rs:
    hit=False
    for i,p in enumerate(d[k]['py']):
      if a in p: d[k]['py'][i]=p.replace(a,b); hit=True
    if not hit: print('MISS',k,a)
for k in d:
  d[k]['py']=[p if True else p for p in d[k]['py']]
  for a,b in G: d[k]['py']=[p.replace(a,b) for p in d[k]['py']]
json.dump(d,open('b3.txt.json','w'),ensure_ascii=False)
json.dump({k:['\n'.join(o['han']),'\n'.join(o['py']),'\n'.join(o['vi']),o['w']] for k,o in d.items()},open('b3.json','w'),ensure_ascii=False)
for k,o in d.items():
  print('@',k); [print(p) for p in o['py']]; print(o['w'])
