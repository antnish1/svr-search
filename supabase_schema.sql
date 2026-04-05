-- Safe PostgreSQL schema (works on older PG too)
-- IMPORTANT: Run this as plain SQL. Do NOT prefix with EXPLAIN ANALYZE.

create table if not exists public.lists (
  id serial primary key,
  list_id varchar(100) not null unique,
  list_date date not null default current_date,
  location varchar(120) not null,
  status varchar(20) not null default 'OPEN' check (status in ('OPEN','CLOSED','VERIFIED','PASSED')),
  total_tada numeric(12,2) not null default 0,
  passed_amount numeric(12,2) not null default 0,
  svr_count integer not null default 0,
  created_at timestamp with time zone not null default now(),
  closed_at timestamp with time zone,
  verified_at timestamp with time zone
);

create table if not exists public.list_rows (
  id serial primary key,
  list_id varchar(100) not null references public.lists(list_id) on delete cascade,
  work_date date,
  location varchar(120),
  engineer_name varchar(120),
  ws_os varchar(50),
  call_type varchar(80),
  complaint text,
  customer_name varchar(200),
  machine_no varchar(120),
  hmr varchar(80),
  job_status varchar(50),
  site_location varchar(200),
  call_id varchar(120),
  labour numeric(12,2),
  distance_km numeric(12,2),
  tada_amount numeric(12,2),
  invoice_no varchar(120),
  svr_no varchar(120),
  passed_amount numeric(12,2),
  row_status varchar(20) not null default 'OPEN' check (row_status in ('OPEN','CLOSED','VERIFIED','PASSED','REJECTED')),
  unique_key varchar(255) not null unique,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table if not exists public.source_calls (
  id serial primary key,
  call_date date,
  location varchar(120),
  engineer_name varchar(120),
  ws_os varchar(50),
  call_type varchar(80),
  complaint text,
  customer_name varchar(200),
  machine_no varchar(120),
  hmr varchar(80),
  job_status varchar(50),
  site_location varchar(200),
  call_id varchar(120),
  labour numeric(12,2),
  distance_km numeric(12,2),
  tada_amount numeric(12,2),
  source_unique_key varchar(255) unique,
  created_at timestamp with time zone not null default now()
);

create table if not exists public.location_security (
  id serial primary key,
  location varchar(120) not null unique,
  pin_code varchar(20) not null,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now()
);

create table if not exists public.app_settings (
  setting_key varchar(120) primary key,
  setting_value text not null,
  updated_at timestamp with time zone not null default now()
);

insert into public.app_settings(setting_key, setting_value)
values ('verification_password', '78612345')
on conflict (setting_key) do nothing;

-- run these separately as plain SQL (without EXPLAIN ANALYZE)
create index if not exists idx_list_rows_list_id on public.list_rows(list_id);
create index if not exists idx_list_rows_engineer on public.list_rows(engineer_name);
create index if not exists idx_list_rows_machine on public.list_rows(machine_no);
create index if not exists idx_list_rows_work_date on public.list_rows(work_date);
