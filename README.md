# shiningstarbie-site

This is the promotional site for **starbie🌈⭐** — VTuber, artist, music
composer, and sound designer. It is built with [Astro](https://astro.build) and
deployed to GitHub Pages.

It replaces the previous single-page Carrd at `starbievt.carrd.co`.

---

## For Starbie

**→ [docs/EDITING.md](docs/EDITING.md)** explains how to update the site from
GitHub.com. You shouldn't need to install anything.

---

## Development

```bash
npm install
npm run dev      # starts the site at http://localhost:4321
npm run build    # checks the code and content, then builds into dist/
npm run preview  # serves the built site locally
```

Use Node 22.12 or newer. Earlier versions haven't been tested.

---

## How the site is put together

I kept everything the site says in a `.md` or `.json` file, so Starbie can
maintain it without writing code. That decision has two consequences:

**Every repeatable list is checked against a schema.**
`src/content.config.ts` defines those schemas with Zod. A missing URL or a
mistyped role fails the build with a message naming the file and field, rather
than publishing a broken page. Astro also writes a JSON Schema for each
collection into `.astro/collections/` on every build. `.vscode/settings.json`
points the editor at those files, so the same checks appear as autocomplete
while editing.

**Components handle the presentation.** A content file can pick a `hue` by
name (`purple`, `teal`, …), but it doesn't contain hex values, CSS classes, or
other layout instructions. This keeps an ordinary content edit from quietly
changing the design.

```
src/
├─ content.config.ts     # every collection + its schema — start here
├─ data/                 # JSON: socials, support, credits, friends,
│                        #   hashtags, profile, credit-roles, site
├─ content/
│  ├─ pages/             # prose: intro, lore, character forms, Nocturne
│  └─ works/             # one .md per piece of art / music / sound
├─ assets/brand/         # her logo, graphics, confetti and star overlays
├─ components/           # Band, LinkRow, FactList, WorkMedia…
├─ layouts/BaseLayout.astro
├─ lib/                  # sorting, hue helpers, small shared utilities
├─ pages/                # routes
└─ styles/               # tokens.css, global.css
```

### Design system

I sampled two palettes from her artwork, and they have different jobs. The
split is enforced in `src/styles/tokens.css`, which also records the contrast
measurements behind it:

- **Sticker pastels** — backgrounds and decoration only. Measured against WCAG
  relative luminance, none of them has enough contrast for text.
- **Logo spectrum** — the wordmark's letter colors. The bright values are
  decoration; each has a `-deep` sibling, the darkest same-hue value clearing
  5:1 on white, and only those are used as text or links.

Ink (`#2E2A3A`) clears AA on all seven pastels (worst case 5.49:1), so text on a
colored band is always ink, and links there take an ink label with a bright
underline. Contrast is resolved once in `Band.astro` rather than per component.

Sections are full-bleed **bands** separated by cloud-scallop dividers. I didn't
use another card grid, since that is what the old Carrd already was.

### Background textures

Two textures came over from the Carrd. Either can be added to a band with
`<Band texture="grid">` or `<Band texture="stars">`:

- **`grid`** — her tiling graph-paper background. Built from two
  `repeating-linear-gradient`s rather than a data-URI SVG, so the color is a
  token (`--grid-color`) and there is no URI encoding to get wrong. Tune with
  `--grid-size`, `--grid-line`, `--grid-opacity` in `tokens.css`.
- **`stars`** — her animated falling-star loop (`public/falling-stars.gif`,
  48 KB, 2.16 s). Its edges match at the native 200 px size, and its alpha
  channel lets the band color show through. Under `prefers-reduced-motion`,
  it swaps to `public/falling-stars-still.png`; the stars stay, but the movement
  stops.

The current convention is that cream bands take the grid, pastel bands stay
flat, and the hero carries the stars. Both textures sit behind the content and
ignore pointer input, so they shouldn't interfere with a link or button.

### Flourishes

`<Flourish variant="stars" | "loops" />` renders the two pink ornaments from her
Carrd. I apply them as CSS **masks** filled with `--flourish-color`, so the same
asset can be used in any color. A data-URI SVG can't read a CSS variable.
Both ornaments are `aria-hidden`. Stars default to the compact 3rem cluster
from the Carrd (`width="full"` runs them edge to edge); loops are always full
width.

**In Markdown**, a plain `---` rule becomes the star divider, while
`<hr class="loops" />` becomes the looping line. This keeps both options in the
files Starbie already edits, without adding a custom format for either one.

**Color.** Her soft `#ffa6c6` measures 9.6:1 on the dark footer but only
1.1–1.8:1 on the band tones, which is close enough to invisible. The default
`--flourish-color` therefore stays soft pink for the dark footer, while `Band`
uses `--flourish-color-deep` (`#a9003d`). It is the same hue, darkened until it
clears 3:1 on the worst band. Override it per heading with
`<SectionHeading flourishColor="var(--c-teal-deep)" />`, or anywhere by setting
`--flourish-color` on a wrapper.

> **The SVGs must stay well-formed XML.** They are loaded as images (for the
> mask), not inlined, so the lenient HTML parser does not apply. A `--` inside
> an XML comment is illegal and silently turns the file into a broken image:
> the mask resolves to nothing, the ornament vanishes, no console error, green
> build. That happened once here — naming `--flourish-color` in a comment — so
> `scripts/check-content.mjs` now fails the build on it.

`<SectionHeading flourish />` wraps a title in the `˗ˏˋ ˎˊ˗` marks she types
around her own headers. The marks live in `aria-hidden` spans rather than the
title text, so a screen reader announces “Lore” instead of a run of modifier
letters. Page titles (`h1`) stay plain. If every heading used the marks, they
would stop looking like an accent.

### Artwork and attribution

Most of the art was made by other artists, so `<Illustration>` accepts a
`credit` and renders it below the image. Keeping that credit on the component
means it travels with the art instead of depending on a nearby paragraph. Prose
pages carry their own `image` and `credit` in frontmatter, while `friends` and
`credits` entries can take an `avatar`.

`image()` **does** work inside `file()`-loaded JSON collections, with paths
resolved relative to the JSON file. I verified that end to end because a wrong
assumption here usually leaves an empty image rather than a useful error.

### Deployment

`.github/workflows/deploy.yml` builds with `withastro/action` and publishes to
GitHub Pages on every push to `main`. Pull requests run the same build, but they
don't deploy it.

The site currently runs as a GitHub Pages project site at
`crimsonstrife.github.io/shiningstarbie-site`. `astro.config.mjs` keeps the
origin in `site` and the repository path in `base`. Internal links go through
`src/lib/urls.ts`, while `BaseLayout.astro` supplies the same base to public
images used from CSS.

When the custom domain is ready, change `site`, remove `base`, and restore
`public/CNAME`. The URL helper will collapse back to ordinary root-relative
paths.

---

## Credits

Site design and build by [Patrick Barnhardt](https://patrickbarnhardt.info).
All character art, logo, and graphics belong to starbie and the artists credited
on [the credits page](https://crimsonstrife.github.io/shiningstarbie-site/credits/).
