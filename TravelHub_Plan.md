# Lộ Trình Phát Triển TravelHub (ReactJS + Express + PostgreSQL + DevOps)

**Thời lượng:** 4 Tháng (16 tuần)
**Nguồn lực:** 1 tiếng / ngày (Khoảng 7 tiếng / tuần | Tổng 112 tiếng)
**Mục tiêu:** Clone hoàn toàn dự án TravelHub cũ, cấu trúc lại theo kiến trúc chuẩn Enterprise với hệ thống DevOps chuyên nghiệp.

---

## 🚀 BẠN NÊN LÀM GÌ ĐẦU TIÊN?
Với một dự án có quy mô chuẩn chỉnh thế này, nếu chỉ có 1h/ngày, nguyên tắc số 1 là: **Cài đặt mọi thứ theo cấu trúc chuẩn ngay từ ngày đầu tiên để không phải đập đi xây lại.**

**3 việc đầu tiên bạn cần bắt tay vào làm là:**
1. **Khởi tạo hệ thống (Scaffolding):** Tạo cấu trúc Monorepo hoặc 2 folder độc lập cho Frontend và Backend. Cài đặt các linter (ESLint, Prettier) để code luôn sạch.
2. **Setup Local Database bằng Docker:** Thay vì cài đặt PostgreSQL trực tiếp vào máy, hãy viết file `docker-compose.yml` để chạy DB (chuẩn bị sớm cho tư duy DevOps).
3. **Cấu hình ORM:** Định nghĩa các bảng vào code thông qua Prisma hoặc Drizzle ngay lập tức và chạy migration đầu tiên.

---

## 🎯 KẾ HOẠCH CHI TIẾT TUẦN 1 (NỀN TẢNG & AUTHENTICATION)

**Mục tiêu:** Có được bộ khung vững chắc cho ReactJS (FE), Express (BE), kết nối PostgreSQL và chạy thành công luồng Đăng ký / Đăng nhập từ đầu đến cuối.

- [ ] **Ngày 1: Setup Mã Nguồn & Môi Trường**
  - **Backend:** `npm init -y`, cài đặt Express, TypeScript, `@types/express`, `ts-node`, `nodemon`. Cấu hình `tsconfig.json`.
  - **Frontend:** Khởi tạo React TS bằng Vite (`npm create vite@latest frontend --template react-ts`). Cài Tailwind CSS. Cấu hình Git cho cả 2.

- [ ] **Ngày 2: Database & ORM (Prisma / Drizzle)**
  - Viết file `docker-compose.yml` chạy PostgreSQL. Chạy DB bằng `docker compose up -d`.
  - Cài đặt **Prisma** (hoặc Drizzle) cho BE. Dựa vào thiết kế, khai báo model `User` trong file schema.
  - Chạy câu lệnh tạo DB thực tế (`npx prisma migrate dev`).

- [ ] **Ngày 3: Backend Core Architecture & API Docs**
  - Cài đặt và cấu hình thư viện bảo mật: `helmet`, `cors`.
  - Thiết lập **Global Error Handler** cho Express.
  - Cài đặt `swagger-ui-express`. Viết Swagger Docs cho 1 API kiểm tra sức khỏe hệ thống: `GET /api/healthcheck`.
  - Chạy thử Postman xem BE đã ổn định chưa.

- [ ] **Ngày 4: Xác thực Backend (Auth API)**
  - Cài đặt `bcrypt` (băm mật khẩu) và `jsonwebtoken` (tạo token).
  - Viết API `POST /api/auth/register`: Nhận email/pass, mã hóa pass, lưu xuống bảng `users`.
  - Viết API `POST /api/auth/login`: Kiểm tra email, so sánh pass, trả về JWT Token.

- [ ] **Ngày 5: Frontend Core Architecture & UI Components**
  - Cài đặt React Router DOM, React Query (quản lý server state) và thư viện gọi API Axios.
  - Khởi tạo **Shadcn UI** (`npx shadcn-ui@latest init`). Tích hợp component `Button`, `Input`, `Form`.
  - Thiết lập cấu trúc thư mục FE chuẩn: `pages/`, `components/`, `services/`, `hooks/`.

