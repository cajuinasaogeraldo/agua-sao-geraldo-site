import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  project: ['**/*.ts', '**/*.tsx', '**/*.md', '**/*.mdx', '**/**/*.astro'],
  ignore: ['**/node_modules/**', '**/dist/**', '*.config.ts'],
  entry: [
    'src/content/config.ts',
    'src/pages/**/*.{astro,mdx,js,ts}',
    '!src/pages/**/_*',
    '!src/pages/**/_*/**',
    'src/data/**/*.mdx',
  ],
  tags: ['-@lintignore', '-@knip-ignore'],
  rules: {
    dependencies: 'off',
    unlisted: 'warn',
  },
  paths: {
    '@': ['./src/*'],
  },
  compilers: {
    mdx: true,
    astro: true,
  },
};

export default config;
