---
trigger: always_on
description: Quy trình bắt buộc đọc tài liệu trước khi thực thi task và cập nhật trạng thái trong PLAN.md
---

# 🤖 WORKFLOW RULE: ĐỌC TÀI LIỆU VÀ CẬP NHẬT PLAN.MD

## 1. Trước khi thực hiện task:

- Bắt buộc kiểm tra và đọc kỹ tài liệu liên quan:
  1. [`docs/PLAN.md`](file:///Users/tanthanh/Documents/Project/nestjs-basic-frontend/docs/PLAN.md) — Xác định task ID, phase hiện tại và sự phụ thuộc.
  2. [`docs/PRD.md`](file:///Users/tanthanh/Documents/Project/nestjs-basic-frontend/docs/PRD.md) — Xem chi tiết yêu cầu nghiệp vụ, UI states, acceptance criteria.
  3. [`docs/integration-guide.md`](file:///Users/tanthanh/Documents/Project/nestjs-basic-frontend/docs/integration-guide.md) — Quy ước HTTP/WS, Axios interceptors, namespace `/chat`, test accounts.
  4. [`docs/api-spec.json`](file:///Users/tanthanh/Documents/Project/nestjs-basic-frontend/docs/api-spec.json) — Schema API chính xác 100%.

## 2. Sau khi hoàn thành task:

- Bắt buộc cập nhật file [`docs/PLAN.md`](file:///Users/tanthanh/Documents/Project/nestjs-basic-frontend/docs/PLAN.md):
  - Đánh dấu `- [x]` cho task vừa làm.
  - Cập nhật dòng trạng thái thành `🟢 Hoàn thành`.
  - Cập nhật số task đã hoàn thành và % tiến độ trong bảng tổng quan Mục 1.
- Kiểm tra tính toàn vẹn (type-check, lint, build) trước khi bàn giao.
