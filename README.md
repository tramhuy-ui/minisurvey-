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
- Đăng nhập bằng email chỉ cần nhập email, không có mật khẩu. Đăng nhập Google thật cần bật theo hướng dẫn bên dưới. Nút Apple chỉ là mô phỏng.

## Nâng cấp để nhiều người cùng trả lời
Thay các hàm `load` và `save` trong `app.js` bằng lời gọi tới một backend miễn phí như Supabase hoặc Firebase (Auth cho đăng nhập, bảng `surveys` và `responses` cho dữ liệu). Phần giao diện giữ nguyên.

## Chưa có trong bản này
Mã QR, Kết nối ứng dụng, Bảng điều khiển và Phân tích đa khảo sát.

## Bật đăng nhập Google thật
Mặc định, nút Google mở màn hình chọn tài khoản mô phỏng (tài khoản mẫu). Để hiện hộp chọn tài khoản Google thật:

1. Vào https://console.cloud.google.com, tạo một **Project** mới.
2. Vào **APIs & Services, OAuth consent screen** (hoặc **Google Auth Platform**), chọn loại **External**, điền tên ứng dụng và email hỗ trợ, rồi lưu. Nếu để trạng thái **Testing**, nhớ thêm email của bạn vào mục **Test users**. Muốn ai cũng đăng nhập được thì bấm **Publish app** (các quyền email, profile cơ bản không cần Google duyệt).
3. Vào **Credentials, Create credentials, OAuth client ID**, chọn **Web application**.
4. Ở **Authorized JavaScript origins**, thêm đúng các địa chỉ web của bạn (không có dấu `/` ở cuối, không có đường dẫn), ví dụ:
   - `https://ten-cua-ban.netlify.app`
   - `https://tramhuy-ui.github.io`
   - `http://localhost:8000` (nếu chạy thử trên máy)
5. Bấm **Create**, sao chép **Client ID** (dạng `xxxx.apps.googleusercontent.com`). Không cần Client secret.
6. Mở `app.js`, tìm dòng `const GOOGLE_CLIENT_ID = '';` và dán Client ID vào giữa hai dấu nháy. Commit lên GitHub.

Lưu ý: Client ID là thông tin công khai nên để trong code được. Bản này chỉ đọc tên, email, ảnh của tài khoản để hiển thị và lưu trong trình duyệt, chưa có máy chủ kiểm tra lại, nên chỉ phù hợp cho demo và học tập.
