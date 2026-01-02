/**
 * @lintignore
 */
import type { PaginateFunction } from 'astro';
import { getCollection, render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { News, Taxonomy } from '@/types';
import { APP_BLOG } from 'astrowind:config';
import {
  cleanSlug,
  trimSlash,
  BLOG_BASE,
  POST_PERMALINK_PATTERN,
  CATEGORY_BASE,
  TAG_BASE,
} from './permalinks';

const generatePermalink = async ({
  id,
  slug,
  publishDate,
  category,
}: {
  id: string;
  slug: string;
  publishDate: Date;
  category: string | undefined;
}) => {
  const year = String(publishDate.getFullYear()).padStart(4, '0');
  const month = String(publishDate.getMonth() + 1).padStart(2, '0');
  const day = String(publishDate.getDate()).padStart(2, '0');
  const hour = String(publishDate.getHours()).padStart(2, '0');
  const minute = String(publishDate.getMinutes()).padStart(2, '0');
  const second = String(publishDate.getSeconds()).padStart(2, '0');

  const permalink = POST_PERMALINK_PATTERN.replace('%slug%', slug)
    .replace('%id%', id)
    .replace('%category%', category || '')
    .replace('%year%', year)
    .replace('%month%', month)
    .replace('%day%', day)
    .replace('%hour%', hour)
    .replace('%minute%', minute)
    .replace('%second%', second);

  return permalink
    .split('/')
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/');
};

const getNormalizedPost = async (post: CollectionEntry<'post'>): Promise<News> => {
  const { id, data } = post;
  const { Content, remarkPluginFrontmatter } = await render(post);

  const {
    publishDate: rawPublishDate = new Date(),
    updateDate: rawUpdateDate,
    title,
    excerpt,
    image,
    tags: rawTags = [],
    category: rawCategory,
    author,
    draft = false,
    metadata = {},
  } = data;

  const slug = cleanSlug(id); // cleanSlug(rawSlug.split('/').pop());
  const publishDate = new Date(rawPublishDate);
  const updateDate = rawUpdateDate ? new Date(rawUpdateDate) : undefined;

  const category = rawCategory
    ? {
        slug: cleanSlug(rawCategory),
        title: rawCategory,
      }
    : undefined;

  const tags = rawTags.map((tag: string) => ({
    slug: cleanSlug(tag),
    title: tag,
  }));

  return {
    id: id,
    slug: slug,
    permalink: await generatePermalink({
      id,
      slug,
      publishDate,
      category: category?.slug,
    }),

    publishDate: publishDate,
    updateDate: updateDate,

    title: title,
    excerpt: excerpt,
    image: image,

    category: category,
    tags: tags,
    author: author,

    draft: draft,

    metadata,

    Content: Content,

    readingTime: remarkPluginFrontmatter?.readingTime,
  };
};

const load = async function (): Promise<Array<News>> {
  const posts = await getCollection('post');
  const normalizedPosts = posts.map(async (post) => await getNormalizedPost(post));

  const results = (await Promise.all(normalizedPosts))
    .sort((a, b) => b.publishDate.valueOf() - a.publishDate.valueOf())
    .filter((post) => !post.draft);
  return results;
};

let _posts: Array<News>;
let _tags: Array<Taxonomy>;

// ==================== CONFIGURAÇÕES DO BLOG ====================

/** Verifica se o blog está habilitado globalmente */
export const isBlogEnabled = APP_BLOG.isEnabled;

/** Verifica se posts relacionados estão habilitados */
export const isRelatedPostsEnabled = APP_BLOG.isRelatedPostsEnabled;

/** Verifica se a rota de listagem do blog está habilitada */
export const isBlogListRouteEnabled = APP_BLOG.list.isEnabled;

/** Verifica se a rota de posts individuais está habilitada */
export const isBlogPostRouteEnabled = APP_BLOG.post.isEnabled;

/** Verifica se a rota de categorias está habilitada */
export const isBlogCategoryRouteEnabled = APP_BLOG.category.isEnabled;

/** Verifica se a rota de tags está habilitada */
export const isBlogTagRouteEnabled = APP_BLOG.tag.isEnabled;

/** Configuração robots.txt para listagem do blog */
export const blogListRobots = APP_BLOG.list.robots;

/** Configuração robots.txt para posts */
export const blogPostRobots = APP_BLOG.post.robots;

/** Configuração robots.txt para categorias */
export const blogCategoryRobots = APP_BLOG.category.robots;

/** Configuração robots.txt para tags */
export const blogTagRobots = APP_BLOG.tag.robots;

/** Número de posts por página na listagem */
export const blogPostsPerPage = APP_BLOG?.postsPerPage;

/**
 * Busca todos os posts normalizados do blog (não-draft, ordenados por data)
 * Usa cache interno para evitar reprocessamento
 * @returns Array de posts publicados ordenados por data decrescente
 */
export const fetchPosts = async (): Promise<Array<News>> => {
  if (!_posts) {
    _posts = await load();
  }

  return _posts;
};

/**
 * Busca todas as tags únicas utilizadas nos posts
 * @returns Array de tags extraídas dos posts
 */
export const fetchTags = async (): Promise<typeof _tags> => {
  if (!_tags) {
    _tags = (await fetchPosts())
      .flatMap((post) => post.tags)
      .filter((tag): tag is Taxonomy => tag !== undefined);
  }

  return _tags;
};

/**
 * Busca posts específicos por seus slugs
 * @param slugs - Array de slugs para buscar
 * @returns Array de posts correspondentes aos slugs fornecidos
 */
export const findPostsBySlugs = async (slugs: Array<string>): Promise<Array<News>> => {
  if (!Array.isArray(slugs)) return [];

  const posts = await fetchPosts();

  return slugs.reduce(function (r: Array<News>, slug: string) {
    posts.some(function (post: News) {
      return slug === post.slug && r.push(post);
    });
    return r;
  }, []);
};

/**
 * Busca posts específicos por seus IDs internos
 * @param ids - Array de IDs para buscar
 * @returns Array de posts correspondentes aos IDs fornecidos
 */
export const findPostsByIds = async (ids: Array<string>): Promise<Array<News>> => {
  if (!Array.isArray(ids)) return [];

  const posts = await fetchPosts();

  return ids.reduce(function (r: Array<News>, id: string) {
    posts.some(function (post: News) {
      return id === post.id && r.push(post);
    });
    return r;
  }, []);
};

/**
 * Busca os posts mais recentes
 * @param options - Opções de busca
 * @param options.count - Número de posts para retornar (padrão: 4)
 * @returns Array dos posts mais recentes
 */
export const findLatestPosts = async ({ count }: { count?: number }): Promise<Array<News>> => {
  const _count = count || 4;
  const posts = await fetchPosts();

  return posts ? posts.slice(0, _count) : [];
};

/**
 * Gera static paths paginados para a listagem do blog
 * Usado em `[...blog]/[...page].astro`
 * @param options - Opções do Astro
 * @param options.paginate - Função de paginação do Astro
 * @returns Array de páginas paginadas
 */
export const getStaticPathsBlogList = async ({ paginate }: { paginate: PaginateFunction }) => {
  if (!isBlogEnabled || !isBlogListRouteEnabled) return [];
  return paginate(await fetchPosts(), {
    params: { blog: BLOG_BASE || undefined },
    pageSize: blogPostsPerPage,
  });
};

/**
 * Gera static paths para posts individuais do blog
 * Usado em `[...blog]/[post].astro`
 * @returns Array de rotas com params e props de cada post
 */
export const getStaticPathsBlogPost = async () => {
  if (!isBlogEnabled || !isBlogPostRouteEnabled) return [];
  return (await fetchPosts()).flatMap((post) => ({
    params: {
      blog: post.permalink,
    },
    props: { post: post },
  }));
};

/**
 * Gera static paths paginados para páginas de categoria
 * Usado em `[...blog]/category/[category]/[...page].astro`
 * @param options - Opções do Astro
 * @param options.paginate - Função de paginação do Astro
 * @returns Array de páginas paginadas por categoria
 */
export const getStaticPathsBlogCategory = async ({ paginate }: { paginate: PaginateFunction }) => {
  if (!isBlogEnabled || !isBlogCategoryRouteEnabled) return [];

  const posts = await fetchPosts();
  const categories = {};
  posts.map((post) => {
    if (post.category?.slug) {
      //@ts-expect-error any
      categories[post.category?.slug] = post.category;
    }
  });

  return Array.from(Object.keys(categories)).flatMap((categorySlug) =>
    paginate(
      posts.filter((post) => post.category?.slug && categorySlug === post.category?.slug),
      {
        params: { category: categorySlug, blog: CATEGORY_BASE || undefined },
        pageSize: blogPostsPerPage,
        //@ts-expect-error any
        props: { category: categories[categorySlug] },
      },
    ),
  );
};

/**
 * Gera static paths paginados para páginas de tag
 * Usado em `[...blog]/tag/[tag]/[...page].astro`
 * @param options - Opções do Astro
 * @param options.paginate - Função de paginação do Astro
 * @returns Array de páginas paginadas por tag
 */
export const getStaticPathsBlogTag = async ({ paginate }: { paginate: PaginateFunction }) => {
  if (!isBlogEnabled || !isBlogTagRouteEnabled) return [];

  const posts = await fetchPosts();
  const tags = {};
  posts.map((post) => {
    if (Array.isArray(post.tags)) {
      post.tags.map((tag) => {
        //@ts-expect-error any
        tags[tag?.slug] = tag;
      });
    }
  });

  return Array.from(Object.keys(tags)).flatMap((tagSlug) =>
    paginate(
      posts.filter(
        (post) => Array.isArray(post.tags) && post.tags.find((elem) => elem.slug === tagSlug),
      ),
      {
        params: { tag: tagSlug, blog: TAG_BASE || undefined },
        pageSize: blogPostsPerPage,
        //@ts-expect-error any
        props: { tag: tags[tagSlug] },
      },
    ),
  );
};

/**
 * Encontra posts relacionados com base em categoria e tags compartilhadas
 * Usa sistema de pontuação: +5 por categoria igual, +1 por tag compartilhada
 * @param originalPost - Post de referência
 * @param maxResults - Número máximo de posts relacionados (padrão: 4)
 * @returns Array de posts relacionados ordenados por relevância
 */
export async function getRelatedPosts(originalPost: News, maxResults: number = 4): Promise<News[]> {
  const allPosts = await fetchPosts();
  const originalTagsSet = new Set(
    originalPost.tags ? originalPost.tags.map((tag) => tag.slug) : [],
  );

  const postsWithScores = allPosts.reduce(
    (acc: { post: News; score: number }[], iteratedPost: News) => {
      if (iteratedPost.slug === originalPost.slug) return acc;

      let score = 0;
      if (
        iteratedPost.category &&
        originalPost.category &&
        iteratedPost.category.slug === originalPost.category.slug
      ) {
        score += 5;
      }

      if (iteratedPost.tags) {
        iteratedPost.tags.forEach((tag) => {
          if (originalTagsSet.has(tag.slug)) {
            score += 1;
          }
        });
      }

      acc.push({ post: iteratedPost, score });
      return acc;
    },
    [],
  );

  postsWithScores.sort((a, b) => b.score - a.score);

  const selectedPosts: News[] = [];
  let i = 0;
  while (selectedPosts.length < maxResults && i < postsWithScores.length) {
    selectedPosts.push(postsWithScores[i].post);
    i++;
  }

  return selectedPosts;
}
