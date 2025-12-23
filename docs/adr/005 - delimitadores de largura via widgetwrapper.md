# ADR-005 — Delimitadores de largura centralizados via WidgetWrapper

**Status:** Accepted  
**Data:** 2025-12-23

## Contexto

O site precisa de consistência visual nos limites de largura do conteúdo principal. Sem padronização, cada componente define sua própria largura máxima, criando inconsistências visuais e duplicação de classes Tailwind. Além disso, layouts específicos de marketing podem exigir quebra desse padrão (ex: banners full-width).

## Decisão

Todo widget ou seção de conteúdo **deve** utilizar o componente `WidgetWrapper` para delimitar largura máxima e padding horizontal. O wrapper define:

- Largura padrão: `max-w-7xl` (1280px)
- Padding responsivo: `px-4 md:px-6`
- Exceções: componentes com `fullWidth={true}` permitem layout edge-to-edge quando necessário

Componentes que não devem usar WidgetWrapper são exceções explícitas definidas pelo layout de marketing (ex: banners hero, rodapé específico).

## Alternativas Consideradas

- **Classes Tailwind diretas em cada componente:** Rejeitado por criar inconsistência e dificultar mudanças globais.
- **CSS global via @apply:** Rejeitado por dificultar opt-out e reduzir flexibilidade de layout.

## Consequências

- Consistência visual garantida entre seções.
- Mudanças de largura máxima centralizadas em um único componente.
- Componentes de marketing podem explicitamente quebrar o padrão via `fullWidth`.
- Qualquer novo widget deve envolver conteúdo com `<WidgetWrapper>` salvo justificativa de design.
- Animações de scroll (IntersectionObserver) são aplicadas automaticamente pelo wrapper.
