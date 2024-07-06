

ALTER TABLE applications ADD COLUMN IF NOT EXISTS description varchar(5000) DEFAULT NULL AFTER cv_url;

