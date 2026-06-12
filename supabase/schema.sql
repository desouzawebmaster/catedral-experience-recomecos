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

drop policy if exists "Public can read sponsors" on public.sponsors;
drop policy if exists "Authenticated users can insert sponsors" on public.sponsors;
drop policy if exists "Authenticated users can update sponsors" on public.sponsors;
drop policy if exists "Authenticated users can delete sponsors" on public.sponsors;

create policy "Public can read sponsors"
on public.sponsors for select
to anon, authenticated
using (true);

create policy "Authenticated users can insert sponsors"
on public.sponsors for insert
to authenticated
with check ((auth.jwt() ->> 'email') = 'desouza.webmaster@gmail.com');

create policy "Authenticated users can update sponsors"
on public.sponsors for update
to authenticated
using ((auth.jwt() ->> 'email') = 'desouza.webmaster@gmail.com')
with check ((auth.jwt() ->> 'email') = 'desouza.webmaster@gmail.com');

create policy "Authenticated users can delete sponsors"
on public.sponsors for delete
to authenticated
using ((auth.jwt() ->> 'email') = 'desouza.webmaster@gmail.com');

create table if not exists public.site_images (
  key text primary key,
  created_at timestamptz not null default now(),
  label text not null,
  image_url text not null,
  alt text not null,
  category text not null check (category in ('hero', 'evento', 'causa', 'experiencia', 'local', 'galeria')),
  position integer not null default 1
);

alter table public.site_images enable row level security;

drop policy if exists "Public can read site images" on public.site_images;
drop policy if exists "Admin can insert site images" on public.site_images;
drop policy if exists "Admin can update site images" on public.site_images;
drop policy if exists "Admin can delete site images" on public.site_images;

create policy "Public can read site images"
on public.site_images for select
to anon, authenticated
using (true);

create policy "Admin can insert site images"
on public.site_images for insert
to authenticated
with check ((auth.jwt() ->> 'email') = 'desouza.webmaster@gmail.com');

create policy "Admin can update site images"
on public.site_images for update
to authenticated
using ((auth.jwt() ->> 'email') = 'desouza.webmaster@gmail.com')
with check ((auth.jwt() ->> 'email') = 'desouza.webmaster@gmail.com');

create policy "Admin can delete site images"
on public.site_images for delete
to authenticated
using ((auth.jwt() ->> 'email') = 'desouza.webmaster@gmail.com');
