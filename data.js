// Dữ liệu chữ Hán HSK 1. Ví dụ: mỗi token [chữ, pinyin]; token có dấu * là chữ đang học.
const DICT = [
{c:"新",py:"xīn",hv:"TÂN",lv:1,pos:"Tính từ",rad:["斤","Cân","jīn","cái rìu"],
 parts:[["亲","Chữ Thân","qīn","cây gỗ tươi mới mọc (bên trái)"],["斤","Bộ Cân","jīn","cái rìu đẵn gỗ (bên phải)"]],
 tip:"Dùng chiếc rìu (斤) đẵn nhánh cây tươi mới mọc (亲) – gỗ vừa đẵn thì còn MỚI.",
 emo:"🆕",mw:"",anti:["旧","jiù","cũ"],
 defs:[{vi:"mới (tính chất mới, chưa dùng, mới xuất hiện)",en:"new",ex:[
  [[["这","zhè"],["是","shì"],["我","wǒ"],["的","de"],["新*","xīn"],["车","chē"],["。",""]],"Đây là chiếc xe mới của tôi.","This is my new car."],
  [[["我","wǒ"],["要","yào"],["买","mǎi"],["新*","xīn"],["衣服","yīfu"],["。",""]],"Tôi muốn mua quần áo mới.","I want to buy new clothes."],
  [[["他","tā"],["在","zài"],["一","yì"],["家","jiā"],["新*","xīn"],["公司","gōngsī"],["工作","gōngzuò"],["。",""]],"Anh ấy làm việc ở một công ty mới.","He works at a new company."]]},
  {vi:"(phó từ) vừa mới, mới (làm gì đó)",en:"newly, recently",ex:[
  [[["这","zhè"],["是","shì"],["我","wǒ"],["新*","xīn"],["买","mǎi"],["的","de"],["书","shū"],["。",""]],"Đây là cuốn sách tôi mới mua.","This is the book I just bought."]]}],
 words:[["新年","xīnnián","năm mới"],["新闻","xīnwén","tin tức"],["新鲜","xīnxiān","tươi, mới mẻ"],["重新","chóngxīn","làm lại từ đầu"],["新生","xīnshēng","học sinh mới"],["新手","xīnshǒu","người mới vào nghề"]]},

{c:"人",py:"rén",hv:"NHÂN",lv:1,pos:"Danh từ",rad:["人","Nhân","rén","người"],
 parts:[["人","Bộ Nhân","rén","hình người đứng nghiêng, hai chân bước"]],
 tip:"Hai nét như hai chân của một người đang bước đi.",emo:"🧍",mw:"个 (gè), 口 (kǒu)",anti:null,
 defs:[{vi:"người, con người",en:"person, people",ex:[
  [[["我","wǒ"],["是","shì"],["中国","Zhōngguó"],["人*","rén"],["。",""]],"Tôi là người Trung Quốc.","I am Chinese."],
  [[["你","nǐ"],["家","jiā"],["有","yǒu"],["几","jǐ"],["口","kǒu"],["人*","rén"],["？",""]],"Nhà bạn có mấy người?","How many people are in your family?"],
  [[["这里","zhèlǐ"],["人*","rén"],["很","hěn"],["多","duō"],["。",""]],"Ở đây rất đông người.","There are many people here."]]}],
 words:[["人们","rénmen","mọi người"],["大人","dàren","người lớn"],["人口","rénkǒu","dân số"],["工人","gōngrén","công nhân"],["家人","jiārén","người nhà"],["病人","bìngrén","bệnh nhân"]]},

{c:"大",py:"dà",hv:"ĐẠI",lv:1,pos:"Tính từ",rad:["大","Đại","dà","to lớn"],
 parts:[["一","Bộ Nhất","yī","nét ngang – hai cánh tay dang rộng"],["人","Bộ Nhân","rén","người đứng"]],
 tip:"Một người (人) dang rộng hai tay (一) để tả thứ gì đó rất TO.",emo:"🐘",mw:"",anti:["小","xiǎo","nhỏ"],
 defs:[{vi:"to, lớn (kích thước, số lượng, tuổi tác)",en:"big, large; old (age)",ex:[
  [[["他","tā"],["家","jiā"],["很","hěn"],["大*","dà"],["。",""]],"Nhà anh ấy rất to.","His house is very big."],
  [[["你","nǐ"],["多","duō"],["大*","dà"],["了","le"],["？",""]],"Bạn bao nhiêu tuổi rồi?","How old are you?"],
  [[["今天","jīntiān"],["雨","yǔ"],["很","hěn"],["大*","dà"],["。",""]],"Hôm nay mưa rất to.","It's raining heavily today."]]}],
 words:[["大学","dàxué","đại học"],["大家","dàjiā","mọi người"],["大人","dàren","người lớn"],["大小","dàxiǎo","kích cỡ"],["大夫","dàifu","bác sĩ"],["大概","dàgài","khoảng, đại khái"]]},

{c:"小",py:"xiǎo",hv:"TIỂU",lv:1,pos:"Tính từ",rad:["小","Tiểu","xiǎo","nhỏ"],
 parts:[["亅","Nét móc","jué","cây cột ở giữa"],["八","Bộ Bát","bā","hai chấm chia ra hai bên"]],
 tip:"Một vật bị chia (八) ra hai bên nét giữa – càng chia càng NHỎ.",emo:"🐜",mw:"",anti:["大","dà","lớn"],
 defs:[{vi:"nhỏ, bé; ít tuổi",en:"small, little; young",ex:[
  [[["这","zhè"],["个","ge"],["杯子","bēizi"],["太","tài"],["小*","xiǎo"],["了","le"],["。",""]],"Cái cốc này nhỏ quá.","This cup is too small."],
  [[["我","wǒ"],["有","yǒu"],["一","yì"],["只","zhī"],["小*","xiǎo"],["猫","māo"],["。",""]],"Tôi có một con mèo nhỏ.","I have a little cat."],
  [[["她","tā"],["比","bǐ"],["我","wǒ"],["小*","xiǎo"],["两","liǎng"],["岁","suì"],["。",""]],"Cô ấy nhỏ hơn tôi hai tuổi.","She is two years younger than me."]]}],
 words:[["小姐","xiǎojiě","cô, tiểu thư"],["小时","xiǎoshí","tiếng (giờ đồng hồ)"],["小孩","xiǎohái","trẻ con"],["小学","xiǎoxué","tiểu học"],["小心","xiǎoxīn","cẩn thận"],["小说","xiǎoshuō","tiểu thuyết"]]},

{c:"中",py:"zhōng",hv:"TRUNG",lv:1,pos:"Danh từ",rad:["丨","Cổn","gǔn","nét sổ"],
 parts:[["口","Bộ Khẩu","kǒu","khung, vật thể"],["丨","Bộ Cổn","gǔn","mũi tên xuyên qua"]],
 tip:"Một mũi tên (丨) bắn trúng chính GIỮA tấm bia (口).",emo:"🎯",mw:"",anti:null,
 defs:[{vi:"giữa, ở giữa; trong",en:"middle, center; in",ex:[
  [[["我","wǒ"],["在","zài"],["学","xué"],["中*","zhōng"],["文","wén"],["。",""]],"Tôi đang học tiếng Trung.","I'm studying Chinese."],
  [[["她","tā"],["是","shì"],["中*","zhōng"],["国","guó"],["人","rén"],["。",""]],"Cô ấy là người Trung Quốc.","She is Chinese."],
  [[["我们","wǒmen"],["中*","zhōng"],["午","wǔ"],["一起","yìqǐ"],["吃饭","chīfàn"],["吧","ba"],["。",""]],"Trưa nay chúng ta cùng ăn cơm nhé.","Let's have lunch together."]]}],
 words:[["中国","Zhōngguó","Trung Quốc"],["中文","Zhōngwén","tiếng Trung"],["中午","zhōngwǔ","buổi trưa"],["中间","zhōngjiān","ở giữa"],["中学","zhōngxué","trung học"],["中心","zhōngxīn","trung tâm"]]},

{c:"国",py:"guó",hv:"QUỐC",lv:1,pos:"Danh từ",rad:["囗","Vi","wéi","vây quanh"],
 parts:[["囗","Bộ Vi","wéi","bức tường bao quanh"],["玉","Bộ Ngọc","yù","ngọc quý, báu vật"]],
 tip:"Báu vật (玉) được bảo vệ trong bức tường thành (囗) – đó là ĐẤT NƯỚC.",emo:"🏯",mw:"个 (gè)",anti:null,
 defs:[{vi:"nước, quốc gia",en:"country, nation",ex:[
  [[["你","nǐ"],["是","shì"],["哪","nǎ"],["国*","guó"],["人","rén"],["？",""]],"Bạn là người nước nào?","Which country are you from?"],
  [[["我","wǒ"],["想","xiǎng"],["去","qù"],["中","Zhōng"],["国*","guó"],["。",""]],"Tôi muốn đi Trung Quốc.","I want to go to China."],
  [[["他","tā"],["是","shì"],["外","wài"],["国*","guó"],["人","rén"],["。",""]],"Anh ấy là người nước ngoài.","He is a foreigner."]]}],
 words:[["中国","Zhōngguó","Trung Quốc"],["国家","guójiā","quốc gia"],["外国","wàiguó","nước ngoài"],["美国","Měiguó","nước Mỹ"],["国际","guójì","quốc tế"],["回国","huíguó","về nước"]]},

{c:"学",py:"xué",hv:"HỌC",lv:1,pos:"Động từ",rad:["子","Tử","zǐ","con, đứa trẻ"],
 parts:[["⺍","Ba chấm","","ánh sáng tri thức"],["冖","Bộ Mịch","mì","mái nhà, mái che"],["子","Bộ Tử","zǐ","đứa trẻ"]],
 tip:"Đứa trẻ (子) ngồi dưới mái nhà (冖), đón ánh sáng tri thức (⺍) – đang HỌC.",emo:"📚",mw:"",anti:null,
 defs:[{vi:"học, học tập",en:"to study, to learn",ex:[
  [[["我","wǒ"],["在","zài"],["学*","xué"],["汉语","Hànyǔ"],["。",""]],"Tôi đang học tiếng Hán.","I'm learning Chinese."],
  [[["你","nǐ"],["是","shì"],["学*","xué"],["生","sheng"],["吗","ma"],["？",""]],"Bạn là học sinh à?","Are you a student?"],
  [[["我们","wǒmen"],["的","de"],["学*","xué"],["校","xiào"],["很","hěn"],["大","dà"],["。",""]],"Trường của chúng tôi rất lớn.","Our school is very big."]]}],
 words:[["学生","xuésheng","học sinh"],["学校","xuéxiào","trường học"],["学习","xuéxí","học tập"],["同学","tóngxué","bạn học"],["大学","dàxué","đại học"],["数学","shùxué","toán học"]]},

{c:"生",py:"shēng",hv:"SINH",lv:1,pos:"Động từ",rad:["生","Sinh","shēng","sinh ra"],
 parts:[["土","Bộ Thổ","tǔ","mặt đất"],["丿 + 一","Mầm cây","","chồi non nhú lên"]],
 tip:"Mầm cây nhú lên khỏi mặt đất (土) – sự SỐNG được sinh ra.",emo:"🌱",mw:"",anti:["死","sǐ","chết"],
 defs:[{vi:"sinh, đẻ; sống; (người) học, sinh",en:"to give birth; life; student",ex:[
  [[["今天","jīntiān"],["是","shì"],["我","wǒ"],["的","de"],["生*","shēng"],["日","rì"],["。",""]],"Hôm nay là sinh nhật tôi.","Today is my birthday."],
  [[["我","wǒ"],["妈妈","māma"],["是","shì"],["医","yī"],["生*","shēng"],["。",""]],"Mẹ tôi là bác sĩ.","My mother is a doctor."],
  [[["王","Wáng"],["先","xiān"],["生*","sheng"],["，",""],["你好","nǐ hǎo"],["！",""]],"Chào ông Vương!","Hello, Mr. Wang!"]]}],
 words:[["学生","xuésheng","học sinh"],["医生","yīshēng","bác sĩ"],["先生","xiānsheng","ông, ngài"],["生日","shēngrì","sinh nhật"],["生活","shēnghuó","cuộc sống"],["生气","shēngqì","tức giận"]]},

{c:"好",py:"hǎo",hv:"HẢO",lv:1,pos:"Tính từ",rad:["女","Nữ","nǚ","phụ nữ"],
 parts:[["女","Bộ Nữ","nǚ","người mẹ"],["子","Bộ Tử","zǐ","đứa con"]],
 tip:"Người mẹ (女) ôm đứa con (子) – thật là TỐT ĐẸP.",emo:"👍",mw:"",anti:["坏","huài","xấu, hỏng"],
 defs:[{vi:"tốt, hay, ngon, đẹp",en:"good, fine, nice",ex:[
  [[["你","nǐ"],["好*","hǎo"],["！",""]],"Xin chào!","Hello!"],
  [[["这","zhè"],["个","ge"],["菜","cài"],["很","hěn"],["好*","hǎo"],["吃","chī"],["。",""]],"Món này rất ngon.","This dish is delicious."],
  [[["今天","jīntiān"],["天气","tiānqì"],["很","hěn"],["好*","hǎo"],["。",""]],"Hôm nay thời tiết rất đẹp.","The weather is nice today."]]}],
 words:[["你好","nǐ hǎo","xin chào"],["好吃","hǎochī","ngon"],["好看","hǎokàn","đẹp, hay"],["好朋友","hǎo péngyou","bạn thân"],["好像","hǎoxiàng","hình như"],["好久","hǎojiǔ","lâu lắm"]]},

{c:"我",py:"wǒ",hv:"NGÃ",lv:1,pos:"Đại từ",rad:["戈","Qua","gē","cây giáo"],
 parts:[["手","Tay","shǒu","bàn tay (biến thể bên trái)"],["戈","Bộ Qua","gē","cây giáo"]],
 tip:"Tay (手) cầm cây giáo (戈) tự bảo vệ chính MÌNH.",emo:"🙋",mw:"",anti:null,
 defs:[{vi:"tôi, ta, mình",en:"I, me",ex:[
  [[["我*","wǒ"],["叫","jiào"],["小明","Xiǎomíng"],["。",""]],"Tôi tên là Tiểu Minh.","My name is Xiaoming."],
  [[["我*","wǒ"],["们","men"],["是","shì"],["朋友","péngyou"],["。",""]],"Chúng tôi là bạn bè.","We are friends."],
  [[["请","qǐng"],["给","gěi"],["我*","wǒ"],["一","yì"],["杯","bēi"],["水","shuǐ"],["。",""]],"Làm ơn cho tôi một cốc nước.","Please give me a glass of water."]]}],
 words:[["我们","wǒmen","chúng tôi"],["自我","zìwǒ","bản thân"]]},

{c:"你",py:"nǐ",hv:"NHĨ",lv:1,pos:"Đại từ",rad:["亻","Nhân đứng","rén","người"],
 parts:[["亻","Bộ Nhân đứng","rén","người"],["尔","Chữ Nhĩ","ěr","ngươi, anh (cổ)"]],
 tip:"Người (亻) mà ta đang gọi là 尔 – chính là BẠN.",emo:"🫵",mw:"",anti:null,
 defs:[{vi:"bạn, anh, chị (ngôi thứ hai)",en:"you",ex:[
  [[["你*","nǐ"],["好","hǎo"],["！",""]],"Xin chào!","Hello!"],
  [[["你*","nǐ"],["叫","jiào"],["什么","shénme"],["名字","míngzi"],["？",""]],"Bạn tên là gì?","What's your name?"],
  [[["谢谢","xièxie"],["你*","nǐ"],["！",""]],"Cảm ơn bạn!","Thank you!"]]}],
 words:[["你好","nǐ hǎo","xin chào"],["你们","nǐmen","các bạn"]]},

{c:"他",py:"tā",hv:"THA",lv:1,pos:"Đại từ",rad:["亻","Nhân đứng","rén","người"],
 parts:[["亻","Bộ Nhân đứng","rén","người"],["也","Chữ Dã","yě","cũng"]],
 tip:"Một người (亻) khác 也 (cũng) ở đây – đó là ANH ẤY.",emo:"👨",mw:"",anti:null,
 defs:[{vi:"anh ấy, ông ấy, nó (nam)",en:"he, him",ex:[
  [[["他*","tā"],["是","shì"],["我","wǒ"],["哥哥","gēge"],["。",""]],"Anh ấy là anh trai tôi.","He is my older brother."],
  [[["他*","tā"],["们","men"],["都","dōu"],["是","shì"],["老师","lǎoshī"],["。",""]],"Họ đều là giáo viên.","They are all teachers."],
  [[["我","wǒ"],["认识","rènshi"],["他*","tā"],["。",""]],"Tôi quen anh ấy.","I know him."]]}],
 words:[["他们","tāmen","họ"],["其他","qítā","khác"]]},

{c:"爱",py:"ài",hv:"ÁI",lv:1,pos:"Động từ",rad:["爫","Trảo","zhǎo","móng vuốt, bàn tay"],
 parts:[["爫","Bộ Trảo","zhǎo","bàn tay úp xuống"],["冖","Bộ Mịch","mì","che chở"],["友","Chữ Hữu","yǒu","bạn bè"]],
 tip:"Bàn tay (爫) che chở (冖) cho người bạn (友) – đó là YÊU THƯƠNG.",emo:"❤️",mw:"",anti:["恨","hèn","ghét, hận"],
 defs:[{vi:"yêu, thương; thích",en:"to love; to like",ex:[
  [[["我","wǒ"],["爱*","ài"],["你","nǐ"],["。",""]],"Anh yêu em.","I love you."],
  [[["我","wǒ"],["爱*","ài"],["我","wǒ"],["的","de"],["家","jiā"],["。",""]],"Tôi yêu gia đình tôi.","I love my family."],
  [[["她","tā"],["很","hěn"],["爱*","ài"],["看","kàn"],["书","shū"],["。",""]],"Cô ấy rất thích đọc sách.","She loves reading."]]}],
 words:[["爱好","àihào","sở thích"],["可爱","kě'ài","dễ thương"],["爱人","àiren","vợ/chồng"],["爱情","àiqíng","tình yêu"]]},

{c:"吃",py:"chī",hv:"NGẬT",lv:1,pos:"Động từ",rad:["口","Khẩu","kǒu","miệng"],
 parts:[["口","Bộ Khẩu","kǒu","cái miệng"],["乞","Chữ Khất","qǐ","xin"]],
 tip:"Cái miệng (口) đi xin (乞) đồ để ĂN.",emo:"🍜",mw:"",anti:null,
 defs:[{vi:"ăn",en:"to eat",ex:[
  [[["你","nǐ"],["吃*","chī"],["饭","fàn"],["了","le"],["吗","ma"],["？",""]],"Bạn ăn cơm chưa?","Have you eaten?"],
  [[["我","wǒ"],["想","xiǎng"],["吃*","chī"],["米饭","mǐfàn"],["。",""]],"Tôi muốn ăn cơm.","I want to eat rice."],
  [[["这","zhè"],["个","ge"],["很","hěn"],["好","hǎo"],["吃*","chī"],["。",""]],"Cái này rất ngon.","This is delicious."]]}],
 words:[["吃饭","chīfàn","ăn cơm"],["好吃","hǎochī","ngon"],["小吃","xiǎochī","đồ ăn vặt"],["吃惊","chījīng","kinh ngạc"]]},

{c:"喝",py:"hē",hv:"HÁT",lv:1,pos:"Động từ",rad:["口","Khẩu","kǒu","miệng"],
 parts:[["口","Bộ Khẩu","kǒu","cái miệng"],["曷","Chữ Hạt","hé","gợi âm đọc"]],
 tip:"Có bộ miệng (口), bên phải 曷 gợi âm “hē” – UỐNG.",emo:"🍵",mw:"",anti:null,
 defs:[{vi:"uống",en:"to drink",ex:[
  [[["我","wǒ"],["想","xiǎng"],["喝*","hē"],["水","shuǐ"],["。",""]],"Tôi muốn uống nước.","I want to drink water."],
  [[["你","nǐ"],["喝*","hē"],["茶","chá"],["吗","ma"],["？",""]],"Bạn uống trà không?","Do you drink tea?"],
  [[["他","tā"],["不","bù"],["喝*","hē"],["咖啡","kāfēi"],["。",""]],"Anh ấy không uống cà phê.","He doesn't drink coffee."]]}],
 words:[["喝水","hē shuǐ","uống nước"],["喝茶","hē chá","uống trà"],["喝酒","hē jiǔ","uống rượu"]]},

{c:"水",py:"shuǐ",hv:"THỦY",lv:1,pos:"Danh từ",rad:["水","Thủy","shuǐ","nước"],
 parts:[["水","Bộ Thủy","shuǐ","dòng nước chảy, giữa là dòng chính, hai bên là gợn sóng"]],
 tip:"Nét giữa là dòng sông, hai bên là những gợn NƯỚC bắn ra.",emo:"💧",mw:"杯 (bēi), 瓶 (píng)",anti:["火","huǒ","lửa"],
 defs:[{vi:"nước",en:"water",ex:[
  [[["请","qǐng"],["喝","hē"],["水*","shuǐ"],["。",""]],"Mời uống nước.","Please drink some water."],
  [[["我","wǒ"],["要","yào"],["一","yì"],["杯","bēi"],["水*","shuǐ"],["。",""]],"Tôi muốn một cốc nước.","I'd like a glass of water."],
  [[["她","tā"],["喜欢","xǐhuan"],["吃","chī"],["水*","shuǐ"],["果","guǒ"],["。",""]],"Cô ấy thích ăn trái cây.","She likes eating fruit."]]}],
 words:[["水果","shuǐguǒ","trái cây"],["喝水","hē shuǐ","uống nước"],["水平","shuǐpíng","trình độ"],["开水","kāishuǐ","nước sôi"]]},

{c:"火",py:"huǒ",hv:"HỎA",lv:1,pos:"Danh từ",rad:["火","Hỏa","huǒ","lửa"],
 parts:[["火","Bộ Hỏa","huǒ","ngọn lửa bốc lên, hai chấm là tia lửa"]],
 tip:"Ngọn LỬA bốc cao, hai bên là tàn lửa bắn ra.",emo:"🔥",mw:"",anti:["水","shuǐ","nước"],
 defs:[{vi:"lửa; (tàu) hỏa",en:"fire",ex:[
  [[["我们","wǒmen"],["坐","zuò"],["火*","huǒ"],["车","chē"],["去","qù"],["北京","Běijīng"],["。",""]],"Chúng tôi đi tàu hỏa đến Bắc Kinh.","We take the train to Beijing."],
  [[["火*","huǒ"],["车","chē"],["站","zhàn"],["在","zài"],["哪儿","nǎr"],["？",""]],"Ga tàu hỏa ở đâu?","Where is the train station?"],
  [[["小心","xiǎoxīn"],["火*","huǒ"],["！",""]],"Cẩn thận lửa!","Careful with the fire!"]]}],
 words:[["火车","huǒchē","tàu hỏa"],["火车站","huǒchēzhàn","ga tàu"],["火锅","huǒguō","lẩu"],["大火","dàhuǒ","đám cháy lớn"]]},

{c:"山",py:"shān",hv:"SƠN",lv:1,pos:"Danh từ",rad:["山","Sơn","shān","núi"],
 parts:[["山","Bộ Sơn","shān","ba ngọn núi nhô lên"]],
 tip:"Ba đỉnh nhọn nhô lên – hình dãy NÚI.",emo:"⛰️",mw:"座 (zuò)",anti:null,
 defs:[{vi:"núi",en:"mountain, hill",ex:[
  [[["我们","wǒmen"],["去","qù"],["爬","pá"],["山*","shān"],["吧","ba"],["。",""]],"Chúng ta đi leo núi nhé.","Let's go hiking."],
  [[["那","nà"],["座","zuò"],["山*","shān"],["很","hěn"],["高","gāo"],["。",""]],"Ngọn núi kia rất cao.","That mountain is very high."],
  [[["山*","shān"],["上","shang"],["有","yǒu"],["很","hěn"],["多","duō"],["树","shù"],["。",""]],"Trên núi có rất nhiều cây.","There are many trees on the mountain."]]}],
 words:[["爬山","pá shān","leo núi"],["山水","shānshuǐ","sơn thủy, phong cảnh"],["火山","huǒshān","núi lửa"],["山区","shānqū","vùng núi"]]},

{c:"日",py:"rì",hv:"NHẬT",lv:1,pos:"Danh từ",rad:["日","Nhật","rì","mặt trời"],
 parts:[["日","Bộ Nhật","rì","mặt trời, giữa là tâm sáng"]],
 tip:"Hình MẶT TRỜI tròn (vẽ vuông) có tâm ở giữa – cũng là NGÀY.",emo:"☀️",mw:"",anti:["月","yuè","mặt trăng"],
 defs:[{vi:"ngày; mặt trời",en:"day; sun",ex:[
  [[["今天","jīntiān"],["几","jǐ"],["月","yuè"],["几","jǐ"],["日*","rì"],["？",""]],"Hôm nay là ngày mấy tháng mấy?","What's the date today?"],
  [[["生","shēng"],["日*","rì"],["快乐","kuàilè"],["！",""]],"Chúc mừng sinh nhật!","Happy birthday!"],
  [[["我","wǒ"],["会","huì"],["说","shuō"],["日*","Rì"],["语","yǔ"],["。",""]],"Tôi biết nói tiếng Nhật.","I can speak Japanese."]]}],
 words:[["生日","shēngrì","sinh nhật"],["日子","rìzi","ngày tháng"],["日本","Rìběn","Nhật Bản"],["日记","rìjì","nhật ký"]]},

{c:"月",py:"yuè",hv:"NGUYỆT",lv:1,pos:"Danh từ",rad:["月","Nguyệt","yuè","mặt trăng"],
 parts:[["月","Bộ Nguyệt","yuè","vầng trăng khuyết"]],
 tip:"Hình vầng TRĂNG khuyết – trăng tròn khuyết một lần là một THÁNG.",emo:"🌙",mw:"个 (gè)",anti:["日","rì","mặt trời"],
 defs:[{vi:"tháng; mặt trăng",en:"month; moon",ex:[
  [[["我","wǒ"],["九","jiǔ"],["月*","yuè"],["去","qù"],["中国","Zhōngguó"],["。",""]],"Tháng chín tôi đi Trung Quốc.","I'm going to China in September."],
  [[["今天","jīntiān"],["的","de"],["月*","yuè"],["亮","liang"],["很","hěn"],["圆","yuán"],["。",""]],"Trăng hôm nay rất tròn.","The moon is very round tonight."],
  [[["我","wǒ"],["学","xué"],["了","le"],["三","sān"],["个","ge"],["月*","yuè"],["汉语","Hànyǔ"],["。",""]],"Tôi đã học tiếng Hán ba tháng.","I've studied Chinese for three months."]]}],
 words:[["月亮","yuèliang","mặt trăng"],["一月","yīyuè","tháng một"],["上个月","shàng ge yuè","tháng trước"],["月饼","yuèbing","bánh trung thu"]]},

{c:"书",py:"shū",hv:"THƯ",lv:1,pos:"Danh từ",rad:["乙","Ất","yǐ","nét gập"],
 parts:[["乛","Nét gập","","trang sách gập lại"],["丨 + 丶","Cây bút","","cây bút và giọt mực"]],
 tip:"Cây bút (丨) và giọt mực (丶) trên trang giấy gập (乛) – quyển SÁCH.",emo:"📖",mw:"本 (běn)",anti:null,
 defs:[{vi:"sách",en:"book",ex:[
  [[["这","zhè"],["是","shì"],["我","wǒ"],["的","de"],["书*","shū"],["。",""]],"Đây là sách của tôi.","This is my book."],
  [[["我","wǒ"],["喜欢","xǐhuan"],["看","kàn"],["书*","shū"],["。",""]],"Tôi thích đọc sách.","I like reading."],
  [[["桌子","zhuōzi"],["上","shang"],["有","yǒu"],["三","sān"],["本","běn"],["书*","shū"],["。",""]],"Trên bàn có ba quyển sách.","There are three books on the table."]]}],
 words:[["看书","kàn shū","đọc sách"],["书店","shūdiàn","hiệu sách"],["书包","shūbāo","cặp sách"],["图书馆","túshūguǎn","thư viện"],["书法","shūfǎ","thư pháp"]]},

{c:"口",py:"kǒu",hv:"KHẨU",lv:1,pos:"Danh từ / Lượng từ",rad:["口","Khẩu","kǒu","miệng"],
 parts:[["口","Bộ Khẩu","kǒu","cái miệng há ra"]],
 tip:"Hình cái MIỆNG há to.",emo:"👄",mw:"",anti:null,
 defs:[{vi:"miệng; cửa, lối; (lượng từ) người trong nhà",en:"mouth; opening; measure word for family members",ex:[
  [[["我","wǒ"],["家","jiā"],["有","yǒu"],["四","sì"],["口*","kǒu"],["人","rén"],["。",""]],"Nhà tôi có bốn người.","There are four people in my family."],
  [[["我","wǒ"],["在","zài"],["门","mén"],["口*","kǒu"],["等","děng"],["你","nǐ"],["。",""]],"Tôi đợi bạn ở cửa.","I'll wait for you at the door."],
  [[["他","tā"],["的","de"],["口*","kǒu"],["语","yǔ"],["很","hěn"],["好","hǎo"],["。",""]],"Khẩu ngữ của anh ấy rất tốt.","His spoken Chinese is very good."]]}],
 words:[["人口","rénkǒu","dân số"],["门口","ménkǒu","cửa ra vào"],["口语","kǒuyǔ","khẩu ngữ"],["出口","chūkǒu","lối ra; xuất khẩu"]]},

{c:"家",py:"jiā",hv:"GIA",lv:1,pos:"Danh từ",rad:["宀","Miên","mián","mái nhà"],
 parts:[["宀","Bộ Miên","mián","mái nhà"],["豕","Bộ Thỉ","shǐ","con lợn"]],
 tip:"Dưới mái nhà (宀) có nuôi lợn (豕) – thời xưa đó là một GIA ĐÌNH no đủ.",emo:"🏠",mw:"个 (gè)",anti:null,
 defs:[{vi:"nhà, gia đình",en:"home, family",ex:[
  [[["我","wǒ"],["回","huí"],["家*","jiā"],["了","le"],["。",""]],"Tôi về nhà rồi.","I'm home."],
  [[["你","nǐ"],["家*","jiā"],["在","zài"],["哪儿","nǎr"],["？",""]],"Nhà bạn ở đâu?","Where is your home?"],
  [[["大","dà"],["家*","jiā"],["好","hǎo"],["！",""]],"Chào mọi người!","Hello everyone!"]]},
  {vi:"(lượng từ) cho cửa hàng, công ty",en:"measure word for shops, companies",ex:[
  [[["这","zhè"],["家*","jiā"],["饭馆","fànguǎn"],["很","hěn"],["好","hǎo"],["。",""]],"Quán ăn này rất ngon.","This restaurant is very good."]]}],
 words:[["大家","dàjiā","mọi người"],["国家","guójiā","quốc gia"],["家人","jiārén","người nhà"],["回家","huí jiā","về nhà"],["家庭","jiātíng","gia đình"]]},

{c:"看",py:"kàn",hv:"KHÁN",lv:1,pos:"Động từ",rad:["目","Mục","mù","mắt"],
 parts:[["手","Tay","shǒu","bàn tay (biến thể phía trên)"],["目","Bộ Mục","mù","con mắt"]],
 tip:"Đặt tay (手) lên trên mắt (目) che nắng để NHÌN ra xa.",emo:"👀",mw:"",anti:null,
 defs:[{vi:"nhìn, xem, đọc; thăm",en:"to look, to watch, to read; to visit",ex:[
  [[["我","wǒ"],["喜欢","xǐhuan"],["看*","kàn"],["电影","diànyǐng"],["。",""]],"Tôi thích xem phim.","I like watching movies."],
  [[["你","nǐ"],["看*","kàn"],["，",""],["那","nà"],["是","shì"],["谁","shéi"],["？",""]],"Bạn nhìn kìa, đó là ai?","Look, who's that?"],
  [[["我","wǒ"],["去","qù"],["医院","yīyuàn"],["看*","kàn"],["朋友","péngyou"],["。",""]],"Tôi đến bệnh viện thăm bạn.","I'm visiting a friend at the hospital."]]}],
 words:[["看见","kànjiàn","nhìn thấy"],["看书","kàn shū","đọc sách"],["好看","hǎokàn","đẹp"],["看病","kànbìng","khám bệnh"]]},

{c:"字",py:"zì",hv:"TỰ",lv:1,pos:"Danh từ",rad:["子","Tử","zǐ","con"],
 parts:[["宀","Bộ Miên","mián","mái nhà"],["子","Bộ Tử","zǐ","đứa trẻ"]],
 tip:"Đứa trẻ (子) ngồi trong nhà (宀) tập viết CHỮ.",emo:"✍️",mw:"个 (gè)",anti:null,
 defs:[{vi:"chữ, chữ viết",en:"character, word",ex:[
  [[["你","nǐ"],["叫","jiào"],["什么","shénme"],["名","míng"],["字*","zi"],["？",""]],"Bạn tên là gì?","What's your name?"],
  [[["这","zhè"],["个","ge"],["字*","zì"],["怎么","zěnme"],["读","dú"],["？",""]],"Chữ này đọc thế nào?","How do you read this character?"],
  [[["他","tā"],["的","de"],["字*","zì"],["写","xiě"],["得","de"],["很","hěn"],["好","hǎo"],["。",""]],"Chữ anh ấy viết rất đẹp.","His handwriting is beautiful."]]}],
 words:[["名字","míngzi","tên"],["汉字","Hànzì","chữ Hán"],["写字","xiě zì","viết chữ"],["字典","zìdiǎn","từ điển chữ"]]},

{c:"天",py:"tiān",hv:"THIÊN",lv:1,pos:"Danh từ",rad:["大","Đại","dà","lớn"],
 parts:[["一","Bộ Nhất","yī","bầu trời phía trên"],["大","Bộ Đại","dà","người lớn"]],
 tip:"Phía trên đầu người (大) là bầu TRỜI (一).",emo:"🌤️",mw:"",anti:["地","dì","đất"],
 defs:[{vi:"trời; ngày",en:"sky; day",ex:[
  [[["今","jīn"],["天*","tiān"],["是","shì"],["星期","xīngqī"],["几","jǐ"],["？",""]],"Hôm nay là thứ mấy?","What day is it today?"],
  [[["明","míng"],["天*","tiān"],["见","jiàn"],["！",""]],"Hẹn gặp ngày mai!","See you tomorrow!"],
  [[["今天","jīntiān"],["天*","tiān"],["气","qì"],["怎么样","zěnmeyàng"],["？",""]],"Hôm nay thời tiết thế nào?","How's the weather today?"]]}],
 words:[["今天","jīntiān","hôm nay"],["明天","míngtiān","ngày mai"],["昨天","zuótiān","hôm qua"],["天气","tiānqì","thời tiết"],["每天","měitiān","mỗi ngày"]]},

{c:"车",py:"chē",hv:"XA",lv:1,pos:"Danh từ",rad:["车","Xa","chē","xe"],
 parts:[["车","Bộ Xa","chē","chiếc xe nhìn từ trên xuống: trục và bánh xe"]],
 tip:"Nhìn từ trên xuống: một trục xe với hai bánh – chiếc XE.",emo:"🚗",mw:"辆 (liàng)",anti:null,
 defs:[{vi:"xe",en:"vehicle, car",ex:[
  [[["我","wǒ"],["坐","zuò"],["出租","chūzū"],["车*","chē"],["去","qù"],["。",""]],"Tôi đi taxi.","I'll take a taxi."],
  [[["这","zhè"],["是","shì"],["谁","shéi"],["的","de"],["车*","chē"],["？",""]],"Đây là xe của ai?","Whose car is this?"],
  [[["他","tā"],["会","huì"],["开","kāi"],["车*","chē"],["。",""]],"Anh ấy biết lái xe.","He can drive."]]}],
 words:[["火车","huǒchē","tàu hỏa"],["出租车","chūzūchē","taxi"],["汽车","qìchē","ô tô"],["自行车","zìxíngchē","xe đạp"],["开车","kāichē","lái xe"]]},

{c:"来",py:"lái",hv:"LAI",lv:1,pos:"Động từ",rad:["木","Mộc","mù","cây"],
 parts:[["木","Bộ Mộc","mù","cây"],["丷 + 一","Bông lúa","","hạt lúa trĩu bông"]],
 tip:"Vốn là hình cây lúa mì trĩu bông (木) – lúa “từ trời ĐẾN”, nên mượn nghĩa là ĐẾN.",emo:"👋",mw:"",anti:["去","qù","đi"],
 defs:[{vi:"đến, tới; lại",en:"to come",ex:[
  [[["你","nǐ"],["来*","lái"],["了","le"],["！",""]],"Bạn đến rồi!","You're here!"],
  [[["他","tā"],["是","shì"],["从","cóng"],["越南","Yuènán"],["来*","lái"],["的","de"],["。",""]],"Anh ấy đến từ Việt Nam.","He comes from Vietnam."],
  [[["明天","míngtiān"],["你","nǐ"],["来*","lái"],["我","wǒ"],["家","jiā"],["吧","ba"],["。",""]],"Mai bạn đến nhà tôi nhé.","Come to my house tomorrow."]]}],
 words:[["回来","huílai","quay về"],["起来","qǐlai","đứng dậy"],["后来","hòulái","sau đó"],["来自","láizì","đến từ"],["未来","wèilái","tương lai"]]},

{c:"去",py:"qù",hv:"KHỨ",lv:1,pos:"Động từ",rad:["厶","Khư","sī","riêng tư"],
 parts:[["土","Bộ Thổ","tǔ","mặt đất, con đường"],["厶","Bộ Khư","sī","bàn chân rời đi"]],
 tip:"Bàn chân (厶) rời khỏi mảnh đất (土) – ĐI.",emo:"🚶",mw:"",anti:["来","lái","đến"],
 defs:[{vi:"đi, đến (nơi khác)",en:"to go",ex:[
  [[["你","nǐ"],["去*","qù"],["哪儿","nǎr"],["？",""]],"Bạn đi đâu?","Where are you going?"],
  [[["我","wǒ"],["去*","qù"],["学校","xuéxiào"],["。",""]],"Tôi đi đến trường.","I'm going to school."],
  [[["我们","wǒmen"],["去*","qù"],["年","nián"],["认识","rènshi"],["的","de"],["。",""]],"Chúng tôi quen nhau năm ngoái.","We met last year."]]}],
 words:[["去年","qùnián","năm ngoái"],["出去","chūqu","đi ra"],["回去","huíqu","quay về"],["过去","guòqù","quá khứ"]]},

{c:"茶",py:"chá",hv:"TRÀ",lv:1,pos:"Danh từ",rad:["艹","Thảo","cǎo","cỏ"],
 parts:[["艹","Bộ Thảo","cǎo","lá cây, cỏ"],["人","Bộ Nhân","rén","người"],["木","Bộ Mộc","mù","cây"]],
 tip:"Người (人) đứng giữa cây (木) hái lá (艹) – lá TRÀ.",emo:"🍵",mw:"杯 (bēi), 壶 (hú)",anti:null,
 defs:[{vi:"trà, chè",en:"tea",ex:[
  [[["请","qǐng"],["喝","hē"],["茶*","chá"],["。",""]],"Mời uống trà.","Please have some tea."],
  [[["我","wǒ"],["喜欢","xǐhuan"],["绿","lǜ"],["茶*","chá"],["。",""]],"Tôi thích trà xanh.","I like green tea."],
  [[["来","lái"],["一","yì"],["杯","bēi"],["茶*","chá"],["吧","ba"],["。",""]],"Cho một tách trà nhé.","Let's have a cup of tea."]]}],
 words:[["喝茶","hē chá","uống trà"],["绿茶","lǜchá","trà xanh"],["红茶","hóngchá","hồng trà"],["奶茶","nǎichá","trà sữa"],["茶馆","cháguǎn","quán trà"]]}
];
