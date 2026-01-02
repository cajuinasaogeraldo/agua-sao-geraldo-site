# ADR-005 — React para interatividade (client-only)

**Status:** Accepted  
**Data:** 2025-12-18  
**Atualizado:** 2025-12-23

## Contexto

Uso indiscriminado de React aumenta bundle e complexidade sem benefício em páginas estáticas. Além disso, hidratação (SSR + client) adiciona complexidade desnecessária quando widgets são puramente interativos.

## Decisão

React é usado exclusivamente para widgets interativos isolados (ex: formulários, calculadoras, dashboards).

**Componentes React nunca são hidratados.** Sempre usar `client:only="react"`.

### Regras Obrigatórias

1. **`client:only="react"`** em todos os widgets React.
2. **Proibido usar** `client:load`, `client:idle`, `client:visible` ou qualquer diretiva de hidratação.
3. **Proibido validações defensivas** como `typeof window !== 'undefined'`, `window as any`, ou guards de ambiente.
4. Componentes React **sempre rodam exclusivamente no cliente**, sem renderização servidor.

### Rationale

- Widgets interativos não se beneficiam de SSR (não possuem conteúdo SEO-crítico).
- Hidratação adiciona peso e complexidade desnecessários.
- `client:only` elimina código defensivo e simplifica desenvolvimento.
- APIs do navegador (`window`, `document`, `localStorage`) estão sempre disponíveis.

## Alternativas Consideradas

- **React em toda a UI:** Rejeitado por custo desnecessário de bundle e complexidade.
- **Outras libs reativas (Vue, Svelte):** Rejeitado por fragmentar a stack e aumentar dependências.
- **Hidratação parcial (`client:load`):** Rejeitado por adicionar complexidade sem ganho real para widgets puramente interativos.

## Consequências

### Positivas

- A maior parte do site permanece estática e leve.
- Widgets têm fronteiras claras e renderização explícita (apenas client-side).
- Código React simplificado: sem guards de ambiente, sem validações de `window`.
- Performance melhor: sem payload de hidratação, sem overhead de reconciliação.

### Negativas

- React não contribui para conteúdo inicial (sem SSR).
- Widgets aparecem após carregamento do JS (flash de carregamento aceitável para interatividade).

### Sinais de Violação

- Uso de `client:load`, `client:idle` ou qualquer diretiva de hidratação.
- Validações como `if (typeof window !== 'undefined')` em componentes React.
- Lógica complexa fora de widgets é sinal de design incorreto.
- Time precisa entender quando usar React vs. Astro puro.
