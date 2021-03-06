create table posts (
    id integer primary key generated by default as identity,
    user_id integer references users(id) on delete cascade not null,
    forum_id integer references forums(id) on delete cascade not null,
    time_submitted text not null,
    content text not null
);