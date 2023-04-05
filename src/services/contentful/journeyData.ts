import type { RichTextContent } from 'contentful';
import { contentfulClient } from './client';

type JourneyData = {
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  location?: string;
  duties?: RichTextContent;
};

export async function getJourneyData() {
  const data = await contentfulClient.getEntries<JourneyData>({
    content_type: 'journey',
    order: '-fields.startDate'
  });

  return data.items.map((item) => ({ ...item.fields }));
}
