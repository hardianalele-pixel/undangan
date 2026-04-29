## Setup Supabase

1. Buat project di Supabase
2. Copy DATABASE_URL (pooler)
3. Masukkan ke Vercel ENV

SQL:

create table if not exists tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  name text,
  email text unique not null,
  password_hash text not null,
  created_at timestamptz default now()
);
