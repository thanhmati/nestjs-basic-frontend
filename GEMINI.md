# 🤖 GEMINI / AGENT DIRECTIVES

## Project: `nestjs-basic-frontend`

Mọi AI Agent khi làm việc trên dự án này **BẮT BUỘC** phải tuân thủ:

1. **Trước khi thực hiện task:**
   - Đọc kỹ [`docs/PLAN.md`](file:///Users/tanthanh/Documents/Project/nestjs-basic-frontend/docs/PLAN.md) để xác định mục tiêu và Task ID hiện tại.
   - Đọc đối chiếu tài liệu kỹ thuật trong `docs/`:
     - [`docs/PRD.md`](file:///Users/tanthanh/Documents/Project/nestjs-basic-frontend/docs/PRD.md)
     - [`docs/integration-guide.md`](file:///Users/tanthanh/Documents/Project/nestjs-basic-frontend/docs/integration-guide.md)
     - [`docs/api-spec.json`](file:///Users/tanthanh/Documents/Project/nestjs-basic-frontend/docs/api-spec.json)
   - Tuyệt đối không tự đoán API hay bỏ qua quy ước bóc tách response envelope `res.data.data` và namespace socket `/chat`.

2. **Sau khi hoàn thành task:**
   - Cập nhật ngay [`docs/PLAN.md`](file:///Users/tanthanh/Documents/Project/nestjs-basic-frontend/docs/PLAN.md):
     - Đánh dấu `- [x]` cho task đã hoàn thành.
     - Đổi trạng thái thành `🟢 Hoàn thành`.
     - Cập nhật số lượng task hoàn thành và % tiến độ trong bảng tổng quan Mục 1.
   - Kiểm tra type-checking (`tsc --noEmit` hoặc `pnpm build`) không có lỗi trước khi kết thúc turn.
