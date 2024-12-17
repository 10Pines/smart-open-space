CREATE TABLE auth_session
(
    id         VARCHAR(255) NOT NULL,
    token      VARCHAR(255),
    created_on TIMESTAMP WITHOUT TIME ZONE,
    expires_on TIMESTAMP WITHOUT TIME ZONE,
    revoked    BOOLEAN      NOT NULL,
    user_id    BIGINT,
    CONSTRAINT pk_authsession PRIMARY KEY (id)
);

ALTER TABLE auth_session
    ADD CONSTRAINT uc_authsession_token UNIQUE (token);

ALTER TABLE auth_session
    ADD CONSTRAINT FK_AUTHSESSION_ON_USER FOREIGN KEY (user_id) REFERENCES users (id);