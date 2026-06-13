-- Catedral Experience - Recomeços
-- Execute este arquivo inteiro no SQL Editor do Supabase.
-- Ele cria a tabela usada pelo CMS e o bucket para uploads.

create table if not exists public.cms_sections (
  section text primary key,
  items jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  constraint cms_sections_section_check
    check (section in ('musicos', 'convidados', 'galeria', 'patrocinadores'))
);

alter table public.cms_sections enable row level security;

drop policy if exists "Public can read CMS sections" on public.cms_sections;
drop policy if exists "Admin can insert CMS sections" on public.cms_sections;
drop policy if exists "Admin can update CMS sections" on public.cms_sections;
drop policy if exists "Admin can delete CMS sections" on public.cms_sections;

create policy "Public can read CMS sections"
on public.cms_sections
for select
to anon, authenticated
using (true);

create policy "Admin can insert CMS sections"
on public.cms_sections
for insert
to authenticated
with check ((auth.jwt() ->> 'email') = 'desouza.webmaster@gmail.com');

create policy "Admin can update CMS sections"
on public.cms_sections
for update
to authenticated
using ((auth.jwt() ->> 'email') = 'desouza.webmaster@gmail.com')
with check ((auth.jwt() ->> 'email') = 'desouza.webmaster@gmail.com');

create policy "Admin can delete CMS sections"
on public.cms_sections
for delete
to authenticated
using ((auth.jwt() ->> 'email') = 'desouza.webmaster@gmail.com');

insert into public.cms_sections (section, items)
values
  ('musicos', '[]'::jsonb),
  ('convidados', '[]'::jsonb),
  ('galeria', '[]'::jsonb),
  ('patrocinadores', '[]'::jsonb)
on conflict (section) do nothing;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'site-media',
  'site-media',
  true,
  52428800,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm'
  ]::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read site media" on storage.objects;
drop policy if exists "Admin can upload site media" on storage.objects;
drop policy if exists "Admin can update site media" on storage.objects;
drop policy if exists "Admin can delete site media" on storage.objects;

create policy "Public can read site media"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'site-media');

create policy "Admin can upload site media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'site-media'
  and (auth.jwt() ->> 'email') = 'desouza.webmaster@gmail.com'
);

create policy "Admin can update site media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'site-media'
  and (auth.jwt() ->> 'email') = 'desouza.webmaster@gmail.com'
)
with check (
  bucket_id = 'site-media'
  and (auth.jwt() ->> 'email') = 'desouza.webmaster@gmail.com'
);

create policy "Admin can delete site media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'site-media'
  and (auth.jwt() ->> 'email') = 'desouza.webmaster@gmail.com'
);
