import type { NextConfig } from "next";

/**
 * Two build targets share this one config.
 *
 * Local dev and Vercel: the default — a full Next.js server. The API route,
 * the order confirmation page, and Resend all work.
 *
 * GitHub Pages: a static export, built by scripts/build-static.mjs and
 * deployed by .github/workflows/deploy-pages.yml — the only two places that
 * ever set NEXT_PUBLIC_STATIC_EXPORT. GitHub Pages can only serve files that
 * already exist; it cannot run `/api/orders` (a POST handler — Next's static
 * export only supports `force-static` GET routes) or `/commande/[orderId]`
 * (params created at runtime, impossible to know at build time). Both are
 * physically removed from the build tree by that script before `next build`
 * runs, and restored immediately after — this config only handles the parts
 * that stay.
 *
 * `output: "export"` disallows next/image's default loader (it optimises on
 * request, which needs a server), hence `unoptimized: true` — the images
 * ship as-is instead.
 *
 * `basePath` is required because this repo is a *project* Pages site
 * (github.io/Nexora-fictif), not a user/org root site — every internal link
 * and asset Next.js manages needs that prefix. The one place Next does NOT
 * manage — a raw `<img>.src` in use-frame-sequence.ts — reads the same value
 * itself via src/lib/base-path.ts, so both stay in sync from one source.
 */
const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  ...(isStaticExport && {
    output: "export",
    basePath: process.env.NEXT_PUBLIC_PAGES_BASE_PATH || "",
    images: { unoptimized: true },
  }),
};

export default nextConfig;
