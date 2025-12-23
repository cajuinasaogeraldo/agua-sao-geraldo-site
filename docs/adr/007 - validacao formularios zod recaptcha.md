# ADR-007 — Validação de formulários com Zod + reCAPTCHA obrigatório

**Status:** Accepted  
**Data:** 2025-12-18

## Contexto

Formulários web são vetores de spam e abuso. Validação apenas client-side é insuficiente. Duplicação de lógica de validação entre formulários gera manutenção cara.

## Decisão

Todos os formulários React utilizam:

1. **Zod** para validação de schemas.
2. **React Hook Form** para controle de estado.
3. **Google reCAPTCHA v2 Enterprise** como validação obrigatória.
4. **Constantes compartilhadas** em `src/components/react/common/form-constants.ts`.

### Arquitetura

```typescript
// Validator + Schema (Zod)
distribuidorSchema.ts

// Form Component (React Hook Form + reCAPTCHA)
ReactDistribuidorForm/index.tsx

// Constantes compartilhadas
form-constants.ts → AllowedFormIds, ESTADOS_BRASIL
```

### Fluxo de Submissão

1. Validação client-side (Zod via React Hook Form).
2. Usuário completa reCAPTCHA v2.
3. Token + dados enviados via `FormData` para API externa.
4. API valida reCAPTCHA server-side.
5. Resposta exibida no cliente.

### Campos Obrigatórios em Todo Formulário

- `captchaToken`: Token do reCAPTCHA.
- `formId`: Identificador único do formulário (enum `AllowedFormIds`).

## Alternativas Consideradas

- **Validação apenas server-side**: Rejeitado por UX ruim (usuário só descobre erro após submissão).
- **reCAPTCHA v3 (invisível)**: Rejeitado por precisar de score tuning e potencial falso positivo.
- **Yup para validação**: Rejeitado por Zod ter inferência TypeScript superior e ser mais moderno.
- **Formulários nativos + Progressive Enhancement**: Rejeitado por complexidade de campos condicionais e upload de arquivos.

## Consequências

### Positivas

- Validação consistente entre formulários (DRY).
- TypeScript infere tipos automaticamente de schemas Zod.
- reCAPTCHA reduz drasticamente spam.
- Experiência de erro imediata (validação client-side).

### Negativas

- Dependência de Google reCAPTCHA (vendor lock-in parcial).
- Bundle React aumenta (~100KB adicional para cada formulário).
- Formulário não funciona sem JavaScript habilitado.
- reCAPTCHA v2 adiciona fricção (usuário precisa resolver desafio).

### Regras de Operação

1. **Nunca submeter** formulário sem `captchaToken` e `formId`.
2. Constantes compartilhadas (`ESTADOS_BRASIL`, `AllowedFormIds`) devem ser **únicas**.
3. Alteração em `form-constants.ts` afeta todos os formulários — testar regressão.
4. Schemas Zod são contratos: mudança quebra interface com backend.

## Segurança

- **Client-side**: Validação Zod previne dados malformados.
- **Server-side**: API valida reCAPTCHA token e schema novamente.
- **Token único**: Token reCAPTCHA expira após uso ou timeout.

## Performance

- **reCAPTCHA script**: ~40KB (carregado via `GoogleReCaptchaProvider`).
- **React Hook Form**: ~24KB.
- **Zod**: ~12KB.
- **Total por formulário**: ~100KB + código específico.

Mitigação: lazy loading de formulários (só carregar quando usuário acessar página).

## Compatibilidade

- Funciona apenas com JavaScript habilitado.
- Requer API backend compatível com validação de reCAPTCHA v2 Enterprise.

## Relação com Outros ADRs

- **ADR-005 (React para interatividade)**: Formulários são widgets React isolados.
- **ADR-001 (SSG)**: Formulários não podem ser server-rendered (exigem hidratação).
