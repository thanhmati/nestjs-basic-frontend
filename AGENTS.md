# 🤖 AI AGENT OPERATING RULES & WORKFLOW GUIDELINES

## Project: `nestjs-basic-frontend` (Social Chat App Web Client)

Mọi AI Agent khi làm việc trên dự án này **BẮT BUỘC** phải tuân thủ nghiêm ngặt các quy tắc và quy trình dưới đây.

---

## 1. 📖 NGUYÊN TẮC 1: ĐỌC TÀI LIỆU TRƯỚC KHI THỰC HIỆN BẤT KỲ TASK NÀO (MANDATORY CONTEXT FIRST)

Tuyệt đối **KHÔNG** bắt đầu code hay sửa đổi file khi chưa đọc và nắm rõ ngữ cảnh từ tài liệu dự án:

1. **Đọc Kế hoạch Triển khai (`PLAN.md`):**
   - Xác định rõ Task ID, Phase hiện tại, mục tiêu của task và các task phụ thuộc đã hoàn thành trước đó.
   - Đảm bảo thực hiện theo đúng trình tự các Phase (từ Phase 1 đến Phase 6), không nhảy cóc.
2. **Đọc Tài liệu Yêu cầu Sản phẩm ([`docs/PRD.md`](file:///Users/tanthanh/Documents/Project/nestjs-basic-frontend/docs/PRD.md)):**
   - Nắm rõ luồng người dùng (User Flows), hành vi giao diện, các trạng thái UI (Loading, Empty, Error) và tiêu chí nghiệm thu (Acceptance Criteria).
3. **Đọc Hướng dẫn Tích hợp Backend ([`docs/integration-guide.md`](file:///Users/tanthanh/Documents/Project/nestjs-basic-frontend/docs/integration-guide.md)):**
   - Nắm vững khế ước giao tiếp HTTP & Socket:
     - Base API URL: `VITE_API_URL=http://localhost:3000/api/v1`
     - Socket.IO Namespace: `VITE_WS_URL=http://localhost:3000/chat` (Namespace bắt buộc `/chat`)
     - Host ảnh tĩnh: `VITE_ASSET_URL=http://localhost:3000`
     - Cơ chế envelope: Server bọc dữ liệu trong `{ statusCode, message, data, timestamp }`. Tầng Axios Interceptor bóc tách lấy `res.data.data`.
     - Dữ liệu tài khoản mẫu kiểm thử: Alice (`alice@example.com`), Bob (`bob@example.com`), Admin (`admin@socialchat.com`), pass: `Password@123`.
4. **Đối chiếu Schema API ([`docs/api-spec.json`](file:///Users/tanthanh/Documents/Project/nestjs-basic-frontend/docs/api-spec.json)):**
   - Tuyệt đối không tự suy đoán tên trường DTO hay HTTP method. Phải kiểm tra chính xác đường dẫn endpoint, tham số query/param và body request trong specification.

---

## 2. 🛠️ NGUYÊN TẮC 2: QUY CHUẨN KỸ THUẬT & KIẾN TRÚC CODE

- **Type Safety 100%:** Luôn sử dụng kiểu dữ liệu sinh từ OpenAPI hoặc định nghĩa chặt chẽ trong `src/types/`. Nghiêm cấm dùng kiểu `any` tùy tiện.
- **Tách Biệt Các Tầng (Clean Architecture):**
  - Tầng API: Chỉ gọi HTTP và trả về kiểu dữ liệu sạch (`src/api/*.api.ts`).
  - Tầng Services: Quản lý instance Axios (`src/services/api.ts`) và kết nối Socket.IO (`src/services/socket.ts`).
  - Tầng State: Quản lý qua Zustand (`src/stores/*.store.ts`).
  - Tầng Components: Tách nhỏ component tái sử dụng (`src/components/common/`, `src/components/posts/`, `src/components/chat/`).
  - Tầng Pages: Ghép nối components và state (`src/pages/*.tsx`).
- **Giao diện Đẳng cấp & Trực quan (Modern Aesthetic):**
  - Sử dụng Tailwind CSS với bảng màu hiện đại (Indigo, Slate, Emerald), bo góc `rounded-xl`, hiệu ứng hover/transition mượt mà.
  - Luôn xử lý đầy đủ 3 trạng thái: Đang tải (Skeleton/Spinner), Trống (Empty State thân thiện), Lỗi (Toast/Error text).
  - Ảnh đại diện & bài viết: Luôn bọc qua helper `getMediaUrl(path)` để fallback ảnh placeholder đẹp mắt khi đường dẫn rỗng.

---

## 3. 🧪 NGUYÊN TẮC 3: KIỂM TRA & XÁC MINH (VERIFY BEFORE FINISHING)

Trước khi đánh dấu một task là hoàn thành:

1. Chạy lệnh kiểm tra TypeScript và Build:
   ```bash
   pnpm run build
   ```
   hoặc `npx tsc --noEmit` để đảm bảo 0 lỗi kiểu dữ liệu và cú pháp.
2. Đảm bảo không phát sinh file rác hoặc commit code thừa.

---

## 4. 📝 NGUYÊN TẮC 4: BẮT BUỘC CẬP NHẬT TRẠNG THÁI TRONG `PLAN.md` (MANDATORY STATUS UPDATE)

Sau khi hoàn thành bất kỳ task nào, Agent **BẮT BUỘC** phải thực hiện ngay các bước sau trên file [`PLAN.md`](file:///Users/tanthanh/Documents/Project/nestjs-basic-frontend/PLAN.md):

1. **Cập nhật checkbox của task:** Chuyển từ `- [ ]` sang `- [x]`.
2. **Cập nhật dòng trạng thái của task:** Đổi từ `⚪ Chưa bắt đầu` sang `🟢 Hoàn thành`.
3. **Cập nhật Bảng Tiến độ Tổng quan (Mục 1 của PLAN.md):**
   - Tăng số lượng task "Đã Hoàn Thành" của Phase tương ứng.
   - Tính toán lại phần trăm hoàn thành (%) của Phase đó và Tổng thể dự án.
   - Nếu Phase hoàn tất 100%, đổi trạng thái Phase sang `🟢 Hoàn thành`.
4. **Báo cáo cho người dùng:**
   - Tóm tắt ngắn gọn các file đã tạo/sửa đổi.
   - Nêu rõ task tiếp theo dự kiến sẽ thực hiện theo thứ tự trong `PLAN.md`.
