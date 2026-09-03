// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

export default defineConfig({
  // GitHub Pages serves a project site from this subdirectory. Keep `site` as
  // the origin and `base` as the repository path, or canonical URLs and public
  // assets will point at the wrong place.
  site: 'https://crimsonstrife.github.io',
  base: '/shiningstarbie-site',

  integrations: [
    // Inline only the icons the components use, so the whole icon set is not shipped.
    icon(),
    sitemap(),
  ],

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        webp: { effort: 5 },
      },
    },
  },
});
