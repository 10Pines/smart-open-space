CREATE SEQUENCE IF NOT EXISTS assigned_slot_id_seq;
ALTER TABLE assigned_slot
    ALTER COLUMN id SET NOT NULL;
ALTER TABLE assigned_slot
    ALTER COLUMN id SET DEFAULT nextval('assigned_slot_id_seq');

ALTER SEQUENCE assigned_slot_id_seq OWNED BY assigned_slot.id;

CREATE SEQUENCE IF NOT EXISTS document_id_seq;
ALTER TABLE document
    ALTER COLUMN id SET NOT NULL;
ALTER TABLE document
    ALTER COLUMN id SET DEFAULT nextval('document_id_seq');

ALTER SEQUENCE document_id_seq OWNED BY document.id;

CREATE SEQUENCE IF NOT EXISTS open_space_id_seq;
ALTER TABLE open_space
    ALTER COLUMN id SET NOT NULL;
ALTER TABLE open_space
    ALTER COLUMN id SET DEFAULT nextval('open_space_id_seq');

ALTER SEQUENCE open_space_id_seq OWNED BY open_space.id;

CREATE SEQUENCE IF NOT EXISTS review_id_seq;
ALTER TABLE review
    ALTER COLUMN id SET NOT NULL;
ALTER TABLE review
    ALTER COLUMN id SET DEFAULT nextval('review_id_seq');

ALTER SEQUENCE review_id_seq OWNED BY review.id;

CREATE SEQUENCE IF NOT EXISTS room_id_seq;
ALTER TABLE room
    ALTER COLUMN id SET NOT NULL;
ALTER TABLE room
    ALTER COLUMN id SET DEFAULT nextval('room_id_seq');

ALTER SEQUENCE room_id_seq OWNED BY room.id;

CREATE SEQUENCE IF NOT EXISTS slot_id_seq;
ALTER TABLE slot
    ALTER COLUMN id SET NOT NULL;
ALTER TABLE slot
    ALTER COLUMN id SET DEFAULT nextval('slot_id_seq');

ALTER SEQUENCE slot_id_seq OWNED BY slot.id;

CREATE SEQUENCE IF NOT EXISTS talk_id_seq;
ALTER TABLE talk
    ALTER COLUMN id SET NOT NULL;
ALTER TABLE talk
    ALTER COLUMN id SET DEFAULT nextval('talk_id_seq');

ALTER SEQUENCE talk_id_seq OWNED BY talk.id;

CREATE SEQUENCE IF NOT EXISTS track_id_seq;
ALTER TABLE track
    ALTER COLUMN id SET NOT NULL;
ALTER TABLE track
    ALTER COLUMN id SET DEFAULT nextval('track_id_seq');

ALTER SEQUENCE track_id_seq OWNED BY track.id;

CREATE SEQUENCE IF NOT EXISTS users_id_seq;
ALTER TABLE users
    ALTER COLUMN id SET NOT NULL;
ALTER TABLE users
    ALTER COLUMN id SET DEFAULT nextval('users_id_seq');

ALTER SEQUENCE users_id_seq OWNED BY users.id;