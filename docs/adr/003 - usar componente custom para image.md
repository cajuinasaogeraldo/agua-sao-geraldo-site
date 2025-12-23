# ADR-004 — Proibição de `<img>` direto

**Status:** Accepted  
**Data:** 2025-12-18

## Contexto

Uso direto de `<img>` gera inconsistência de performance, loading e otimização de imagens.

## Decisão

Todas as imagens devem ser renderizadas via componente `Image.astro`.

## Alternativas Consideradas

- **Uso livre de `<img>`:** Rejeitado por perda de otimização automática e controle de performance.

## Consequências

- Performance e SEO mais previsíveis.
- Padronização visual e técnica (lazy loading, formatos modernos, responsive images, galeria de imagens).
- Uso de `<img>` direto indica violação de padrão.
- Aumento inicial de verbosidade no código.
