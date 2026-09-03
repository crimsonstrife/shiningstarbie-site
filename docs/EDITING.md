# Updating the site

Everything on this site comes from plain text files. You shouldn't need to
install anything or write code; you can make the changes in a browser on
GitHub.com.

**How a change goes live:** you edit a file → GitHub saves it → the site rebuilds
itself → your change is live in about a minute.

> **A mistake will usually stop the new version, not the live site.** The site
> checks the content files before publishing them. If one of those checks
> fails, GitHub keeps the last successful version online and emails you about
> the failed build. Fix the file and commit it again.

---

## Editing a file on GitHub.com

1. Open the repository on GitHub.
2. Click into the folder, then the file you want (paths are listed below).
3. Click the **pencil icon** at the top right of the file.
4. Make your change.
5. Scroll down, click **Commit changes**.

That's the whole process. Give the build about a minute, then refresh the site.

---

## The files, and what each one does

| I want to… | Edit this file |
|---|---|
| Add or change a social link | `src/data/socials.json` |
| Change merch, wishlist, sponsor, or PO box | `src/data/support.json` |
| Add someone to the credits | `src/data/credits.json` |
| Change my hashtags | `src/data/hashtags.json` |
| Change my name, birthday, pronouns, etc. | `src/data/profile.json` |
| Add or change a friend | `src/data/friends.json` |
| Change my bio, lore, or character refs | `src/content/pages/` |
| Add a piece of art, music, or sound | `src/content/works/` |
| Change the site title or menu | `src/data/site.json` |

---

## Rules that apply to every `.json` file

JSON is picky about punctuation. Three rules cover almost everything:

- Text goes in `"double quotes"`.
- Every line ends with a comma **except the last one** in its block.
- `true` and `false` are not quoted.

A good habit is to copy an existing entry and change its values. The punctuation
is already in place, which removes most of the ways JSON can object.

---

## Adding a social link

Open `src/data/socials.json`. Copy one of the blocks and edit it:

```json
{
  "id": "bluesky",
  "order": 8,
  "label": "Bluesky",
  "url": "https://bsky.app/profile/yourname",
  "icon": "fa6-brands:bluesky",
  "hue": "sky",
  "blurb": "Shows under the name.",
  "primary": false
}
```

