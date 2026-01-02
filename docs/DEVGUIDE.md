# Guia de Desenvolvimento - Cajuína São Geraldo

Guia para configurar o ambiente e desenvolver localmente.

---

## Índice

- [Requisitos](#requisitos)
- [Stack Tecnológica](#stack-tecnológica)
- [Instalação](#instalação)
- [Comandos Disponíveis](#comandos-disponíveis)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Configuração do Astro](#configuração-do-astro)
- [Trabalhando com Imagens](#trabalhando-com-imagens)
- [Trabalhando com Content Collections](#trabalhando-com-content-collections)
- [Plugins Markdown](#plugins-markdown)
- [Tailwind CSS](#tailwind-css)
- [CI/CD Pipelines](#cicd-pipelines)
- [Troubleshooting](#troubleshooting)
- [Links Úteis](#links-úteis)

---

## Requisitos

| Ferramenta  | Versão   | Obrigatório |
| ----------- | -------- | ----------- |
| **Node.js** | 20.18.0+ | ✅          |
| **pnpm**    | 9.x      | ✅          |
| **Git**     | 2.x      | ✅          |

> ⚠️ **Importante:** Use **pnpm** como gerenciador de pacotes.

---

## Stack Tecnológica

| Tecnologia          | Versão | Uso                                            |
| ------------------- | ------ | ---------------------------------------------- |
| **Astro**           | 5.x    | Framework SSG (Static Site Generation)         |
| **React**           | 19.x   | Componentes interativos (sliders, forms, maps) |
| **Tailwind CSS**    | 4.x    | Estilização (via `@tailwindcss/vite`)          |
| **TypeScript**      | 5.x    | Tipagem estática                               |
| **Zod**             | 3.x    | Validação de schemas                           |
| **Swiper**          | 12.x   | Carrosséis e sliders                           |
| **React Hook Form** | 7.x    | Formulários React                              |

---

## Instalação

### 1. Clone o repositório

```bash
git clone git@github.com:cajuinasaogeraldo/cajuina-site.git
cd cajuina-site
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure as variáveis de ambiente (opcional)

Crie um arquivo `.env` na raiz:

```bash
# .env
PUBLIC_GOOGLE_MAPS_KEY_PROD=sua_api_key
PUBLIC_GOOGLE_CAPTCHA_SITEKEY=sua_sitekey
PUBLIC_API_BASE_URL=https://api.exemplo.com
SITE_URL=http://localhost:4321
```

### 4. Inicie o servidor de desenvolvimento

```bash
pnpm dev
```

O site estará disponível em **<http://localhost:4321>**

---

## Comandos Disponíveis

### Desenvolvimento

```bash
pnpm dev          # Inicia servidor de desenvolvimento (localhost:4321)
pnpm start        # Alias para pnpm dev
```

### Build

```bash
pnpm build        # Gera build de produção em ./dist/
pnpm preview      # Preview do build local (após pnpm build)
```

### Qualidade de Código

```bash
pnpm check        # Roda todos os checks (Astro + ESLint + Prettier)
pnpm check:astro  # Verifica tipos do Astro
pnpm check:eslint # Verifica regras do ESLint
pnpm check:prettier # Verifica formatação

pnpm fix          # Auto-fix ESLint e Prettier
pnpm fix:eslint   # Auto-fix apenas ESLint
pnpm fix:prettier # Auto-fix apenas Prettier
```

### Análise

```bash
pnpm knip         # Detecta código/dependências não utilizadas
pnpm fix:knip     # Auto-fix do knip (remove exports não usados)
```

### Astro CLI

```bash
pnpm astro        # CLI do Astro
pnpm astro add    # Adicionar integrações
pnpm astro check  # Type checking
```

---

## Variáveis de Ambiente

### Build-time (servidor)

Disponíveis apenas durante o build:

| Variável                   | Descrição                         | Exemplo                            |
| -------------------------- | --------------------------------- | ---------------------------------- |
| `SITE_URL`                 | URL de produção                   | `https://cajuinasaogeraldo.com.br` |
| `GOOGLE_SITE_VERIFICATION` | Verificação Google Search Console | `abc123...`                        |
| `GOOGLE_ANALYTICS_ID`      | ID do GA4                         | `G-XXXXXXXXXX`                     |
| `API_BASE_URL`             | URL base da API (backend)         | `https://api.exemplo.com`          |

### Client-side (prefixo `PUBLIC_`)

Disponíveis no navegador:

| Variável                        | Descrição                | Exemplo                   |
| ------------------------------- | ------------------------ | ------------------------- |
| `PUBLIC_GOOGLE_MAPS_KEY_PROD`   | API Key do Google Maps   | `AIza...`                 |
| `PUBLIC_GOOGLE_CAPTCHA_SITEKEY` | Site key do reCAPTCHA v2 | `6Lc...`                  |
| `PUBLIC_API_BASE_URL`           | URL base da API (client) | `https://api.exemplo.com` |

### Variáveis de Deploy (CI/CD)

Configuradas nos secrets/variables do GitHub:

```bash
# Secrets (sensíveis)
SSH_PRIVATE_KEY              # Chave SSH privada para deploy
PUBLIC_GOOGLE_MAPS_KEY_PROD  # API Key do Google Maps

# Variables
SSH_HOST                     # Host SSH (Hostinger)
SSH_USER                     # Usuário SSH
SSH_PORT                     # Porta SSH
SSH_REMOTE_PATH              # Caminho remoto do site
SSH_PREVIEW_REMOTE_PATH      # Caminho do preview
PREVIEW_URL                  # URL do ambiente de preview
```

### Usando no código

```typescript
// Em arquivos .astro ou .ts (server-side)
const siteUrl = import.meta.env.SITE_URL;

// Em componentes React (client-side)
const mapsKey = import.meta.env.PUBLIC_GOOGLE_MAPS_KEY_PROD;
```

---

## Trabalhando com Imagens

### Componente Image.astro

**Sempre use o componente `Image.astro`** para imagens otimizadas:

```astro
---
import Image from '@/components/common/Image.astro';
---
```

### Imagens em Content Collections

Nas collections, use o helper `image()` do Zod:

```typescript
// src/content/config.ts
schema: ({ image }) =>
  z.object({
    normalImage: image(),
    hoverImage: image().optional(),
  }),
```

---

> ⚠️ Alterações no schema podem quebrar o build se os arquivos existentes não estiverem conformes.

---

## Plugins Markdown

### Remark (processam Markdown)

| Plugin                          | Função                       |
| ------------------------------- | ---------------------------- |
| `readingTimeRemarkPlugin`       | Calcula tempo de leitura     |
| `resolveImagePathsRemarkPlugin` | Resolve paths `@/assets/...` |
| `remarkShortcodes`              | Shortcodes customizados      |

### Rehype (processam HTML)

| Plugin                         | Função                           |
| ------------------------------ | -------------------------------- |
| `responsiveTablesRehypePlugin` | Wraps tables em div com overflow |
| `lazyImagesRehypePlugin`       | Adiciona `loading="lazy"`        |

---

## Tailwind CSS

### Configuração

O Tailwind 4 é integrado via `@tailwindcss/vite`:

```typescript
// astro.config.ts
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

### Cores Customizadas

Definidas em `src/ui/colors.ts` com prefixo `caju`:

```typescript
export const colors = {
  caju: {
    secondary: {
      yellow: '#f7a421',
      orange: '#ea5426',
    },
    heading: {
      primary: '#09863C',
      secondary: '#00422a',
    },
    // ...
  },
};
```

---

## CI/CD Pipelines

### Fluxo de Deploy

```any
development → PR automático → main → Deploy Hostinger
     ↑                                      ↓
   CMS salva                          Site em produção
```

### Workflows

#### 1. `deploy-ssh.yml` - Deploy de Produção

**Triggers:** Push em `main`, workflow_dispatch, repository_dispatch

#### 2. `create-and-merge-pr.yml` - Auto-merge CMS

**Triggers:** Push em `development` com `[cms]` ou `[ci]`

#### 3. `preview-deploy.yml` - Preview

**Triggers:** repository_dispatch `sveltia-cms-preview`

### Disparando Rebuild Manual

No GitHub Actions, vá em **Actions → deploy-ssh.yml → Run workflow**.

---

## Troubleshooting

### Build falha com erro de schema

```any
[ERROR] Invalid content in "src/data/news/meu-post.md"
```

**Solução:**

1. Verifique o frontmatter do arquivo
2. Compare com o schema em `src/content/config.ts`
3. Campos obrigatórios devem estar presentes

### Imagens não aparecem

**Causas comuns:**

- Domínio não está em `image.domains`
- Path incorreto (use `@/assets/...`)
- Usando `<img>` direto (use `Image.astro`)

**Solução:**

```typescript
// astro.config.ts
image: {
  domains: ['novo-dominio.com'],
}
```

### Deploy não dispara automaticamente

**Causas:**

- Commit não tem prefixo `[cms]` ou `[ci]`
- Branch incorreta

**Solução:**

- Verifique o prefixo do commit
- Verifique logs em GitHub Actions

### .htaccess não atualiza

**Solução:**

1. Rebuild necessário (`pnpm build`)
2. Verifique sintaxe YAML em `public/_htaccess`

### Erro "Cannot find module '@/...'"

**Solução:**

1. Verifique se o alias está configurado em `tsconfig.json`
2. Reinicie o servidor de desenvolvimento

### Cache não limpa em produção

**Entenda:**

- Assets em `/_astro/` têm cache de 1 ano (hash no nome)
- HTML tem cache de 1 hora
- Para forçar refresh, faça rebuild (novos hashes)

### TypeScript errors

```bash
# Verificar tipos
pnpm check:astro

# Gerar types das collections
pnpm astro sync
```

---

## Princípios de Desenvolvimento

### Content Collections como Contrato

**Regra:** Schemas Zod em `src/content/config.ts` são contratos rígidos.

**Por quê:** Mudança no schema quebra build se arquivos `.md` não forem conformes.

**Consequência:** Alterações em schemas exigem migração de todos os arquivos markdown afetados.

### Componente Image Obrigatório

**Regra:** Usar sempre `src/components/common/Image.astro`, nunca `<img>` direto.

**Por quê:** Performance visual previsível: formatos modernos, lazy loading, responsive images.

**Consequência:** Uso de `<img>` indica código legado ou bug.

### React Apenas para Widgets

**Regra:** React usado exclusivamente para widgets interativos (formulários, sliders, mapas).

**Por quê:** Manter bundle JavaScript pequeno, apenas hidratar componentes interativos.

**Consequência:** Uso de React fora de `src/components/react/widgets/` indica design incorreto.

### Formulários com Zod + reCAPTCHA

**Regra:** Todo formulário deve enviar `captchaToken` e `formId` no `FormData`.

**Por quê:** Validação client-side + server-side obrigatória contra spam. E identificação do formulário, pois a função lambda recebe requisições de múltiplos formulários da cajuína e da água mineral.

---

## Links Úteis

### Documentação Oficial

- [Astro Docs](https://docs.astro.build)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Docs](https://react.dev)
- [Zod Docs](https://zod.dev)

### Projeto

- [Arquitetura do Projeto](./ARCHITECTURE.md)
- [Fluxo do CMS](../CMS_WORKFLOW.md)
- [Architecture Decision Records](./adr/)

### Ferramentas

- [Sveltia CMS](https://github.com/sveltia/sveltia-cms)
- [Astro Icon](https://github.com/natemoo-re/astro-icon)
- [Swiper](https://swiperjs.com/react)
