create extension if not exists pgcrypto;

create type public.content_region as enum ('Canada', 'United States', 'Global');
create type public.content_type as enum ('Idiom', 'Slang', 'Power word', 'Transition');
create type public.content_tone as enum ('Casual', 'Neutral', 'Polished');
create type public.account_role as enum ('member', 'admin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role public.account_role not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  phrase text not null,
  meaning text not null,
  example text not null,
  region public.content_region not null default 'Global',
  type public.content_type not null,
  context text[] not null default '{}',
  tone public.content_tone not null default 'Neutral',
  is_published boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.saved_phrases (
  user_id uuid not null references auth.users(id) on delete cascade,
  content_id uuid not null references public.content_items(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, content_id)
);

create table public.practice_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content_id uuid not null references public.content_items(id) on delete cascade,
  practiced_at timestamptz not null default now()
);

create table public.reminder_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  enabled boolean not null default true,
  timezone text not null default 'America/Toronto',
  local_time time not null default '08:30',
  days smallint[] not null default '{1,2,3,4,5}',
  updated_at timestamptz not null default now()
);

create table public.device_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  platform text not null check (platform in ('web', 'ios', 'watchos')),
  token text not null unique,
  last_seen_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'); $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$ begin insert into public.profiles (id, display_name) values (new.id, coalesce(new.raw_user_meta_data->>'name', new.email)); return new; end; $$;

create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger content_items_updated_at before update on public.content_items for each row execute function public.set_updated_at();
create trigger reminders_updated_at before update on public.reminder_preferences for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.content_items enable row level security;
alter table public.saved_phrases enable row level security;
alter table public.practice_events enable row level security;
alter table public.reminder_preferences enable row level security;
alter table public.device_tokens enable row level security;

create policy "Published content is readable" on public.content_items for select using (is_published or public.is_admin());
create policy "Admins manage content" on public.content_items for all using (public.is_admin()) with check (public.is_admin());
create policy "Users view own profile" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "Users update own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "Users manage saved phrases" on public.saved_phrases for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users manage practice events" on public.practice_events for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users manage reminders" on public.reminder_preferences for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users manage device tokens" on public.device_tokens for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create index content_items_search_idx on public.content_items using gin (to_tsvector('english', phrase || ' ' || meaning || ' ' || example));
create index practice_events_user_date_idx on public.practice_events (user_id, practiced_at desc);
