/// <reference types="astro/client" />
/// <reference types="@astrojs/image/client" />

interface ImportMetaEnv {
	readonly CONTENTFUL_SPACE_ID: string;
	readonly CONTENTFUL_ACCESS_TOKEN: string;
	readonly CONTENTFUL_PREVIEW_ACCESS_TOKEN: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
