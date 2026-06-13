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
- Supabase Database para conteudo editavel
- Supabase Storage para imagens e videos enviados pelo admin
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

## Admin e CMS

O painel `/admin` usa Supabase para autenticacao, conteudo e arquivos enviados. Crie manualmente o usuario `desouza.webmaster@gmail.com` em:

`Supabase > Authentication > Users`

Depois acesse `/admin` com este e-mail e senha. O painel permite gerenciar:

- Musicos
- Convidados especiais
- Galeria de fotos e videos
- Patrocinadores

Rode o SQL de `supabase/schema.sql` no SQL Editor do Supabase. Ele cria:

- a tabela `cms_sections`
- o bucket público `site-media`
- as políticas de leitura pública e escrita restrita ao administrador
- os dados iniciais do site

Os arquivos JSON em `src/data` continuam existindo apenas como fallback inicial do projeto. Em producao, o site carrega primeiro os dados salvos no Supabase.

No Supabase, este select deve retornar 4 linhas:

```sql
select section, jsonb_array_length(items) as total
from public.cms_sections
order by section;
```

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
