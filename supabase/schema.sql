create extension if not exists "pgcrypto";

create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_progress enable row level security;

create policy "users can read own progress"
  on public.user_progress
  for select
  using (auth.uid() = user_id);

create policy "users can insert own progress"
  on public.user_progress
  for insert
  with check (auth.uid() = user_id);

create policy "users can update own progress"
  on public.user_progress
  for update
  using (auth.uid() = user_id);
