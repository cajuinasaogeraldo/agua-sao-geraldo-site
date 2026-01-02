# Água Mineral São Geraldo - Site Institucional

[![Deploy via SSH Rsync](https://github.com/cajuinasaogeraldo/cajuina-site/actions/workflows/deploy-ssh.yml/badge.svg)](https://github.com/cajuinasaogeraldo/cajuina-site/actions/workflows/deploy-ssh.yml)

Site institucional da Água Mineral São Geraldo, desenvolvido com Astro 5.

[![Container Diagram](/docs/images/containerDiagram.jpg 'Container Diagram')](https://miro.com/app/board/uXjVGZnH8xw=/)

---

## 📚 Documentação

| Documento                                   | Descrição                                                                     |
| ------------------------------------------- | ----------------------------------------------------------------------------- |
| [**ARCHITECTURE.md**](docs/ARCHITECTURE.md) | Estrutura do projeto, decisões arquiteturais, rotas, collections, componentes |
| [**DEVGUIDE.md**](docs/DEVGUIDE.md)         | Como rodar o projeto, comandos, variáveis de ambiente, troubleshooting        |
| [**CMS_WORKFLOW.md**](docs/CMS_WORKFLOW.md) | Guia de uso do painel de edição                                               |
| [**ADRs**](docs/adr/)                       | Architecture Decision Records — histórico de decisões técnicas                |

---

## 🚀 Quick Start

```bash
# 1. Clone o repositório
git clone git@github.com:cajuinasaogeraldo/cajuina-site.git
cd cajuina-site

# 2. Instale as dependências (requer pnpm)
pnpm install

# 3. Inicie o servidor de desenvolvimento
pnpm dev

# Site disponível em http://localhost:4321
```

---

## 🛠️ Stack

| Tecnologia       | Versão  | Uso                     |
| ---------------- | ------- | ----------------------- |
| **Astro**        | 5.x     | Framework SSG           |
| **React**        | 19.x    | Componentes interativos |
| **Tailwind CSS** | 4.x     | Estilização             |
| **TypeScript**   | 5.x     | Tipagem                 |
| **pnpm**         | 9.x     | Gerenciador de pacotes  |
| **Node.js**      | 20.18.0 | Runtime                 |

---

## 📁 Estrutura (resumo)

```any
src/
├── assets/        # Imagens e ícones
├── components/    # Componentes Astro e React
├── content/       # Schemas das collections (Zod)
├── data/          # Conteúdo Markdown (CMS)
├── layouts/       # Templates de página
├── pages/         # Rotas do site
├── styles/        # CSS global
├── ui/            # Cores (paleta caju.*)
└── utils/         # Funções auxiliares (JSDoc)
```

👉 Arquitetura completa em [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## 📋 Comandos

```bash
pnpm dev          # Servidor de desenvolvimento
pnpm build        # Build de produção
pnpm preview      # Preview do build
pnpm check        # Lint + type check
pnpm fix          # Auto-fix ESLint/Prettier
```

👉 Todos os comandos em [docs/DEVGUIDE.md](docs/DEVGUIDE.md)

---

## 🔄 CI/CD

| Workflow                  | Trigger                                       | Ação                   |
| ------------------------- | --------------------------------------------- | ---------------------- |
| `deploy-ssh.yml`          | Push em `main`                                | Deploy para Hostinger  |
| `create-and-merge-pr.yml` | Commit `[cms]` em `development` ou `cms/push` | Auto-merge para `main` |
| `preview-deploy.yml`      | Dispatch do CMS                               | Preview de conteúdo    |

```any
CMS → development → PR automático → main → Deploy
```

---

## 🔗 Links Úteis

- [Astro Docs](https://docs.astro.build)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Fluxo do CMS](./docs/CMS_WORKFLOW.md)
