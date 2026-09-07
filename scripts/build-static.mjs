/**
 * Builds the GitHub Pages export.
 *
 * `output: "export"` refuses to build at all if the tree contains a route
 * Next.js cannot make static — confirmed against the bundled docs
 * (node_modules/next/dist/docs/01-app/02-guides/static-exports.md):
 *
 *   - `src/app/api/orders/route.ts` is a POST handler. Static export only
 *     supports GET routes marked `force-static`; anything else fails the
 *     build outright.
 *   - `src/app/commande/[orderId]/page.tsx` is a dynamic route with no
 *     `generateStaticParams()` — order ids are created at runtime by real
 *     orders, so there is nothing to pre-render at build time.
 *
 * Both are genuinely incompatible with static hosting, not just inconvenient
 * — GitHub Pages cannot run either one however this script is written. So
 * this MOVES them out of `src/app` before `next build`, and moves them back
 * in a `finally` block that runs whether the build succeeds or throws — the
 * working tree must never end a run with routes missing, for local builds or
 * for Vercel's next deploy.
 *
 * Nothing else in the source tree changes. `lib/orders.ts` and
 * `lib/notify-seller.ts` are simply left unimported for this build — Next
 * does not compile a file that nothing references, so no further exclusion
 * is needed for them.
 *
 * Usage: node scripts/build-static.mjs
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const appDir = join(root, "src", "app");
const parkDir = join(root, ".tmp", "static-export-excluded");
const nextCacheDir = join(root, ".next");

/** [source inside src/app, park location] */
const EXCLUDED = [
  ["api", "api"],
  ["commande", "commande"],
];

function park() {
  rmSync(parkDir, { recursive: true, force: true });
  mkdirSync(parkDir, { recursive: true });
  for (const [name, parkName] of EXCLUDED) {
    const from = join(appDir, name);
    if (existsSync(from)) {
      renameSync(from, join(parkDir, parkName));
      console.log(`  parked  src/app/${name}`);
    }
  }
}

function restore() {
  let restored = 0;
  for (const [name, parkName] of EXCLUDED) {
    const from = join(parkDir, parkName);
    if (existsSync(from)) {
      renameSync(from, join(appDir, name));
      restored++;
    }
  }
  if (restored > 0) console.log(`  restored ${restored} route(s) to src/app`);
  rmSync(parkDir, { recursive: true, force: true });
}

console.log("Excluding server-only routes for the static export:");
park();

// `.next/dev/types/validator.ts` is generated against whatever routes existed
// the last time Next ran — `next dev`, an ordinary `next build`, an earlier
// invocation of this script. With api/ and commande/ just moved out, a stale
// validator still importing them fails typecheck before the build even gets
// to bundling. The tree just changed shape, so the cache from its old shape
// cannot be trusted; wiping it is what makes this script reliably
// re-runnable regardless of what ran here before it.
rmSync(nextCacheDir, { recursive: true, force: true });

try {
  // `npx` is a `.cmd` shim on Windows, not a real executable. Node's own docs
  // are explicit that spawning a `.cmd`/`.bat` requires `shell: true` on
  // Windows — without it, spawning fails outright (confirmed: EINVAL, not a
  // fallback). Node also warns that `shell: true` stops it from escaping
  // arguments, but that warning is about untrusted input reaching a shell;
  // the two arguments here are the fixed literals "next" and "build", never
  // anything from a caller, so there is nothing an escape would protect
  // against.
  execFileSync("npx", ["next", "build"], {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, NEXT_PUBLIC_STATIC_EXPORT: "true" },
    shell: true,
  });
} finally {
  restore();
}

console.log("\nStatic export ready in ./out");
