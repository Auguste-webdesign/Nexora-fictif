/**
 * The path GitHub Pages serves this app under, e.g. `/Nexora-fictif`.
 *
 * Empty everywhere else — local dev, Vercel — where the app is served from
 * its own domain root. `next.config.ts` reads the same variable for `basePath`
 * (which handles every asset Next.js itself manages: `<Link>`, `next/image`,
 * its own JS chunks). This constant exists for the ONE place that bypasses
 * Next's asset handling: `use-frame-sequence.ts` sets `<img>.src` directly on
 * a raw DOM element to drive the canvas scrub, which Next never sees and
 * therefore never prefixes.
 *
 * `NEXT_PUBLIC_` so the value is inlined into the client bundle at build time
 * — see .github/workflows/deploy-pages.yml, the only place that ever sets it.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_PAGES_BASE_PATH ?? "";
