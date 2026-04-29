create extension if not exists "pgcrypto";

create table if not exists public.investments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  source text not null,
  account text not null default 'Self',
  type text not null check (type in ('sip', 'lumpsum')),
  monthly_amount numeric,
  lump_sum_amount numeric,
  expected_annual_return numeric not null,
  start_date date not null,
  end_date date,
  sip_day int,
  status text not null default 'active' check (status in ('active', 'paused', 'closed')),
  lock_in_months int default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.installments (
  id uuid primary key default gen_random_uuid(),
  investment_id uuid not null references public.investments (id) on delete cascade,
  installment_number int not null,
  installment_date date not null,
  amount numeric not null,
  months_invested int not null,
  future_value numeric not null,
  gain numeric not null,
  is_deleted boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  unique (investment_id, installment_number)
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  investment_id uuid not null references public.investments (id) on delete cascade,
  type text not null check (type in ('INVEST', 'WITHDRAWAL')),
  amount numeric not null,
  date date not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.investment_lifecycle_events (
  id uuid primary key default gen_random_uuid(),
  investment_id uuid not null references public.investments (id) on delete cascade,
  type text not null check (type in ('PAUSE', 'RESUME', 'CLOSE')),
  effective_date date not null,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.investments enable row level security;
alter table public.installments enable row level security;
alter table public.transactions enable row level security;
alter table public.investment_lifecycle_events enable row level security;

create policy "Users can manage own investments"
on public.investments
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can access own installments"
on public.installments
for all
using (
  exists (
    select 1
    from public.investments
    where investments.id = installments.investment_id
      and investments.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.investments
    where investments.id = installments.investment_id
      and investments.user_id = auth.uid()
  )
);

create policy "Users can access own transactions"
on public.transactions
for all
using (
  exists (
    select 1
    from public.investments
    where investments.id = transactions.investment_id
      and investments.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.investments
    where investments.id = transactions.investment_id
      and investments.user_id = auth.uid()
  )
);

create policy "Users can access own lifecycle events"
on public.investment_lifecycle_events
for all
using (
  exists (
    select 1
    from public.investments
    where investments.id = investment_lifecycle_events.investment_id
      and investments.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.investments
    where investments.id = investment_lifecycle_events.investment_id
      and investments.user_id = auth.uid()
  )
);
