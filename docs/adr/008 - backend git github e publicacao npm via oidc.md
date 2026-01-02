# ADR-008 — Backend Git dos sites em GitHub e publicação npm via Trusted Publisher (OIDC)

**Status:** Accepted  
**Data:** 2025-12-29

## Contexto

A Cajuina SI usa Bitbucket como plataforma de Git no ecossistema. Porém, para os sites (Cajuína e Água), existem duas necessidades operacionais que dependem diretamente de integrações externas:

- O CMS (Sveltia) precisa de um backend git estável para gravar conteúdo e disparar o fluxo de CI/CD.
- Alguns componentes compartilhados (CMS custom e configs de padronização) são distribuídos via npm e exigem um pipeline de publicação seguro e rastreável.

No momento, o login OAuth do CMS usando Bitbucket como backend git para esses sites está inicialmente indisponível. Existe um plano futuro para habilitar esse fluxo, mas a operação atual não pode depender dele.

Além disso, a publicação no npm foi desenhada para usar Trusted Publisher (OpenID Connect), pois reduz a dependência de tokens long-lived e melhora o modelo de segurança da release.

## Decisão

1. O backend git dos sites (repositórios que recebem conteúdo via CMS e disparam deploy) permanece no GitHub enquanto o login OAuth com Bitbucket como backend git estiver indisponível.
2. O CMS custom e os pacotes de padronização (ESLint/Prettier) permanecem com repositórios no GitHub para viabilizar publicação no npm via Trusted Publisher (OIDC) e manter o fluxo de release integrado.
3. Bitbucket permanece como plataforma de Git adotada pela Cajuina SI no ecossistema, com a migração do backend git do CMS para Bitbucket tratada como evolução futura quando houver suporte completo.

## Alternativas Consideradas

- Usar Bitbucket como backend git dos sites imediatamente: rejeitado por indisponibilidade do fluxo OAuth/integração do CMS no momento.
- Manter tokens fixos (long-lived) de npm para publicar pacotes a partir de qualquer plataforma: rejeitado por piora do perfil de segurança e custo operacional (rotação, vazamento, escopo).
- Não publicar pacotes compartilhados e copiar configs manualmente entre repos: rejeitado por aumentar divergência entre sites e custo de manutenção.

## Consequências

- A operação atual do CMS e do deploy permanece previsível, com backend git efetivamente suportado.
- Existe uma “assimetria” intencional: Bitbucket como padrão da Cajuina SI, mas sites com backend git em GitHub por limitação/compatibilidade de integrações.
- A segurança do pipeline de publicação no npm melhora (modelo OIDC/Trusted Publisher), reduzindo dependência de segredos persistentes.
- Uma futura migração do backend git dos sites para Bitbucket exige projeto próprio (especialmente no eixo OAuth/integração do CMS) e deve preservar o fluxo editorial/CI.

## Referências

- Guia do fluxo CMS → deploy: [docs/CMS_WORKFLOW.md](../CMS_WORKFLOW.md)
- Config do CMS: [public/admin/config.yml](../../public/admin/config.yml)
- OAuth do CMS (Bitbucket): https://bitbucket.org/cajuinasaogeraldo/sveltia-oauth-cms/src/main/
- CMS custom (GitHub): https://github.com/cajuinasaogeraldo/sveltia-cms
- Prettier config (GitHub): https://github.com/CajuinaSI/prettier-config
- ESLint config (GitHub): https://github.com/CajuinaSI/eslint-config
