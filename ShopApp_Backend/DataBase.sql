CREATE DATABASE shopapp;
USE shopapp;

-- TẠO BẢNG
CREATE TABLE loaisanpham 
(
    MALOAISANPHAM INT PRIMARY KEY AUTO_INCREMENT,
    TENLOAISANPHAM VARCHAR(255) NOT NULL
);

CREATE TABLE thuonghieu
(
    MATHUONGHIEU INT PRIMARY KEY AUTO_INCREMENT,
    TENTHUONGHIEU VARCHAR(40)
);

CREATE TABLE sanpham 
(
    MASANPHAM INT PRIMARY KEY AUTO_INCREMENT,
    TENSANPHAM VARCHAR(255) NOT NULL,
    GIA INT NOT NULL,
    MATHUONGHIEU INT NOT NULL,
    MOTA VARCHAR(500) DEFAULT '',
    SOLUONGTONKHO INT,
    NGAYTAO DATETIME,
    CHINHSUA DATETIME,
    MALOAISANPHAM INT,
    THUMBNAIL VARCHAR(300) DEFAULT '',
    CONSTRAINT fk_loaisanpham FOREIGN KEY (MALOAISANPHAM) REFERENCES loaisanpham(MALOAISANPHAM),
    CONSTRAINT fk_mathuonghieu FOREIGN KEY (MATHUONGHIEU) REFERENCES thuonghieu(MATHUONGHIEU)
);

CREATE TABLE hinhanh
(
    ID INT PRIMARY KEY AUTO_INCREMENT,
    MASANPHAM INT,
    MALOAISANPHAM INT,
    TENHINHANH VARCHAR(300),
    CONSTRAINT fk_hinhanh_sanpham FOREIGN KEY(MASANPHAM) REFERENCES sanpham(MASANPHAM) ON DELETE CASCADE,
    CONSTRAINT fk_hinhanh_loaisanpham FOREIGN KEY(MALOAISANPHAM) REFERENCES loaisanpham(MALOAISANPHAM) ON DELETE CASCADE
);

CREATE TABLE accounts
(
    USERID INT PRIMARY KEY AUTO_INCREMENT,
    PASSWORD VARCHAR(255) NOT NULL,
    EMAIL VARCHAR(255) DEFAULT '',
    FULLNAME VARCHAR(255) DEFAULT '',
    DIACHI VARCHAR(255) DEFAULT '',
    SODIENTHOAI VARCHAR(15) NOT NULL,
    NGAYTAO DATETIME,
    CHINHSUA DATETIME,
    NGAYSINH DATE,
    profile_image VARCHAR(500) DEFAULT NULL,
    IS_ACTIVE BIT DEFAULT 1,
    FACEBOOK_ACCOUNT_ID VARCHAR(100) DEFAULT NULL,
    GOOGLE_ACCOUNT_ID VARCHAR(100) DEFAULT NULL,
    ROLENAME BIT
);

CREATE TABLE tokens
(
    TOKEN_ID INT PRIMARY KEY AUTO_INCREMENT,
    TOKEN VARCHAR(500) UNIQUE NOT NULL,
    TOKEN_TYPE VARCHAR(100) NOT NULL,
    EXPIRATION_DATE DATETIME,
    REVOKED BIT DEFAULT 1,
    EXPIRED BIT DEFAULT 1,
    USERID INT,
    CONSTRAINT fk_tokens_accounts FOREIGN KEY (USERID) REFERENCES accounts(USERID)
);

CREATE TABLE social_accounts
(
    SOCIAL_ACCOUNT_ID INT PRIMARY KEY AUTO_INCREMENT,
    PROVIDER VARCHAR(20) NOT NULL COMMENT 'tên nhà social network',
    PROVIDER_ID VARCHAR(50) NOT NULL,
    EMAIL VARCHAR(150) NOT NULL COMMENT 'email tài khoản',
    NAME VARCHAR(100) NOT NULL COMMENT 'tên người dùng',
    USERID INT,
    CONSTRAINT fk_social_accounts_accounts FOREIGN KEY (USERID) REFERENCES accounts(USERID)
);

