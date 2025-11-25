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
const whenExternalScripts = (
  items: (() => AstroIntegration) | (() => AstroIntegration)[] = []
) =>
  hasExternalScripts
    ? Array.isArray(items)
      ? items.map((item) => item())
      : [items()]
    : [];

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.SITE_URL || 'https://cajuinasaogeraldo.com.br',
  trailingSlash: 'always',
  output: 'static',
  server: {
    headers: {
      'Cache-Control':
        import.meta.env.mode === 'production'
          ? 'public, max-age=31536000, s-maxage=31536000'
          : 'public, max-age=0, s-maxage=0',
    },
  },

  integrations: [
    sitemap(),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
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
        config: { forward: ['dataLayer.push'] },
      })
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
      config: './src/config.yaml',
    }),
    generateHtaccess({ config: './public/_htaccess' }),
    react(),
  ],

  image: {
    domains: [
      'cdn.pixabay.com',
      'images.unsplash.com',
      'cajuinasaogeraldo.com.br',
    ],
  },

  markdown: {
    remarkPlugins: [
      readingTimeRemarkPlugin,
      resolveImagePathsRemarkPlugin,
      remarkShortcodes,
    ],
    rehypePlugins: [responsiveTablesRehypePlugin, lazyImagesRehypePlugin],
    shikiConfig: {
      wrap: true,
      themes: {
        light: 'github-light',
      },
    },
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  },
});
