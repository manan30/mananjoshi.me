import { contentfulClient } from './client';

export type ProjectsData = {
  title: string;
  description?: string;
  deploymentURL?: string;
  packageURL?: string;
  blogURL?: string;
  githubURL?: string;
  isPackage?: boolean;
};

export async function getProjectsData(params?: { limit?: number }) {
  const data = await contentfulClient.getEntries<ProjectsData>({
    content_type: 'project',
    limit: params?.limit ?? 3,
    order: '-sys.createdAt'
  });

  return data.items;
}
