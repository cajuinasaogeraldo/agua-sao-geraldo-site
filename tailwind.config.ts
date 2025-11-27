import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';
// @ts-ignore
import typographyPlugin from '@tailwindcss/typography';
import { colors } from './src/ui/colors';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,json,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontSize: {
        xxs: '10px',
        xsm: '12px',
      },
      colors: {
        ...colors,
        default: 'var(--aw-color-text-default)',
        muted: 'var(--aw-color-text-muted)',
      },

      animation: {
        fade: 'fadeInUp 1s both',
      },

      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(2rem)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    // typographyPlugin,
    plugin(({ addVariant }) => {
      addVariant('intersect', '&:not([no-intersect])');
    }),
  ],
  purge: ['./src/**/*.html', './src/**/*.astro', './src/**/*.jsx'],
};
