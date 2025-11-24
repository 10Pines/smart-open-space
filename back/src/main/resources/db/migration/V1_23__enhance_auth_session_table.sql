ALTER TABLE auth_session
    ADD token_id VARCHAR(40);

ALTER TABLE auth_session
    ADD CONSTRAINT uc_authsession_tokenid UNIQUE (token_id);

ALTER TABLE auth_session DROP COLUMN token;
