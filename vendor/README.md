# Vendor Integration Layer

Camada de integrações customizadas que estendem funcionalidades do Astro.

## Propósito

Este diretório contém código **próprio** (não dependências de terceiros) que:

- Integra-se ao ciclo de vida de build do Astro
- Gera artefatos derivados (ex: `.htaccess`)
- Expõe configuração global como módulo virtual

## Estrutura

```any
vendor/integration/
├── index.ts                # Integração astrowind (config loader)
├── generate-htaccess.ts    # Gerador de .htaccess
├── types.d.ts              # Types da integração
└── utils/
    ├── configBuilder.ts    # Parser de config YAML
    └── loadConfig.ts       # Loader de arquivo de config
```

## Princípios

1. **Vendor ≠ node_modules**: Contém código próprio mantido pelo time
2. **Build-time, não Runtime**: Integrações rodam apenas durante o build
3. **Fail-fast**: Configurações inválidas devem quebrar o build imediatamente
4. **Declarativo > Imperativo**: Preferir YAML/JSON como entrada

## Documentação Completa

Veja [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md#integrações-customizadas) e [docs/adr/](../docs/adr/) para detalhes sobre decisões arquiteturais.
