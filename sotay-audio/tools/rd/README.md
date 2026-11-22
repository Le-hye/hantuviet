# Kéo dài bài Luyện đọc (Sổ Tay Hán Tự)

1. Soạn file `bN.txt` theo mẫu `b1.txt`: dòng `@MÃ_BÀI`, mỗi câu `chữ Hán|nghĩa tiếng Việt`, dòng `W=từ|nghĩa; từ|nghĩa…`.
2. `cd sotay-audio/tools/rd && python3 rdbuild.py bN.txt` (cần `pip install --break-system-packages pypinyin jieba`) → in số câu/số chữ, tạo `bN.txt.json` (pinyin tự sinh; đọc lại và sửa tay nếu sai).
3. Tạo `bN.json` = {MÃ: [hán nối \n, pinyin nối \n, việt nối \n, từ]} (xem đoạn python trong tài liệu dự án `LUYEN_DOC_DAI.md`), commit + push.
4. Trong editor Apps Script: hàm tạm tải `https://raw.githubusercontent.com/le-hye/hantuviet/main/sotay-audio/tools/rd/bN.json` và ghi cột G–J trang `_Luyện đọc dữ liệu` theo mã bài; xong đặt lại hàm về chế độ ĐỌC Mẫu câu.
5. Tạo giọng đọc cho câu/từ mới bằng `../gen.py` rồi dựng lại idx.txt, push.
