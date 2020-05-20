create table admins (
    user_id integer references users(id) on delete cascade not null
)