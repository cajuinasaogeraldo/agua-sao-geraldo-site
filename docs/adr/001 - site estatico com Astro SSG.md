# ADR-001 — Astro em SSG com trailing slash obrigatório

**Status:** Accepted  
**Data:** 2025-12-18

## Contexto

O projeto é predominantemente conteúdo estático, com foco em SEO, e deploy simples via SSH. A necessidade principal é previsibilidade de URLs e baixo custo operacional. O motivo da escolha de SSG é por conta da hospedagem na Hostinger

## Decisão

O site é construído usando Astro em modo SSG, com `output: 'static'` e `trailingSlash: 'always'`.

## Alternativas Consideradas

- **SSR com Astro ou outro framework:** Rejeitado por aumentar complexidade de deploy e custo operacional.

## Consequências

- URLs são previsíveis e consistentes.
- Deploy é simples e altamente cacheável.
- Qualquer feature que exija interatividade deve ser isolada (ex: widgets React).
