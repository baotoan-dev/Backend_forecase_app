ALTER TABLE post_notification ADD COLUMN IF NOT EXISTS type tinyint(4) NOT NULL DEFAULT 0 AFTER is_read;

-- modify column type to varchar(10)

ALTER TABLE post_notification modify column type varchar(10) NOT NULL DEFAULT '3';

UPDATE post_notification SET type = '3' WHERE id != 6825;