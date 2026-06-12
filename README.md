# Catedral Experience - Recomecos

Site profissional para captacao de patrocinadores, venda de ingressos e divulgacao social do evento beneficente independente Catedral Experience - Recomecos.

## Stack

- React
- Next.js com App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide Icons
- Supabase Auth para login do administrador
- CMS local por JSON para conteudo editavel
- Pronto para Vercel, GitHub e dominio proprio

## Como rodar

```bash
npm install
npm run dev
```

Crie `.env.local` a partir de `.env.example` e preencha:

```bash
NEXT_PUBLIC_SITE_URL=https://www.seudominio.com.br
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-publishable-key
NEXT_PUBLIC_CONTACT_EMAIL=contato@catedralexperience.com.br
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
NEXT_PUBLIC_INSTAGRAM_URL=https://www.instagram.com/catedralexperience
```

## Admin

O painel `/admin` usa Supabase apenas para autenticacao. Crie manualmente o usuario `desouza.webmaster@gmail.com` em:

`Supabase > Authentication > Users`

Depois acesse `/admin` com este e-mail e senha. O painel permite gerenciar:

- Musicos
- Convidados especiais
- Galeria de fotos e videos
- Patrocinadores

Os dados ficam nos arquivos:

- `src/data/musicos.json`
- `src/data/convidados.json`
- `src/data/galeria.json`
- `src/data/patrocinadores.json`

Uploads locais sao salvos em:

- `public/uploads/musicos`
- `public/uploads/convidados`
- `public/uploads/galeria`
- `public/uploads/patrocinadores`

## Importante sobre Vercel

A Vercel nao deve ser usada como armazenamento permanente de uploads feitos em tempo de execucao. Em producao, arquivos gravados pelo painel podem sumir em novos deploys ou novas instancias.

Esta estrutura foi preparada para funcionar localmente e manter persistencia no repositorio. Para uso administrativo real em producao, migre os uploads para Supabase Storage, Cloudinary, S3 ou outro storage externo. Os JSONs tambem podem ser migrados futuramente para Supabase Database.

## Deploy na Vercel

1. Suba o projeto para o GitHub.
2. Importe o repositorio na Vercel.
3. Configure as variaveis de ambiente.
4. Faca um novo deploy depois de alterar variaveis.
5. Adicione o dominio proprio em Project Settings > Domains.

## SEO incluido

- Meta tags completas
- Open Graph
- Twitter Cards
- `sitemap.xml`
- `robots.txt`
- Schema.org para evento
- Conteudo otimizado para: Banda Catedral, Tributo Banda Catedral, Show Banda Catedral Sao Paulo, Evento beneficente Sao Paulo, Musica crista Sao Paulo e Catedral Experience

## Aviso legal

Catedral Experience - Recomecos e um evento independente em homenagem ao repertorio da Banda Catedral e nao possui vinculo oficial com a banda.
