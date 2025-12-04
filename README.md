# Documentação Técnica - Água São Geraldo

Documentação técnica para a equipe de manutenção do site.

---

## Stack Tecnológica

| Tecnologia       | Versão  | Uso                                            |
| ---------------- | ------- | ---------------------------------------------- |
| **Astro**        | 5.x     | Framework SSG (Static Site Generation)         |
| **React**        | 19.x    | Componentes interativos (sliders, forms, maps) |
| **Tailwind CSS** | 4.x     | Estilização (via `@tailwindcss/vite`)          |
| **TypeScript**   | 5.x     | Tipagem estática                               |
| **pnpm**         | 9.x     | Gerenciador de pacotes (obrigatório)           |
| **Node.js**      | 20.18.0 | Runtime                                        |

---

## Estrutura de Diretórios

```
├── .github/workflows/     # CI/CD pipelines
├── public/                # Arquivos estáticos e configuração
├── src/
│   ├── assets/           # Imagens, ícones, favicons
│   ├── components/       # Componentes Astro e React
│   ├── content/          # Configuração de collections (schemas)
│   ├── data/             # Conteúdo Markdown (gerenciado pelo CMS)
│   ├── layouts/          # Layouts de página
│   ├── pages/            # Rotas do Astro
│   ├── styles/           # CSS global
│   ├── ui/               # Configuração de cores
│   └── utils/            # Utilitários e plugins
├── vendor/               # Integrações customizadas
├── astro.config.ts       # Configuração principal do Astro
├── tailwind.config.ts    # Configuração do Tailwind
└── tsconfig.json         # Configuração do TypeScript
```

---

## GitHub Actions Pipelines

### 1. `deploy-ssh.yml` - Deploy de Produção

**Triggers:**

- Push na branch `main`
- `repository_dispatch`: `cms-publish`, `rebuild`
- Conclusão bem-sucedida do workflow `Create and Auto-Merge PR`
- Manual via `workflow_dispatch`

**O que faz:**

1. Checkout do código
2. Setup pnpm + Node.js 20.18.0
3. `pnpm install --frozen-lockfile`
4. `pnpm build` com variáveis de ambiente
5. Deploy via rsync/SSH para Hostinger

**Variáveis de ambiente (secrets/vars):**

```bash
# Secrets
SSH_PRIVATE_KEY              # Chave SSH privada
PUBLIC_GOOGLE_MAPS_KEY_PROD  # API Key do Google Maps

# Variables
SSH_HOST                     # Host SSH (Hostinger)
SSH_USER                     # Usuário SSH
SSH_PORT                     # Porta SSH
SSH_REMOTE_PATH              # Caminho remoto do site
PUBLIC_GOOGLE_CAPTCHA_SITEKEY
API_BASE_URL
GOOGLE_SITE_VERIFICATION
GOOGLE_ANALYTICS_ID
SITE_URL
```

---

### 2. `create-and-merge-pr.yml` - Auto-merge do CMS

**Triggers:**

- Push na branch `development` com commits contendo `[cms]` ou `[ci]`
- `repository_dispatch`: `sveltia-cms-publish`
- Manual via `workflow_dispatch`

**O que faz:**

1. Cria PR de `development` → `main`
2. Adiciona PR à merge queue com `--auto`

**Fluxo:**

```
CMS salva [cms] → development → PR criado → Auto-merge → main → Deploy
```

---

### 3. `preview-deploy.yml` - Preview de Conteúdo

**Triggers:**

- `repository_dispatch`: `sveltia-cms-preview`

**O que faz:**

1. Build do site com branch específica
2. Deploy para ambiente de preview (URL separada)

**Variáveis específicas:**

```bash
SSH_PREVIEW_REMOTE_PATH  # Caminho do ambiente de preview
PREVIEW_URL              # URL do preview
```

---

## Arquivos da pasta `public/`

### `_config` (YAML)

Configuração global do site. Carregado pela integração `astrowind`.

```yaml
site:
  name: 'Água Mineral Natural - São Geraldo'
  site: 'https://aguasaogeraldo.com.br'
  trailingSlash: true

metadata:
  title:
    default: 'São Geraldo'
    template: '%s - São Geraldo'
  description: '...'
  robots: { index: true, follow: true }
  openGraph: { ... }

apps:
  blog:
    isEnabled: true
    postsPerPage: 6
    post:
      permalink: '/%slug%' # Padrão de URL dos posts

analytics:
  vendors:
    googleAnalytics:
      id: 'G-XXXXXXXXXX'

ui:
  theme: 'light:only'
```

