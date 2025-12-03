# Água São Geraldo - Copilot Instructions

## Stack e Arquitetura

- **Framework**: Astro 5.x (SSG puro, sem SSR) + React para componentes interativos
- **Estilização**: Tailwind CSS 4.x (via `@tailwindcss/vite`)
- **Package Manager**: pnpm (obrigatório)
- **CMS**: Sveltia CMS (headless) em `/admin/`
- **Deploy**: SSH/rsync para Hostinger

## Estrutura Crítica

```
src/
├── content/config.ts    # Schemas das collections (Zod) - SEMPRE validar aqui
├── data/                # Conteúdo Markdown gerenciado pelo CMS
│   ├── news/            # Posts do blog (collection: post)
│   ├── banner/          # Slides do banner principal
│   └── distribuidor/    # Pontos de venda com lat/lng
├── components/
│   ├── common/Image.astro  # SEMPRE usar para imagens (otimização automática)
│   └── react/           # Componentes interativos (Swiper, Forms, Maps)
├── utils/blog.ts        # Funções de fetch/filter de posts (fetchPosts, findLatestPosts)
├── navigation.ts        # Links do header/footer
└── ui/colors.ts         # Paleta de cores da marca
```

## Padrões de Código

### Imports - usar alias `@`
```typescript
import Image from '@/components/common/Image.astro';
import { fetchPosts } from '@/utils/blog';
import type { News } from '@/types';
```

### Collections - usar glob loader
```typescript
// src/content/config.ts
const news = defineCollection({
  loader: glob({ base: './src/data/news', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) => z.object({ title: z.string(), image: image() })
});
```

### Cores da marca
```typescript
// Usar classes Tailwind: bg-agua-primary-blue, text-agua-primary-green
agua: { primary: { blue: '#004F9F', green: '#74BC1F' } }
```

## Comandos

```bash
pnpm dev          # Dev server (localhost:4321)
pnpm build        # Build de produção
pnpm check        # Lint + type check (rodar antes de commit)
pnpm fix          # Auto-fix ESLint/Prettier
pnpm knip         # Detectar código não utilizado
```

## CI/CD Workflows

| Workflow | Trigger | Ação |
|----------|---------|------|
| `deploy-ssh.yml` | push main, workflow_dispatch | Build + rsync para Hostinger |
| `create-and-merge-pr.yml` | commits `[cms]` ou `[ci]` | Auto-merge PR do CMS |
| `preview-deploy.yml` | PRs | Deploy de preview |

## Convenções Importantes

1. **Imagens**: Sempre usar `Image.astro` (nunca `<img>` direto)
2. **Blog**: Posts em `src/data/news/`, usar `fetchPosts()` de `@/utils/blog`
3. **CMS**: Configuração em `public/admin/config.yml` - commits do CMS têm prefixo `[cms]`
4. **Rotas dinâmicas**: Posts em `/{slug}/`, categorias em `/category/{slug}/`
5. **SEO**: Configuração global em `src/_config.yaml`, componente `Metadata.astro`
6. **Tailwind**: Classes de botão: `btn-primary`, `btn-secondary`, `btn-tertiary`

## Variáveis de Ambiente (build)

```bash
PUBLIC_GOOGLE_MAPS_KEY_PROD  # API do Google Maps
PUBLIC_GOOGLE_CAPTCHA_SITEKEY # reCAPTCHA
PUBLIC_API_BASE_URL          # API backend
SITE_URL                     # URL de produção
```

## Integrações Customizadas

- `vendor/integration/generate-htaccess.ts` - Gera `.htaccess` a partir de `src/_htaccess.yml`
- `src/utils/frontmatter.ts` - Plugins remark/rehype (reading time, lazy images)
- `src/utils/remark-plugins/shortcodes.ts` - Shortcodes customizados para MDX
