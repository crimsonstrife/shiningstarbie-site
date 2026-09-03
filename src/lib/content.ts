/** Drafts render in `astro dev` and never in a production build. */
export const includeDrafts = import.meta.env.DEV;

/** Use the explicit `order` key because file-loaded collections sort by id. */
export function byOrder<T extends { data: { order: number } }>(a: T, b: T): number {
  return a.data.order - b.data.order;
}

/** Show the newest work first. */
export function byDate<T extends { data: { date: Date } }>(a: T, b: T): number {
  return b.data.date.valueOf() - a.data.date.valueOf();
}

/**
 * A work's Markdown body is optional; an image and title are enough. Comments
 * do not count as a write-up because the reader never sees them.
 */
export function hasWriteup(body?: string): boolean {
  return Boolean(body?.replace(/<!--[\s\S]*?-->/g, '').trim());
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', timeZone: 'UTC' });
}