**Campos importantes:**

- `site.site` - URL canônica (afeta sitemap, SEO)
- `metadata` - SEO padrão para todas as páginas
- `apps.blog.post.permalink` - Padrão de URL dos posts
- `analytics` - IDs do Google Analytics e GTM

---

### `_htaccess` (YAML)

Configuração para geração do `.htaccess` (Apache). Processado pela integração `generate-htaccess.ts`.

```yaml
enabled: true
forceHttps: false # Servidor já faz redirect
forceWww: remove # Remove www do domínio
domain: aguasaogeraldo.com.br

redirects:
  - from: /noticias/
    to: /blog/
    code: 301

cors:
  fonts: true
  images: true
  allowCredentials: true

compression:
  gzip: true
  brotli: true

caching:
  enabled: true
  rules:
    - type: 'image/webp'
      duration: 'access plus 1 year'
    - type: 'text/html'
      duration: 'access plus 1 hour'

customRules: |
  # Security headers
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "SAMEORIGIN"
```

**Campos importantes:**

- `redirects` - Redirecionamentos 301/302
- `caching.rules` - Políticas de cache por tipo MIME
- `customRules` - Regras Apache raw (segurança, bloqueios)

---

### `_headers`

Headers HTTP para CDN/edge (formato Netlify/Cloudflare Pages).

```
/_astro/*
  Cache-Control: public, max-age=31536000, immutable
```

---

### `robots.txt`

Configuração de crawlers. Editável pelo CMS.

---

### `admin/config.yml`

Configuração do Sveltia CMS. Ver [CMS_WORKFLOW.md](./CMS_WORKFLOW.md).

---

## Content Collections

Definidas em `src/content/config.ts`. Usam **Astro Content Layer** com `glob` loader.

| Collection     | Pasta                     | Schema Principal                                          |
| -------------- | ------------------------- | --------------------------------------------------------- |
| `post` (news)  | `src/data/news/`          | title, excerpt, image, category, tags, publishDate        |
| `banner`       | `src/data/banner/`        | title, image, cta, order, active, publishDate, expireDate |
| `middleBanner` | `src/data/middle-banner/` | title, image, active                                      |
| `distribuidor` | `src/data/distribuidor/`  | nome, endereco, telefone, lat, lng, active                |
| `pages`        | `src/data/pages/`         | title, layout, body, metadata                             |
| `tag`          | `src/data/tag/`           | title, description                                        |
| `category`     | `src/data/category/`      | title, description                                        |
| `aboutGallery` | `src/data/about-gallery/` | image, active                                             |

**Validação:** Todos os schemas são validados com Zod. Erros de schema quebram o build.

---

## Integrações Astro

### Oficiais

| Integração           | Uso                              |
| -------------------- | -------------------------------- |
| `@astrojs/sitemap`   | Gera `sitemap.xml`               |
| `@astrojs/mdx`       | Suporte a MDX (Markdown + JSX)   |
| `@astrojs/react`     | Componentes React                |
| `@astrojs/partytown` | Scripts de terceiros (analytics) |

### Terceiros

| Integração         | Uso                              |
| ------------------ | -------------------------------- |
| `astro-icon`       | Sistema de ícones (Tabler, MDI)  |
| `astro-compress`   | Compressão de HTML, CSS, JS, SVG |
| `astro-seo-schema` | JSON-LD Schema.org               |

### Customizadas (`vendor/`)

#### `astrowind`

Carrega configuração global de `public/_config`.

#### `generate-htaccess`

Gera `.htaccess` a partir de `public/_htaccess` (YAML → Apache).

**Funcionalidades:**

- Redirects 301/302
- CORS para fonts e imagens
- Compressão gzip/brotli
- Cache por tipo MIME
- Security headers
- Regras customizadas

---

## Plugins Markdown

Definidos em `src/utils/frontmatter.ts`:

