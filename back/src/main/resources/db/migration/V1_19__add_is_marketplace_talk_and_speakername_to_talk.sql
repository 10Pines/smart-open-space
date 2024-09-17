alter table talk
    add column if not exists is_marketplace_talk boolean default false;
    add column if not exists speaker_name varchar(255) default null;