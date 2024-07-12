DO $$
DECLARE
max_last_value bigint;
BEGIN
    -- Retrieve the next sequence value from hibernate_sequence
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

-- Recreate hibernate_sequence with the max value of all entities sequences
EXECUTE format('CREATE SEQUENCE hibernate_sequence START WITH %s', max_last_value);


-- Delete all identity sequences
DROP SEQUENCE IF EXISTS assigned_slot_id_seq CASCADE;
DROP SEQUENCE IF EXISTS document_id_seq CASCADE;
DROP SEQUENCE IF EXISTS open_space_id_seq CASCADE;
DROP SEQUENCE IF EXISTS review_id_seq CASCADE;
DROP SEQUENCE IF EXISTS room_id_seq CASCADE;
DROP SEQUENCE IF EXISTS slot_id_seq CASCADE;
DROP SEQUENCE IF EXISTS talk_id_seq CASCADE;
DROP SEQUENCE IF EXISTS track_id_seq CASCADE;
DROP SEQUENCE IF EXISTS users_id_seq CASCADE;

END $$;