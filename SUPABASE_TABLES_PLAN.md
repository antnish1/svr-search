# Supabase tables needed to rebuild your old system logic

This plan is based on your old files: `index1.html`, `home1.html`, `edit1.html`, `passed1.html`, `dashboard1.html`.

## ✅ Minimum tables you should create

## 1) `lists` (one row per list)
Use this for list header data shown on index page.

Columns:
- `id` serial primary key
- `list_id` text unique (example: `SVR-2026-001`)
- `list_date` date
- `location` text
- `status` text check in (`OPEN`,`CLOSED`,`VERIFIED`,`PASSED`)
- `created_at` timestamptz default now()
- `closed_at` timestamptz null
- `verified_at` timestamptz null
- `total_tada` numeric default 0
- `passed_amount` numeric default 0
- `svr_count` int default 0

Why needed:
- Old `index1.html` shows list rows with `listId`, `date`, `location`, `status`, `svrCount`, `totalTaDa`, `passedAmount`.

---

## 2) `list_rows` (one row per call inside a list)
This is the main working table used in home/edit/passed/dashboard.

Columns:
- `id` serial primary key
- `list_id` text references `lists(list_id)` on delete cascade
- `work_date` date
- `location` text
- `engineer_name` text
- `ws_os` text
- `call_type` text
- `complaint` text
- `customer_name` text
- `machine_no` text
- `hmr` text
- `job_status` text
- `site_location` text
- `call_id` text
- `labour` numeric
- `distance_km` numeric
- `tada_amount` numeric
- `invoice_no` text
- `svr_no` text
- `passed_amount` numeric
- `row_status` text check in (`OPEN`,`CLOSED`,`VERIFIED`,`PASSED`,`REJECTED`) default `OPEN`
- `unique_key` text unique
- `created_at` timestamptz default now()
- `updated_at` timestamptz default now()

Why needed:
- Old `home1.html` reads/edits row fields, saves `svrNo` + `invoiceNo`, and uses date+engineer+machine as unique identity.
- Old `passed1.html` writes passed amount per row.
- Old `edit1.html` deletes rows by date+engineer+machine.

---

## 3) `source_calls` (search source data; optional but strongly recommended)
Use this if you still need a searchable raw dataset like your old Google search action.

Columns:
- `id` serial primary key
- `call_date` date
- `location` text
- `engineer_name` text
- `ws_os` text
- `call_type` text
- `complaint` text
- `customer_name` text
- `machine_no` text
- `hmr` text
- `job_status` text
- `site_location` text
- `call_id` text
- `labour` numeric
- `distance_km` numeric
- `tada_amount` numeric
- `source_unique_key` text unique
- `created_at` timestamptz default now()

Why needed:
- Old `home1.html` does search first, then selected rows are saved into a list.

---

## 4) `location_security` (PIN/password per location)
Needed because old index flow protects Open/Edit by location PIN.

Columns:
- `id` serial primary key
- `location` text unique
- `pin_code` text
- `is_active` boolean default true
- `created_at` timestamptz default now()

Why needed:
- Old `index1.html` verifies location PIN before opening/editing a list.

---

## 5) `app_settings` (global settings)
Use this for verification password instead of hard-coding in JS.

Columns:
- `setting_key` varchar primary key
- `setting_value` text
- `updated_at` timestamptz default now()

Suggested row:
- `setting_key = verification_password`, `setting_value = 78612345` (change later)

---

## SQL starter (create tables)

Use the SQL in `supabase_schema.sql` added in this repo.

