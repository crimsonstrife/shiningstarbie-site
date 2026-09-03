/** Add Astro's deployment base to an internal path. External URLs pass through. */
export function href(path: string): string {
  if (!path.startsWith('/')) return path;

  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path}`;
}
