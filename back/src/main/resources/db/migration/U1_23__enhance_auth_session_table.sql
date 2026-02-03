ALTER TABLE auth_session
    ADD token VARCHAR(455);

ALTER TABLE auth_session
    ADD CONSTRAINT uc_authsession_token UNIQUE (token);

ALTER TABLE auth_session DROP COLUMN token_id;
