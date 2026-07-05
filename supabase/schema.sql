-- Mithila Girls Hostel — Supabase schema
-- Run this once in Supabase → SQL Editor → New Query → Paste → Run

create table if not exists public.enquiries (
  id           bigserial primary key,
  created_at   timestamptz not null default now(),
  name         text not null,
  phone        text not null,
  email        text,
  room_type    text not null check (room_type in ('single','double','triple','not-sure')),
  message      text,
  source       text default 'website',
  user_agent   text,
  status       text not null default 'new' check (status in ('new','contacted','booked','closed'))
);

create index if not exists idx_enquiries_created_at on public.enquiries (created_at desc);
create index if not exists idx_enquiries_status on public.enquiries (status);

-- Row Level Security: block anonymous reads. The serverless API uses the
-- service-role key which bypasses RLS, so it can still insert.
alter table public.enquiries enable row level security;

-- (Explicitly no anon policies — RLS on with no policy = deny for anon.)
