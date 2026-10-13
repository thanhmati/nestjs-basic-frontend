# 📋 KẾ HOẠCH TRIỂN KHAI DỰ ÁN (PROJECT IMPLEMENTATION PLAN)
## Social Chat App Web Client (React 19 + TypeScript + Vite + Tailwind CSS)

> **Mã dự án:** `nestjs-basic-frontend`  
> **Backend tương ứng:** `nestjs-basic-course` (`http://localhost:3000`)  
> **Tài liệu tham chiếu:**  
> - 📄 PRD: [`docs/PRD.md`](file:///Users/tanthanh/Documents/Project/nestjs-basic-frontend/docs/PRD.md)  
> - 📄 Integration Guide: [`docs/integration-guide.md`](file:///Users/tanthanh/Documents/Project/nestjs-basic-frontend/docs/integration-guide.md)  
> - 📄 OpenAPI Specification: [`docs/api-spec.json`](file:///Users/tanthanh/Documents/Project/nestjs-basic-frontend/docs/api-spec.json)  
> **Phiên bản kế hoạch:** 1.0.0  
> **Trạng thái tổng thể:** 🟡 SẴN SÀNG TRIỂN KHAI (NOT STARTED)

---

## 1. 📊 Bảng Theo Dõi Tiến Độ Tổng Quan (Progress Dashboard)

| Phase | Tên Giai Đoạn | Số Tasks | Đã Hoàn Thành | Trạng Thái | Tiến Độ |
| :---: | :--- | :---: | :---: | :---: | :---: |
| **Phase 1** | Khởi Tạo Dự Án & Hạ Tầng Mạng Lõi (Scaffolding & Core Network) | 7 | 7 | 🟢 Hoàn thành | 100% |
| **Phase 2** | Xác Thực, Điều Hướng & Master Layout (Auth & Shell) | 5 | 5 | 🟢 Hoàn thành | 100% |
| **Phase 3** | Bảng Tin Xã Hội & Bình Luận (Social Newsfeed & Comments) | 5 | 5 | 🟢 Hoàn thành | 100% |
| **Phase 4** | Hệ Thống Trò Chuyện Thời Gian Thực (Hybrid Real-Time Chat) | 7 | 7 | 🟢 Hoàn thành | 100% |
| **Phase 5** | Thông Báo Trực Tuyến & Hồ Sơ Cá Nhân (Live Notifs & Profile) | 4 | 4 | 🟢 Hoàn thành | 100% |
| **Phase 6** | Tối Ưu Hóa, E2E Verification & Bàn Giao (Polish & Launch) | 5 | 0 | ⚪ Chưa bắt đầu | 0% |
| **TỔNG** | **Toàn bộ dự án** | **33** | **28** | **🟡 Đang triển khai** | **84.8%** |

---

## 2. 🏗️ Ngăn Xếp Công Nghệ & Khung Kiến Trúc (Tech Stack & Architecture)

- **UI & Core Framework:** React 19, TypeScript 5.7+, Vite 8
- **Styling & Design System:** Tailwind CSS, Lucide React Icons
- **State Management:** Zustand 5 (Auth & Chat Stores với persist localStorage)
- **Routing:** React Router DOM (Protected Routes & Layout Wrapper)
- **Networking:** 
  - REST: Axios với Interceptors tự bóc tách `res.data.data` và tự đính kèm JWT Bearer Token
  - Real-time: `socket.io-client` (Namespace `/chat`, Handshake auth token)
- **Data Validation & Types:** `openapi-typescript` sinh từ [`docs/api-spec.json`](file:///Users/tanthanh/Documents/Project/nestjs-basic-frontend/docs/api-spec.json)
- **Date & Media Helpers:** Dayjs / Date-fns, `getMediaUrl` helper

---

## 3. 🎯 Kế Hoạch Chi Tiết Từng Phase (Detailed Phase Breakdown)

---

### 🔹 PHASE 1: Khởi Tạo Dự Án, Cấu Hình Nền Tảng & Hạ Tầng Mạng Lõi
> **Mục tiêu:** Cài đặt toàn bộ thư viện cần thiết, thiết lập hệ thống styling Tailwind CSS, sinh type contracts từ OpenAPI, cấu hình tầng Axios & Socket.IO và tạo Auth Store.  
> **Điều kiện tiên quyết:** Dự án Vite React có sẵn, file tài liệu `docs/` đầy đủ.

- [x] **Task 1.1: Cấu hình biến môi trường và cài đặt Dependencies**
  - **Mô tả:** Cài đặt các gói phụ thuộc: `tailwindcss`, `@tailwindcss/vite` (hoặc PostCSS setup), `lucide-react`, `axios`, `socket.io-client`, `zustand`, `react-router-dom`, `dayjs`, `openapi-typescript`. Tạo file `.env` và `.env.example`.
  - **File tác động:** `package.json`, `.env`, `.env.example`, `vite.config.ts`
  - **Tiêu chí nghiệm thu (AC):** `pnpm install` thành công, môi trường đọc được `VITE_API_URL`, `VITE_WS_URL`, `VITE_ASSET_URL`.
  - **Trạng thái:** 🟢 Hoàn thành

- [x] **Task 1.2: Thiết lập Tailwind CSS & Design System Tokens**
  - **Mô tả:** Cấu hình Tailwind CSS, phông chữ Inter/Roboto, định nghĩa màu sắc chủ đạo (Indigo, Slate, Emerald, Rose), bo góc `rounded-xl`, cấu hình `src/index.css`.
  - **File tác động:** `src/index.css`, `vite.config.ts` / `tailwind.config.js`
  - **Tiêu chí nghiệm thu (AC):** Class Tailwind hoạt động chính xác trên component mẫu; giao diện có bảng màu hiện đại, tinh gọn.
  - **Trạng thái:** 🟢 Hoàn thành

- [x] **Task 1.3: Sinh & Chuẩn hóa TypeScript Types từ OpenAPI Schema**
  - **Mô tả:** Chạy `openapi-typescript` dựa trên [`docs/api-spec.json`](file:///Users/tanthanh/Documents/Project/nestjs-basic-frontend/docs/api-spec.json) để tạo `src/types/api.generated.ts`. Định nghĩa bổ sung các interface helper: `User`, `Post`, `Comment`, `Conversation`, `ChatMessage`, `Notification`.
  - **File tác động:** `src/types/api.generated.ts`, `src/types/index.ts`
  - **Tiêu chí nghiệm thu (AC):** Typescript compile không có lỗi; các DTOs của Backend phản ánh chính xác 100% trong type contract.
  - **Trạng thái:** 🟢 Hoàn thành

- [x] **Task 1.4: Xây dựng Axios Client Core & Interceptors**
  - **Mô tả:** Cấu hình `src/services/api.ts`.
    1. Request Interceptor: Tự động trích xuất `access_token` từ `localStorage` và đính kèm `Authorization: Bearer <token>`.
    2. Response Interceptor: Tự động unwrap cấu trúc envelope `{ statusCode, message, data }` để trả về trực tiếp `data`.
    3. Error Interceptor: Bắt mã lỗi 401 Unauthorized, dọn dẹp storage và điều hướng về `/login`.
  - **File tác động:** `src/services/api.ts`
  - **Tiêu chí nghiệm thu (AC):** Đảm bảo axios call trả về payload unwrap, tự động đính token và chuyển hướng khi 401.
  - **Trạng thái:** 🟢 Hoàn thành

- [x] **Task 1.5: Xây dựng Socket.IO Connection Manager (/chat namespace)**
  - **Mô tả:** Xây dựng `src/services/socket.ts` kết nối đến `VITE_WS_URL` (Namespace `/chat`) kèm handshake `auth: { token: 'Bearer ...' }`. Thiết lập hàm `connectChatSocket(token)`, `disconnectChatSocket()`, tự động emit `subscribe_notifications` khi kết nối thành công, xử lý reconnect.
  - **File tác động:** `src/services/socket.ts`
  - **Tiêu chí nghiệm thu (AC):** Socket kết nối đúng namespace `/chat`, quản lý kết nối singleton an toàn, không bị duplicate listeners.
  - **Trạng thái:** 🟢 Hoàn thành

- [x] **Task 1.6: Xây dựng các hàm tiện ích dùng chung (Media & Format)**
  - **Mô tả:** 
    - `src/utils/media.ts`: Hàm `getMediaUrl(path)` chuẩn hóa URL hình ảnh từ `VITE_ASSET_URL` và avatar fallback.
    - `src/utils/format.ts`: Hàm format thời gian tương đối ("vừa xong", "5 phút trước", "14:30").
  - **File tác động:** `src/utils/media.ts`, `src/utils/format.ts`
  - **Tiêu chí nghiệm thu (AC):** Hàm xử lý chuẩn xác cho cả URL tuyệt đối, tương đối, null/undefined.
  - **Trạng thái:** 🟢 Hoàn thành

- [x] **Task 1.7: Xây dựng Store Quản lý Xác thực (Zustand Auth Store)**
  - **Mô tả:** Xây dựng `src/stores/auth.store.ts` quản lý state: `token`, `user`, `isAuthenticated`, `isLoading`, các action `login`, `register`, `logout`, `updateCurrentUser`. Tích hợp middleware `persist` lưu `access_token` và `user_info` vào `localStorage`.
  - **File tác động:** `src/stores/auth.store.ts`
  - **Tiêu chí nghiệm thu (AC):** F5 tải lại trang vẫn giữ nguyên phiên đăng nhập; logout dọn sạch state và ngắt socket.
  - **Trạng thái:** 🟢 Hoàn thành

---

### 🔹 PHASE 2: Hệ Thống Xác Thực, Điều Hướng & Master Shell (Auth & Master Shell)
> **Mục tiêu:** Xây dựng hoàn chỉnh luồng Đăng nhập, Đăng ký, thanh Quick-Fill tài khoản test, khung giao diện App Shell (Header/Navbar/Logout) và Protected Route.  
> **Điều kiện tiên quyết:** Hoàn thành Phase 1 (Auth Store, Axios API).

- [x] **Task 2.1: Bộ UI Components cơ bản dùng chung (Common UI Kit)**
  - **Mô tả:** Xây dựng các thành phần cơ sở: `Button`, `Input`, `Avatar`, `Badge`, `Spinner`, `Modal`, `Toast/Alert`.
  - **File tác động:** `src/components/common/Button.tsx`, `Input.tsx`, `Avatar.tsx`, `Badge.tsx`, `Modal.tsx`, `Spinner.tsx`, `Toast.tsx`
  - **Tiêu chí nghiệm thu (AC):** UI đồng bộ, hiệu ứng hover/active mượt mà, hỗ trợ đầy đủ variant màu và disabled state.
  - **Trạng thái:** 🟢 Hoàn thành

- [x] **Task 2.2: Module API Xác Thực (`auth.api.ts`)**
  - **Mô tả:** Viết hàm `loginApi(data)` (`POST /auth/login`), `registerApi(data)` (`POST /auth/register`).
  - **File tác động:** `src/api/auth.api.ts`
  - **Tiêu chí nghiệm thu (AC):** Khớp 100% với schema DTO của Backend.
  - **Trạng thái:** 🟢 Hoàn thành

- [x] **Task 2.3: Màn hình Đăng Nhập (`LoginPage.tsx`) & Thanh Quick-Fill**
  - **Mô tả:** Giao diện đăng nhập hiện đại với email & mật khẩu. Tích hợp thanh Quick-Fill gồm 3 nút: **[Alice (User)]**, **[Bob (User)]**, **[Admin]** - click tự động điền form và submit đăng nhập nhanh. Hiển thị thông báo lỗi khi đăng nhập thất bại.
  - **File tác động:** `src/pages/LoginPage.tsx`, `src/components/auth/QuickFillBar.tsx`
  - **Tiêu chí nghiệm thu (AC):** Bấm nút Alice/Bob/Admin tự động đăng nhập và điều hướng vào trang chủ `/`.
  - **Trạng thái:** 🟢 Hoàn thành

- [x] **Task 2.4: Màn hình Đăng Ký (`RegisterPage.tsx`)**
  - **Mô tả:** Giao diện đăng ký tài khoản mới: Tên, Email, Mật khẩu (validate >= 6 ký tự). Xử lý hiển thị lỗi trùng email (409 Conflict).
  - **File tác động:** `src/pages/RegisterPage.tsx`
  - **Tiêu chí nghiệm thu (AC):** Đăng ký thành công điều hướng về Login kèm thông báo chúc mừng.
  - **Trạng thái:** 🟢 Hoàn thành

- [x] **Task 2.5: Khung Điều Hướng Master Shell & Protected Routes**
  - **Mô tả:** Xây dựng `AppLayout.tsx`, `Header.tsx` (Logo, Link Bảng Tin `/`, Tin Nhắn `/chat`, Danh Bạ, Avatar người dùng, Dropdown Menu, Nút Đăng xuất). Thiết lập React Router với `ProtectedRoute` chặn truy cập trái phép.
  - **File tác động:** `src/components/layout/AppLayout.tsx`, `Header.tsx`, `src/components/layout/ProtectedRoute.tsx`, `src/App.tsx`
  - **Tiêu chí nghiệm thu (AC):** Chưa đăng nhập truy cập `/` hoặc `/chat` bị chuyển hướng về `/login`; Đã đăng nhập hiển thị đầy đủ Header và nội dung.
  - **Trạng thái:** 🟢 Hoàn thành

---

### 🔹 PHASE 3: Bảng Tin Xã Hội & Tương Tác Bình Luận (Social Newsfeed & Comments)
> **Mục tiêu:** Cung cấp tính năng xem Bảng tin cuộn vô tận (Cursor Pagination), đăng bài viết kèm nhiều hình ảnh có preview, xem và gửi bình luận tức thì.  
> **Điều kiện tiên quyết:** Hoàn thành Phase 2 (Auth & App Shell).

- [x] **Task 3.1: Module API Posts & Comments**
  - **Mô tả:** 
    - `posts.api.ts`: `getFeed(cursor, take, search)`, `createPost(data)`, `uploadPostImages(files)`, `deletePost(id)`.
    - `comments.api.ts`: `getComments(postId, cursor, limit)`, `createComment(postId, content)`, `deleteComment(id)`.
  - **File tác động:** `src/api/posts.api.ts`, `src/api/comments.api.ts`
  - **Tiêu chí nghiệm thu (AC):** Gọi đúng các endpoint `/posts/feed`, `/posts`, `/posts/upload-images`, `/posts/:postId/comments`.
  - **Trạng thái:** 🟢 Hoàn thành

- [x] **Task 3.2: Khung Tạo Bài Viết Mới (`CreatePostBox.tsx`)**
  - **Mô tả:** Ô nhập tiêu đề, nội dung bài viết, chọn tối đa 5 file ảnh. Hiển thị thumbnail preview và nút xóa từng ảnh trước khi đăng. Tự động upload ảnh qua `POST /posts/upload-images` trước khi gửi `POST /posts`.
  - **File tác động:** `src/components/posts/CreatePostBox.tsx`
  - **Tiêu chí nghiệm thu (AC):** Đăng bài thành công, bài viết mới lập tức xuất hiện ở đầu Bảng tin; reset form và xóa ảnh preview.
  - **Trạng thái:** 🟢 Hoàn thành

- [x] **Task 3.3: Thẻ Bài Viết (`PostCard.tsx`) & Lưới Hiển Thị Ảnh**
  - **Mô tả:** Component hiển thị bài viết: Avatar, tên tác giả, nhãn thời gian tương đối, tiêu đề, nội dung, grid ảnh responsive (1-5 ảnh), nút xóa bài viết (chỉ hiện cho chính chủ hoặc Admin với hộp thoại xác nhận `ConfirmModal`).
  - **File tác động:** `src/components/posts/PostCard.tsx`, `src/components/posts/ImageGallery.tsx`
  - **Tiêu chí nghiệm thu (AC):** Render hình ảnh rõ nét qua `getMediaUrl`; xóa bài viết thành công cập nhật giao diện.
  - **Trạng thái:** 🟢 Hoàn thành

- [x] **Task 3.4: Bảng Tin Cuộn Vô Tận (`FeedPage.tsx`)**
  - **Mô tả:** Màn hình trang chủ `/`: Tải bài viết qua `getFeed` với Cursor pagination. Khi cuộn tới đáy trang, tự động fetch trang tiếp theo. Có thanh tìm kiếm theo tiêu đề/nội dung, Skeleton loading và Empty state khi chưa có bài viết.
  - **File tác động:** `src/pages/FeedPage.tsx`
  - **Tiêu chí nghiệm thu (AC):** Cuộn mượt mà không giật màn hình; cursor pagination hoạt động chuẩn xác.
  - **Trạng thái:** 🟢 Hoàn thành

- [x] **Task 3.5: Hệ Thống Bình Luận Dưới Bài Viết (`CommentSection.tsx`)**
  - **Mô tả:** Danh sách bình luận mở rộng dưới PostCard. Hỗ trợ nút "Xem thêm bình luận cũ" (cursor pagination), form gửi bình luận mới với nút Gửi/Enter, nút xóa bình luận (author, post owner, admin).
  - **File tác động:** `src/components/posts/CommentSection.tsx`, `src/components/posts/CommentItem.tsx`
  - **Tiêu chí nghiệm thu (AC):** Bình luận mới xuất hiện ngay lập tức; quyền xóa bình luận hoạt động đúng vai trò.
  - **Trạng thái:** 🟢 Hoàn thành

---

### 🔹 PHASE 4: Hệ Thống Trò Chuyện Thời Gian Thực (Hybrid Real-Time Chat)
> **Mục tiêu:** Xây dựng toàn diện tính năng Chat kết hợp REST API (lấy lịch sử ban đầu) và WebSockets Socket.IO (nhận & gửi tin nhắn tức thời, đánh dấu đã đọc, chat phòng).  
> **Điều kiện tiên quyết:** Hoàn thành Phase 1 (Socket core) và Phase 2 (Auth).

- [x] **Task 4.1: Module API & Store Quản Lý Chat (`chat.api.ts`, `chat.store.ts`)**
  - **Mô tả:** 
    - `chat.api.ts`: `getConversations()`, `getMessages(receiverId, limit)`, `markAsRead(senderId)`.
    - `chat.store.ts`: Quản lý danh sách hội thoại, đối tác chat đang chọn (`activePartner`), tin nhắn trong phòng hiện tại, số tin chưa đọc (`unreadTotal`), action add/update message.
  - **File tác động:** `src/api/chat.api.ts`, `src/stores/chat.store.ts`
  - **Tiêu chí nghiệm thu (AC):** Quản lý state tập trung, cập nhật phản ứng tức thời khi có event từ socket.
  - **Trạng thái:** 🟢 Hoàn thành

- [x] **Task 4.2: Sidebar Danh Sách Hội Thoại & Danh Bạ Thành Viên (`ConversationList.tsx`)**
  - **Mô tả:** Cột trái màn hình Chat: Danh sách hội thoại gần đây (Avatar, tên, tin nhắn cuối cùng, thời gian, badge tin chưa đọc). Có Tab chuyển sang Danh bạ thành viên (`GET /users`) để tìm kiếm và bắt đầu chat với người mới.
  - **File tác động:** `src/components/chat/ConversationList.tsx`, `src/components/chat/UserDirectoryTab.tsx`
  - **Tiêu chí nghiệm thu (AC):** Click vào thành viên bất kỳ sẽ kích hoạt khung chat với người đó.
  - **Trạng thái:** 🟢 Hoàn thành

- [x] **Task 4.3: Khung Trò Chuyện Active (`ChatWindow.tsx`) & Tải Lịch Sử Ban Đầu**
  - **Mô tả:** Khung chat chính: Header hiển thị thông tin đối tác chat và trạng thái kết nối WebSockets (chấm xanh). Khi chọn đối tác, gọi REST `GET /chat/messages/:receiverId` lấy 50 tin nhắn gần nhất kèm hiệu ứng loading.
  - **File tác động:** `src/components/chat/ChatWindow.tsx`, `src/components/chat/ChatHeader.tsx`
  - **Tiêu chí nghiệm thu (AC):** Tải lịch sử tin nhắn ban đầu mượt mà, hiển thị empty state nếu chưa có cuộc trò chuyện.
  - **Trạng thái:** 🟢 Hoàn thành

- [x] **Task 4.4: Bong Bóng Tin Nhắn (`MessageBubble.tsx`) & Format Trình Bày**
  - **Mô tả:** Hiển thị tin nhắn rõ ràng: Tin của mình (căn phải, nền Indigo nổi bật), tin của bạn (căn trái, nền Slate xám, kèm Avatar). Format giờ gửi (HH:mm) và ngày tháng phân tách nếu khác ngày.
  - **File tác động:** `src/components/chat/MessageBubble.tsx`
  - **Tiêu chí nghiệm thu (AC):** Phân biệt rõ ràng người gửi/người nhận, chữ tự động xuống dòng, hỗ trợ ký tự đặc biệt/emoji an toàn.
  - **Trạng thái:** 🟢 Hoàn thành

- [x] **Task 4.5: Tích Hợp Real-time Gửi & Nhận Tin Nhắn (Socket Events)**
  - **Mô tả:** 
    - Form nhập tin nhắn: Bấm Gửi hoặc Enter emit socket `send_room_message` (`{ receiverId, content }`).
    - Listener socket: Lắng nghe `new_room_message`. Nếu thuộc hội thoại đang mở -> append vào danh sách và cuộn xuống đáy (Auto-scroll to bottom). Nếu thuộc người khác -> cập nhật badge chưa đọc tại Sidebar.
  - **File tác động:** `src/components/chat/ChatInput.tsx`, `src/components/chat/ChatWindow.tsx`
  - **Tiêu chí nghiệm thu (AC):** Gửi nhận tin nhắn real-time hai chiều < 100ms giữa 2 cửa sổ/tab trình duyệt.
  - **Trạng thái:** 🟢 Hoàn thành

- [x] **Task 4.6: Đánh Dấu Đã Đọc Tin Nhắn (`PATCH /chat/messages/:senderId/read`)**
  - **Mô tả:** Khi mở hoặc đang xem cuộc trò chuyện của một người gửi, tự động gọi API `markAsRead` và reset badge chưa đọc của đối tác đó về 0.
  - **File tác động:** `src/components/chat/ChatWindow.tsx`, `src/stores/chat.store.ts`
  - **Tiêu chí nghiệm thu (AC):** Mở chat lập tức làm biến mất badge đỏ unread count.
  - **Trạng thái:** 🟢 Hoàn thành

- [x] **Task 4.7: Hỗ Trợ Phòng Trò Chuyện Nhóm (Room Chat Support)**
  - **Mô tả:** Hỗ trợ nhập Room ID (ví dụ: `general`, `lounge`) để emit `join_room`, `leave_room`, và gửi tin nhắn nhóm với `{ roomId, content }`. Hiển thị thông báo khi có người vào/ra phòng (`user_joined`, `user_left`).
  - **File tác động:** `src/components/chat/RoomModal.tsx`, `src/pages/ChatPage.tsx`
  - **Tiêu chí nghiệm thu (AC):** Nhiều người dùng cùng join chung room ID đều nhận được tin nhắn nhóm tức thì.
  - **Trạng thái:** 🟢 Hoàn thành

---

### 🔹 PHASE 5: Thông Báo Trực Tuyến & Hồ Sơ Cá Nhân (Live Notifs & Profile)
> **Mục tiêu:** Tích hợp chuông thông báo Real-time khi có bình luận mới, xây dựng trang hồ sơ cá nhân, chỉnh sửa thông tin và upload đổi avatar.  
> **Điều kiện tiên quyết:** Hoàn thành Phase 3 (Comments) & Phase 4 (Socket).

- [x] **Task 5.1: Chuông Thông Báo Trực Tuyến Trên Header (`NotificationBell.tsx`)**
  - **Mô tả:** Biểu tượng chuông kèm badge đếm số thông báo chưa đọc. Dropdown danh sách thông báo lấy từ `GET /notifications`. Socket lắng nghe `new_notification` -> nhảy badge + hiển thị Toast alert. Hỗ trợ đánh dấu đọc từng cái hoặc đọc tất cả (`PATCH /notifications/read-all`).
  - **File tác động:** `src/components/layout/NotificationBell.tsx`, `src/api/notifications.api.ts`
  - **Tiêu chí nghiệm thu (AC):** Người dùng B bình luận bài của A -> màn hình của A lập tức nhảy số thông báo và hiện Toast thông báo.
  - **Trạng thái:** 🟢 Hoàn thành

- [x] **Task 5.2: API Người Dùng & Quản Lý Hồ Sơ Cá Nhân (`users.api.ts`)**
  - **Mô tả:** Viết các hàm: `getProfileApi()` (`GET /users/profile`), `updateProfileApi(data)` (`PATCH /users/profile`), `uploadAvatarApi(file)` (`POST /users/avatar` multipart), `getUserByIdApi(id)` (`GET /users/:id`), `getUsersApi(search, limit)` (`GET /users`).
  - **File tác động:** `src/api/users.api.ts`
  - **Tiêu chí nghiệm thu (AC):** Xử lý đúng FormData cho upload avatar, unwrap đúng dữ liệu trả về.
  - **Trạng thái:** 🟢 Hoàn thành

- [x] **Task 5.3: Trang Hồ Sơ Cá Nhân & Đổi Avatar (`ProfilePage.tsx`)**
  - **Mô tả:** Màn hình `/profile`: Xem thông tin tài khoản (Email, Role, Ngày tham gia). Form chỉnh sửa Họ tên, Bio, Location. Nút tải lên Avatar (JPG/PNG/WEBP <= 2MB) có preview; sau khi upload tự động cập nhật avatar trên Header và trong Auth Store.
  - **File tác động:** `src/pages/ProfilePage.tsx`
  - **Tiêu chí nghiệm thu (AC):** Cập nhật thông tin và đổi avatar thành công, avatar mới hiển thị đồng bộ toàn ứng dụng.
  - **Trạng thái:** 🟢 Hoàn thành

- [x] **Task 5.4: Trang Hồ Sơ Công Khai Thành Viên (`UserProfilePage.tsx`)**
  - **Mô tả:** Màn hình `/users/:id`: Xem hồ sơ công khai của thành viên khác (Avatar, tên, bio, location). Có nút "Nhắn tin" bấm vào sẽ điều hướng thẳng sang `/chat` và mở cuộc trò chuyện với người đó.
  - **File tác động:** `src/pages/UserProfilePage.tsx`
  - **Tiêu chí nghiệm thu (AC):** Xem được thông tin công khai của bạn bè, bấm nút nhắn tin chuyển mượt mà sang chat.
  - **Trạng thái:** 🟢 Hoàn thành

---

### 🔹 PHASE 6: Tối Ưu Hóa Giao Diện, E2E Verification & Bàn Giao (Polish & Launch)
> **Mục tiêu:** Hoàn thiện trải nghiệm Responsive mobile/desktop, micro-animations, kiểm thử E2E 2 tài khoản thực tế và chạy build production sạch sẽ.  
> **Điều kiện tiên quyết:** Hoàn thành toàn bộ Phase 1 đến 5.

- [ ] **Task 6.1: Tối ưu Responsive Mobile & Tablet UX**
  - **Mô tả:** Đảm bảo giao diện chuẩn responsive trên mọi kích thước (Mobile 375px+, Tablet, Desktop). Trên Mobile: Chat chuyển đổi linh hoạt giữa danh sách hội thoại và khung chat (có nút "Quay lại" danh sách).
  - **File tác động:** `src/pages/ChatPage.tsx`, `src/components/layout/Header.tsx`, `src/index.css`
  - **Tiêu chí nghiệm thu (AC):** Sử dụng tốt trên mobile, không bị vỡ layout hay tràn ngang màn hình.
  - **Trạng thái:** ⚪ Chưa bắt đầu

- [ ] **Task 6.2: Kiểm Thử E2E Luồng Xác Thực & Quick-Fill**
  - **Mô tả:** Kiểm thử đăng nhập với Alice, Bob, Admin; kiểm thử đăng ký tài khoản mới; kiểm thử xử lý lỗi 401 khi xóa token thủ công.
  - **File tác động:** Kiểm thử chức năng
  - **Tiêu chí nghiệm thu (AC):** Đạt 100% mục 1 trong Tiêu chí nghiệm thu PRD.
  - **Trạng thái:** ⚪ Chưa bắt đầu

- [ ] **Task 6.3: Kiểm Thử E2E Đăng Bài, Upload Ảnh & Bình Luận**
  - **Mô tả:** Đăng bài kèm ảnh với Alice; kiểm tra hiển thị ảnh trên Bảng tin; dùng Bob bình luận bài viết; kiểm tra chuông thông báo của Alice nhảy số tức thì.
  - **File tác động:** Kiểm thử chức năng
  - **Tiêu chí nghiệm thu (AC):** Đạt 100% mục 2 & 4 trong Tiêu chí nghiệm thu PRD.
  - **Trạng thái:** ⚪ Chưa bắt đầu

- [ ] **Task 6.4: Kiểm Thử E2E Chat Real-time 2 Chiều (Alice & Bob)**
  - **Mô tả:** Mở 2 cửa sổ trình duyệt (Thường & Ẩn danh). Alice chat với Bob -> Bob nhận tin tức thì không cần F5. Bob trả lời -> Alice nhận tin tức thì.
  - **File tác động:** Kiểm thử chức năng
  - **Tiêu chí nghiệm thu (AC):** Đạt 100% mục 3 trong Tiêu chí nghiệm thu PRD (< 100ms latency).
  - **Trạng thái:** ⚪ Chưa bắt đầu

- [ ] **Task 6.5: Rà Soát Code, Type-Check, Build Production & Bàn Giao**
  - **Mô tả:** Chạy `pnpm run lint` và `pnpm run build` (`tsc -b && vite build`) đảm bảo 0 lỗi TypeScript và 0 lỗi Lint. Cập nhật `README.md` hướng dẫn chạy dự án.
  - **File tác động:** Toàn bộ dự án, `README.md`
  - **Tiêu chí nghiệm thu (AC):** Build production thành công sạch sẽ, sẵn sàng triển khai.
  - **Trạng thái:** ⚪ Chưa bắt đầu

---

## 4. 🔗 Bảng Ánh Xạ Endpoint & Socket Event (Mapping Matrix)

| Chức Năng | Giao Thức | Endpoint / Event Name | Payload / Params | Phụ Trách Task |
| :--- | :---: | :--- | :--- | :---: |
| Đăng ký | HTTP POST | `/api/v1/auth/register` | `{ email, password, name }` | Task 2.2, 2.4 |
| Đăng nhập | HTTP POST | `/api/v1/auth/login` | `{ email, password }` | Task 2.2, 2.3 |
| Danh bạ người dùng | HTTP GET | `/api/v1/users` | `?search=&limit=` | Task 4.2, 5.2 |
| Hồ sơ cá nhân | HTTP GET | `/api/v1/users/profile` | _None_ | Task 5.2, 5.3 |
| Cập nhật hồ sơ | HTTP PATCH | `/api/v1/users/profile` | `{ name?, bio?, location? }` | Task 5.2, 5.3 |
| Upload Avatar | HTTP POST | `/api/v1/users/avatar` | FormData (`avatar`) | Task 5.2, 5.3 |
| Hồ sơ công khai | HTTP GET | `/api/v1/users/:id` | `Param: id` | Task 5.2, 5.4 |
| Newsfeed cursor | HTTP GET | `/api/v1/posts/feed` | `?cursor=&take=&search=` | Task 3.1, 3.4 |
| Upload ảnh post | HTTP POST | `/api/v1/posts/upload-images` | FormData (`images`, max 5) | Task 3.1, 3.2 |
| Tạo bài viết | HTTP POST | `/api/v1/posts` | `{ title, content, published }` | Task 3.1, 3.2 |
| Xóa bài viết | HTTP DELETE | `/api/v1/posts/:id` | `Param: id` | Task 3.1, 3.3 |
| Danh sách bình luận | HTTP GET | `/api/v1/posts/:postId/comments` | `?cursor=&limit=` | Task 3.1, 3.5 |
| Gửi bình luận | HTTP POST | `/api/v1/posts/:postId/comments` | `{ content }` | Task 3.1, 3.5 |
| Xóa bình luận | HTTP DELETE | `/api/v1/comments/:id` | `Param: id` | Task 3.1, 3.5 |
| DS cuộc trò chuyện | HTTP GET | `/api/v1/chat/conversations` | _None_ | Task 4.1, 4.2 |
| Lịch sử tin nhắn | HTTP GET | `/api/v1/chat/messages/:receiverId` | `?limit=50` | Task 4.1, 4.3 |
| Đánh dấu đọc chat | HTTP PATCH | `/api/v1/chat/messages/:senderId/read` | `Param: senderId` | Task 4.1, 4.6 |
| DS thông báo | HTTP GET | `/api/v1/notifications` | `?cursor=&limit=&isRead=` | Task 5.1 |
| Đọc tất cả thông báo | HTTP PATCH | `/api/v1/notifications/read-all` | _None_ | Task 5.1 |
| Đọc 1 thông báo | HTTP PATCH | `/api/v1/notifications/:id/read` | `Param: id` | Task 5.1 |
| Kết nối Socket | WS Handshake | `ws://localhost:3000/chat` | `auth: { token: 'Bearer ...' }` | Task 1.5 |
| Đăng ký nhận notif | WS Emit | `subscribe_notifications` | _None_ | Task 1.5, 5.1 |
| Gửi tin nhắn chat | WS Emit | `send_room_message` | `{ receiverId?, roomId?, content }`| Task 4.5 |
| Tham gia phòng | WS Emit | `join_room` | `{ roomId }` | Task 4.7 |
| Rời phòng | WS Emit | `leave_room` | `{ roomId }` | Task 4.7 |
| Nhận tin nhắn mới | WS On | `new_room_message` | Tin nhắn mới + sender info | Task 4.5 |
| Nhận thông báo mới | WS On | `new_notification` | Thông báo mới | Task 5.1 |

---

## 5. 📜 Quy Tắc Bắt Buộc Dành Cho AI Agent (Agent Execution Protocol)

Mọi AI Agent khi nhận lệnh thực hiện bất kỳ task nào trong dự án này **BẮT BUỘC** phải tuân thủ nghiêm ngặt quy trình 4 bước sau:

1. **Bước 1 (Đọc & Đối Chiếu Tài Liệu):**
   - Trước khi viết bất kỳ dòng mã nào, Agent phải đọc lại các file tài liệu liên quan trong `docs/`:
     - [`docs/PRD.md`](file:///Users/tanthanh/Documents/Project/nestjs-basic-frontend/docs/PRD.md): Nắm rõ hành vi người dùng và tiêu chí giao diện.
     - [`docs/integration-guide.md`](file:///Users/tanthanh/Documents/Project/nestjs-basic-frontend/docs/integration-guide.md): Nắm rõ quy cách gọi API, unwrap envelope, format socket event.
     - [`docs/api-spec.json`](file:///Users/tanthanh/Documents/Project/nestjs-basic-frontend/docs/api-spec.json): Đối chiếu schema request/response chính xác.
   - Kiểm tra `PLAN.md` để xác định task cần làm và các task phụ thuộc đã hoàn thành trước đó.

2. **Bước 2 (Thực Thi Chuẩn Xác):**
   - Tuân thủ thứ tự tuần tự của các Phase. Không nhảy cóc qua Phase sau khi Phase trước chưa hoàn thiện.
   - Code phải có type-safety, không dùng `any` bừa bãi.
   - Không được phá vỡ kiến trúc đã thống nhất (Zustand, Axios Interceptor, Tailwind CSS).

3. **Bước 3 (Kiểm Tra & Xác Minh):**
   - Chạy kiểm tra lint hoặc type-check (`tsc --noEmit` hoặc `pnpm build` hoặc test UI) để chắc chắn mã nguồn không phát sinh lỗi cú pháp hay gãy logic.

4. **Bước 4 (Cập Nhật Trạng Thái Dự Án Trong PLAN.md):**
   - Ngay sau khi hoàn thành task, Agent **BẮT BUỘC** phải mở file `PLAN.md` và:
     - Đổi trạng thái task từ `[ ]` sang `[x]`.
     - Chuyển trạng thái từ `⚪ Chưa bắt đầu` sang `🟢 Hoàn thành`.
     - Cập nhật số lượng task đã hoàn thành và phần trăm tiến độ trong **Bảng Theo Dõi Tiến Độ Tổng Quan (Mục 1)**.
     - Báo cáo rõ ràng cho người dùng về những việc đã làm và task kế tiếp cần thực hiện.
