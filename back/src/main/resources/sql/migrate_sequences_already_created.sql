DO $$
DECLARE
    last_seq_value bigint;
BEGIN
    -- Retrieve the next sequence value from hibernate_sequence
    SELECT last_value + 1 INTO last_seq_value FROM hibernate_sequence;

    CREATE SEQUENCE assigned_slot_id_seq START WITH 1;
    EXECUTE format('CREATE SEQUENCE IF NOT EXISTS assigned_slot_id_seq START WITH %s', last_seq_value);
    EXECUTE format('CREATE SEQUENCE IF NOT EXISTS document_id_seq START WITH %s', last_seq_value);
    EXECUTE format('CREATE SEQUENCE IF NOT EXISTS open_space_id_seq START WITH %s', last_seq_value);
    EXECUTE format('CREATE SEQUENCE IF NOT EXISTS review_id_seq START WITH %s', last_seq_value);
    EXECUTE format('CREATE SEQUENCE IF NOT EXISTS room_id_seq START WITH %s', last_seq_value);
    EXECUTE format('CREATE SEQUENCE IF NOT EXISTS slot_id_seq START WITH %s', last_seq_value);
    EXECUTE format('CREATE SEQUENCE IF NOT EXISTS talk_id_seq START WITH %s', last_seq_value);
    EXECUTE format('CREATE SEQUENCE IF NOT EXISTS track_id_seq START WITH %s', last_seq_value);
    EXECUTE format('CREATE SEQUENCE IF NOT EXISTS users_id_seq START WITH %s', last_seq_value);

    -- Drop the hibernate_sequence
    DROP SEQUENCE IF EXISTS hibernate_sequence CASCADE;
END $$;
