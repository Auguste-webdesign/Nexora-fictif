/**
 * Normalises the supplied product photography into one consistent set of
 * catalogue tiles: 1200x900 (4:3) WebP, one per product id.
 *
 * The source images arrive in three shapes, and each needs different handling:
 *
 *  1. UNIFORM BACKGROUND (most of them — a product shot on flat white).
 *     Scaled to fit and padded out to 4:3 using the image's OWN corner colour,
 *     so the added area is invisible rather than a white bar on an off-white
 *     photo.
 *
 *  2. TRANSPARENT (alpha channel — the HHKB png, the MX Mechanical and AirPods
 *     Pro webps). There is no background to sample, so one is chosen against
 *     the product: mean luminance of the opaque pixels decides it. A pale
 *     product (white AirPods, light HHKB keycaps) would vanish on white, so it
 *     gets a cool light grey; a dark product keeps white.
 *
 *  3. SCENE PHOTO (ASUS, Keychron, LG — shot in a room, corners all differ).
 *     Padding these would band the edges with an arbitrary colour, so they are
 *     centre-cropped to 4:3 instead. All three are already close to 4:3, so
 *     almost nothing is lost.
 *
 * Usage: node scripts/prepare-products.mjs
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(root, "MEDIA");
const OUT = join(root, "public", "products");

const W = 1200;
const H = 900;
/** Inner margin for padded product shots so nothing touches the tile edge. */
const INSET = 0.92;

/** Backgrounds used only when the source has no background of its own. */
const BG_FOR_PALE_PRODUCT = "#E7ECF3"; // cool grey — keeps white products readable
const BG_FOR_DARK_PRODUCT = "#FFFFFF";
/** Above this mean luminance the product is treated as pale. */
const PALE_THRESHOLD = 165;

/** filename in MEDIA/ -> product id in src/lib/products.ts */
const MAP = {
  "phone-18-pro.jpg": "iphone-18",
  "gg pixel 10 pro.jpg": "pixel-10-pro",
  "Smartphone-Samsung-Galaxy-S26-Ultra.jpg": "galaxy-s26-ultra",
  "sonny xperia.webp": "xperia-1-vii",

  "appleairpodspro3-headphones-white.webp": "airpods-pro-3",
  "sonny 1000xM6.jpg": "wf-1000xm6",
  "Sennheiser — Momentum True Wireless 4.jpg": "momentum-4-tw",
  "Bang & Olufsen — Beoplay EX.jpg": "beoplay-ex",

  "Sony — WH-1000XM6.webp": "wh-1000xm6",
  "Apple — AirPods Max 2.jpg": "airpods-max-2",
  "Bang & Olufsen — Beoplay H100.jpg": "beoplay-h100",
  "Sennheiser — HD 820.webp": "hd-820",

  "Apple — Pro Display XDR.webp": "pro-display-xdr",
  "LG — UltraFine Evo 6K.jpg": "ultrafine-evo",
  ". Samsung — Odyssey OLED G9.jpg": "odyssey-oled-g9",
  "ASUS — ProArt PA32KCX.jpg": "proart-pa32kcx",

  "Keychron — Q3 Max.jpg": "q3-max",
  "HHKB — Professional Hybrid Type-S.png": "hhkb-hybrid",
  "Logitech — MX Mechanical.webp": "mx-mechanical",
  "Apple — Magic Keyboard.jpg": "magic-keyboard",
};

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

/** Downsamples to a small RGBA grid and returns every pixel. */
function pixels(file, size = 48) {
  const buf = ff([
    "-v", "error",
    "-i", file,
    "-vf", `scale=${size}:${size}`,
    "-f", "rawvideo",
    "-pix_fmt", "rgba",
    "-",
  ]);
  const out = [];
  for (let i = 0; i < buf.length; i += 4) out.push([buf[i], buf[i + 1], buf[i + 2], buf[i + 3]]);
  return out;
}

function cornerPatch(file, x, y) {
  const buf = ff([
    "-v", "error",
    "-i", file,
    "-vf", `crop=24:24:${x}:${y},scale=1:1`,
    "-f", "rawvideo",
    "-pix_fmt", "rgba",
    "-",
  ]);
  return [buf[0], buf[1], buf[2], buf[3]];
}

const hex = ([r, g, b]) =>
  "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");

const luminance = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

function analyse(file) {
  const { w, h } = dimensions(file);
  const corners = [
    cornerPatch(file, 2, 2),
    cornerPatch(file, w - 26, 2),
    cornerPatch(file, 2, h - 26),
    cornerPatch(file, w - 26, h - 26),
  ];

  const hasAlpha = corners.some((c) => c[3] < 250);
  if (hasAlpha) {
    // Mean luminance of the product itself, ignoring transparent pixels.
    const opaque = pixels(file).filter((p) => p[3] > 128);
    const mean = opaque.length
      ? opaque.reduce((sum, p) => sum + luminance(p), 0) / opaque.length
      : 0;
    return {
      mode: "transparent",
      background: mean > PALE_THRESHOLD ? BG_FOR_PALE_PRODUCT : BG_FOR_DARK_PRODUCT,
      detail: `product luminance ${mean.toFixed(0)}`,
    };
  }

  const avg = [0, 1, 2].map((i) => Math.round(corners.reduce((s, c) => s + c[i], 0) / 4));
  const spread = Math.max(
    ...corners.map((c) => Math.max(...[0, 1, 2].map((i) => Math.abs(c[i] - avg[i]))))
  );

  return spread <= 10
    ? { mode: "pad", background: hex(avg), detail: `uniform ${hex(avg)}` }
    : { mode: "crop", detail: `scene photo (corner spread ${spread})` };
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const entries = Object.entries(MAP);
let padded = 0;
let flattened = 0;
let cropped = 0;

for (const [filename, id] of entries) {
  const src = join(SRC, filename);
  const dest = join(OUT, `${id}.webp`);
  const { mode, background, detail } = analyse(src);

  if (mode === "crop") {
    // Cover-fit, then take the centre. No invented background.
    ff([
      "-v", "error",
      "-i", src,
      "-vf", `scale=${W}:${H}:force_original_aspect_ratio=increase:flags=lanczos,crop=${W}:${H}`,
      "-c:v", "libwebp", "-quality", "86", "-compression_level", "6",
      dest, "-y",
    ]);
    cropped++;
  } else {
    // One overlay pipeline covers both padding and alpha flattening: the solid
    // colour is the canvas and the scaled source is composited onto it, so a
    // transparent source is flattened by the same operation that pads it.
    ff([
      "-v", "error",
      "-i", src,
      "-filter_complex",
      `color=c=${background}:s=${W}x${H}[bg];` +
        `[0:v]scale=${Math.round(W * INSET)}:${Math.round(H * INSET)}:` +
        `force_original_aspect_ratio=decrease:flags=lanczos[fg];` +
        `[bg][fg]overlay=(W-w)/2:(H-h)/2:format=auto`,
      "-frames:v", "1",
      "-c:v", "libwebp", "-quality", "86", "-compression_level", "6",
      dest, "-y",
    ]);
    if (mode === "transparent") flattened++;
    else padded++;
  }

  console.log(`${id.padEnd(22)} ${mode.padEnd(12)} ${detail}`);
}

const totalMB =
  readdirSync(OUT).reduce((sum, f) => sum + statSync(join(OUT, f)).size, 0) / 1024 / 1024;
console.log(
  `\n${entries.length} tiles at ${W}x${H} — ${padded} padded, ${flattened} flattened, ${cropped} cropped — ${totalMB.toFixed(2)} MB`
);
