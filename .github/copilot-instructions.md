# Água São Geraldo - Copilot Instructions

## Visão Geral do Projeto

Site institucional da **Água Mineral São Geraldo**, construído com Astro 5 e hospedado na Hostinger. O projeto utiliza SSG (Static Site Generation) e inclui um CMS headless (Sveltia CMS) para gerenciamento de conteúdo.

- **URL de Produção**: https://aguasaogeraldo.com.br
- **Framework**: Astro 5.x com React para componentes interativos
- **Estilização**: Tailwind CSS 4.x
- **Package Manager**: pnpm
- **Linguagem**: TypeScript

---

## Estrutura do Projeto

```
src/
├── assets/              # Imagens, ícones, favicons
├── components/          # Componentes Astro e React
│   ├── blog/           # Componentes do blog (List, Grid, Pagination, etc.)
│   ├── common/         # Componentes compartilhados (Metadata, Image, etc.)
│   ├── react/          # Componentes React (widgets interativos)
│   ├── ui/             # Componentes de UI (Button, Headline, etc.)
│   └── widgets/        # Widgets de página (Hero, Features, etc.)
├── content/            # Configuração de collections (Astro Content Layer)
├── data/               # Arquivos Markdown das collections
│   ├── banner/         # Banners do slider principal
│   ├── middle-banner/  # Banners intermediários
│   ├── news/           # Posts do blog/notícias
│   ├── distribuidor/   # Distribuidores com geolocalização
│   ├── pages/          # Páginas dinâmicas
│   └── tag/, category/ # Taxonomias
├── layouts/            # Layouts de página
├── pages/              # Rotas do Astro
│   ├── [...blog]/      # Rotas do blog (posts, categorias, tags)
│   ├── [...pages]/     # Páginas dinâmicas do CMS
│   ├── admin/          # Painel do CMS (Sveltia)
│   └── solicite/       # Formulários de solicitação
├── styles/             # CSS global e Tailwind
├── ui/                 # Configuração de cores
└── utils/              # Utilitários (blog, images, permalinks)

public/
├── _config             # Configuração do site (YAML)
├── _htaccess           # Configuração do .htaccess
├── admin/              # Configuração do CMS
└── fonts/              # Fontes customizadas
```

---

## Collections (Content Layer)

O projeto usa **Astro Content Collections** com glob loader:

| Collection        | Descrição                       | Schema Principal                                           |
| ----------------- | ------------------------------- | ---------------------------------------------------------- |
| `post` (news)     | Posts do blog/notícias          | title, excerpt, image, category, tags, author, publishDate |
| `banner`          | Slides do banner principal      | title, image, cta, textPosition, overlay, order            |
| `middleBanner`    | Banners intermediários          | title, image, active                                       |
| `distribuidor`    | Pontos de venda com coordenadas | nome, endereco, telefone, lat, lng                         |
| `pages`           | Páginas dinâmicas do CMS        | title, layout, body, metadata                              |
| `aboutGallery`    | Galeria da página Sobre         | image, active                                              |
| `tag`, `category` | Taxonomias do blog              | title, description                                         |

---

## Paleta de Cores

Cores customizadas definidas em `src/ui/colors.ts`:

```typescript
// Cores da marca Água São Geraldo
agua: {
  primary: {
    blue: '#004F9F',   // Azul principal
    green: '#74BC1F',  // Verde principal
  },
  secondary: {
    green: '#19CF41',  // Verde secundário
    blue: '#1BBAEE',   // Azul secundário
  },
}

// Cores da marca Cajuína (legado)
caju: {
  primary: { light: '#005b3c', dark: '#00422a' },
  secondary: { yellow: '#f7a421', orange: '#ea5426' },
  // ...
}
```

**Uso no Tailwind**: `bg-agua-primary-blue`, `text-agua-primary-green`, etc.

---

## Componentes de UI

### Botões

Utilitários Tailwind customizados:

