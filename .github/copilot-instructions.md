# Água Mineral São Geraldo – Copilot Instructions (Internal)

Estas instruções definem **como o agente deve interpretar, navegar e documentar este repositório**.  
Não são sugestões: são **padrões internos**.

## Stack & Build

- Astro 5 (SSG, `output: 'static'`, `trailingSlash: 'always'`).
- React usado exclusivamente para widgets interativos.
- Tailwind 4 via `@tailwindcss/vite`; cores centralizadas em `src/ui/colors.ts` (`caju.*`).
- Gerenciador padrão: **pnpm** (obrigatório).
- Scripts relevantes: `pnpm dev`, `pnpm build`, `pnpm check`, `pnpm fix`, `pnpm knip`.

## Conteúdo & Dados

- Collections são definidas em `src/content/config.ts` (glob loader):
  - `post` (`src/data/news`), `product`, `banner`, `middleBanner`, `distribuidor`, `tag`, `category`, `socialResponsability`, `pages`.
- **Schemas Zod devem ser alterados antes de qualquer mudança em `src/data/**`\*\*.
- Permalinks são centralizados em `src/utils/permalinks.ts`.
  - Produtos seguem `PRODUCTS_PERMALINK_PATTERN` (`/produtos/%slug%`).
  - Rotas em `src/pages/produtos/[product].astro`.

## Componentes & Padrões

- Imagens: usar exclusivamente `src/components/common/Image.astro` (unpic/astro).
  - Uso direto de `<img>` é considerado desvio de padrão.
- Widgets React ficam em `src/components/react/widgets/`.
- Forms (distribuidor/parcerias):
  - Constantes compartilhadas em `src/components/react/common/form-constants.ts`.
  - Sempre enviar `captchaToken` e `formId` no `FormData`.
- Navegação estática definida em `src/navigation.ts`.

## SEO & Configuração

- Configuração global em `src/_config.yaml`.
- Integrações declaradas em `Astro.config.ts` (sitemap, mdx, icons, compress, etc.).
- `.htaccess` é **gerado**, não editado manualmente:
  - Fonte: `src/_htaccess.yml`
  - Geração: `vendor/integration/generate-htaccess.ts`

## CMS & Fluxo de Deploy

- CMS: Sveltia (`public/admin/config.yml`).
  - Backend GitHub: branch `development`.
  - Commits automatizados com prefixo `[cms]`.
- CI/CD em `.github/workflows/`:
  - `deploy-ssh.yml`: deploy de `main` → Hostinger.
  - `create-and-merge-pr.yml`: merge automático `development` → `main`.
  - `preview-deploy.yml`: preview manual.

## Convenções de Código

- Imports via alias `@`.
- Slugs e URLs **sempre** usando helpers:
  - `getPermalink`, `cleanSlug`, `trimSlash`
- URLs finais **sempre** com `/`.
- Helpers:
  - Blog: `src/utils/blog.ts`
  - Produtos: `src/utils/products.ts`

## Variáveis de Ambiente (Principais)

- `PUBLIC_GOOGLE_MAPS_KEY_PROD`
- `PUBLIC_GOOGLE_CAPTCHA_SITEKEY`
- `PUBLIC_API_BASE_URL`
- `SITE_URL`
- `API_BASE_URL`
- Credenciais SSH/Host para deploy

## Notas Operacionais

- Produtos exigem: `normalImage`, `hoverImage`, `details`, `ingredients`.
- Banner principal:
  - Controlado por `active`, `order`, `publishDate`.
  - Preload apenas na home (`PreloadAssets.astro`).
- Blog usa `getCollection('post')`, independente do nome da pasta (`data/news`).

---

## Documentation Style & Behavior (Internal – Mandatory)

### Context Navigation

- O agente **deve navegar por todo o repositório**: código, estrutura, README e `/docs`.
- Custo ou tempo **não são fatores de decisão**.
- `/docs/ARCHITECTURE` e `/docs/CMS_WORKFLOW` são **fonte de verdade** para:
  - Decisões estruturais
  - Fluxo editorial
  - Intenção do sistema

### Documentation Principles

- Documentar **intenção e responsabilidade**, não implementação.
- A documentação deve ser **opinativa e diretiva**, deixando claro:
  - Por que algo existe
  - Qual problema estrutural resolve
  - Qual é o uso esperado dentro do time
  - Quais riscos surgem ao sair do padrão
- O leitor é sempre um **dev experiente do time**.

### Hard Restrictions

- É proibido:
  - Escrever exemplos de código
  - Copiar trechos de arquivos
  - Descrever conteúdo interno de arquivos como exemplo
  - **CRIAR NOVOS ARQUIVOS DE DOCUMENTAÇÃO** além dos existentes (ARCHITECTURE.md, DEVGUIDE.md, CMS_WORKFLOW.md, ADRs)
- Não explicar:
  - Uso de IDE
  - Tooling básico
  - Conceitos óbvios de linguagem, framework ou stack
- Evitar qualquer tom didático ou introdutório.

### Documentation Files Structure

**Arquivos de documentação permitidos:**

- `docs/ARCHITECTURE.md` — Estrutura, decisões arquiteturais, integrações
- `docs/DEVGUIDE.md` — Desenvolvimento, comandos, princípios
- `docs/CMS_WORKFLOW.md` — Fluxo editorial e CMS
- `docs/adr/*.md` — Architecture Decision Records
- `vendor/README.md` — Documentação específica da camada vendor

**NUNCA criar:**

- Novos arquivos de documentação root (ex: SYSTEM_INTENT.md, DESIGN.md)
- Documentação duplicada em outros diretórios
- Arquivos de resumo ou changelog além dos existentes

**Quando atualizar documentação:**

- Mesclar conteúdo nos arquivos existentes
- Adicionar seções relevantes em ARCHITECTURE.md ou DEVGUIDE.md
- Criar ADR em `docs/adr/` apenas para decisões arquiteturais críticas

### References & Signals

- Quando relevante, apenas sinalizar que:
  - Funções ou módulos possuem **JSDoc disponível**
- Não repetir literalmente conteúdo do README ou `/docs`;
  - Complementar apenas com **contexto, intenção e direção técnica**.

### Goal

Produzir documentação interna que:

- Reforce decisões arquiteturais existentes
- Oriente manutenção e evolução do sistema
- Reduza ambiguidade e improvisação
- Sirva como referência rápida para o time
- **Permaneça nos arquivos estabelecidos**

## Architecture Decisions (ADR)

- As decisões arquiteturais registradas em `/docs/adr/` são **normativas**.
- O agente deve:
  - Respeitar essas decisões ao sugerir código ou documentação.
  - Referenciar ADRs relevantes ao explicar por que algo funciona de determinada forma.
  - Evitar sugestões que contradigam ADRs aceitos.
