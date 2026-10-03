# Supabase setup

1. Create a Supabase project.
2. In the SQL Editor, run `schema.sql`, then `seed.sql`.
3. Copy `.env.example` to `.env.local` and add the project URL and publishable key.
4. Create your first account through Supabase Auth, then promote it to admin:

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'you@example.com');
```

The frontend can use `/api/content` for public content. Signed-in clients can use `/api/me/saved`, `/api/me/practice`, and `/api/me/reminders`. Admin clients can use `/api/admin/content`.

Keep Supabase service-role keys server-side only. The browser should only receive the publishable key, with Row Level Security enabled as defined in `schema.sql`.