- `btn-primary` - Botão verde (ação principal)
- `btn-secondary` - Botão azul
- `btn-tertiary` - Botão outline verde
- `btn-action` - Botão transparente com borda

### Tipografia

Classes responsivas automáticas para headings:

- `h1` → `text-2xl sm:text-3xl md:text-5xl lg:text-6xl`
- `h2` → `text-xl sm:text-2xl md:text-4xl lg:text-5xl`
- Etc.

---

## Rotas do Blog

| Rota                | Descrição                    |
| ------------------- | ---------------------------- |
| `/blog/`            | Lista paginada de posts      |
| `/{slug}/`          | Post individual              |
| `/category/{slug}/` | Posts por categoria          |
| `/tag/{slug}/`      | Posts por tag                |
| `/busca?s={query}`  | Busca de posts (client-side) |

---

## SEO e Metadata

O componente `Metadata.astro` gerencia:

- Meta tags OpenGraph e Twitter Cards
- Schema.org JSON-LD com WebPage, WebSite e ImageObject
- SearchAction para busca indexável pelo Google
- Canonical URLs

**Configuração global** em `src/_config.yaml`:

```yaml
metadata:
  title:
    default: 'Água São Geraldo'
    template: '%s - São Geraldo'
  description: '...'
  robots: { index: true, follow: true }
```

---

## Componentes React

Localizados em `src/components/react/`:

- `BannerSwiper` - Slider de banners com Swiper
- `ReactParceriasForm` - Formulário de parcerias
- `ImageOptimized` - Componente de imagem otimizada para React

**Hooks customizados** em `src/components/react/hooks/`

---

## Padrões de Código

### Imports

```typescript
// Usar alias @ para imports internos
import Image from '@/components/common/Image.astro';
import { fetchPosts } from '@/utils/blog';
import type { News } from '@/types';
```

### Componentes Astro

```astro
---
// Frontmatter: imports, lógica, props
import type { Props } from './types';
const { title, class: className } = Astro.props;
---

<!-- Template HTML -->
<div class={className}>
  <h1>{title}</h1>
</div>
```

### Tailwind

- Preferir utilitários sobre CSS customizado
- Usar `twMerge` para merge de classes
- Breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Classes de escape: usar `!` para important (`text-white!`)

---

## Scripts de Desenvolvimento

```bash
pnpm dev          # Servidor de desenvolvimento
pnpm build        # Build de produção
pnpm preview      # Preview do build
pnpm check        # Lint + type check
pnpm fix          # Auto-fix ESLint e Prettier
pnpm knip         # Detectar código não utilizado
```

---

## Integrações Astro

- `@astrojs/sitemap` - Geração de sitemap
- `@astrojs/mdx` - Suporte a MDX
- `@astrojs/react` - Componentes React
- `astro-icon` - Ícones (Tabler, MDI)
- `astro-compress` - Compressão de assets
- `astro-seo-schema` - JSON-LD Schema.org
- `generateHtaccess` - Geração de .htaccess customizado

---

## CMS (Sveltia)

Painel admin acessível em `/admin/`. Configuração em `public/admin/config.yml`.

**Collections editáveis**:

- Notícias (news)
- Páginas (pages)
- Banners
- Distribuidores

---

## Boas Práticas

1. **Imagens**: Sempre usar o componente `Image.astro` para otimização automática
2. **SEO**: Passar metadata via props nos layouts
3. **Tipos**: Definir tipos em `src/types.d.ts`
4. **Collections**: Validar schemas em `src/content/config.ts`
5. **Responsividade**: Mobile-first com Tailwind
6. **Performance**: Usar `loading="lazy"` para imagens abaixo do fold
7. **Acessibilidade**: Sempre incluir `alt` em imagens e `aria-label` em ícones

---

## Observações

- O site é SSG puro, sem SSR
- Deploy via Hostinger ou qualquer host estático
- Domínio principal: aguasaogeraldo.com.br
- O projeto também contém assets da marca Cajuína (mesmo grupo empresarial)
