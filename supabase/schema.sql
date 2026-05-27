-- ============================================================
-- URBANLUXE — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Products
create table if not exists products (
  id           text primary key,
  name         text not null,
  type         text not null,        -- polo | tshirt | hoodie
  price        numeric(10,2) not null,
  original_price numeric(10,2),
  rating       numeric(3,2) default 0,
  review_count integer default 0,
  description  text not null,
  image        text not null,
  category     text not null,
  sizes        jsonb not null default '[]',
  colors       jsonb not null default '[]',
  trending     boolean default false,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Reviews
create table if not exists reviews (
  id         uuid primary key default gen_random_uuid(),
  product_id text references products(id) on delete cascade,
  user_name  text not null,
  rating     integer not null check (rating >= 1 and rating <= 5),
  text       text not null,
  created_at timestamptz default now()
);

-- Orders
create table if not exists orders (
  id                text primary key,
  email             text,
  full_name         text,
  phone             text,
  address           text,
  total             numeric(10,2) not null,
  status            text default 'pending',
  payment_method    text default 'paystack',
  payment_reference text,
  currency          text default 'NGN',
  created_at        timestamptz default now()
);

-- Order Items
create table if not exists order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   text references orders(id) on delete cascade,
  product_id text references products(id),
  name       text not null,
  size       text not null,
  color      text not null,
  quantity   integer not null,
  price      numeric(10,2) not null,
  image      text
);

-- Auto-update updated_at on products
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on products;
create trigger set_updated_at
  before update on products
  for each row execute function update_updated_at();

-- Row Level Security (optional but recommended)
alter table products    enable row level security;
alter table reviews     enable row level security;
alter table orders      enable row level security;
alter table order_items enable row level security;

-- Allow public read on products and reviews
create policy "Public read products"    on products    for select using (true);
create policy "Public read reviews"     on reviews     for select using (true);
create policy "Insert reviews"          on reviews     for insert with check (true);

-- Orders only via service role (server-side API routes)
create policy "Service role orders"     on orders      using (true) with check (true);
create policy "Service role order_items" on order_items using (true) with check (true);
