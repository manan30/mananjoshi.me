import { contentfulClient } from './client';

export type ArticlesData = {
  title: string;
  slug?: string;
  readTime?: number;
};

export async function getDashboardArticles() {
  const data = await contentfulClient.getEntries<ArticlesData>({
    content_type: 'blogPost',
    limit: 3,
    order: '-sys.createdAt',
    select: 'fields.title,fields.readTime'
  });

  return data.items;
}

export async function getAllArticles(params?: { limit?: number }) {
  const data = await contentfulClient.getEntries<ArticlesData>({
    content_type: 'blogPost',
    limit: params?.limit ?? 3,
    order: '-sys.createdAt'
  });

  return data.items;
}
