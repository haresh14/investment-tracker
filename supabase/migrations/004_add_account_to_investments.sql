alter table public.investments
  add column if not exists account text not null default 'Self';
