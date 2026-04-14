import path from 'path';
import { fileURLToPath } from 'url';

import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';
import type { AstroIntegration } from 'astro';
import astrowind from './vendor/integration';
import generateHtaccess from './vendor/integration/generate-htaccess';

import {
  readingTimeRemarkPlugin,
  responsiveTablesRehypePlugin,
  lazyImagesRehypePlugin,
  resolveImagePathsRemarkPlugin,
} from './src/utils/frontmatter';
import { remarkShortcodes } from './src/utils/remark-plugins/shortcodes';
import react from '@astrojs/react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;
const whenExternalScripts = (items: (() => AstroIntegration) | (() => AstroIntegration)[] = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.SITE_URL || 'https://aguamineralsaogeraldo.com.br',
  trailingSlash: 'always',
  output: 'static',
  integrations: [
    sitemap(),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
        mdi: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),
    ...whenExternalScripts(() =>
      partytown({
        config: {
          forward: ['dataLayer.push', 'fbq'],
          debug: true,
        },
      }),
    ),
    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: true,
      Logger: 1,
    }),
    astrowind({
      config: './src/_config',
    }),
    generateHtaccess({ config: './src/_htaccess' }),
    react(),
  ],

  image: {
    domains: ['cdn.pixabay.com', 'images.unsplash.com', 'aguamineralsaogeraldo.com.br'],
  },

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin, resolveImagePathsRemarkPlugin, remarkShortcodes],
    rehypePlugins: [responsiveTablesRehypePlugin, lazyImagesRehypePlugin],
    shikiConfig: {
      wrap: true,
      themes: {
        light: 'github-light',
      },
    },
  },

  build: {
    inlineStylesheets: 'auto',
    assets: '_astro',
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
    },
  },
});
