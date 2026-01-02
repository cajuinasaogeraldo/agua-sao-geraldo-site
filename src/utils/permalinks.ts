import slugify from 'limax';
import { SITE, APP_BLOG } from 'astrowind:config';
import { trim } from '@/utils/utils';

// ==================== TYPES ====================

type PermalinkType =
  | 'home'
  | 'blog'
  | 'asset'
  | 'category'
  | 'tag'
  | 'post'
  | 'page'
  | 'product'
  | 'news';

type PermalinkHref = {
  type?: PermalinkType;
  url?: string;
};

type Permalinks = {
  href?: string | PermalinkHref;
  [key: string]: unknown;
};

type PermalinksInput = Permalinks | Permalinks[];

// ==================== UTILITY FUNCTIONS ====================

/**
 * Remove barras do início e fim de uma string
 * @param s - String para processar
 * @returns String sem barras nas extremidades
 */
export const trimSlash = (s: string): string => trim(trim(s, '/'));

/**
 * Limpa e normaliza um slug, convertendo para formato URL-friendly
 * @param text - Texto para converter em slug
 * @returns Slug limpo e normalizado
 * @example cleanSlug('Minha Notícia') // → 'minha-noticia'
 */
export const cleanSlug = (text = ''): string =>
  trimSlash(text)
    .split('/')
    .map((slug) => slugify(slug))
    .join('/');

/**
 * Cria um caminho válido com trailing slash se configurado
 * @private
 */
const createPath = (...params: string[]): string => {
  const paths = params
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/');
  return '/' + paths + (SITE.trailingSlash && paths ? '/' : '');
};

/** @private */
const definitivePermalink = (permalink: string): string => createPath(BASE_PATHNAME, permalink);

/**
 * Verifica se uma URL é externa ou especial (http://, https://, #, etc.)
 * @private
 */
const isExternalOrSpecialUrl = (slug: string): boolean => {
  const specialPrefixes = ['https://', 'http://', '://', '#', 'javascript:'];
  return specialPrefixes.some((prefix) => slug.startsWith(prefix));
};

// ==================== CONSTANTS ====================

/** @private */
const BASE_PATHNAME = SITE.base || '/';

/** Caminho base para o blog (ex: '/blog') */
export const BLOG_BASE = cleanSlug(APP_BLOG?.list?.pathname);

/** Caminho base para categorias (ex: '/category') */
export const CATEGORY_BASE = cleanSlug(APP_BLOG?.category?.pathname);

/** Caminho base para tags (ex: '/tag') */
export const TAG_BASE = cleanSlug(APP_BLOG?.tag?.pathname) || 'tag';

/** Caminho base para produtos ('/produtos') */
export const PRODUCTS_BASE = cleanSlug(`${BASE_PATHNAME}/produtos`);

/** Caminho base para responsabilidade social */
export const SOCIAL_RESPONSABILITY_BASE = cleanSlug(
  `${BASE_PATHNAME}/empresa/responsabilidade-social`,
);

/**
 * Padrão de permalink para posts do blog
 * Variáveis disponíveis: %slug%, %id%, %category%, %year%, %month%, %day%
 * @example '/%slug%' → '/minha-noticia/'
 */
export const POST_PERMALINK_PATTERN = trimSlash(APP_BLOG?.post?.permalink || `${BLOG_BASE}/%slug%`);

/**
 * Padrão de permalink para produtos
 * @example '/produtos/%slug%' → '/produtos/cajuina-tradicional/'
 */
export const PRODUCTS_PERMALINK_PATTERN = trimSlash(`${PRODUCTS_BASE}/%slug%`);

/**
 * Padrão de permalink para páginas de responsabilidade social
 * @example '/empresa/responsabilidade-social/%slug%'
 */
export const SOCIAL_RESPONSABILITY_PERMALINK_PATTERN = trimSlash(
  `${SOCIAL_RESPONSABILITY_BASE}/%slug%`,
);

// ==================== PERMALINK GENERATORS ====================

/**
 * Retorna o permalink da página inicial
 * @returns '/' ou caminho configurado
 */
export const getHomePermalink = (): string => getPermalink('/');

/**
 * Retorna o permalink da listagem do blog
 * @returns Caminho do blog (ex: '/blog/')
 */
export const getBlogPermalink = (): string => getPermalink(BLOG_BASE);

/**
 * Retorna o caminho completo de um asset estático
 * @param path - Caminho relativo do asset
 * @returns Caminho absoluto do asset
 */
export const getAsset = (path: string): string =>
  '/' +
  [BASE_PATHNAME, path]
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/');

/**
 * Gera URL canônica para SEO respeitando configuração de trailing slash
 * @param path - Caminho relativo
 * @returns URL completa canônica
 */
export const getCanonical = (path = ''): string | URL => {
  const url = String(new URL(path, SITE.site));

  if (SITE.trailingSlash === false && path && url.endsWith('/')) {
    return url.slice(0, -1);
  }

  if (SITE.trailingSlash === true && path && !url.endsWith('/')) {
    return url + '/';
  }

  return url;
};

export const getPermalink = (slug = '', type: PermalinkType = 'page'): string => {
  if (isExternalOrSpecialUrl(slug)) {
    return slug;
  }

  let permalink: string;

  switch (type) {
    case 'home':
      permalink = getHomePermalink();
      break;

    case 'blog':
      permalink = getBlogPermalink();
      break;

    case 'asset':
      permalink = getAsset(slug);
      break;

    case 'category':
      permalink = createPath(CATEGORY_BASE, trimSlash(slug));
      break;

    case 'tag':
      permalink = createPath(TAG_BASE, trimSlash(slug));
      break;

    case 'post':
      permalink = createPath(trimSlash(slug));
      break;

    case 'product':
      permalink = createPath(PRODUCTS_BASE, trimSlash(slug));
      break;

    case 'page':
      permalink = createPath(trimSlash(slug));
      break;

    default:
      permalink = createPath(slug);
      break;
  }

  return definitivePermalink(permalink);
};

// ==================== PERMALINK APPLICATION ====================

const processHrefValue = (hrefValue: string | PermalinkHref): string | undefined => {
  if (typeof hrefValue === 'string') {
    return getPermalink(hrefValue);
  }

  if (typeof hrefValue === 'object' && hrefValue !== null) {
    const { type, url } = hrefValue;

    if (type === 'home') return getHomePermalink();
    if (type === 'blog') return getBlogPermalink();
    if (type === 'asset' && url) return getAsset(url);
    if (url) return getPermalink(url, type);
  }

  return undefined;
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const applyGetPermalinks = (menu: PermalinksInput = {}): PermalinksInput => {
  // Handle arrays
  if (Array.isArray(menu)) {
    return menu.map((item) => applyGetPermalinks(item) as Permalinks);
  }

  // Handle objects
  if (typeof menu === 'object' && menu !== null) {
    const result: Permalinks = {};

    for (const key in menu) {
      if (key === 'href') {
        const hrefValue = menu[key] as string | PermalinkHref | undefined;
        if (hrefValue) {
          const processed = processHrefValue(hrefValue);
          if (processed) result[key] = processed;
        }
      } else {
        result[key] = applyGetPermalinks(menu[key] as PermalinksInput);
      }
    }

    return result;
  }

  return menu;
};
