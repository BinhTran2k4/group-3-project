# Dự án Quản lý User Nâng cao (MERN Stack)

Đây là dự án full-stack MERN (MongoDB, Express, React, Node.js) xây dựng một hệ thống quản lý người dùng hoàn chỉnh. Ứng dụng này bao gồm các tính năng xác thực nâng cao, phân quyền, upload ảnh, gửi email thật, và nhiều hơn nữa.

Dự án này là sản phẩm của **(Nhóm 3/ Phát triển phần mềm mã nguồn mở)**.

## ✨ Các tính năng chính

* **Xác thực (Hoạt động 1):** Đăng ký, đăng nhập sử dụng JWT (Access Token + Refresh Token).
* **Phân quyền (Hoạt động 2):** Hệ thống RBAC với 3 cấp độ: `User`, `Admin`, và `Moderator`.
    * **Admin:** Có toàn quyền, bao gồm xem log và quản lý tất cả user.
    * **Moderator:** Có thể xem và quản lý `User`, nhưng không thể chỉnh sửa `Admin`.
* **Upload ảnh (Hoạt động 3):** Người dùng có thể upload ảnh đại diện (avatar). Ảnh được resize (dùng `sharp`) và lưu trữ trên **Cloudinary**.
* **Email (Hoạt động 4):** Chức năng "Quên mật khẩu" và "Reset mật khẩu" bằng cách gửi email thật qua **Gmail SMTP** (dùng `Nodemailer`).
* **Bảo mật & Giám sát (Hoạt động 5):**
    * **Logging:** Ghi lại các hoạt động quan trọng (đăng nhập thành công, thất bại, xóa user) vào database.
    * **Rate Limiting:** Chống tấn công brute-force vào API đăng nhập.
* **Frontend Nâng cao (Hoạt động 6):**
    * Quản lý trạng thái toàn cục bằng **Redux Toolkit**.
    * Sử dụng **Protected Routes** để chặn truy cập trái phép vào các trang cá nhân và quản trị.

## 💻 Công nghệ sử dụng

* **Backend:** Node.js, Express.js, MongoDB (với Mongoose)
* **Frontend:** React, React Router, Redux Toolkit, Axios
* **Xác thực:** JSON Web Token (JWT), bcrypt.js
* **Dịch vụ bên thứ ba:** Cloudinary (lưu trữ ảnh), Nodemailer (gửi email)
* **Bảo mật:** `express-rate-limit`, `cors`

---

## 🚀 Hướng dẫn Cài đặt & Khởi chạy

Để chạy dự án này, bạn cần khởi động cả server **Backend** và **Frontend** cùng một lúc.

### 1. Yêu cầu Hệ thống

Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt:
* [Node.js](https://nodejs.org/) (phiên bản 18+ được khuyến nghị)
* `npm` (thường đi kèm với Node.js)
* Tài khoản **MongoDB Atlas** (để lấy chuỗi kết nối URI).
* Tài khoản **Cloudinary** (để lấy API keys).
* Tài khoản **Gmail** đã bật "Mật khẩu Ứng dụng" (App Password).

### 2. Cài đặt Dự án

1.  **Tải mã nguồn (Clone repo):**
    ```bash
    git clone [https://github.com/ten-cua-ban/ten-repo-cua-ban.git](https://github.com/ten-cua-ban/ten-repo-cua-ban.git)
    cd ten-repo-cua-ban
    ```

2.  **Cài đặt Backend (Thư mục `backend`):**
   * Di chuyển vào thư mục backend và cài đặt các gói thư viện:
        ```bash
        cd backend
npm install
        ```
    * Tạo một file tên là `.env` trong thư mục `backend`. Sao chép và dán toàn bộ nội dung dưới đây vào, sau đó **thay thế bằng thông tin của bạn**:

        ```env
        # Kết nối MongoDB Atlas
        MONGO_URI="mongodb+srv://ten_user:mat_khau@cluster-cua-ban.mongodb.net/ten-database"

        # Khóa bí mật cho JWT (hãy tự nghĩ ra một chuỗi phức tạp)
        JWT_SECRET="DAYLAMOTCHUOIBAOMATSIEUPHUCTAP123!@#"

        # Địa chỉ của ứng dụng Frontend (để tạo link trong email)
        FRONTEND_URL="http://localhost:5173"

        # --- Thông tin gửi email (Gmail SMTP) ---
        EMAIL_HOST=smtp.gmail.com
        EMAIL_PORT=587
        EMAIL_USER=email-gmail-cua-ban@gmail.com
        EMAIL_PASS=mat_khau_ung_dung_16_ky_tu_cua_ban

        # --- Cấu hình Cloudinary ---
        CLOUDINARY_CLOUD_NAME=ten-cloud-name-cua-ban
        CLOUDINARY_API_KEY=api-key-cloudinary-cua-ban
        CLOUDINARY_API_SECRET=api-secret-cloudinary-cua-ban
        ```

3.  **Cài đặt Frontend (Thư mục `frontend`):**

    * Mở một cửa sổ **Terminal MỚI**.
    * Di chuyển vào thư mục frontend và cài đặt các gói thư viện:
        ```bash
        cd frontend
        npm install
        ```
    * (Frontend không cần file `.env` vì `axiosInstance` đã được cấu hình để gọi API tại `http://localhost:3000/api`).

### 3. Khởi chạy Ứng dụng

Bạn cần **chạy cả hai terminal** này cùng một lúc.

* **Terminal 1 (Chạy Backend):**
    ```bash
    cd backend
    node server.js
    ```
    *Server sẽ chạy tại `http://localhost:3000`*

* **Terminal 2 (Chạy Frontend):**
    ```bash
    cd frontend
    npm run dev
    ```
    *Ứng dụng sẽ tự động mở tại `http://localhost:5173` (hoặc một cổng khác do Vite chỉ định).*

### 4. Sử dụng Ứng dụng

1.  Truy cập `http://localhost:5173` trên trình duyệt.
2.  Tạo một tài khoản mới (mặc định sẽ có vai trò `user`).
3.  **Quan trọng:** Để truy cập các chức năng quản lý, hãy sử dụng MongoDB Compass hoặc Atlas để **thay đổi thủ công** trường `role` của tài khoản bạn vừa tạo thành `"admin"` hoặc `"moderator"`.
4.  Đăng nhập lại bằng tài khoản admin/moderator đó để thấy các link "Quản lý Users" và "Nhật ký" trên thanh điều hướng.
5.  Test tất cả các chức năng.