CREATE TABLE donhang (
    MADONHANG INT PRIMARY KEY AUTO_INCREMENT,
    USERID INT,
    FULLNAME VARCHAR(100) NOT NULL,
    EMAIL VARCHAR(100) DEFAULT '',
    SODIENTHOAI VARCHAR(15) NOT NULL,
    DIACHI VARCHAR(200) NOT NULL,
    GHICHU VARCHAR(100) DEFAULT '',
    TRANGTHAI ENUM('Chưa xử lý', 'Đang xử lý', 'Đang vận chuyển', 'Giao hàng thành công', 'Đã hủy'),
    NGAYDATHANG DATE,
    TONGTIEN INT CHECK(TONGTIEN >= 0),
    PHUONGTHUCTHANHTOAN VARCHAR(100),
    IS_ACTIVE BIT DEFAULT 1,
    CONSTRAINT fk_donhang_accounts FOREIGN KEY (USERID) REFERENCES accounts(USERID)
);

CREATE TABLE chitietdonhang (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    MADONHANG INT NOT NULL,
    MASANPHAM INT NOT NULL,
    SOLUONG INT NOT NULL,
    GIABAN INT NOT NULL CHECK(GIABAN >= 0),
    TONGTIEN INT NOT NULL CHECK(TONGTIEN >= 0),
    CONSTRAINT fk_donhang FOREIGN KEY (MADONHANG) REFERENCES donhang(MADONHANG),
    CONSTRAINT fk_sanpham FOREIGN KEY (MASANPHAM) REFERENCES sanpham(MASANPHAM)
);

CREATE TABLE feedback (
    FEEDBACKID INT PRIMARY KEY AUTO_INCREMENT,
    USERID INT,
    NOIDUNG VARCHAR(255) NOT NULL,
    SOSAO INT NOT NULL,
    MASANPHAM INT,
    CONSTRAINT fk_spfb FOREIGN KEY (MASANPHAM) REFERENCES sanpham(MASANPHAM),
    CONSTRAINT fk_feedback_accounts FOREIGN KEY (USERID) REFERENCES accounts(USERID)
);

-- Example data

INSERT INTO loaisanpham (TENLOAISANPHAM) VALUES
('Điện thoại'),
('Máy tính xách tay'),
('Tai nghe'),
('Đồng hồ thông minh'),
('Phụ kiện'),
('Máy ảnh'),
('Loa Bluetooth');

INSERT INTO thuonghieu (TENTHUONGHIEU) VALUES
('Apple'),
('Samsung'),
('Xiaomi'),
('Sony'),
('Huawei'),
('Dell'),
('JBL');

INSERT INTO sanpham (TENSANPHAM, GIA, MATHUONGHIEU, MOTA, SOLUONGTONKHO, NGAYTAO, CHINHSUA, MALOAISANPHAM, THUMBNAIL) VALUES
('iPhone 14', 22000000, 1, 'Smartphone cao cấp với camera chất lượng cao', 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 'iphone14_thumbnail.jpg'),
('Samsung Galaxy S23', 18000000, 2, 'Thiết kế hiện đại, hiệu năng mạnh mẽ', 45, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 'galaxy_s23_thumbnail.jpg'),
('Xiaomi 13', 12000000, 3, 'Điện thoại giá rẻ nhưng hiệu suất tốt', 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 'xiaomi13_thumbnail.jpg'),
('Sony WH-1000XM5', 8000000, 4, 'Tai nghe chống ồn hàng đầu', 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 'wh1000xm5_thumbnail.jpg'),
('Huawei Watch GT 3', 5000000, 5, 'Đồng hồ thông minh với thiết kế sang trọng', 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 'watch_gt3_thumbnail.jpg'),
('Dell XPS 13', 25000000, 6, 'Máy tính xách tay mỏng nhẹ, hiệu năng cao', 25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 'xps13.jpg'),
('JBL Charge 5', 4000000, 7, 'Loa Bluetooth chống nước, âm thanh mạnh mẽ', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 'jbl_charge5.jpg'),
('iPhone 13 Mini', 18000000, 1, 'Phiên bản nhỏ gọn của iPhone 13', 35, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 'iphone13mini.jpg'),
('Samsung Galaxy Z Fold 4', 30000000, 2, 'Điện thoại màn hình gập cao cấp', 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 'zfold4.jpg'),
('Xiaomi Mi Band 7', 1000000, 3, 'Dây đeo thông minh giá rẻ', 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 'miband7.jpg'),
('Sony Alpha A7 IV', 45000000, 4, 'Máy ảnh mirrorless chuyên nghiệp', 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 'a7iv.jpg'),
('Huawei MateBook 14', 20000000, 5, 'Laptop sang trọng với màn hình 2K', 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 'matebook14.jpg'),
('JBL Flip 6', 2500000, 7, 'Loa Bluetooth nhỏ gọn, chất lượng âm thanh tốt', 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 'jbl_flip6.jpg'),
('Apple Watch Series 8', 12000000, 1, 'Đồng hồ thông minh với nhiều tính năng sức khỏe', 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 'watch_series8.jpg'),
('Samsung Galaxy Tab S8', 15000000, 2, 'Máy tính bảng hiệu năng cao', 35, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 'tab_s8.jpg'),
('Xiaomi Redmi Note 12', 5000000, 3, 'Điện thoại giá rẻ với camera tốt', 90, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 'redmi_note12.jpg'),
('Sony Xperia 5 IV', 20000000, 4, 'Điện thoại chuyên nghiệp với màn hình 4K', 25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 'xperia5iv.jpg'),
('Huawei P50 Pro', 18000000, 5, 'Camera đỉnh cao, thiết kế tinh tế', 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 'p50pro.jpg'),
('Dell Inspiron 15', 15000000, 6, 'Laptop phổ thông cho công việc và giải trí', 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 'inspiron15.jpg'),
('JBL Boombox 2', 10000000, 7, 'Loa Bluetooth siêu bass, pin lâu', 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 'boombox2.jpg');

