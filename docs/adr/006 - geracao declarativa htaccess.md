# ADR-006 — Geração declarativa de .htaccess

**Status:** Accepted  
**Data:** 2025-12-18

## Contexto

Configurações de servidor (redirects, CORS, cache, compressão) historicamente ficam em `.htaccess` editado manualmente, causando perda de versionamento, inconsistência entre ambientes e dificuldade de auditoria.

## Decisão

O arquivo `.htaccess` é gerado automaticamente durante o build a partir de um arquivo YAML (`public/_htaccess`), através da integração customizada `vendor/integration/generate-htaccess.ts`.

### Arquitetura

```any
public/_htaccess (fonte YAML)
         ↓
vendor/integration/generate-htaccess.ts
         ↓
dist/.htaccess (gerado no build)
```

### Funcionalidades suportadas

- Redirects (301/302)
- Rewrites
- CORS (fontes, imagens, origins customizados)
- Compressão (gzip + brotli)
- Cache rules por tipo de arquivo
- Security headers
- Force HTTPS/WWW

## Alternativas Consideradas

- **Usar apenas redirects no Astro**: Rejeitado por não funcionar em SSG como esperado com status codes corretos.

### Regras de Operação

1. **Nunca editar** `dist/.htaccess` manualmente — é artefato gerado.
2. **Sempre editar** `public/_htaccess` para mudanças de configuração.
3. Regras customizadas que não couberem no schema YAML devem ir em `customRules`.
4. Testar localmente requer Apache (XAMPP/MAMP) ou validar direto no preview.
5. Validar esquema YAML com `yarn validate-htaccess`.

## Compatibilidade

- Funciona apenas com Apache da hostinger (mod_rewrite, mod_headers, mod_deflate, mod_brotli).
- Não funciona com Nginx ou Caddy (migração exige reescrever lógica).

## Relação com Outros ADRs

- **ADR-001 (SSG)**: `.htaccess` gerado é essencial para redirects em SSG puro.
- **ADR-003 (Permalinks)**: Redirects mantêm compatibilidade quando URLs mudam.
