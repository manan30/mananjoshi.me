import contentful from 'contentful';

const contentfulClient = contentful.createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.PROD
    ? import.meta.env.CONTENTFUL_ACCESS_TOKEN
    : import.meta.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
  host: import.meta.env.PROD ? 'cdn.contentful.com' : 'preview.contentful.com'
});

export { contentfulClient };
