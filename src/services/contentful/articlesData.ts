import { contentfulClient } from './client';

export type ArticlesData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  readTime?: number;
};

export async function getDashboardArticles() {
  const data = await contentfulClient.getEntries<
    Pick<ArticlesData, 'readTime' | 'slug' | 'title'>
  >({
    content_type: 'blogPost',
    limit: 3,
    order: '-sys.createdAt',
    select: 'fields.title,fields.readTime,sys.createdAt'
  });

  return data.items;
}

export async function getAllArticles() {
  const data = await contentfulClient.getEntries<ArticlesData>({
    content_type: 'blogPost',
    order: '-sys.createdAt'
  });

  return data.items;
}

export async function getAllArticlesSlug() {
  const data = await contentfulClient.getEntries<Pick<ArticlesData, 'slug'>>({
    content_type: 'blogPost',
    select: 'fields.slug'
  });

  return data.items;
}

export async function getArticleBySlug(slug: string) {
  const data = await contentfulClient.getEntries<ArticlesData>({
    content_type: 'blogPost',
    'fields.slug': slug
  });

  return data.items[0];
}
