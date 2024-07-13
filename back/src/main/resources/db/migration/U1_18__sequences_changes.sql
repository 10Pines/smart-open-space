CREATE SEQUENCE IF NOT EXISTS hibernate_sequence;

ALTER TABLE assigned_slot
    ALTER COLUMN id SET NOT NULL;
ALTER TABLE assigned_slot
    ALTER COLUMN id SET DEFAULT nextval('hibernate_sequence');

ALTER SEQUENCE hibernate_sequence OWNED BY assigned_slot.id;

ALTER TABLE document
    ALTER COLUMN id SET NOT NULL;
ALTER TABLE document
    ALTER COLUMN id SET DEFAULT nextval('hibernate_sequence');

ALTER SEQUENCE hibernate_sequence OWNED BY document.id;

ALTER TABLE open_space
    ALTER COLUMN id SET NOT NULL;
ALTER TABLE open_space
    ALTER COLUMN id SET DEFAULT nextval('hibernate_sequence');

ALTER SEQUENCE hibernate_sequence OWNED BY open_space.id;

ALTER TABLE review
    ALTER COLUMN id SET NOT NULL;
ALTER TABLE review
    ALTER COLUMN id SET DEFAULT nextval('hibernate_sequence');

ALTER SEQUENCE hibernate_sequence OWNED BY review.id;

ALTER TABLE room
    ALTER COLUMN id SET NOT NULL;
ALTER TABLE room
    ALTER COLUMN id SET DEFAULT nextval('hibernate_sequence');

ALTER SEQUENCE hibernate_sequence OWNED BY room.id;

ALTER TABLE slot
    ALTER COLUMN id SET NOT NULL;
ALTER TABLE slot
    ALTER COLUMN id SET DEFAULT nextval('hibernate_sequence');

ALTER SEQUENCE hibernate_sequence OWNED BY slot.id;

ALTER TABLE talk
    ALTER COLUMN id SET NOT NULL;
ALTER TABLE talk
    ALTER COLUMN id SET DEFAULT nextval('hibernate_sequence');

ALTER SEQUENCE hibernate_sequence OWNED BY talk.id;

ALTER TABLE track
    ALTER COLUMN id SET NOT NULL;
ALTER TABLE track
    ALTER COLUMN id SET DEFAULT nextval('hibernate_sequence');

ALTER SEQUENCE hibernate_sequence OWNED BY track.id;

ALTER TABLE users
    ALTER COLUMN id SET NOT NULL;
ALTER TABLE users
    ALTER COLUMN id SET DEFAULT nextval('hibernate_sequence');

ALTER SEQUENCE hibernate_sequence OWNED BY users.id;