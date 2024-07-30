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

-- Script to migrate all sequences to unique sequence hibernate_sequence getting max value from all sequences
DO $$
DECLARE
    max_last_value bigint;
BEGIN
    BEGIN
        -- Retrieve the value for init hibernate_sequence
        SELECT MAX(last_value) INTO max_last_value
        FROM (
                 SELECT last_value FROM assigned_slot_id_seq
                 UNION ALL
                 SELECT last_value FROM document_id_seq
                 UNION ALL
                 SELECT last_value FROM open_space_id_seq
                 UNION ALL
                 SELECT last_value FROM review_id_seq
                 UNION ALL
                 SELECT last_value FROM room_id_seq
                 UNION ALL
                 SELECT last_value FROM slot_id_seq
                 UNION ALL
                 SELECT last_value FROM talk_id_seq
                 UNION ALL
                 SELECT last_value FROM track_id_seq
                 UNION ALL
                 SELECT last_value FROM users_id_seq
         ) AS all_sequences;
    EXCEPTION
        WHEN others THEN
            max_last_value := 1;
    END;


    -- set the max value of all entities sequences
    EXECUTE format('ALTER SEQUENCE IF EXISTS hibernate_sequence RESTART WITH %s', max_last_value);

END $$;

DROP SEQUENCE IF EXISTS assigned_slot_id_seq CASCADE;

DROP SEQUENCE IF EXISTS document_id_seq CASCADE;

DROP SEQUENCE IF EXISTS open_space_id_seq CASCADE;

DROP SEQUENCE IF EXISTS review_id_seq CASCADE;

DROP SEQUENCE IF EXISTS room_id_seq CASCADE;

DROP SEQUENCE IF EXISTS slot_id_seq CASCADE;

DROP SEQUENCE IF EXISTS talk_id_seq CASCADE;

DROP SEQUENCE IF EXISTS track_id_seq CASCADE;

DROP SEQUENCE IF EXISTS users_id_seq CASCADE;

