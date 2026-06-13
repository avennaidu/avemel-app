-- Avemel Driver App - storage table
-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run

create table if not exists kv_store (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

-- Pilot-simple access: anyone with the app's anon key can read/write.
-- (Lock down with auth before wider rollout.)
alter table kv_store enable row level security;

create policy "pilot read"  on kv_store for select using (true);
create policy "pilot write" on kv_store for insert with check (true);
create policy "pilot update" on kv_store for update using (true);
