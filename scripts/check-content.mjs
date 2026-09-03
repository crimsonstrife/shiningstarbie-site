/**
 * Pre-build guard for the JSON content files.
 *
 * Astro's `file()` loader does not fail the build on malformed JSON. It logs
 * `[ERROR] [file-loader] Error reading data from ...`, exits 0, and produces a
 * site with that collection silently empty. I verified it with one stray comma
 * in socials.json: the Links page had no links, and the footer had no icons. A
 * warm cache can hide the problem with the previous good data, so it tends to
 * appear on a clean CI checkout, which is exactly where it matters.
 *
 * The editing model depends on a typo failing the build instead of replacing
 * the live site, so this closes that gap. It runs during `prebuild` and checks
 * the three things a hand edit is most likely to get wrong.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DATA = 'src/data';

/** Files that must parse, be a non-empty array, and have unique ids. */
const COLLECTIONS = [
  'socials.json',
  'support.json',
  'credits.json',
  'credit-roles.json',
  'friends.json',
  'hashtags.json',
  'profile.json',
];

/** Not a collection — a single object, so it gets the parse check only. */
const SINGLETONS = ['site.json'];

const problems = [];

function parse(file) {
  const path = join(DATA, file);
  let raw;
  try {
    raw = readFileSync(path, 'utf8');
  } catch {
    problems.push(`${file} — file is missing.`);
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    // Turn “Unexpected token } in JSON at position 412” into a line number,
    // since the person fixing it is probably working in a browser text box.
    const at = /position (\d+)/.exec(error.message)?.[1];
    const where = at ? ` (around line ${raw.slice(0, Number(at)).split('\n').length})` : '';
    problems.push(
      `${file}${where} — this file isn't valid JSON.\n` +
        `      ${error.message}\n` +
        `      Usually a missing or extra comma, or a missing quote mark.`
    );
    return null;
  }
}

for (const file of SINGLETONS) parse(file);

for (const file of COLLECTIONS) {
  const data = parse(file);
  if (data === null) continue;

  if (!Array.isArray(data)) {
    problems.push(`${file} — expected a list of entries in [ square brackets ].`);
    continue;
  }

  if (data.length === 0) {
    problems.push(`${file} — this file is empty, so that section would vanish from the site.`);
    continue;
  }

  const seen = new Map();
  data.forEach((entry, i) => {
    const id = entry?.id;
    if (typeof id !== 'string' || id === '') {
      problems.push(`${file} — entry #${i + 1} has no "id". Every entry needs a unique one.`);
      return;
    }
    if (seen.has(id)) {
      problems.push(
        `${file} — "id": "${id}" is used twice (entries #${seen.get(id) + 1} and #${i + 1}). ` +
          `Ids must be unique or one entry will overwrite the other.`
      );
    }
    seen.set(id, i);
  });
}

/*
 * The SVGs in public/ are CSS masks, so the browser loads them as images and
 * expects well-formed XML. Inline SVG is more forgiving. A double hyphen in a
 * comment is illegal XML; the mask then resolves to nothing, the ornament
 * disappears, and the build stays green. That happened once, so this is the
 * tripwire.
 */
for (const file of readdirSync('public').filter((f) => f.endsWith('.svg'))) {
  const svg = readFileSync(join('public', file), 'utf8');

  for (const comment of svg.match(/<!--[\s\S]*?-->/g) ?? []) {
    if (comment.slice(4, -3).includes('--')) {
      problems.push(
        `public/${file} — an XML comment contains "--", which is not allowed and ` +
          `stops the file loading as an image. Reword the comment.`
      );
    }
  }

  if (!svg.includes('<svg')) problems.push(`public/${file} — no <svg> root element.`);
}

if (problems.length > 0) {
  console.error('\n  Content check failed — the site was NOT built.\n');
  for (const problem of problems) console.error(`  ✗ ${problem}\n`);
  console.error('  Fix the file above and commit again. The live site is unchanged.\n');
  process.exit(1);
}

const svgCount = readdirSync('public').filter((f) => f.endsWith('.svg')).length;
console.log(`✓ Content check passed (${COLLECTIONS.length + SINGLETONS.length} data files, ${svgCount} SVGs).`);
