import { contentfulClient } from './client';

export type ArticlesData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  readTime?: number;
  date: string;
};

export async function getDashboardArticles() {
  const data = await contentfulClient.getEntries<
    Pick<ArticlesData, 'readTime' | 'slug' | 'title'>
  >({
    content_type: 'blogPost',
    limit: 3,
    order: '-fields.date',
    select: 'fields.title,fields.readTime,fields.date,fields.slug'
  });

  return data.items;
}

export async function getAllArticles() {
  const data = await contentfulClient.getEntries<ArticlesData>({
    content_type: 'blogPost',
    order: '-fields.date'
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