| Plugin                          | Tipo   | Função                                        |
| ------------------------------- | ------ | --------------------------------------------- |
| `readingTimeRemarkPlugin`       | Remark | Calcula tempo de leitura                      |
| `resolveImagePathsRemarkPlugin` | Remark | Converte paths `/src/assets/` para relativos  |
| `responsiveTablesRehypePlugin`  | Rehype | Wraps tables em `<div style="overflow:auto">` |
| `lazyImagesRehypePlugin`        | Rehype | Adiciona `loading="lazy"` em imagens          |

### Shortcodes

Definidos em `src/utils/remark-plugins/shortcodes.ts`. Permitem sintaxe especial em Markdown.

---

## Sistema de Cores

Definido em `src/ui/colors.ts`:

```typescript
export const colors = {
  agua: {
    primary: {
      blue: '#004F9F',   // Azul principal
      green: '#74BC1F',  // Verde principal
    },
    secondary: {
      green: '#19CF41',
      blue: '#1BBAEE',
    },
  },
  caju: { ... },  // Cores legado (Cajuína)
};
```

**Uso no Tailwind:**

```html
<div class="bg-agua-primary-blue text-agua-primary-green"></div>
```

---

## Scripts de Desenvolvimento

```bash
pnpm dev          # Dev server (localhost:4321)
pnpm build        # Build de produção → ./dist/
pnpm preview      # Preview do build local
pnpm check        # Lint + type check (Astro + ESLint + Prettier)
pnpm fix          # Auto-fix ESLint e Prettier
pnpm knip         # Detectar código/dependências não utilizadas
```

---

## Configuração do Build

### `astro.config.ts`

```typescript
export default defineConfig({
  site: 'https://aguasaogeraldo.com.br',
  trailingSlash: 'always', // URLs terminam com /
  output: 'static', // SSG puro (sem SSR)

  integrations: [
    sitemap(),
    mdx(),
    icon({ include: { tabler: ['*'] } }),
    compress({ CSS: true, HTML: true, JavaScript: true }),
    astrowind({ config: './public/_config' }),
    generateHtaccess({ config: './public/_htaccess' }),
    react(),
  ],

  image: {
    domains: ['cdn.pixabay.com', 'images.unsplash.com'],
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: { '@': './src' }, // Import alias
    },
  },
});
```

**Pontos importantes:**

- `trailingSlash: 'always'` - Todas as URLs terminam com `/`
- `output: 'static'` - Gera HTML estático (não há servidor)
- `image.domains` - Domínios permitidos para otimização de imagens remotas

---

## Domínios de Imagem

Para usar imagens de domínios externos, adicione em `astro.config.ts`:

```typescript
image: {
  domains: ['cdn.pixabay.com', 'images.unsplash.com'],
}
```

---

## Variáveis de Ambiente

### Build time (disponíveis no servidor)

```bash
SITE_URL                     # URL de produção
GOOGLE_SITE_VERIFICATION     # Verificação do Google Search Console
GOOGLE_ANALYTICS_ID          # ID do GA4
```

### Client-side (prefixo `PUBLIC_`)

```bash
PUBLIC_GOOGLE_MAPS_KEY_PROD  # API Key do Google Maps
PUBLIC_GOOGLE_CAPTCHA_SITEKEY # Site key do reCAPTCHA
PUBLIC_API_BASE_URL          # URL base da API
```

---

## Troubleshooting

### Build falha com erro de schema

- Verificar `src/content/config.ts`
- Validar frontmatter dos arquivos em `src/data/`

### Imagens não aparecem

- Verificar se o domínio está em `image.domains`
- Usar componente `Image.astro` (não `<img>` direto)

### Deploy não dispara

- Verificar se commit tem prefixo `[cms]` ou `[ci]`
- Verificar logs do GitHub Actions

### .htaccess não atualiza

- Rebuild necessário (`pnpm build`)
- Verificar sintaxe YAML em `public/_htaccess`

### Cache não limpa em produção

- `.htaccess` define cache de 1 ano para assets
- Astro gera hashes nos nomes dos arquivos (`/_astro/`)
- HTML tem cache de 1 hora

---

## Links Úteis

- [Astro Docs](https://docs.astro.build)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Sveltia CMS Docs](https://github.com/cajuinasaogeraldo/sveltia-cms)
- [CMS_WORKFLOW.md](./CMS_WORKFLOW.md) - Fluxo do CMS
