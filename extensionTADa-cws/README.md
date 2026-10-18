# TADa for YouTube

Extension Chrome (Manifest V3) chặn quảng cáo YouTube + bộ tiện ích: Tự động bỏ qua đoạn Intro, Outro & Nhà tài trợ (Auto-Skip Segments), Hiện số lượt Dislike (Return YouTube Dislike), Đánh dấu mốc thời gian & Ghi chú (Bookmarks), Lặp đoạn A-B (A-B Looper), PiP 1 chạm, Chụp ảnh màn hình (Screenshot), Tốc độ vi chỉnh 0.1x - 4.0x, tăng âm lượng 500%, Ambient Light, ẩn Shorts, ẩn thẻ kết thúc, lưới 4 cột, lọc gợi ý sidebar, cố định bình luận.

**v2.2.0 — Tối ưu hóa thanh công cụ & Khắc phục phản hồi nút:**
- **Khắc phục lỗi click nút:** Giải quyết triệt để lỗi các nút chức năng trên thanh điều khiển YouTube bị liệt / không phản hồi khi bấm.
- **Cơ chế Idempotent Toolbar Layout:** Loại bỏ hoàn toàn vòng lặp tái chèn DOM (DOM churning) và triệt tiêu xung đột với MutationObserver, đảm bảo độ mượt 100%.
- **Chuẩn hóa Pointer Events:** Khóa `pointer-events: none` trên các icon/phần tử con bên trong nút để mọi thao tác click luôn hướng chuẩn xác vào thẻ điều khiển.
- **Dọn dẹp bộ nhớ & Listener:** Chống rò rỉ sự kiện outside-click trên các Popover bộ lọc màu và Menu chỉnh tốc độ phát.

**v2.0.1 — Sắp xếp & Tùy biến thanh công cụ (Toolbar Customizer):**
- **Sắp xếp thứ tự & ẩn/hiện nút:** Kéo thả linh hoạt (hỗ trợ Pointer Events mượt mà trên chuột/cảm ứng) hoặc bấm nút ▲ / ▼ để sắp xếp thứ tự các nút TADa trên thanh điều khiển YouTube. Bật/tắt công tắc để ẩn bớt các nút không dùng.
- **Tùy biến vị trí nút A-B Looper:** Tùy chọn đặt nút A-B ở góc trái (cạnh mốc giờ) hoặc đặt trong cụm công cụ bên phải.
- **Vị trí cụm TADa:** Cho phép hiển thị trước hoặc sau nút Cài đặt bánh răng gốc của YouTube.
- **Trang Cài đặt phím tắt:** Tách riêng màn hình cấu hình phím tắt cho toàn bộ 17 chức năng, hỗ trợ đổi phím 1-chạm hoặc khôi phục mặc định.
- **Chia sẻ & Ủng hộ tác giả:** Thêm nút sao chép link CWS, chia sẻ tiện ích và thông tin ủng hộ MB Bank.
- **Tối ưu độ ổn định:** Sử dụng phương thức chèn DOM `insertAdjacentElement` chuẩn mực, tránh xung đột cấu trúc nút của YouTube.

**v2.0.0 — Rebrand TADa:** giao diện theo TADa Manager (kem #FDF6EC, hổ phách #E8930C, chữ nâu #2D1F16).
- **Tùy chọn Logo YouTube:** **TADa** (mặc định), **YouTube Premium**, hoặc **Mặc định** (YouTube gốc). Chuyển đổi trực tiếp ngay trên màn hình chính popup hoặc giữ **Alt + click** trực tiếp vào logo YouTube trên trang web để đổi nhanh. Tự động tương thích cả Sáng / Tối.
- **Giả lập giao diện YouTube TV (Smart TV / Leanback):** Mở khóa 100% giao diện YouTube trên TV (`youtube.com/tv`) trên máy tính mà không bị Google chặn. Chọn nhanh giữa giao diện **PC** hoặc **TV** ngay trong popup, mở cửa sổ TV riêng biệt chuẩn rạp phim, điều khiển bằng phím mũi tên hoặc liên kết remote từ điện thoại. Phím tắt nhanh **Alt + M** trên TV để quay về PC.
- **Đổi màu thanh thời gian (Custom Progress Bar Color):** Đổi màu thanh tiến trình video, nút tua, thanh âm lượng và vạch tiến trình trên toàn bộ YouTube. Tích hợp sẵn 7 màu tuyển chọn (Cam TADa, Xanh Cyan Neon, Xanh Ngọc, Tím Neon, Hồng Pastel, Vàng Gold, Đỏ gốc) kèm bảng chọn màu tự do HTML5 & mã HEX theo sở thích.
- **Bộ lọc màu & Ánh sáng (Video Color & Brightness Filter):** Tinh chỉnh độ sáng, độ tương phản, bão hòa màu, tông màu ấm (lọc ánh sáng xanh), đảo màu (invert) và đen trắng trực tiếp qua phần cứng GPU. Cứu sáng video quay thiếu sáng, xem đêm dịu mắt, hoặc đảo màu đọc slide bài giảng nền trắng. Tích hợp 7 mẫu lọc nhanh (1-chạm) cùng nút điều khiển trực tiếp trên thanh Player YouTube lẫn trong popup extension.
- **Chế độ Rạp phim / Tắt đèn (Cinema Mode):** Làm tối mờ toàn bộ giao diện xung quanh (thanh điều hướng, gợi ý, bình luận) để bạn tập trung 100% vào video. Khác với Fullscreen, bạn vẫn giữ được thanh URL và đa nhiệm cửa sổ thoải mái. Click chuột vào bất kỳ vùng tối nào để bật đèn lại tức thì. Hỗ trợ phím tắt **Shift + L** hoặc bấm trực tiếp nút bóng đèn trên thanh Player YouTube kèm thanh trượt độ tối 40% - 100%.
- **Vòng xoay tải video cánh chim (Giant Bird Loader):** Thay thế biểu tượng xoay vòng tròn nhàm chán của YouTube bằng hiệu ứng cánh chim nghệ thuật vẽ nét động (theo mẫu thiết kế Giant Bird trên Uiverse). Nét vẽ tự động đổi màu đồng bộ theo màu thanh thời gian (`--tada-progress-color`), có hiệu ứng đổ bóng mờ neon nổi bật trên nền video. Tùy chọn bật/tắt dễ dàng trong nhóm "Trình phát & Âm thanh".
- **Tự động ép độ phân giải cao nhất (Auto Highest Quality):** Tự động phát hiện và khóa độ phân giải cao nhất có thể (8K, 4K, 2K, 1080p 60fps) ngay khi mở video, ngăn chặn triệt để tình trạng YouTube tự ý hạ chất lượng xuống 480p/720p khi mạng dao động. Cho phép tùy chọn mức phân giải ưu tiên (Cao nhất, 4K, 2K, 1080p, 720p, 480p) và hiển thị thẻ thông báo tinh tế trên màn hình video khi chất lượng được áp dụng.

## Cài đặt
1. Giải nén zip.
2. Mở `chrome://extensions` → bật **Developer mode**.
3. **Load unpacked** → chọn thư mục `extensionTADa`.
4. Cập nhật bản mới: giải nén đè thư mục cũ → bấm **Reload** trên thẻ extension. Cài đặt cũ được giữ nguyên (storage keys không đổi).
