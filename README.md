# MiniSurvey

Bản học tập mô phỏng luồng của một nền tảng khảo sát: trang chủ, đăng nhập, Home, thiết kế, đăng link, trả lời, phân tích, xuất CSV. Thuần HTML, CSS, JavaScript, không cần cài đặt hay build.

## Chạy thử trên máy
Mở `index.html` bằng trình duyệt, hoặc chạy `python3 -m http.server` rồi vào http://localhost:8000.

## Đưa lên GitHub Pages
1. Tạo repo mới trên github.com, ví dụ `minisurvey` (chế độ Public).
2. Bấm **Add file, Upload files**, kéo thả 3 file `index.html`, `styles.css`, `app.js` (và README.md), rồi **Commit changes**.
3. Vào **Settings, Pages**. Ở mục **Build and deployment**, chọn Source là **Deploy from a branch**, Branch là `main`, thư mục `/ (root)`, bấm **Save**.
4. Chờ 1 đến 2 phút, web chạy tại `https://<tên-github-của-bạn>.github.io/minisurvey/`.

Dùng dòng lệnh thay cho bước 1 và 2:
```
git init && git add . && git commit -m "MiniSurvey"
git branch -M main
git remote add origin https://github.com/<tên-của-bạn>/minisurvey.git
git push -u origin main
```

## Giới hạn
- GitHub Pages chỉ phục vụ file tĩnh nên dữ liệu lưu trong `localStorage`. Khảo sát và phản hồi chỉ tồn tại trên trình duyệt đã tạo; người khác mở link sẽ không thấy khảo sát.
- "Bắt đầu từ ý tưởng" là mô phỏng bằng từ khóa, chưa gọi AI thật.
- Đăng nhập chỉ là nhập tên, không phải xác thực thật.

## Nâng cấp để nhiều người cùng trả lời
Thay các hàm `load` và `save` trong `app.js` bằng lời gọi tới một backend miễn phí như Supabase hoặc Firebase (Auth cho đăng nhập, bảng `surveys` và `responses` cho dữ liệu). Phần giao diện giữ nguyên.

## Chưa có trong bản này
Mã QR, Kết nối ứng dụng, Bảng điều khiển và Phân tích đa khảo sát.
