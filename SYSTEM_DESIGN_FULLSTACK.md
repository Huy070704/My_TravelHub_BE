# System Design: TravelHub (ReactJS + Express + PostgreSQL)

## 1. Tổng quan hệ thống (System Overview)
Đây là bản thiết kế hệ thống TravelHub được cấu trúc lại hoàn toàn với Enterprise Tech Stack và tích hợp tư duy Vận hành/Triển khai tự động (DevOps Zero to Hero):
- **Frontend:** ReactJS (Single Page Application).
- **Backend:** NodeJS Express (RESTful API).
- **Database:** PostgreSQL (Relational Database mạnh mẽ).
- **DevOps & Cloud:** Git, Docker, Kubernetes, Terraform, CI/CD Pipeline, Monitoring.

---

## 2. Tech Stack Chi tiết

### 2.1. Frontend (Client-side)
- **Core Framework:** React 18, Vite.
- **Ngôn ngữ:** TypeScript.
- **State Management:** Redux Toolkit hoặc React Query (để quản lý server state hiệu quả).
- **Styling:** Tailwind CSS kết hợp với Radix UI / Shadcn.

### 2.2. Backend (Server-side)
- **Core Framework:** ExpressJS (Node.js).
- **Ngôn ngữ:** JavaScript / TypeScript.
- **Security:** Helmet, CORS, JWT Authentication.
- **ORM:** Drizzle ORM / Prisma.
- **Real-time:** Socket.io (cho tính năng Chat).
- **API Documentation:** Swagger UI Express.

### 2.3. Database
- **Core:** PostgreSQL 15+.
- **Database Migration:** Flyway hoặc Liquibase (Kiểm soát phiên bản của DB Schema).

---

## 3. Thiết kế Cơ sở dữ liệu (Database Schema)
Hệ thống sử dụng PostgreSQL. Dưới đây là liệt kê đầy đủ các bảng và các trường quan trọng:

### 3.1. Bảng `users` (Người dùng)
| Cột | Kiểu dữ liệu | Khóa | Ghi chú |
| --- | --- | --- | --- |
| id | UUID | PK | Khóa chính |
| email | VARCHAR(255) | UNIQUE| Email đăng nhập |
| password_hash | VARCHAR(255) | | Mật khẩu đã băm (Bcrypt) |
| full_name | VARCHAR(100) | | Tên hiển thị |
| role | VARCHAR(50) | | USER, ADMIN, STAFF |
| is_active | BOOLEAN | | Trạng thái tài khoản |
| created_at | TIMESTAMP | | Thời gian tạo |

### 3.2. Bảng `destinations` (Điểm đến)
| Cột | Kiểu dữ liệu | Khóa | Ghi chú |
| --- | --- | --- | --- |
| id | SERIAL | PK | Khóa chính tự tăng |
| name | VARCHAR(255) | | Tên điểm đến (VD: Đà Lạt) |
| country | VARCHAR(100) | | Quốc gia |
| description | TEXT | | Mô tả chi tiết |
| image_url | VARCHAR(500) | | Link ảnh bìa |

### 3.3. Bảng `tours` (Chuyến đi)
| Cột | Kiểu dữ liệu | Khóa | Ghi chú |
| --- | --- | --- | --- |
| id | UUID | PK | Khóa chính |
| destination_id| INT | FK | Trỏ đến `destinations.id` |
| title | VARCHAR(255) | | Tên chuyến đi |
| description | TEXT | | Mô tả |
| price | DECIMAL(12,2)| | Giá tiền |
| capacity | INT | | Số chỗ tối đa |
| available_seats| INT | | Số chỗ còn trống |
| start_date | DATE | | Ngày bắt đầu |
| end_date | DATE | | Ngày kết thúc |

### 3.4. Bảng `bookings` (Đặt tour)
| Cột | Kiểu dữ liệu | Khóa | Ghi chú |
| --- | --- | --- | --- |
| id | UUID | PK | Khóa chính |
| user_id | UUID | FK | Trỏ đến `users.id` |
| tour_id | UUID | FK | Trỏ đến `tours.id` |
| booking_date | TIMESTAMP | | Thời gian đặt |
| status | VARCHAR(50) | | PENDING, CONFIRMED, CANCELLED |
| total_price | DECIMAL(12,2)| | Tổng tiền cần thanh toán |

