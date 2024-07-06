CREATE TABLE app_version (
    version VARCHAR(50) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    is_force_update BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (version, platform)
)

INSERT INTO app_version (version, platform, is_force_update) VALUES ('1.0.0', 'android', TRUE);