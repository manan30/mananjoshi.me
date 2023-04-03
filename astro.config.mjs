import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import partytown from '@astrojs/partytown';
import image from '@astrojs/image';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({ config: { applyBaseStyles: false } }),
    partytown(),
    react(),
    image({
      serviceEntryPoint: '@astrojs/image/sharp'
    })
  ],
  server: { port: 3002 }
});
