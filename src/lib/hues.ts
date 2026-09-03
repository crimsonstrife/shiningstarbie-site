/**
 * The seven logo hues, in the order they appear in the wordmark. Content files
 * pick one by name, so nothing outside this file needs to know the hex values.
 */
export const HUES = ['terracotta', 'orange', 'gold', 'green', 'teal', 'purple', 'pink'] as const;

export type Hue = (typeof HUES)[number];

/** The bright value is for decoration, rules, and underlines, not text. */
export const bright = (hue: Hue) => `var(--c-${hue})`;

/**
 * Only the darkened value clears AA on white, so links and labels use this
 * version. The measurements are in tokens.css.
 */
export const deep = (hue: Hue) => `var(--c-${hue}-deep)`;

/**
 * Walk through the wordmark colors when a list does not need hand-picked hues.
 * This keeps one more setting out of each content entry.
 */
export const hueAt = (index: number): Hue => HUES[index % HUES.length];
