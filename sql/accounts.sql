CREATE TABLE accounts  (
    id VARCHAR(50) PRIMARY KEY NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    status TINYINT DEFAULT 1,
    role TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE accounts ADD COLUMN gg_id VARCHAR(50) NULL;

ALTER TABLE accounts ADD is_active TINYINT DEFAULT 0;

CREATE TABLE profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    account_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    avatar VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(id)
);

ALTER TABLE profiles ADD COLUMN is_notify TINYINT DEFAULT 0;

-- create trigger when accounts is deleted then profiles is deleted

DELIMITER $$
CREATE TRIGGER accounts_delete
AFTER DELETE ON accounts
FOR EACH ROW
BEGIN
    DELETE FROM profiles WHERE account_id = OLD.id;
END;
$$
DELIMITER ;

