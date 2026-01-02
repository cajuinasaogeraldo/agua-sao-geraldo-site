# ADR-002 — CMS Git-based com auto-merge

**Status:** Accepted  
**Data:** 2025-12-18

## Contexto

O time editorial precisa publicar conteúdo sem acesso direto ao código, mantendo histórico, rollback e revisão automatizada.

## Decisão

O CMS utilizado é git-based (Sveltia), operando na branch `cms/push`, com merge automático para `main` via CI.

## Alternativas Consideradas

- **CMS externo com API:** Rejeitado por aumentar dependência externa e complexidade.
- **Publicação direta em `main`:** Rejeitado por reduzir controle e rastreabilidade.

## Consequências

- Todo conteúdo publicado gera commit versionado.
- O pipeline de CI passa a ser parte do fluxo editorial.
- Erros editoriais podem impactar o build se schemas forem quebrados.
- Rollback é trivial via Git.