### 3.5. Bảng `payments` (Thanh toán)
| Cột | Kiểu dữ liệu | Khóa | Ghi chú |
| --- | --- | --- | --- |
| id | UUID | PK | Khóa chính |
| booking_id | UUID | FK | Trỏ đến `bookings.id` |
| amount | DECIMAL(12,2)| | Số tiền đã thanh toán |
| payment_method| VARCHAR(50) | | CREDIT_CARD, PAYPAL, VNPAY |
| payment_status| VARCHAR(50) | | SUCCESS, FAILED, REFUNDED |
| transaction_id| VARCHAR(255) | | Mã giao dịch từ cổng thanh toán |

### 3.6. Bảng `reviews` (Đánh giá)
| Cột | Kiểu dữ liệu | Khóa | Ghi chú |
| --- | --- | --- | --- |
| id | UUID | PK | Khóa chính |
| user_id | UUID | FK | Người đánh giá |
| tour_id | UUID | FK | Tour được đánh giá |
| rating | INT | | Điểm số (1-5) |
| comment | TEXT | | Bình luận |
| created_at | TIMESTAMP | | Thời gian đánh giá |

---

## 4. Tích hợp DevOps (Dựa trên "DevOps Zero to Hero")

Toàn bộ quy trình phát triển và vận hành (SDLC) được tự động hóa chuẩn DevOps:

### 4.1. Infrastructure as Code (IaC) - Terraform
- Sử dụng **Terraform** để cấp phát tài nguyên tự động trên Cloud (AWS/GCP).
- Hạ tầng bao gồm: 
  - **VPC** (Virtual Private Cloud) chia ra Public/Private Subnets để bảo mật.
  - Cụm **EKS (Elastic Kubernetes Service)** nằm ở vùng Public/Private để chạy ứng dụng.
  - **AWS RDS cho PostgreSQL** nằm ở vùng Private Subnet (chỉ Backend mới có thể gọi tới DB).

### 4.2. CI/CD Pipeline (GitHub Actions / Jenkins)
- **Continuous Integration (CI):**
  1. Code được push lên nhánh `main` hoặc tạo PR.
  2. Pipeline tự động chạy Unit Tests (Jest cho Node.js, Jest cho React).
  3. Quét lỗi bảo mật bằng SonarQube.
  4. Nếu Pass -> Build **Docker Image** thông qua `Dockerfile`.
  5. Push Docker Image lên **Docker Hub** hoặc **AWS ECR** kèm tag version (`v1.0.0`, `latest`).
  
- **Continuous Deployment (CD - GitOps):**
  1. Sử dụng **ArgoCD** (chuẩn GitOps) luôn theo dõi sự thay đổi của repository cấu hình K8s.
  2. Ngay khi có Image Tag mới, ArgoCD tự động Pull và Apply thay đổi lên cụm Kubernetes.

### 4.3. Kubernetes (K8s) Orchestration
Thay vì chạy bằng lệnh `docker run` thủ công, hệ thống quản lý Container bằng K8s:
- **Deployments:** Đảm bảo luôn có 3 replicas (3 pods) cho Backend và 2 replicas cho Frontend để chạy High Availability (HA).
- **Services:** Expose các Pods nội bộ thông qua ClusterIP hoặc NodePort.
- **Ingress Controller (Nginx Ingress):** Là cửa ngõ duy nhất nhận traffic từ Internet, phân luồng theo path:
  - `/api/*` -> `backend-service`
  - `/` -> `frontend-service`
- **ConfigMaps & Secrets:** Quản lý an toàn các thông tin cấu hình (như DB_URL) và mật khẩu (JWT_SECRET, DB_PASSWORD) dưới dạng mã hóa Base64.

### 4.4. Observability (Monitoring & Logging)
- **Prometheus & Grafana:** Express tích hợp thư viện `prom-client` để expose số liệu (CPU, RAM, API load time) cho Prometheus scrape. Dữ liệu này hiển thị dashboard đồ thị trên Grafana.
- **ELK Stack (Elasticsearch, Logstash, Kibana) / Loki:** Thu thập Log của tất cả các Pods K8s (Log React, Log Node.js Error) đưa về 1 màn hình duy nhất để dễ dàng dò tìm (trace) bug khi có sự cố.

