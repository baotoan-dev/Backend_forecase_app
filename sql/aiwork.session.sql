CREATE TRIGGER limit_keyword BEFORE INSERT ON keywords_notification
FOR EACH ROW
BEGIN
    DECLARE count INT;
    SELECT COUNT(*) INTO count FROM keywords_notification WHERE account_id = NEW.account_id;
    IF count >= 10 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'You can only add 10 keywords';
    END IF;
END;