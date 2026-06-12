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

insert into public.site_images (key, label, image_url, alt, category, position)
values
  ('hero.main', 'Banner principal', '/assets/hero-image.png', 'Banda no palco do Catedral Experience', 'hero', 1),
  ('evento.vocal', 'Evento - vocal', '/assets/hero-singer.png', 'Vocalista no palco', 'evento', 1),
  ('evento.bateria', 'Evento - bateria', '/assets/hero-musician-1.png', 'Baterista', 'evento', 2),
  ('evento.guitarra', 'Evento - guitarra', '/assets/hero-guitar.jpeg', 'Guitarrista', 'evento', 3),
  ('evento.teclado', 'Evento - teclado', '/assets/hero-musician-5.png', 'Tecladista', 'evento', 4),
  ('evento.baixo', 'Evento - baixo', '/assets/hero-bass.jpeg', 'Baixista', 'evento', 5),
  ('causa.1', 'Causa 1', '/assets/social-cause-1.jpeg', 'Familia recebendo cesta basica', 'causa', 1),
  ('causa.2', 'Causa 2', '/assets/social-cause-2.jpeg', 'Cestas basicas organizadas', 'causa', 2),
  ('causa.3', 'Causa 3', '/assets/social-cause-3.jpeg', 'Atendimento social no evento', 'causa', 3),
  ('causa.4', 'Causa 4', '/assets/social-cause-4.jpeg', 'Cadastro para recebimento de alimentos', 'causa', 4),
  ('causa.5', 'Causa 5', '/assets/social-cause-5.jpeg', 'Entrega de alimentos', 'causa', 5),
  ('local.1', 'Local 1', '/assets/place-1.jpeg', 'Palco do Dissenso Lounge', 'local', 1),
  ('local.2', 'Local 2', '/assets/place-2.png', 'Estrutura do palco', 'local', 2),
  ('local.3', 'Local 3', '/assets/place-3.png', 'Iluminacao do palco', 'local', 3)
on conflict (key) do update set
  label = excluded.label,
  image_url = excluded.image_url,
  alt = excluded.alt,
  category = excluded.category,
  position = excluded.position;
