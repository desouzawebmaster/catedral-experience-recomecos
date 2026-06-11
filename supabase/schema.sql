create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  slogan text not null,
  logo_url text not null,
  url text,
  tier text not null default 'colaborador' check (tier in ('master', 'colaborador'))
);

alter table public.sponsors enable row level security;

create policy "Public can read sponsors"
on public.sponsors for select
to anon, authenticated
using (true);

create policy "Authenticated users can insert sponsors"
on public.sponsors for insert
to authenticated
with check (true);

create policy "Authenticated users can update sponsors"
on public.sponsors for update
to authenticated
using (true)
with check (true);

create policy "Authenticated users can delete sponsors"
on public.sponsors for delete
to authenticated
using (true);
