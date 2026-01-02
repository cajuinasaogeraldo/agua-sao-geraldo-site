import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  ignore: ['**/node_modules/**', '**/dist/**', '*.config.ts'],
  entry: [
    'src/pages/**/*.{astro,mdx,js,ts}',
    'src/components/**/*.{astro,tsx,ts}',
    'src/content/config.ts',
  ],
  tags: ['-@lintignore', '-@knip-ignore'],
  rules: {
    dependencies: 'warn',
    unlisted: 'warn',
  },
  paths: {
    '@': ['./src/*'],
  },
  compilers: {
    mdx: true,
    astro: true,
  },
  ignoreDependencies: ['astrowind', 'vite'],
};

export default config;