- **`id`** — a short nickname, lowercase, no spaces. Must be different from every other one.
- **`order`** — the position in the list. Lower numbers come first.
- **`icon`** — search your platform at [icones.js.org](https://icones.js.org/collection/fa6-brands) and use the name shown, e.g. `fa6-brands:twitch`.
- **`hue`** — the stripe color. One of: `terracotta`, `orange`, `gold`, `green`, `teal`, `purple`, `pink`.
- **`primary`** — `true` puts it as a big button on the front page. Keep this to about four.

---

## Adding a piece of art, music, or sound

Go to `src/content/works/` and click **Add file → Create new file**.

Name it something like `starlight-waltz.md` — lowercase, dashes instead of
spaces, ending in `.md`. **The file name becomes the web address**, so that one
becomes `/works/starlight-waltz`.

There is a filled-in example at `src/content/works/example-piece.md` you can
copy from. The short version:

```
---
title: Starlight Waltz
kind: music
date: 2026-03-14
summary: One line that shows under the title.
featured: false
draft: false
media:
  type: youtube
  videoId: dQw4w9WgXcQ
---

Anything you write down here becomes the write-up on the piece's own page.
It's optional — a title and a picture is a perfectly good entry.
```

- **`kind`** — `art`, `music`, or `sound`. This drives the filter buttons.
- **`date`** — `YYYY-MM-DD`. Newest shows first.
- **`featured`** — `true` puts it on the front page.
- **`draft`** — `true` hides it from the live site. Set it to `false` to publish.

### The four kinds of media

**A picture.** Upload the image into `src/assets/works/` first, then:

```yaml
media:
  type: image
  src: ../../assets/works/your-file-name.png
  alt: A short description for anyone who can't see the image.
```

Please always write the `alt` line. It is the description a screen reader uses
in place of the image.

**A YouTube video.** From `youtube.com/watch?v=dQw4w9WgXcQ`, take the part after `v=`:

```yaml
media:
  type: youtube
  videoId: dQw4w9WgXcQ
```

**A SoundCloud track** — the full address of the track:

```yaml
media:
  type: soundcloud
  trackUrl: https://soundcloud.com/your-name/your-track
```

**A Bandcamp album or track** — from Bandcamp's share/embed code, the `album=` or `track=` part:

```yaml
media:
  type: bandcamp
  embedId: album=1234567890
```

### Crediting an artist

If someone else made the piece, add this and their name shows on the page:

```yaml
credit:
  name: Their name
  role: Illustration
  url: https://their-link.com
```

---

## Adding someone to the credits

Open `src/data/credits.json` and copy an entry:

```json
{ "id": "newartist", "name": "NewArtist", "role": "illustration", "url": "https://vgen.co/newartist" }
```

`role` must be exactly one of: `live2d`, `illustration`, `overlays`,
`animation`, `emotes`, `editing`, `management`, `web`. The spelling matters
because the page uses it to choose a heading. You don't need to put the people
in any particular order.  If you need a new role added, ask me or take a shot at editing the `.json` file at `src/data/credit-roles.json`.

`url` and `note` are both optional. Leave `url` out entirely if they don't want
to be linked:

```json
{ "id": "someone", "name": "Someone", "role": "emotes" }
```

---

## Adding profile pictures

Friends and credited people can have a profile picture. Put the image file in
`src/assets/people/`, then point at it from the entry:

```json
{ "id": "juno", "order": 1, "name": "Juno", "url": "https://www.twitch.tv/butterfly_juno", "hue": "purple", "avatar": "../assets/people/juno.png" }
```

The `../assets/people/` part tells the site how to reach the image from the data
file. Copy that part exactly and change only the file name at the end.

Square images look best. Anyone without an `avatar` still shows normally, so you
can add pictures a few at a time.

---

## Adding a picture to a page

The bio, lore, and Nocturne pages in `src/content/pages/` can each carry an
illustration. Put the file in `src/assets/art/`, then add these lines between
the two rows of `---`:

```yaml
image: ../../assets/art/your-file-name.png
imageAlt: A short description for anyone who can't see the picture.
credit:
  name: The artist's name
  role: Illustration
  url: https://their-link.com
```

The credit shows underneath the picture. Please always fill it in when the art
isn't yours.

---

## Changing your bio or lore

These are in `src/content/pages/`:

| File | What it is |
|---|---|
| `intro.md` | The greeting on the front page |
| `lore.md` | Your backstory, on the About page |
| `form-human.md` | Human form reference list |
| `form-succubus.md` | Succubus form reference list |
| `nocturne.md` | Nox's description |

Leave the lines between the two rows of `---` alone, since the build uses them
as page settings. Edit the text below them. A blank line starts a new paragraph,
and `- ` at the start of a line makes a bullet point.

---

## Adding a divider to your writing

Anywhere you're writing in a `.md` file, put **three dashes on their own line**
with a blank line above and below:

```
Some writing up here.

---

And more writing down here.
```

That becomes your little star divider. For the looping line instead, use:

```
<hr class="loops" />
```

Both use the color assigned to their section, so you don't need to set one in
the Markdown file.

---

## Changing the site icon

The little picture in the browser tab is your Carrd icon. To change it, replace
these three files in the `public/` folder, keeping the same names and sizes:

| File | Size |
|---|---|
| `favicon-32.png` | 32 × 32 |
| `favicon-64.png` | 64 × 64 |
| `apple-touch-icon.png` | 180 × 180, no transparency |

On GitHub, open the `public` folder, click **Add file → Upload files**, and drop
in the replacements. Keep the names unchanged, or the site will keep using
the old files.

---

## Things worth knowing

**Colors.** Everywhere a file asks for a `hue`, the choices are `terracotta`,
`orange`, `gold`, `green`, `teal`, `purple`, `pink` — the seven colors in the
starbie logo. If you want to change one of these or add a new one, ask me.

**Don't rename or delete a file's `id`** if you're unsure. Other entries may
point at it, and those references will not follow the new name. Changing the
`name` or `label` is generally safe.

**Renaming a works file changes its web address.** If you've shared a link to a
piece, that old link will stop working.

**Adult content.** `#starbiesinfuls` is listed on the Links page as text with an
18+ label. No adult imagery is hosted or shown anywhere on this site, webhosts can be a little picky.
If you're determined to eventually host adult content on the site itself, we'll need a different hosting option.

---

## If you get stuck

Ask me. If a change didn't appear, check the **Actions** tab in the GitHub
repository. A red ✗ means the last build failed; click it to see which file and
line caused the problem.