INSERT INTO hinhanh(MASANPHAM, MALOAISANPHAM, TENHINHANH) VALUES
(1,1,'iphone14_1.jpg'),
(1,1,'iphone14_2.jpg'),
(1,1,'iphone14_3.jpg'),
(1,1,'iphone14_4.jpg'),
(1,1,'iphone14_5.jpg'),
(1,1,'iphone14_6.jpg'),
(1,1,'iphone14_7.jpg'),
(2,1,'samsung-galaxy-s23-plus-kem-1-750x500.jpg'),
(2,1,'samsung-galaxy-s23-plus-kem-2-750x500.jpg'),
(2,1,'samsung-galaxy-s23-plus-kem-3-750x500.jpg'),
(2,1,'samsung-galaxy-s23-plus-kem-4-750x500.jpg'),
(2,1,'samsung-galaxy-s23-plus-kem-5-750x500.jpg'),
(2,1,'samsung-galaxy-s23-plus-kem-6-750x500.jpg'),
(2,1,'samsung-galaxy-s23-plus-kem-7-750x500.jpg'),
(3,1,'xiaomi-13t-xanh-1-750x500.jpg'),
(3,1,'xiaomi-13t-xanh-2-750x500.jpg'),
(3,1,'xiaomi-13t-xanh-3-750x500.jpg'),
(3,1,'xiaomi-13t-xanh-4-750x500.jpg'),
(3,1,'xiaomi-13t-xanh-5-750x500.jpg'),
(3,1,'xiaomi-13t-xanh-6-750x500.jpg'),
(3,1,'xiaomi-13t-xanh-7-750x500.jpg'),
(3,1,'xiaomi-13t-xanh-1-750x500.jpg'),
(4,3,'tai-nghe-bluetooth-chup-tai-sony-wh1000xm5-hong-1-638633907635054552-750x500.jpg'),
(4,3,'tai-nghe-bluetooth-chup-tai-sony-wh1000xm5-hong-2-638633907635054552-750x500.jpg'),
(4,3,'tai-nghe-bluetooth-chup-tai-sony-wh1000xm5-hong-3-638633907635054552-750x500.jpg'),
(4,3,'tai-nghe-bluetooth-chup-tai-sony-wh1000xm5-hong-4-638633907635054552-750x500.jpg'),
(5,4,'huawei-watch-gt-5-pro-41mm-vien-gom-day-cao-su-1-638627745851000718-750x500.jpg'),
(5,4,'huawei-watch-gt-5-pro-41mm-vien-gom-day-cao-su-2-638627745851000718-750x500.jpg'),
(5,4,'huawei-watch-gt-5-pro-41mm-vien-gom-day-cao-su-3-638627745851000718-750x500.jpg'),
(5,4,'huawei-watch-gt-5-pro-41mm-vien-gom-day-cao-su-4-638627745851000718-750x500.jpg'),
(5,4,'huawei-watch-gt-5-pro-41mm-vien-gom-day-cao-su-5-638627745851000718-750x500.jpg');