---

## 5. Tóm tắt luồng xử lý thực tế (End-to-End Flow)
1. User nhập `travelhub.com` trên trình duyệt.
2. Request chạm tới **AWS Route 53 (DNS)**, trỏ về **AWS Load Balancer**.
3. Load Balancer chuyển request xuống **K8s Nginx Ingress**.
4. Ingress điều hướng request về **ReactJS Pod**. Frontend tải giao diện cho người dùng.
5. User bấm nút "Đặt Tour". ReactJS gọi API `POST /api/bookings`.
6. Request lại qua Ingress, vào **Express Pod**.
7. Express thực thi logic, kết nối xuống **AWS RDS (PostgreSQL)** để trừ chỗ và ghi nhận `bookings`.
8. Trả kết quả về cho ReactJS để thông báo Đặt Tour thành công. Log quá trình chạy được lưu xuống **ELK/Loki**, metrics được ghi nhận bởi **Prometheus**.

---

## 6. Kế Hoạch Triển Khai 4 Tháng (1 Giờ/Ngày)
Với quỹ thời gian 1 giờ/ngày, tổng cộng chúng ta có khoảng 120 giờ thực tế. Kế hoạch này tập trung cốt lõi vào tính năng MVP trước, phần DevOps nâng cao sẽ đưa về tháng cuối.

### Tháng 1: Nền tảng Backend & Cơ sở dữ liệu (30 giờ)
- **Tuần 1:** Khởi tạo dự án BE (Express, TypeScript). Setup kết nối PostgreSQL qua Prisma hoặc Drizzle.
- **Tuần 2:** Tạo và chạy Migration cho các bảng cơ sở dữ liệu (`users`, `destinations`, `tours`).
- **Tuần 3:** Xây dựng API Authentication (Đăng ký, Đăng nhập JWT) và Middleware phân quyền (Role-based).
- **Tuần 4:** Xây dựng API CRUD cơ bản cho Destinations và Tours. Test API bằng Postman/Swagger.

### Tháng 2: Nền tảng Frontend & Kết nối (30 giờ)
- **Tuần 1:** Khởi tạo React/Vite. Cấu hình TailwindCSS và Shadcn UI. Thiết lập Routing (React Router).
- **Tuần 2:** Xây dựng UI Đăng nhập/Đăng ký. Gọi API Auth và lưu token, quản lý State người dùng.
- **Tuần 3:** Xây dựng trang chủ, danh sách Tour. Fetch API từ Backend hiển thị danh sách.
- **Tuần 4:** Xây dựng giao diện trang Chi tiết Tour và hoàn thiện luồng Navigation.

### Tháng 3: Tính năng Cốt lõi & Thanh toán (30 giờ)
- **Tuần 1:** Xây dựng luồng Đặt Tour (Booking API trên BE và UI Booking trên FE).
- **Tuần 2:** Tích hợp Payment Gateway (ví dụ Stripe/VNPay sandbox) vào Backend.
- **Tuần 3:** Hoàn thành UI xử lý Thanh toán (Success/Cancel page) trên Frontend.
- **Tuần 4:** Xây dựng tính năng Review, đánh giá Tour và luồng xem lịch sử Đặt Tour của User.

### Tháng 4: Tối ưu & Cơ bản DevOps (30 giờ)
- **Tuần 1:** Đóng gói Docker (viết Dockerfile cho FE và BE, tạo `docker-compose.yml` chạy local).
- **Tuần 2:** Tối ưu hóa UI/UX, fix bug, cleanup code.
- **Tuần 3:** Deploy Backend (Render / Railway) và Database (Supabase / Render). Deploy Frontend (Vercel / Netlify).
- **Tuần 4:** (Tùy chọn) Setup CI/CD GitHub Actions cơ bản. *Lưu ý: Kubernetes & Terraform sẽ rất nặng cho 1h/ngày, nên chỉ ưu tiên nếu dư thời gian.*
