# Fluxo CMS → Deploy

Documentação do fluxo de publicação de conteúdo via Sveltia CMS.

## Visão Geral

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Sveltia CMS   │────▶│   development   │────▶│      main       │────▶│    Hostinger    │
│   /admin/       │     │    (branch)     │     │    (branch)     │     │   (produção)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │                       │
   Editor salva           Workflow cria            PR é mergeado          Deploy SSH/rsync
   com [cms]              PR automático            automaticamente        via workflow
```

## Modo: Editorial Workflow

O CMS está configurado com `publish_mode: editorial_workflow`, que permite:

- **Rascunhos**: Conteúdo salvo mas não publicado
- **Em Revisão**: Conteúdo aguardando aprovação
- **Publicado**: Conteúdo commitado na branch `development`

## Fluxo Detalhado

### 1. Editor cria/edita conteúdo no CMS

- Acessa `/admin/` (Sveltia CMS)
- Autentica via GitHub OAuth (Cloudflare Worker: `cajuina-cms-auth`)
- Edita banners, notícias, distribuidores, etc.
- Salva → commit na branch `development`

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

- Push na branch `development` com commit contendo `[cms]` ou `[ci]`
- `repository_dispatch` do tipo `sveltia-cms-publish`
- Manual via `workflow_dispatch`

**Ações:**

1. Cria PR de `development` → `main`
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

| Collection       | Pasta                     | Descrição                                            |
| ---------------- | ------------------------- | ---------------------------------------------------- |
| `banners`        | `src/data/banner/`        | Slides do banner principal                           |
| `middle-banner`  | `src/data/middle-banner/` | Banner intermediário                                 |
| `distribuidores` | `src/data/distribuidor/`  | Pontos de venda com geolocalização                   |
| `config`         | `public/`                 | Arquivos de configuração (headers, robots, htaccess) |

## Autenticação

- **OAuth Provider**: Cloudflare Worker
- **URL**: `https://cajuina-cms-auth.cadastro-cajuina.workers.dev/`
- **Repo**: `cajuinasaogeraldo/agua-sao-geraldo-site`
- **Branch padrão**: `development`

## Ambiente de Preview

- **URL**: `https://seagreen-squirrel-365460.hostingersite.com/`
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
