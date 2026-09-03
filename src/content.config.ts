import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Every repeatable list on this site is checked against a schema.
 *
 * This isn't type safety for its own sake. The site is meant to be maintained
 * by editing JSON and Markdown in GitHub's web editor. A schema turns “the site
 * quietly broke” into “the build failed and named the bad field,” so a missing
 * URL or mistyped role should not reach production.
 *
 * Astro writes a JSON Schema per collection to `.astro/collections/` on every
 * build; `.vscode/settings.json` points the editor at them, so the same rules
 * show up as autocomplete while editing. Run `npm run dev` once to generate
 * them after cloning.
 *
 * One catch: `file()` returns entries sorted by id, not in the order of the
 * JSON array. Any list where order matters therefore carries an explicit
 * `order` key and is sorted where it is used.
 */

/** An Iconify name such as "fa6-brands:twitch". Browse them at https://icones.js.org. */
const iconName = z
  .string()
  .regex(/^[a-z0-9-]+:[a-z0-9-]+$/, 'Expected an Iconify name like "fa6-brands:twitch"');

/** One of the seven wordmark hues, used for rules and underlines. */
const HUES = ['terracotta', 'orange', 'gold', 'green', 'teal', 'purple', 'pink'] as const;
const hue = z.enum(HUES);

/* ---------------------------------------------------------------------------
   Socials — the link list, shown on /links and in the footer.
   --------------------------------------------------------------------------- */
const socials = defineCollection({
  loader: file('src/data/socials.json'),
  schema: z.object({
    id: z.string(),
    order: z.number().int().positive(),
    label: z.string(),
    url: z.url(),
    icon: iconName,
    hue,
    /** One line describing what she posts there. Shown beside the link. */
    blurb: z.string().default(''),
    /** Pin to the short list of links on the home page. */
    primary: z.boolean().default(false),
  }),
});

/* ---------------------------------------------------------------------------
   Support — merch, wishlist, sponsor codes, donations, and the PO box. I keep
   anything that asks the audience for money here, so it can be checked in one
   place, and every entry has to say plainly what it is.
   --------------------------------------------------------------------------- */
const support = defineCollection({
  loader: file('src/data/support.json'),
  schema: z.object({
    id: z.string(),
    order: z.number().int().positive(),
    label: z.string(),
    kind: z.enum(['merch', 'wishlist', 'sponsor', 'donation', 'mail']),
    /** Omitted for `mail`, which has an address instead of a link. */
    url: z.url().optional(),
    icon: iconName,
    hue,
    blurb: z.string().default(''),
    /** Discount code for a sponsor, e.g. Dubby. */
    code: z.string().optional(),
    /** Postal address lines, for `kind: "mail"`. */
    address: z.array(z.string()).optional(),
  }),
});

/* ---------------------------------------------------------------------------
   Credits — the contributor roster. Grouped by role on /credits.
   --------------------------------------------------------------------------- */
const CREDIT_ROLES = [
  'live2d',
  'illustration',
  'overlays',
  'animation',
  'emotes',
  'editing',
  'management',
  'web',
] as const;

const credits = defineCollection({
  loader: file('src/data/credits.json'),
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      name: z.string(),
      role: z.enum(CREDIT_ROLES),
      url: z.url().optional(),
      /** Optional detail, e.g. "rigging" or a specific piece. */
      note: z.string().optional(),
      /** Profile picture. Path is relative to this JSON file. */
      avatar: image().optional(),
    }),
});

/** Display names and order for the roster groupings above. */
const creditRoles = defineCollection({
  loader: file('src/data/credit-roles.json'),
  schema: z.object({
    id: z.enum(CREDIT_ROLES),
    order: z.number().int().positive(),
    label: z.string(),
  }),
});

/* ---------------------------------------------------------------------------
   Friends — other creators she wants to point people at.
   --------------------------------------------------------------------------- */
const friends = defineCollection({
  loader: file('src/data/friends.json'),
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      order: z.number().int().positive(),
      name: z.string(),
      url: z.url().optional(),
      hue,
      blurb: z.string().default(''),
      /** Profile picture. Path is relative to this JSON file. */
      avatar: image().optional(),
    }),
});

/* ---------------------------------------------------------------------------
   Hashtags. `adult` marks a tag as 18+; those tags get a label and stay out of
   anywhere the site shows images. No adult imagery is hosted or embedded here,
   since web hosts can be a little particular about that sort of thing.
   --------------------------------------------------------------------------- */
const hashtags = defineCollection({
  loader: file('src/data/hashtags.json'),
  schema: z.object({
    id: z.string(),
    order: z.number().int().positive(),
    tag: z.string().startsWith('#', 'Include the leading #'),
    purpose: z.string(),
    hue,
    adult: z.boolean().default(false),
  }),
});

/* ---------------------------------------------------------------------------
   Profile — the "quick facts" list.
   --------------------------------------------------------------------------- */
const profile = defineCollection({
  loader: file('src/data/profile.json'),
  schema: z.object({
    id: z.string(),
    order: z.number().int().positive(),
    label: z.string(),
    value: z.string(),
    hue,
  }),
});

/* ---------------------------------------------------------------------------
   Works — art, music, and sound design. One Markdown file per piece; the body
   is an optional write-up.
   --------------------------------------------------------------------------- */
const works = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/works' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      kind: z.enum(['art', 'music', 'sound']),
      /** Sort key, newest first. */
      date: z.coerce.date(),
      summary: z.string().default(''),
      tags: z.array(z.string()).default([]),
      featured: z.boolean().default(false),
      /** Drafts show in `astro dev` and are dropped from production builds. */
      draft: z.boolean().default(false),
      /**
       * Credit for work that is not hers. A commissioned illustration can lead
       * the page without implying that she drew it.
       */
      credit: z
        .object({
          name: z.string(),
          role: z.string().optional(),
          url: z.url().optional(),
        })
        .optional(),
      media: z.discriminatedUnion('type', [
        z.object({
          type: z.literal('image'),
          src: image(),
          alt: z.string(),
        }),
        z.object({
          type: z.literal('youtube'),
          videoId: z.string(),
          poster: image().optional(),
        }),
        z.object({
          type: z.literal('soundcloud'),
          trackUrl: z.url(),
          poster: image().optional(),
        }),
        z.object({
          type: z.literal('bandcamp'),
          embedId: z.string(),
          poster: image().optional(),
        }),
      ]),
    }),
});

/* ---------------------------------------------------------------------------
   Pages — the bio, lore, character forms, Nocturne, and other long prose. They
   stay out of the components so they can be edited as plain Markdown.
   --------------------------------------------------------------------------- */
const artCredit = z.object({
  name: z.string(),
  role: z.string().optional(),
  url: z.url().optional(),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Shorter alternative used where the full text would not fit. */
      summary: z.string().optional(),
      order: z.number().int().positive().default(1),
      /** Illustration for this section. Path is relative to the .md file. */
      image: image().optional(),
      imageAlt: z.string().optional(),
      /** Who drew it. Rendered wherever the image is shown. */
      credit: artCredit.optional(),
    }),
});

export const collections = {
  socials,
  support,
  credits,
  creditRoles,
  friends,
  hashtags,
  profile,
  works,
  pages,
};
