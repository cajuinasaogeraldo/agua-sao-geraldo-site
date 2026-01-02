# Fluxo CMS → Deploy

Documentação do fluxo de publicação de conteúdo via Sveltia CMS.

## Visão Geral

```any
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Sveltia CMS   │────▶│    cms/push     │────▶│      main       │────▶│    Hostinger    │
│   /admin/       │     │    (branch)     │     │    (branch)     │     │   (produção)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │                       │
   Editor publica         Workflow cria            PR é mergeado          Deploy SSH/rsync
   via Editorial          PR automático            automaticamente        via workflow
   Workflow
```

## Modo: Editorial Workflow

O CMS está configurado com `publish_mode: editorial_workflow`, que permite um fluxo de aprovação antes da publicação:

### Estados do Conteúdo

| Estado        | Descrição                                                        |
| ------------- | ---------------------------------------------------------------- |
| **Draft**     | Conteúdo salvo em branch temporária (ex: `cms/posts/meu-artigo`) |
| **In Review** | Cria Pull Request para revisão                                   |
| **Ready**     | Aprovado e pronto para publicar                                  |
| **Published** | Mergeado na branch `cms/push`                                    |

### Fluxo Técnico

1. Editor cria/edita → branch temporária criada
2. Editor muda para "In Review" → PR criado
3. Editor publica → PR mergeado na `cms/push`
4. Commit `[cms]` dispara workflows de CI/CD

## Fluxo Detalhado

### 1. Editor cria/edita conteúdo no CMS

- Acessa `/admin/` (Sveltia CMS)
- Autentica via GitHub OAuth (Cloudflare Worker: `cajuina-cms-auth`)
- Edita banners, notícias, distribuidores, etc.
- Salva como rascunho → branch temporária criada
- Publica via Editorial Workflow → commit na branch `cms/push`

### 2. Commit com prefixo `[cms]`

O CMS está configurado para gerar commits com prefixo `[cms]`:

```yaml
# public/admin/config.yml
commit_messages:
  create: '[cms] Create {{collection}} "{{slug}}" - {{author-name}}'
  update: '[cms] Update {{collection}} "{{slug}}" - {{author-name}}'
  delete: '[cms] Delete {{collection}} "{{slug}}" - {{author-name}}'
```

### 3. Workflow `create-and-merge-pr.yml` dispara

**Triggers:**

- Push na branch `cms/push` com commit contendo `[cms]` ou `[ci]`
- `repository_dispatch` do tipo `sveltia-cms-publish`
- Manual via `workflow_dispatch`

**Ações:**

1. Cria PR de `cms/push` → `main`
2. Adiciona PR à merge queue com `--auto`

```yaml
# .github/workflows/create-and-merge-pr.yml
- name: Add PR to merge queue
  run: gh pr merge ${{ steps.create-pr.outputs.pr_number }} --merge --auto
```

### 4. Workflow `deploy-ssh.yml` dispara

**Triggers:**

- Push na branch `main`
- Workflow `Create and Auto-Merge PR` completado com sucesso
- `repository_dispatch` (cms-publish, rebuild)
- Manual via `workflow_dispatch`

**Ações:**

1. Checkout do código
2. `pnpm install && pnpm build`
3. Deploy via rsync para Hostinger

## Arquivos Envolvidos

| Arquivo                                     | Responsabilidade              |
| ------------------------------------------- | ----------------------------- |
| `public/admin/config.yml`                   | Configuração do Sveltia CMS   |
| `.github/workflows/create-and-merge-pr.yml` | Cria PR e auto-merge          |
| `.github/workflows/deploy-ssh.yml`          | Build e deploy para Hostinger |

## Collections do CMS

| Collection             | Pasta                            | Descrição                                            |
| ---------------------- | -------------------------------- | ---------------------------------------------------- |
| `about-gallery`        | `src/data/about-gallery/`        | Galeria de imagens sobre a empresa                   |
| `banners`              | `src/data/banner/`               | Slides do banner principal                           |
| `distribuidores`       | `src/data/distribuidor/`         | Pontos de venda com geolocalização                   |
| `middle-banner`        | `src/data/middle-banner/`        | Banner intermediário                                 |
| `news`                 | `src/data/news/`                 | Notícias                                             |
| `pages`                | `src/data/pages/`                | Páginas estáticas                                    |
| `product`              | `src/data/product/`              | Produtos                                             |
| `socialResponsability` | `src/data/socialResponsability/` | Responsabilidade social                              |
| `config`               | `public/`                        | Arquivos de configuração (headers, robots, htaccess) |

## Autenticação

- **OAuth Provider**: Cloudflare Worker
- **URL**: `https://hub.cajuinasaogeraldo.com.br:8444/`
- **Repo**: `cajuinasaogeraldo/cajuina-site`
- **Branch padrão**: `cms/push`

## Ambiente de Preview

- **URL**: `https://maroon-shark-519604.hostingersite.com/`
- Configurado em `backend.preview_url` no CMS

## Troubleshooting

### PR não está sendo criado

- Verificar se o commit tem prefixo `[cms]` ou `[ci]`
- Verificar permissões do `GITHUB_TOKEN`

### Deploy não dispara após merge

- Verificar se o workflow `Create and Auto-Merge PR` completou com sucesso
- O deploy tem condition: `github.event.workflow_run.conclusion == 'success'`

### Conteúdo não aparece no site

1. Verificar se o PR foi mergeado na `main`
2. Verificar logs do workflow `Deploy via SSH Rsync`
3. Limpar cache do navegador/CDN
