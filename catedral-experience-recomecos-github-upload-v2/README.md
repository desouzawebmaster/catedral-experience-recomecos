# Catedral Experience – Recomeços

Site profissional para captação de patrocinadores, venda de ingressos e divulgação social do evento beneficente independente Catedral Experience – Recomeços.

## Stack

- React
- Next.js com App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide Icons
- Supabase para administração de patrocinadores
- Pronto para Vercel, GitHub e domínio próprio

## Como rodar

```bash
npm install
npm run dev
```

Crie `.env.local` a partir de `.env.example` e preencha:

```bash
NEXT_PUBLIC_SITE_URL=https://www.seudominio.com.br
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-publica
NEXT_PUBLIC_CONTACT_EMAIL=contato@catedralexperience.com.br
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
NEXT_PUBLIC_INSTAGRAM_URL=https://www.instagram.com/catedralexperience
```

## Supabase

1. Crie um projeto no Supabase.
2. Rode o SQL de `supabase/schema.sql`.
3. Em Authentication, crie o usuário administrador por e-mail e senha.
4. Desative cadastros públicos ou mantenha o acesso por convite/manual para proteger a administração.
5. Configure as variáveis de ambiente na Vercel.
6. Acesse `/admin` para cadastrar e editar patrocinadores.

## Assets

As imagens `.jpg` fornecidas foram copiadas para `public/assets`.

Os arquivos `hero-band.png` e `studio.mp4` vieram apenas como metadados `.asset.json`, sem os binários correspondentes. Quando os arquivos reais estiverem disponíveis, coloque-os em:

- `public/assets/hero-band.png`
- `public/assets/studio.mp4`

O site já está estruturado para receber novos itens de galeria e novos patrocinadores sem alteração estrutural.

## Deploy na Vercel

1. Suba o projeto para o GitHub.
2. Importe o repositório na Vercel.
3. Configure as variáveis de ambiente.
4. Adicione o domínio próprio em Project Settings > Domains.

## SEO incluído

- Meta tags completas
- Open Graph
- Twitter Cards
- `sitemap.xml`
- `robots.txt`
- Schema.org para evento
- Conteúdo otimizado para: Banda Catedral, Tributo Banda Catedral, Show Banda Catedral São Paulo, Evento beneficente São Paulo, Música cristã São Paulo e Catedral Experience

## Aviso legal

Catedral Experience – Recomeços é um evento independente em homenagem ao repertório da Banda Catedral e não possui vínculo oficial com a banda.
