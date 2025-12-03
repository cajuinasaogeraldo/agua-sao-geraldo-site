---
layout: '@/layouts/MarkdownLayout.astro'
title: 'Como usar o CMS'
---

Bem-vindo ao painel de administração do site **Água São Geraldo**! Este guia explica como gerenciar o conteúdo do site.

##### <br/>

## Acessando o CMS

1. Acesse <code class='inline-code bg-gray-700 p-1'><a href="/admin/">/admin/</a></code> no navegador
2. Faça login com sua conta **GitHub** (você precisa ter acesso ao repositório)
3. Pronto! Você verá o painel de administração

##### <br/>

---

## O que você pode editar:

### 🖼️ Banners do Slide Principal

- Os banners que aparecem na página inicial.
- **Como editar:**
  - 1. Clique em **"Banners do Slide"** no menu lateral
  - 2. Clique em um banner existente para editar, ou **"Novo"** para criar
  - 3. Preencha os campos:
    - **Título**: Texto que aparece no banner
    - **Imagem de Fundo**: Clique para fazer upload (recomendado: 1920x800px)
    - **Call to Action Link**: URL para onde o banner direciona ao clicar
    - **Ordem**: Número que define a posição (menor = primeiro)
    - **Ativo**: Desmarque para ocultar temporariamente
    - **Data de Publicação/Expiração**: Agende quando o banner aparece/desaparece

### 🖼️ Banner do Meio

- O banner que aparece no meio da página inicial.
- **Como editar:**
  - 1. Clique em **"Banner do Meio"** no menu lateral
  - 2. Selecione o banner existente
  - 3. Atualize a imagem ou desative se necessário

### 📍 Distribuidores

- Pontos de venda que aparecem no mapa.
- **Como adicionar:**
  - 1. Clique em **"Distribuidores"** no menu lateral
  - 2. Clique em **"Novo"**
  - 3. Preencha:
    - **Nome**: Nome do estabelecimento
    - **Endereço**: Endereço completo
    - **Telefone**: Formato (88) 3512-3400
    - **Latitude/Longitude**: Coordenadas do mapa (use o Google Maps para encontrar)
    - **Ativo**: Marque para exibir no site

> 💡 **Dica**: Para encontrar lat/lng, pesquise o endereço no Google Maps, clique com botão direito e copie as coordenadas.

---

## Fluxo de Publicação

O site usa um sistema de **Editorial Workflow** com 3 estados:

### 1. Rascunho (Draft)

- Conteúdo salvo mas não publicado
- Só você pode ver

### 2. Em Revisão (In Review)

- Conteúdo pronto para revisão
- Outros editores podem ver e aprovar

### 3. Publicado (Ready)

- Clique em **"Publish"** para enviar ao site
- O conteúdo vai para produção em alguns minutos

---

## Salvando alterações

1. Após editar, clique em **"Save"** (canto superior direito)
2. Escolha o estado:
   - **Save as draft**: Salvar como rascunho
   - **Save and publish**: Publicar imediatamente
3. Aguarde a confirmação

> ⏱️ **Tempo de deploy**: Após publicar, o site atualiza em aproximadamente **2-5 minutos**.

---

## Imagens

### Formatos aceitos

- JPG, PNG, WebP, SVG

### Tamanhos recomendados

| Local               |     | Tamanho       |
| ------------------- | --- | ------------- |
| Banner principal    |     | 1920 x 800 px |
| Banner do meio      |     | 1920 x 600 px |
| Imagens de notícias |     | 1200 x 630 px |

### Boas práticas

- Use imagens de alta qualidade
- Prefira formatos 16:9 ou 2:1
- Nomeie os arquivos sem acentos ou espaços

---

## Precisa de ajuda?

Se tiver dúvidas ou problemas:

1. **Não está conseguindo logar?** Verifique se tem acesso ao repositório no GitHub
2. **Mudança não apareceu?** Aguarde 5 minutos e limpe o cache do navegador
3. **Erro ao salvar?** Tente novamente ou entre em contato com o suporte técnico

---

[← Voltar ao painel](/admin/)
