# TADa for YouTube (v2.0)

> **Tiện ích mở rộng thông minh, tối ưu trải nghiệm xem YouTube sạch sẽ, không quảng cáo cùng bộ công cụ hỗ trợ toàn diện.**  
> Thuộc hệ sinh thái **TADa Manager**.

---

## 👨‍💻 Tác giả & Phát triển
* **Phát triển bởi:** **Nguyễn Tuấn Anh** (Thành viên team TADa)
* **Mã nguồn GitHub:** [https://github.com/nobianh78/TADa-for-YouTube-v2.0](https://github.com/nobianh78/TADa-for-YouTube-v2.0)
* **Phiên bản:** `v2.0.0` (Manifest V3)
* **Bản quyền:** © 2026 TADa Team. Phát hành theo giấy phép MIT.

---

## 📦 Phân biệt 2 phiên bản phát hành

Nhằm tuân thủ tuyệt đối [Chính sách chương trình dành cho nhà phát triển của Chrome Web Store](https://developer.chrome.com/docs/webstore/program_policies/) (nghiêm cấm tải nội dung video/audio từ YouTube), dự án được phân tách thành 2 phiên bản độc lập:

| Đặc điểm | Bản 1: Chrome Web Store (`extensionTADa-cws`) | Bản 2: GitHub Full (`extensionTADa-github`) |
| :--- | :--- | :--- |
| **Kênh tải** | Chrome Web Store chính thức | GitHub Releases / Sideload Unpacked |
| **Chặn quảng cáo toàn diện** | ✅ Có (Luật Declarative Net Request) | ✅ Có (Luật Declarative Net Request) |
| **Khuếch đại âm lượng 500%** | ✅ Có (Super Volume Booster) | ✅ Có (Super Volume Booster) |
| **Ánh sáng viền Ambient Light** | ✅ Có (Đèn nền phát sáng video) | ✅ Có (Đèn nền phát sáng video) |
| **Nút PiP 1 chạm [P]** | ✅ Có | ✅ Có |
| **Chụp ảnh màn hình HD/4K [S]** | ✅ Có (Xuất ảnh sạch chuẩn nét gốc) | ✅ Có (Xuất ảnh sạch chuẩn nét gốc) |
| **Vi chỉnh tốc độ phát [>] [<] [=]** | ✅ Có (0.1x – 4.0x kèm HUD) | ✅ Có (0.1x – 4.0x kèm HUD) |
| **Lặp đoạn A-B Looper** | ✅ Có (Ghim A-B trên thanh tua) | ✅ Có (Ghim A-B trên thanh tua) |
| **Đánh dấu mốc & Ghi chú (Bookmarks)** | ✅ Có (Lưu mốc vĩnh viễn & Quản lý) | ✅ Có (Lưu mốc vĩnh viễn & Quản lý) |
| **Tùy biến giao diện (Ẩn Shorts, Lưới 4 cột)** | ✅ Có | ✅ Có |
| **Tải Video MP4 & Nhạc MP3 [D]** | ❌ *Loại bỏ để duyệt Store nhanh & bảo vệ tài khoản* | **✅ Có (Tải MP4 1080p, 720p, 360p & MP3 320kbps)** |
| **Quyền truy cập yêu cầu** | Tối thiểu (`declarativeNetRequest`, `activeTab`, `storage`) | Thêm quyền `downloads` & host media proxy |
| **File đóng gói ZIP** | `extensionTADa-cws.zip` | `extensionTADa-github.zip` |

---

## 🌟 Các tính năng nổi bật chi tiết

- **Tăng âm lượng 500% (Super Volume):** Điều khiển mượt mà với thanh trượt thế hệ mới, tự động căng tràn khung, hiển thị số % âm lượng trực tiếp và hiệu ứng Boost lửa.
- **Ambient Light (Đèn nền phát sáng):** Tự động phát sáng theo khung hình video chuẩn điện ảnh, điều chỉnh được độ sáng và độ tỏa (Spread).
- **Nút Hình trong hình (Picture-in-Picture - PiP) 1 chạm:** Tích hợp trực tiếp nút PiP chuẩn phong cách YouTube ngay cạnh nút Cài đặt [HD] trên thanh điều khiển video player; bấm 1 chạm là đưa video ra góc màn hình ngay lập tức để vừa làm việc vừa xem video (hỗ trợ phím tắt **`[P]`** siêu nhanh, tự động đổi màu hổ phách TADa khi đang bật PiP).
- **Chụp ảnh màn hình Video 1 chạm (Clean Screenshot HD/4K):** Chụp trực tiếp từ khung hình video ở độ phân giải gốc siêu nét (1080p, 2K, 4K), hoàn toàn sạch không dính watermark, thanh điều khiển hay popup. Nút Camera chuẩn phong cách YouTube ngay trên thanh điều khiển; bấm chuột trái hoặc phím tắt **`[S]`** để tải ảnh PNG về máy (tự động đặt tên theo tên video và thời lượng), **Shift + Click** hoặc **Chuột phải** hoặc phím tắt **`Shift + S`** để sao chép thẳng vào Clipboard dán nhanh; tích hợp hiệu ứng chớp sáng màn trập máy ảnh & thông báo kích thước ảnh trực quan.
- **Điều khiển tốc độ phát vi chỉnh (Fine Speed Control 0.1x – 4.0x):** Xóa bỏ giới hạn các mốc tốc độ thô của YouTube, cho phép tăng/giảm tốc độ phát mượt mà theo bước nhảy **0.1x** (hoặc **0.05x** khi cuộn chuột). Tích hợp nút tốc độ trực quan ngay trên thanh điều khiển (click mở menu chọn mốc nhanh `0.5x` đến `4.0x`, chuột phải về `1.0x`, cuộn chuột trên nút để vi chỉnh); kèm hệ thống phím tắt siêu tốc: **`>`** (tăng 0.1x), **`<`** (giảm 0.1x), **`=`** (về chuẩn 1.0x) và **HUD tốc độ hổ phách sang trọng** nổi trên màn hình video. Cực kỳ tối ưu cho học tập, nghe podcast và luyện kỹ năng cùng A-B Looper.
- **Lặp đoạn A - B (A-B Looper):** Cho phép chọn mốc bắt đầu [A] và kết thúc [B] để video tự động lặp lại liên tục đoạn đó. Hỗ trợ **chọn và kéo thả trực tiếp mốc A & B trên thanh thời gian (progress bar)**, thanh công cụ chọn 1 chạm, trượt cả đoạn lặp, vi chỉnh ±0.5s và phím tắt siêu nhanh: **`[`** (mốc A), **`]`** (mốc B), **`\`** (bật/tắt lặp), **Shift+Click** (chọn A trên thanh tua), **Alt+Click** (chọn B trên thanh tua). Hoàn hảo cho học nhảy, luyện nhạc cụ, nghe điệp khúc hoặc học phát âm ngoại ngữ.
- **Đánh dấu mốc thời gian cá nhân (Video Bookmarks & Notes):** Lưu vĩnh viễn các mốc thời gian kèm ghi chú theo từng video (không bao giờ mất khi tắt tab hay tắt máy). Trải nghiệm ghim mốc trực quan: **Bấm nút Note (hoặc phím `[B]`) ➜ click vào điểm bất kỳ trên thanh thời gian ➜ popup ghi chú nhỏ nổi lên ngay tại điểm đó ➜ gõ ghi chú & ấn Enter ➜ điểm ghim kim cương hổ phách lập tức xuất hiện trên thanh thời gian**! Hỗ trợ rê chuột xem tooltip, click để nhảy tới mốc, **chuột phải vào điểm ghim để xóa nhanh**, phím tắt chuột **`Ctrl + Click`**, sao chép toàn bộ mốc thành định dạng Markdown / Timestamps và **Thư viện quản lý Bookmarks tập trung trong Popup TADa**.
- **Tải Video MP4 & Nhạc MP3 (TADa Downloader - Chỉ có trên bản GitHub):** Tải video YouTube trực tiếp về máy không dính quảng cáo với đa dạng lựa chọn: Video MP4 chuẩn Full HD 1080p, 720p HD, 360p tiết kiệm hoặc tách âm thanh MP3 chất lượng cao 320kbps. Tích hợp nút Download phong cách YouTube ngay trên thanh điều khiển player (phím tắt nhanh **`[D]`**), thanh tiến trình xử lý động theo thời gian thực và tích hợp sẵn công cụ dự phòng 1-chạm (Cobalt, Y2Mate, SaveFrom).
- **Chặn quảng cáo toàn diện:** Tự động lọc video ads, banner ads, popup và lướt qua quảng cáo tài trợ.
- **Tối ưu giao diện YouTube:** Ẩn Shorts, ẩn thẻ kết thúc, lưới hiển thị video 4 cột, lọc gợi ý video liên quan thông minh, cố định bình luận.
- **Thương hiệu & Thông tin TADa:** Giao diện Cream & Amber cao cấp phong cách Material You, tích hợp trang Giới thiệu TADa và thông tin tác giả.

---

## 🚀 Hướng dẫn cài đặt

### Cách 1: Cài đặt từ Chrome Web Store (Khuyên dùng cho người dùng phổ thông)
1. Truy cập đường link extension trên Chrome Web Store (sau khi được xuất bản).
2. Bấm nút **Thêm vào Chrome (Add to Chrome)**.
3. Mở [YouTube](https://www.youtube.com/) và tận hưởng!

### Cách 2: Cài đặt bản GitHub Full (Dành cho người muốn dùng tính năng Tải Video MP4/MP3)
1. Tải file **`extensionTADa-github.zip`** từ mục [Releases](https://github.com/nobianh78/TADa-for-YouTube-v2.0/releases) hoặc clone repository này.
2. Giải nén file zip vào một thư mục trên máy tính.
3. Mở trình duyệt Chrome / Cốc Cốc / Edge / Brave và truy cập: `chrome://extensions/`
4. Bật công tắc **Chế độ dành cho nhà phát triển (Developer mode)** ở góc trên bên phải.
5. Bấm nút **Tải tiện ích đã giải nén (Load unpacked)** ➜ Chọn thư mục đã giải nén (hoặc thư mục `extensionTADa-github`).
6. Mở [YouTube](https://www.youtube.com/) và trải nghiệm trọn vẹn tất cả các tính năng!
