alter table public.investments
  add column if not exists end_date date;

alter table public.investments
  add column if not exists status text not null default 'active';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'investments_status_check'
  ) then
    alter table public.investments
      add constraint investments_status_check
      check (status in ('active', 'paused', 'closed'));
  end if;
end $$;

alter table public.investments
  drop column if exists duration_months;

create table if not exists public.investment_lifecycle_events (
  id uuid primary key default gen_random_uuid(),
  investment_id uuid not null references public.investments (id) on delete cascade,
  type text not null check (type in ('PAUSE', 'RESUME', 'CLOSE')),
  effective_date date not null,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.investment_lifecycle_events enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'investment_lifecycle_events'
      and policyname = 'Users can access own lifecycle events'
  ) then
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
  end if;
end $$;