- [ ] **Ngày 6: Xây dựng Giao Diện Frontend Auth**
  - Dựng UI trang Đăng nhập (`/login`) và Đăng ký (`/register`) cực mượt và hiện đại bằng Tailwind + Shadcn.
  - Bắt lỗi Form Validation (có thể dùng React Hook Form + Zod cho chuẩn Enterprise).

- [ ] **Ngày 7: E2E Authentication & Dockerize cơ bản**
  - Ghép nối Frontend gọi API Backend. Xử lý lưu JWT vào LocalStorage / Cookie sau khi đăng nhập thành công.
  - Cấu hình Axios Interceptors tự động đính kèm Token vào Header cho các request sau.
  - **Bước đệm DevOps:** Viết file `Dockerfile` đơn giản cho Backend để tập làm quen với Container.

---

## 📅 LỘ TRÌNH 4 THÁNG (HIGH-LEVEL ROADMAP)

Để đảm bảo hoàn thành dự án trong 4 tháng, bạn cần tuân thủ nghiêm ngặt tiến độ theo tuần:

### Phase 1: Nền tảng, Database & API (Tháng 1 - Tuần 1 đến 4)
- **Tuần 1:** Setup bộ khung, Database, ORM, API Authentication (như trên).
- **Tuần 2:** Migration toàn bộ Database Schema (Bảng Destinations, Tours, Bookings, v.v.). Viết API CRUD cho Tours và Destinations.
- **Tuần 3:** Viết API quản lý Đặt Tour (Bookings) và Đánh giá (Reviews). Cấu hình phân quyền (Role: User, Admin).
- **Tuần 4:** Áp dụng Unit Test cho API (Jest). Hoàn thiện toàn bộ Swagger API Docs.

### Phase 2: Client Interface & Tích Hợp (Tháng 2 - Tuần 5 đến 8)
- **Tuần 5:** Xây dựng Layout chính FE (Header, Footer, Navigation). Trang chủ: Fetch & Render danh sách Tour bằng React Query.
- **Tuần 6:** Trang chi tiết Tour, tính năng chọn số lượng ghế. 
- **Tuần 7:** Luồng thanh toán Booking. Trang User Profile & Lịch sử Đặt Tour.
- **Tuần 8:** Tích hợp tính năng Reviews (Hiển thị và viết review). Hoàn thiện luồng User thông thường.

### Phase 3: Nâng Cao & Admin Dashboard (Tháng 3 - Tuần 9 đến 12)
- **Tuần 9:** Dựng Layout Admin. Màn hình quản lý Tour (Tạo, Sửa, Xóa).
- **Tuần 10:** Màn hình quản lý Booking và User cho Admin.
- **Tuần 11:** Implement Real-time Chat bằng `Socket.io` (Hỗ trợ KH trực tuyến).
- **Tuần 12:** Tích hợp API Cổng thanh toán (Stripe / VNPay test). Tối ưu hóa API và Query.

### Phase 4: CI/CD, K8s & Observability (Tháng 4 - Tuần 13 đến 16)
- **Tuần 13 (CI & Docker):** Chuẩn hóa Dockerfile cho cả BE & FE. Viết pipeline **GitHub Actions** chạy lint, test, build và push Image lên Docker Hub.
- **Tuần 14 (IaC & K8s):** Dùng **Terraform** hoặc setup manual cụm Kubernetes (Minikube). Viết các file manifest (`Deployment`, `Service`, `Ingress`).
- **Tuần 15 (CD):** Cấu hình **ArgoCD** để triển khai tự động theo chuẩn GitOps.
- **Tuần 16 (Monitoring):** Cài đặt **Prometheus & Grafana** để xem biểu đồ RAM/CPU. Setup **ELK / Loki** để đọc log tập trung. Review và tổng kết.
