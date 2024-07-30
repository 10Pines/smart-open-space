-- Script to migrate all sequences to unique sequence hibernate_sequence getting max value from all sequences
DO $$
DECLARE
    max_last_value bigint;
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

    -- set the max value of all entities sequences
    EXECUTE format('ALTER SEQUENCE IF EXISTS hibernate_sequence RESTART WITH %s', max_last_value);

END $$;