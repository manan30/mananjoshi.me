import { contentfulClient } from './client';

export async function getProfileData() {
  const data = await contentfulClient.getEntries();
  return data;
}
