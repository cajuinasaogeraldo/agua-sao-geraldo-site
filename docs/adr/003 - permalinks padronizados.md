# ADR-003 — Centralização de permalinks

**Status:** Accepted  
**Data:** 2025-12-18

## Contexto

Geração de URLs espalhada pelo código tende a criar inconsistências, duplicação e problemas de SEO.

## Decisão

Toda geração de URL pública é centralizada em `src/utils/permalinks.ts`.

## Alternativas Consideradas

- **Definir URLs localmente em cada página:** Rejeitado por falta de consistência e manutenção difícil.

## Consequências

- Mudanças de estrutura de URL são controladas centralmente.
- Novas entidades públicas devem usar esse módulo.
- Desvios indicam dívida técnica.
- Refatoração de URLs torna-se mais segura e previsível.
