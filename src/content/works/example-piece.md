---
# ---------------------------------------------------------------------------
# This file is a working example of the format, not a real piece.
# `draft: true` keeps it off the live site while still showing in `npm run dev`,
# so you can see the layout. Copy it, rename it, fill it in, and set draft to
# false. Delete this file whenever you like.
#
# The file name becomes the web address:
#   src/content/works/starlight-waltz.md  ->  /works/starlight-waltz
# ---------------------------------------------------------------------------
title: Example piece
kind: art            # art | music | sound
date: 2026-01-01
summary: A one-line description that shows under the title.
featured: false      # true pins it to the home page
draft: true          # false publishes it
tags:
  - example
media:
  type: image        # image | youtube | soundcloud | bandcamp
  src: ../../assets/brand/starbie-about-graphic.png
  alt: Describe the picture for anyone who cannot see it.
credit:
  name: Your artist's name
  role: Illustration
---

Anything you write below the dashes becomes the write-up on the piece's own
page. It is optional — a title and a picture is a perfectly good entry.

Typing three dashes on their own line drops in your star divider:

---

And this gives you the looping line instead:

<hr class="loops" />

## Other kinds of media

Swap the `media:` block above for one of these:

```yaml
media:
  type: youtube
  videoId: dQw4w9WgXcQ
```

```yaml
media:
  type: soundcloud
  trackUrl: https://soundcloud.com/your-name/your-track
```

```yaml
media:
  type: bandcamp
  embedId: album=1234567890
```
