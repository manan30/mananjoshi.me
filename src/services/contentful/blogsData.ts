import { contentfulClient } from './client';

export type BlogsData = {
  title: string;
  slug?: string;
};

export async function getBlogsData(params?: { limit?: number }) {
  const data = await contentfulClient.getEntries<BlogsData>({
    content_type: 'blogPost',
    limit: params?.limit ?? 3,
    order: '-sys.createdAt'
  });

  return data.items;
}
