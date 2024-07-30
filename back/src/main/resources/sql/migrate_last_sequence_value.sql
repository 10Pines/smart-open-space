-- Script to migrate the last sequence value from hibernate_sequence to the new sequences
DO $$
DECLARE
    last_seq_value bigint;
BEGIN
    BEGIN
        SELECT last_value INTO last_seq_value FROM hibernate_sequence;
    EXCEPTION
            WHEN others THEN
                last_seq_value := 1;
    END;

    EXECUTE format('ALTER SEQUENCE IF EXISTS assigned_slot_id_seq RESTART WITH %s', last_seq_value);
    EXECUTE format('ALTER SEQUENCE IF EXISTS document_id_seq RESTART WITH %s', last_seq_value);
    EXECUTE format('ALTER SEQUENCE IF EXISTS open_space_id_seq RESTART WITH %s', last_seq_value);
    EXECUTE format('ALTER SEQUENCE IF EXISTS review_id_seq RESTART WITH %s', last_seq_value);
    EXECUTE format('ALTER SEQUENCE IF EXISTS room_id_seq RESTART WITH %s', last_seq_value);
    EXECUTE format('ALTER SEQUENCE IF EXISTS slot_id_seq RESTART WITH %s', last_seq_value);
    EXECUTE format('ALTER SEQUENCE IF EXISTS talk_id_seq RESTART WITH %s', last_seq_value);
    EXECUTE format('ALTER SEQUENCE IF EXISTS track_id_seq RESTART WITH %s', last_seq_value);
    EXECUTE format('ALTER SEQUENCE IF EXISTS users_id_seq RESTART WITH %s', last_seq_value);
END $$;

DROP SEQUENCE IF EXISTS hibernate_sequence CASCADE;