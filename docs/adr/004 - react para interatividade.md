# ADR-005 — React para interatividade

**Status:** Accepted  
**Data:** 2025-12-18

## Contexto

Uso indiscriminado de React aumenta bundle e complexidade sem benefício em páginas estáticas.

## Decisão

React é usado exclusivamente para widgets interativos isolados (ex: formulários, calculadoras, dashboards).

## Alternativas Consideradas

- **React em toda a UI:** Rejeitado por custo desnecessário de bundle e complexidade.
- **Outras libs reativas (Vue, Svelte):** Rejeitado por fragmentarem a stack, aumentarem a complexidade de dependências e elevarem a curva de aprendizado com a introdução de novas ferramentas.

## Consequências

- A maior parte do site permanece estática e leve.
- Widgets têm fronteiras claras e hidratação explícita.
- Lógica complexa fora de widgets é sinal de design incorreto.
- Time precisa entender quando usar React vs. Astro puro.
