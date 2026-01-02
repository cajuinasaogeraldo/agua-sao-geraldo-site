import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';
import type { RehypePlugin, RemarkPlugin } from '@astrojs/markdown-remark';
import path from 'path';

/**
 * Plugin Remark que calcula tempo de leitura estimado
 * Adiciona `readingTime` ao frontmatter do arquivo
 * @example
 * // No frontmatter do post ficará disponível:
 * // readingTime: 5 (minutos)
 */
export const readingTimeRemarkPlugin: RemarkPlugin = () => {
  return function (tree, file) {
    const textOnPage = toString(tree);
    const readingTime = Math.ceil(getReadingTime(textOnPage).minutes);

    if (typeof file?.data?.astro?.frontmatter !== 'undefined') {
      file.data.astro.frontmatter.readingTime = readingTime;
    }
  };
};

/**
 * Plugin Remark que converte paths absolutos de imagens para relativos
 * Transforma `/src/assets/...` em paths relativos ao arquivo markdown
 * Necessário para que o Astro processe as imagens corretamente
 */
export const resolveImagePathsRemarkPlugin: RemarkPlugin = () => {
  return function (tree, file) {
    // Pega o caminho do arquivo atual
    const filePath = file.history[0];
    if (!filePath) return;

    visit(tree, 'image', (node: any) => {
      const url = node.url;

      // Se a imagem começa com /src/assets/, converte para path relativo
      if (typeof url === 'string' && url.startsWith('/src/assets/')) {
        // Remove o /src/ do início
        const assetPath = url.replace('/src/', '');

        // Calcula o path relativo do arquivo atual até a imagem
        const fileDir = path.dirname(filePath);
        const srcDir = path.resolve(fileDir, '../..'); // volta para /src
        const targetPath = path.resolve(srcDir, assetPath);

        // Calcula o path relativo
        const relativePath = path.relative(fileDir, targetPath);

        node.url = relativePath;
      }
    });
  };
};

/**
 * Plugin Rehype que torna tabelas responsivas
 * Envolve tabelas em div com scroll horizontal em mobile
 */
export const responsiveTablesRehypePlugin: RehypePlugin = () => {
  return function (tree) {
    if (!tree.children) return;

    for (let i = 0; i < tree.children.length; i++) {
      const child = tree.children[i];

      if (child.type === 'element' && child.tagName === 'table') {
        tree.children[i] = {
          type: 'element',
          tagName: 'div',
          properties: {
            style: 'overflow:auto',
          },
          children: [child],
        };

        i++;
      }
    }
  };
};
/**
 * Plugin Rehype que adiciona lazy loading em imagens
 * Adiciona `loading="lazy"` em todas as tags `<img>`
 */ export const lazyImagesRehypePlugin: RehypePlugin = () => {
  return function (tree) {
    if (!tree.children) return;

    visit(tree, 'element', function (node) {
      if (node.tagName === 'img') {
        node.properties.loading = 'lazy';
      }
    });
  };
};
