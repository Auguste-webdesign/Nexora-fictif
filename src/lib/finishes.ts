/**
 * The iPhone 18 colourways, and the accent palette each one drives.
 *
 * The selected finish is global state (see FinishProvider): it recolours the
 * navbar, every accent button, the section backdrops and the metric bubbles,
 * not just the Acquire section's own artwork.
 *
 * Three colour roles per finish:
 *  - `swatch` — the real chassis colour, measured from the source photography
 *    by scripts/prepare-colorways.mjs.
 *  - `deep`   — that colour darkened until white text clears AA on it, used to
 *    fill the finish buttons so each one wears the colour it selects. Chosen by
 *    hand rather than by darkening to a common contrast: at equal luminance
 *    graphite and platinum came out one RGB level apart and stopped being
 *    tellable apart, so they sit at 11.2:1 and 4.8:1 against white instead of
 *    matching, and stay 91 RGB levels apart.
 *  - `wash`   — that colour mixed toward white. Used for large filled areas
 *    (the Acquire background, the bubbles, the navbar, the footer).
 *
 *    The depth of these is set by TWO constraints, not one. They carry black
 *    body copy, so they must stay light — but §04's oversized white "NEW" sits
 *    on one, so they must also stay dark enough for WHITE to register. The
 *    first version was tuned only for black text and landed at 1.48:1 against
 *    white on blue and platinum versus 1.78:1 on graphite, which is why the
 *    word appeared to work on the grey finish alone. All three now sit in a
 *    1.73–1.89:1 band against white while holding 11:1+ against black.
 *    Equalising luminance exactly was rejected: it pushed graphite and platinum
 *    to within three RGB levels of each other and the finishes stopped being
 *    tellable apart, so chroma is preserved and luminance merely banded.
 *  - `tint`   — the same colour taken very much further toward white (~93%).
 *    This is the PAGE ground: every surface that was previously pure white now
 *    carries it, so the coloured panels no longer sit as bright patches on a
 *    white sheet. It is deliberately only a few RGB steps off white — enough to
 *    close the gap with the washes, faint enough that product photography with
 *    a white background still sits on it without reading as a cut-out.
 *  - `accent` — deep/core/light. Replaces the brand blue on buttons and marks.
 *    NOT simply the chassis colour: graphite and platinum are near-neutral, and
 *    a desaturated accent reads as a disabled control rather than a brand
 *    colour, so each is pushed to a usable saturation and darkened enough to
 *    carry white text.
 */
export type Finish = {
  id: string;
  label: string;
  swatch: string;
  deep: string;
  wash: string;
  tint: string;
  image: string;
  accent: { deep: string; core: string; light: string };
};

export const FINISHES: Finish[] = [
  {
    id: "blue",
    label: "Bleu titane",
    swatch: "#5c7387",
    deep: "#3f5568",
    wash: "#b4c7dc",
    tint: "#f1f5f9",
    image: "/colorways/blue.webp",
    // The house accent — Nexora's default identity.
    accent: { deep: "#0038b8", core: "#0b5fff", light: "#7fb2ff" },
  },
  {
    id: "graphite",
    label: "Graphite",
    swatch: "#686766",
    deep: "#3b3b3e",
    wash: "#bcbcc1",
    tint: "#f4f4f5",
    image: "/colorways/graphite.webp",
    accent: { deep: "#232326", core: "#4a4a4f", light: "#9a9aa1" },
  },
  {
    id: "platinum",
    label: "Platine",
    swatch: "#a9a8a5",
    deep: "#7a7263",
    wash: "#cdc0a6",
    tint: "#f8f3e9",
    image: "/colorways/platinum.webp",
    // Warmer and deeper than the measured-and-lightened formula returns, so
    // platinum stays a champagne rather than collapsing into another grey once
    // the washes were deepened.
    accent: { deep: "#55503f", core: "#8a8168", light: "#cec4ab" },
  },
];

export const DEFAULT_FINISH = FINISHES[0];

/**
 * `#rrggbb` -> `rgba(r, g, b, alpha)`.
 *
 * Needed because the navbar animates its background with Motion, which
 * interpolates concrete colour values — a `color-mix()` string would be handed
 * straight through and never animate.
 */
export function withAlpha(hex: string, alpha: number): string {
  const value = hex.replace("#", "");
  const n = parseInt(
    value.length === 3
      ? value[0] + value[0] + value[1] + value[1] + value[2] + value[2]
      : value,
    16
  );
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
