CREATE TABLE companies_notification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id varchar(50) NOT NULL,
    company_id INT NOT NULL,
    company_name varchar(255) NOT NULL,
    message TEXT NOT NULL,
    is_read tinyint(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    FOREIGN KEY (company_id) REFERENCES companies (id),
    FOREIGN KEY (sender_id) REFERENCES accounts (id)
);