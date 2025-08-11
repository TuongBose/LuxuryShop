CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    type VARCHAR(50),
    is_read BIT DEFAULT FALSE,
    NGAYTAO DATETIME NOT NULL,
    CHINHSUA DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES accounts(userid) ON DELETE CASCADE
);

--INSERT INTO notifications (user_id, title, content, type, is_read, NGAYTAO,CHINHSUA)
--VALUES (1, 'Test Notification', 'Đây là thông báo test', 'INFO', FALSE, NOW(),NOW());