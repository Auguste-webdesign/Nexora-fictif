/**
 * Prepares the three iPhone 18 colourway shots for the Vision and Acquire
 * sections.
 *
 * The sources are 2752x1536 with the phone occupying a small portion of a very
 * wide, near-empty frame — dropped into a portrait container as-is, the phone
 * would render tiny. Each one is therefore:
 *
 *   1. MEASURED. The content bounding box is found by downsampling and keeping
 *      every pixel darker than the near-white ground, rather than trusting
 *      ffmpeg's cropdetect (which looks for BLACK borders, and would find
 *      nothing on a white-bordered image).
 *   2. CROPPED to that box plus a margin, then padded out to a 3:4 portrait.
 *   3. WHITE-POINT LIFTED, THEN KEYED TO TRANSPARENT. The ground is #FAFAFA,
 *      the same as the teardown footage; it is lifted to pure #FFFFFF and then
 *      keyed out to alpha.
 *
 *      Transparency here is not cosmetic. These sit on the Acquire section's
 *      coloured wash, and the obvious alternative — keeping a white ground and
 *      compositing with mix-blend-multiply — breaks the moment the image is
 *      animated: animating opacity creates a stacking context, which isolates
 *      the blend, so the white ground reappears as a hard rectangle for the
 *      whole duration of the entrance. A real alpha channel has no such
 *      coupling. The key is deliberately tight (similarity 0.06) because the
 *      platinum chassis is only #a9a8a5 — a loose key would eat the product.
 *
 * Usage: node scripts/prepare-colorways.mjs
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(root, "MEDIA");
const OUT = join(root, "public", "colorways");

const W = 900;
const H = 1200; // 3:4 portrait
const MARGIN = 0.06; // fraction of the detected box added on every side
const WHITE_POINT = "colorlevels=rimin=0:rimax=0.9804:gimin=0:gimax=0.9804:bimin=0:bimax=0.9804";
/** Anything below this luminance counts as product rather than ground. */
const CONTENT_THRESHOLD = 238;

/**
 * `keep` = do NOT key the ground out.
 *
 * The graphite chassis is a near-neutral #686766 sitting on the graphite wash
 * (#bcbcc1); keyed to alpha it loses almost all separation from the panel behind
 * it. Keeping its white ground gives the phone a plate to stand on. Blue and
 * platinum have enough separation from their own washes to float free.
 */
const SOURCES = [
  { file: "iphone 18 bleu.jpeg", id: "blue" },
  { file: "iphone 18 graphite.jpeg", id: "graphite", keepGround: true },
  { file: "iphone 18 platine.jpeg", id: "platinum" },
];

const ff = (args) =>
  execFileSync(ffmpegPath, args, { maxBuffer: 1 << 26, stdio: ["ignore", "pipe", "pipe"] });

function dimensions(file) {
  let txt = "";
  try {
    ff(["-i", file]);
  } catch (e) {
    txt = (e.stderr || "").toString();
  }
  const m = txt.match(/Stream #0:0.*?: Video: \w+.*?, \w+[^,]*, (\d+)x(\d+)/);
  if (!m) throw new Error(`could not read dimensions: ${file}`);
  return { w: +m[1], h: +m[2] };
}

/** Bounding box of non-ground pixels, in source coordinates. */
function contentBox(file, srcW, srcH, grid = 240) {
  const gh = Math.round((grid * srcH) / srcW);
  const buf = ff([
    "-v", "error",
    "-i", file,
    "-vf", `scale=${grid}:${gh}`,
    "-f", "rawvideo",
    "-pix_fmt", "rgb24",
    "-",
  ]);

  let minX = grid;
  let minY = gh;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < gh; y++) {
    for (let x = 0; x < grid; x++) {
      const i = (y * grid + x) * 3;
      const lum = 0.2126 * buf[i] + 0.7152 * buf[i + 1] + 0.0722 * buf[i + 2];
      if (lum < CONTENT_THRESHOLD) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) throw new Error(`no content detected in ${file}`);

  const sx = srcW / grid;
  const sy = srcH / gh;
  const boxW = (maxX - minX + 1) * sx;
  const boxH = (maxY - minY + 1) * sy;
  const padX = boxW * MARGIN;
  const padY = boxH * MARGIN;

  const left = Math.max(0, Math.round(minX * sx - padX));
  const top = Math.max(0, Math.round(minY * sy - padY));
  const width = Math.min(srcW - left, Math.round(boxW + padX * 2));
  const height = Math.min(srcH - top, Math.round(boxH + padY * 2));
  return { left, top, width, height };
}

/** Mean colour of the product body, used to derive the section's colour wash. */
function bodyColour(file, box) {
  const buf = ff([
    "-v", "error",
    "-i", file,
    "-vf", `crop=${box.width}:${box.height}:${box.left}:${box.top},scale=64:64`,
    "-f", "rawvideo",
    "-pix_fmt", "rgb24",
    "-",
  ]);
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  for (let i = 0; i < buf.length; i += 3) {
    const lum = 0.2126 * buf[i] + 0.7152 * buf[i + 1] + 0.0722 * buf[i + 2];
    // Skip the ground and the black screen glass; keep the chassis.
    if (lum < CONTENT_THRESHOLD && lum > 40) {
      r += buf[i];
      g += buf[i + 1];
      b += buf[i + 2];
      n++;
    }
  }
  if (!n) return null;
  return [r / n, g / n, b / n].map((v) => Math.round(v));
}

const hex = ([r, g, b]) => "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
/** Mixes toward white — the wash must stay light enough for black body copy. */
const lighten = ([r, g, b], amount) =>
  [r, g, b].map((v) => Math.round(v + (255 - v) * amount));

mkdirSync(OUT, { recursive: true });

for (const { file, id, keepGround } of SOURCES) {
  const src = join(SRC, file);
  const { w, h } = dimensions(src);
  const box = contentBox(src, w, h);
  const body = bodyColour(src, box);

  ff([
    "-v", "error",
    "-i", src,
    "-filter_complex",
    `color=c=${keepGround ? "white" : "black@0.0"}:s=${W}x${H},format=rgba[bg];` +
      `[0:v]crop=${box.width}:${box.height}:${box.left}:${box.top},${WHITE_POINT},` +
      `format=rgba${keepGround ? "" : ",colorkey=0xFFFFFF:0.06:0.0"},` +
      `scale=${W}:${H}:force_original_aspect_ratio=decrease:flags=lanczos[fg];` +
      `[bg][fg]overlay=(W-w)/2:(H-h)/2:format=auto`,
    "-frames:v", "1",
    "-c:v", "libwebp", "-quality", "88", "-compression_level", "6",
    join(OUT, `${id}.webp`), "-y",
  ]);

  console.log(
    `${id.padEnd(10)} ${(keepGround ? "white ground" : "keyed to alpha").padEnd(15)} crop ${box.width}x${box.height}` +
      (body ? `  body ${hex(body)}  wash ${hex(lighten(body, 0.74))}` : "")
  );
}

const mb = readdirSync(OUT).reduce((s, f) => s + statSync(join(OUT, f)).size, 0) / 1024 / 1024;
console.log(`\n${SOURCES.length} colourways at ${W}x${H} — ${mb.toFixed(2)} MB`);
