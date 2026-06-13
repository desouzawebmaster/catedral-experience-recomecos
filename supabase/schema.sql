-- Catedral Experience - Recomeços
-- CMS em Supabase Database + Supabase Storage

create table if not exists public.cms_sections (
  section text primary key check (section in ('musicos', 'convidados', 'galeria', 'patrocinadores')),
  items jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.cms_sections enable row level security;

drop policy if exists "Public can read CMS sections" on public.cms_sections;
drop policy if exists "Admin can insert CMS sections" on public.cms_sections;
drop policy if exists "Admin can update CMS sections" on public.cms_sections;
drop policy if exists "Admin can delete CMS sections" on public.cms_sections;

create policy "Public can read CMS sections"
on public.cms_sections for select
to anon, authenticated
using (true);

create policy "Admin can insert CMS sections"
on public.cms_sections for insert
to authenticated
with check ((auth.jwt() ->> 'email') = 'desouza.webmaster@gmail.com');

create policy "Admin can update CMS sections"
on public.cms_sections for update
to authenticated
using ((auth.jwt() ->> 'email') = 'desouza.webmaster@gmail.com')
with check ((auth.jwt() ->> 'email') = 'desouza.webmaster@gmail.com');

create policy "Admin can delete CMS sections"
on public.cms_sections for delete
to authenticated
using ((auth.jwt() ->> 'email') = 'desouza.webmaster@gmail.com');

insert into public.cms_sections (section, items, updated_at)
values
(
  'musicos',
  $json$
  [
    {
      "id": "vocal",
      "name": "Vocal",
      "role": "Voz principal",
      "image": "/assets/hero-singer.png",
      "alt": "Vocalista no palco",
      "active": true,
      "position": 1
    },
    {
      "id": "bateria",
      "name": "Bateria",
      "role": "Bateria",
      "image": "/assets/hero-musician-1.png",
      "alt": "Baterista",
      "active": true,
      "position": 2
    },
    {
      "id": "guitarra",
      "name": "Guitarra",
      "role": "Guitarra",
      "image": "/assets/hero-guitar.jpeg",
      "alt": "Guitarrista",
      "active": true,
      "position": 3
    },
    {
      "id": "violao",
      "name": "Evento - Violão",
      "role": "Violão e voz",
      "image": "/assets/hero-violao.jpeg",
      "alt": "Músico tocando violão",
      "active": true,
      "position": 4
    },
    {
      "id": "teclado",
      "name": "Teclado",
      "role": "Teclado",
      "image": "/assets/hero-musician-5.png",
      "alt": "Tecladista",
      "active": true,
      "position": 5
    },
    {
      "id": "baixo",
      "name": "Baixo",
      "role": "Baixo",
      "image": "/assets/hero-bass.jpeg",
      "alt": "Baixista",
      "active": true,
      "position": 6
    }
  ]
  $json$::jsonb,
  now()
),
(
  'convidados',
  $json$
  [
    {
      "id": "rodolfo-lauber",
      "name": "Rodolfo Lauber",
      "description": "Rodolfo Lauber é cantor e compositor da Banda Apogeu.",
      "image": "/assets/guest-rodolfo-lauber.jpeg",
      "alt": "Rodolfo Lauber cantando no palco",
      "active": true,
      "position": 1
    }
  ]
  $json$::jsonb,
  now()
),
(
  'galeria',
  $json$
  [
    {
      "id": "hero",
      "type": "image",
      "src": "/assets/hero-image.png",
      "title": "Banda no palco do evento",
      "active": true,
      "position": 1
    },
    {
      "id": "vocal",
      "type": "image",
      "src": "/assets/hero-singer.png",
      "title": "Voz principal",
      "active": true,
      "position": 2
    },
    {
      "id": "rodolfo",
      "type": "image",
      "src": "/assets/guest-rodolfo-lauber.jpeg",
      "title": "Convidado especial",
      "active": true,
      "position": 3
    },
    {
      "id": "violao",
      "type": "image",
      "src": "/assets/hero-violao.jpeg",
      "title": "Violão",
      "active": true,
      "position": 4
    },
    {
      "id": "guitarra",
      "type": "image",
      "src": "/assets/hero-guitar.jpeg",
      "title": "Guitarra",
      "active": true,
      "position": 5
    },
    {
      "id": "baixo",
      "type": "image",
      "src": "/assets/hero-bass.jpeg",
      "title": "Baixo",
      "active": true,
      "position": 6
    },
    {
      "id": "studio",
      "type": "video",
      "src": "/assets/studio.mp4",
      "poster": "/assets/place-1.jpeg",
      "title": "Vídeo do espaço",
      "active": true,
      "position": 7
    }
  ]
  $json$::jsonb,
  now()
),
(
  'patrocinadores',
  $json$
  [
    {
      "id": "placeholder-master",
      "name": "Sua marca aqui",
      "slogan": "Associe sua empresa a uma noite de impacto social.",
      "logo": "/assets/logo-placeholder.jpg",
      "url": "#patrocinios",
      "instagram": "",
      "facebook": "",
      "whatsapp": "",
      "tier": "master",
      "active": true,
      "position": 1
    },
    {
      "id": "placeholder-parceiro",
      "name": "Patrocinador Parceiro",
      "slogan": "Visibilidade com propósito para empresas locais.",
      "logo": "/assets/logo-placeholder.jpg",
      "url": "#patrocinios",
      "instagram": "",
      "facebook": "",
      "whatsapp": "",
      "tier": "parceiro",
      "active": true,
      "position": 2
    }
  ]
  $json$::jsonb,
  now()
)
on conflict (section) do update set
  items = excluded.items,
  updated_at = now()
where public.cms_sections.items = '[]'::jsonb
   or public.cms_sections.items is null;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']::text[]
)
on conflict (id) do update set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read site media" on storage.objects;
drop policy if exists "Admin can upload site media" on storage.objects;
drop policy if exists "Admin can update site media" on storage.objects;
drop policy if exists "Admin can delete site media" on storage.objects;

create policy "Public can read site media"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'site-media');

create policy "Admin can upload site media"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'site-media'
  and (auth.jwt() ->> 'email') = 'desouza.webmaster@gmail.com'
);

create policy "Admin can update site media"
on storage.objects for update
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
on storage.objects for delete
to authenticated
using (
  bucket_id = 'site-media'
  and (auth.jwt() ->> 'email') = 'desouza.webmaster@gmail.com'
);
