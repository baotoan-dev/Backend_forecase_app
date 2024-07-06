CREATE TRIGGER auto_add_platform AFTER INSERT ON keywords_notification
FOR EACH ROW
BEGIN
    DECLARE count INT;
    SELECT COUNT(*) INTO count FROM type_notification_platform WHERE account_id = NEW.account_id;
    IF count = 0 THEN
        INSERT INTO type_notification_platform (account_id, type) VALUES (NEW.account_id, 0);
    END IF;
END;