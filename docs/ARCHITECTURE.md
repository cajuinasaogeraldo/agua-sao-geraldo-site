# Arquitetura do Projeto - Cajuína São Geraldo

Documentação da estrutura e organização do código-fonte.

---

## Índice

- [Visão Geral](#visão-geral)
- [Estrutura de Diretórios](#estrutura-de-diretórios)
- [Rotas (Pages)](#rotas-pages)
- [Content Collections](#content-collections)
- [Componentes](#componentes)
- [Layouts](#layouts)
- [Navegação](#navegação)
- [Utilitários](#utilitários)
- [Integrações Customizadas](#integrações-customizadas)
- [Arquivos de Configuração](#arquivos-de-configuração)

---

## Visão Geral

O projeto segue a arquitetura padrão do **Astro 5** com SSG (Static Site Generation). Os principais conceitos são:

- **Pages**: Rotas do site (arquivos `.astro` em `src/pages/`)
- **Components**: Componentes reutilizáveis (Astro + React)
- **Content Collections**: Conteúdo gerenciado via Markdown/MDX
- **Layouts**: Templates de página
- **Utils**: Funções auxiliares

[![Container Diagram](/docs/images/containerDiagram.jpg 'Container Diagram')](https://miro.com/app/board/uXjVGZnH8xw=/)

---

## Estrutura de Diretórios

```any
cajuina-site/
├── .github/workflows/        # CI/CD (GitHub Actions)
│
├── docs/                     # Documentação técnica
│
├── public/                   # Arquivos estáticos (copiados sem processamento)
│   ├── _config               # Configuração global do site (YAML)
│   ├── _headers              # Headers HTTP para CDN
│   ├── _htaccess             # Configuração .htaccess (YAML → Apache)
│   ├── robots.txt            # Configuração de crawlers
│   ├── admin/                # Sveltia CMS
│   │   ├── config.yml        # Configuração do CMS
│   │   └── collections/      # Definições de collections do CMS
│   └── fonts/                # Fontes customizadas
│
├── src/
│   ├── assets/               # Assets processados pelo Astro
│   │
│   ├── components/           # Componentes reutilizáveis
│   │   ├── *.astro           # Componentes principais (Header, Footer, etc.)
│   │   ├── blog/             # Componentes do blog
│   │   ├── common/           # Componentes utilitários (Image, Metadata, etc.)
│   │   ├── cookie-consent/   # Banner de cookies
│   │   ├── react/            # Componentes React interativos
│   │   │   ├── common/       # Compartilhados (form-constants, etc.)
│   │   │   ├── hooks/        # React hooks customizados
│   │   │   ├── types/        # TypeScript types
│   │   │   └── widgets/      # Widgets interativos
│   │   ├── ui/               # Componentes de UI base
│   │   └── widgets/          # Widgets Astro
│   │
│   ├── content/              # Configuração das Coleções do CMS
│   │   └── config.ts         # Schemas Zod das collections
│   │
│   ├── data/                 # Conteúdo Markdown (gerenciado pelo CMS)
│   │   ├── about-gallery/    # Galeria da página Sobre
│   │   ├── banner/           # Slides do banner principal
│   │   ├── category/         # Categorias do blog
│   │   ├── distribuidor/     # Pontos de distribuição
│   │   ├── middle-banner/    # Banner do meio do site
│   │   ├── news/             # Posts do blog
│   │   ├── pages/            # Páginas dinâmicas
│   │   └── tag/              # Tags do blog
│   │
│   ├── layouts/              # Templates de página
│   │
│   ├── pages/                # Rotas do site
│   │   ├── index.astro       # Home
│   │   ├── 404.astro         # Página de erro
│   │   ├── sobre.astro       # Página Sobre
│   │   ├── [...blog]/        # Rotas dinâmicas do blog
│   │   ├── admin/            # Painel do CMS
│   │   ├── fale-conosco/     # Formulário de contato
│   │   └── solicite/         # Formulários (revendedor, parcerias)
│   │
│   ├── styles/               # CSS global
│   │
│   ├── ui/                   # Configuração de UI
│   │   └── colors.ts         # Paleta de cores (prefixo agua.*)
│   │
│   ├── utils/                # Funções utilitárias
│   │   ├── blog.ts           # Helpers para posts
│   │   ├── permalinks.ts     # Geração de URLs
│   │   ├── images.ts         # Manipulação de imagens
│   │   ├── images-optimization.ts
│   │   ├── images-optimization-react.ts
│   │   ├── utils.ts          # Utilitários gerais
│   │   └── remark-plugins/   # Plugins customizados do editor Markdown
│   │       └── shortcodes.ts
│   │
│   ├── navigation.ts         # Links do header/footer
│   ├── types.d.ts            # TypeScript declarations
│   └── env.d.ts              # Env types
│
├── vendor/                   # Integrações customizadas
│   └── integration/
│       ├── index.ts          # Integração astrowind
│       ├── generate-htaccess.ts # Gerador de .htaccess
│       ├── types.d.ts
│       └── utils/
│
├── astro.config.ts           # Configuração principal do Astro
└── README.md                 # Documentação principal
```

---

## Rotas (Pages)

O Astro usa file-based routing. Cada arquivo em `src/pages/` vira uma rota.

### Rotas Estáticas

| Arquivo       | URL        | Descrição      |
| ------------- | ---------- | -------------- |
| `index.astro` | `/`        | Home           |
| `sobre.astro` | `/sobre/`  | Página Sobre   |
| `busca.astro` | `/busca/`  | Busca no site  |
| `404.astro`   | `/404/`    | Página de erro |
| `rss.xml.ts`  | `/rss.xml` | Feed RSS       |

### Rotas Dinâmicas

| Pasta            | Padrão de URL                                                | Descrição                      |
| ---------------- | ------------------------------------------------------------ | ------------------------------ |
| `[...blog]/`     | `/blog/`, `/blog/[slug]/`, `/category/[cat]/`, `/tag/[tag]/` | Blog e posts                   |
| `[...produtos]/` | `/produtos/`, `/produtos/[slug]/`                            | Listagem e detalhe de produtos |
| `empresa/`       | `/empresa/*`                                                 | Páginas institucionais         |
| `fale-conosco/`  | `/fale-conosco/`                                             | Formulário de contato          |
| `solicite/`      | `/solicite/seja-um-distribuidor/`, `/solicite/parcerias/`    | Formulários                    |
| `admin/`         | `/admin/`                                                    | Painel do CMS                  |

---

## Content Collections

Definidas em [src/content/config.ts](../src/content/config.ts) usando **Astro Content Layer** com glob loader e schemas **Zod**.

### Collections Disponíveis

| Collection           | Pasta em `src/data/` | Uso                        |
| -------------------- | -------------------- | -------------------------- |
| `post` (alias: news) | `news/`              | Posts do blog              |
| `banner`             | `banner/`            | Slides do banner principal |
| `middleBanner`       | `middle-banner/`     | Banner intermediário       |
| `distribuidor`       | `distribuidor/`      | Pontos de distribuição     |
| `tag`                | `tag/`               | Tags do blog               |
| `category`           | `category/`          | Categorias do blog         |
| `aboutGallery`       | `about-gallery/`     | Galeria da página Sobre    |

> **Nota:** A collection `post` carrega de `src/data/news/` por compatibilidade com template astrowind.

---

## Componentes

### Diretórios React Auxiliares

```any
src/components/react/
├── common/           # Compartilhados entre widgets
│   └── form-constants.ts  # Constantes de formulários
├── hooks/            # React hooks customizados
└── types/            # TypeScript types para React
```

---

## Layouts

Templates de página em `src/layouts/`:

| Layout              | Uso                               |
| ------------------- | --------------------------------- |
| `Layout.astro`      | Layout base (HTML, head, scripts) |
| `PageLayout.astro`  | Páginas com header/footer         |
| `AdminLayout.astro` | Painel do editor avançado do CMS  |

---

## Navegação

Definida estaticamente em [src/navigation.ts](../src/navigation.ts).

Exporta `headerData` (links + actions) e `footerData` (colunas + redes sociais).

---

## Utilitários

Funções auxiliares TypeScript em `src/utils/`. Cada arquivo possui documentação JSDoc detalhada visível na IDE.

**Principais arquivos:**

| Arquivo                     | Descrição                                              |
| --------------------------- | ------------------------------------------------------ |
| `permalinks.ts`             | Geração de URLs e padrões de permalink                 |
| `blog.ts`                   | Funções para buscar, filtrar e paginar posts           |
| `images.ts`                 | Resolução e otimização de imagens                      |
| `frontmatter.ts`            | Plugins Remark/Rehype (tempo leitura, lazy load, etc.) |
| `remark-plugins/shortcodes` | Shortcodes customizados para Markdown                  |

> **Dica:** Passe o mouse sobre as funções na IDE para ver documentação completa com exemplos.

---

## Integrações Customizadas

### Sveltia CMS Customizado

Este projeto conta com uma versão customizada do CMS, distribuída via **npm** e carregada no site através do **unpkg**, garantindo controle de versão previsível e independência em relação às releases da versão oficial.

O CMS foi estendido para atender necessidades específicas do fluxo editorial, incorporando **workflow editorial**, **preview configurável**, **observabilidade do tempo de build dos previews**, **templates personalizados de mensagens de commit**, **consulta automática dos últimos releases** e **tradução completa para pt-BR**.  
Essa abordagem proporciona maior previsibilidade, flexibilidade e controle sobre o processo de publicação, sem comprometer a estabilidade do CMS base.

#### Funcionalidades adicionadas

- Workflow editorial (`publish_mode: editorial_workflow`)
- Configuração de URL de preview (`preview_url`)
- Monitoramento do tempo de build dos previews
- Templates personalizados de mensagens de commit
- Consulta automática dos últimos releases
- Tradução completa para pt-BR

**Repositório:** <https://github.com/cajuinasaogeraldo/sveltia-cms>

#### Distribuição

- O CMS customizado é publicado no **npm** após uma release no github
- É carregado no site via **unpkg**
- Permite customizações específicas do projeto sem depender da versão oficial

#### Configuração

- Arquivo de configuração: `public/admin/config.yml`
- Documentação do fluxo de trabalho: [CMS_WORKFLOW.md](../CMS_WORKFLOW.md)

### Integrações Vendor

Localizadas em `vendor/integration/`. Este diretório contém código que integra-se ao ciclo de vida de build do Astro.

#### `astrowind` (`index.ts`)

**Responsabilidade:** Carrega `public/_config` (YAML) e expõe como módulo virtual `astrowind:config`.

**Por que existe:** Permitir que configuração global (site name, metadata, analytics) seja editada sem tocar código TypeScript e até mesmo pelo CMS.

#### `generate-htaccess` (`generate-htaccess.ts`)

**Responsabilidade:** Gera `.htaccess` Apache a partir de YAML (`public/_htaccess`) durante o build.

**Por que existe:** Versionamento de configuração de servidor Hostinger (redirects, CORS, cache, compressão) e consistência entre ambientes.

**Regra crítica:** `.htaccess` gerado é artefato de build, não código fonte. Sempre editar `public/_htaccess`.

Veja [ADR-006](./adr/006%20-%20geracao%20declarativa%20htaccess.md) para detalhes.

---

## Arquivos de Configuração

### `public/_config`

Configuração global em YAML: site, metadata, apps, analytics.

### `public/_htaccess`

Configuração do `.htaccess` em YAML: redirects, CORS, compression, caching.

### `public/admin/config.yml`

Configuração do Sveltia CMS. Documentação em [CMS_WORKFLOW.md](../CMS_WORKFLOW.md).

---

## Próximos Passos

- [Guia de Desenvolvimento](./DEVGUIDE.md) - Como rodar o projeto localmente
- [Guia do CMS](./CMS_WORKFLOW.md) - Como usar o painel de edição
- [Architecture Decision Records](./adr/) - Histórico de decisões técnicas críticas
