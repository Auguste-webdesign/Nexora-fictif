/**
 * Extracts the iPhone 18 teardown clip into WebP frame sequences for the
 * scroll-scrubbed hero canvas.
 *
 * Why frames instead of <video>: scrubbing an MP4 via currentTime only seeks
 * cleanly to keyframes and janks badly under rapid writes (especially iOS
 * Safari). A preloaded frame sequence gives deterministic, bidirectional,
 * frame-accurate scrubbing.
 *
 * Source is 1280x720 @ 24fps, 8s = 192 frames, on a flat #FAFAFA background.
 * We lift that background to pure #FFFFFF so it merges seamlessly with the
 * page. The hero canvas then renders with mix-blend-mode: multiply, so the
 * white becomes effectively transparent and any background layer added later
 * shows through without keying artifacts.
 *
 * Usage: node scripts/extract-frames.mjs
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(root, "MEDIA", "Disassembling_iPhone_animation_202608261447.mp4");

/**
 * The source carries a 3px black letterbox bar on the top and bottom edges.
 * ffmpeg's cropdetect misses it at default thresholds, but under the hero's
 * mix-blend-mode: multiply those rows render as hard black rules across the
 * viewport. Trim 4px from each edge (1280x720 -> 1280x712).
 */
const CROP = "crop=1280:712:0:4";

// Lifts the source's #FAFAFA (250/255 = 0.9804) white point to pure #FFFFFF.
const WHITE_POINT = "colorlevels=rimin=0:rimax=0.9804:gimin=0:gimax=0.9804:bimin=0:bimax=0.9804";

/** Stills pulled from the same clip, used as real imagery in page sections. */
const STILLS = [
  { frame: 1, name: "assembled" },
  { frame: 58, name: "separating" },
  { frame: 104, name: "layers" },
  { frame: 150, name: "spread" },
  { frame: 192, name: "exploded" },
];

const VARIANTS = [
  { name: "desktop", width: 1280, quality: 84 },
  { name: "mobile", width: 720, quality: 76 },
];

function dirSizeMB(dir) {
  return (
    readdirSync(dir).reduce((sum, f) => sum + statSync(join(dir, f)).size, 0) /
    1024 /
    1024
  );
}

for (const variant of VARIANTS) {
  const outDir = join(root, "public", "frames", variant.name);
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  // -vsync 0 keeps a strict 1:1 mapping between source and output frames.
  execFileSync(
    ffmpegPath,
    [
      "-v", "error",
      "-i", SOURCE,
      "-vf", `${CROP},${WHITE_POINT},scale=${variant.width}:-2:flags=lanczos`,
      "-vsync", "0",
      "-c:v", "libwebp",
      "-quality", String(variant.quality),
      "-compression_level", "6",
      "-preset", "picture",
      "-an",
      join(outDir, "frame_%04d.webp"),
      "-y",
    ],
    { stdio: "inherit" }
  );

  const count = readdirSync(outDir).length;
  console.log(
    `${variant.name}: ${count} frames @ ${variant.width}px — ${dirSizeMB(outDir).toFixed(2)} MB`
  );
}

// Section stills — real imagery from the actual product footage, so the page
// is not carrying abstract placeholders where photography belongs.
const stillsDir = join(root, "public", "stills");
rmSync(stillsDir, { recursive: true, force: true });
mkdirSync(stillsDir, { recursive: true });

for (const still of STILLS) {
  execFileSync(
    ffmpegPath,
    [
      "-v", "error",
      "-i", SOURCE,
      "-vf", `select='eq(n\\,${still.frame - 1})',${CROP},${WHITE_POINT}`,
      "-frames:v", "1",
      "-c:v", "libwebp",
      "-quality", "90",
      "-compression_level", "6",
      join(stillsDir, `${still.name}.webp`),
      "-y",
    ],
    { stdio: "inherit" }
  );
}
console.log(`stills: ${STILLS.length} written — ${dirSizeMB(stillsDir).toFixed(2)} MB`);

// The manifest is the single source of truth for frame count, so the hero
// never guesses how many frames exist.
const count = readdirSync(join(root, "public", "frames", "desktop")).length;
writeFileSync(
  join(root, "public", "frames", "manifest.json"),
  JSON.stringify({ frameCount: count, aspectRatio: 1280 / 720 }, null, 2)
);
console.log(`manifest.json written (frameCount: ${count})`);
