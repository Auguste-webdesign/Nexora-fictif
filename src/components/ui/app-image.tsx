import Image, { type ImageProps } from "next/image";
import { BASE_PATH } from "@/lib/base-path";

/**
 * `next/image`, with `basePath` applied by hand.
 *
 * `images.unoptimized: true` (required for the GitHub Pages static export —
 * see next.config.ts) makes next/image skip its own URL construction
 * entirely. Normally the `/_next/image?url=...` proxy path is what carries
 * the `basePath` prefix; in unoptimized mode there is no proxy path, so a
 * literal `src="/products/iphone-18.webp"` is used verbatim — which 404s the
 * moment the site is served from a subpath (`/Nexora-fictif/...`) instead of
 * the domain root. Confirmed on the live deployment: every `<img>` on
 * /catalog rendered with the bare `/products/...` path, none prefixed.
 *
 * This wraps next/image and prepends BASE_PATH itself for any root-relative
 * string `src`, so every call site keeps writing plain `/products/...`
 * paths — nothing else changes, only the import. `BASE_PATH` is `""`
 * everywhere except the GitHub Pages build (src/lib/base-path.ts), so local
 * dev and Vercel are unaffected.
 *
 * Deliberately not a Client Component: it does nothing but transform a prop,
 * so it works in whichever kind of component imports it.
 */
export default function AppImage({ src, alt, ...rest }: ImageProps) {
  const prefixed = typeof src === "string" && src.startsWith("/") ? `${BASE_PATH}${src}` : src;
  // `alt` is destructured and passed explicitly rather than left inside
  // `...rest`: `ImageProps` requires it, so this is never actually missing,
  // but eslint-plugin-jsx-a11y only recognises a literal `alt=` on the
  // element itself and flags a false positive otherwise.
  return <Image src={prefixed} alt={alt} {...rest} />;
}
