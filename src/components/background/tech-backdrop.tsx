"use client";

import { CursorRingField } from "./cursor-ring-field";
import { useMotionEnabled } from "@/components/motion-provider";
import { useFinish } from "@/components/finish-provider";

/**
 * The site's technological ground layer (docs/DESIGN_SYSTEM.md §6, revised).
 *
 * Three stacked, individually restrained layers that together stop the page
 * reading as blank white:
 *   1. a blueprint grid — engineering paper, not decoration
 *   2. soft blue radial washes that give the white some depth
 *   3. the Cursor Ring Field — a Poisson-scattered capsule field lit by a ring
 *      that follows the pointer
 *
 * The ring field replaced the earlier hand-rolled constellation canvas. It is
 * the interactive layer: the ring tracks the cursor, and with no pointer it
 * wanders on its own, so the page is never visually dead.
 *
 * Note on colour: the field's fragment shader multiplies each point by its
 * accumulated ring energy, so unlit points fall toward black and only points
 * inside the ring band carry the palette. On white that reads as a fine
 * technical dot field with a blue wave travelling through it — which is exactly
 * the effect wanted, but it means the palette mostly governs the ring, not the
 * resting field.
 */
type Variant = "hero" | "section" | "quiet";

const GRID_OPACITY: Record<Variant, string> = {
  hero: "opacity-[0.55]",
  section: "opacity-40",
  quiet: "opacity-25",
};

/** Kept low: this sits under content and must never compete with type. */
const FIELD_OPACITY: Record<Variant, number> = {
  hero: 0.55,
  section: 0.32,
  quiet: 0.2,
};

/**
 * Density is the sampler's spacing dial — higher is tighter, and point count
 * grows fast. The hero runs alongside the teardown's own rAF loop, so it takes
 * a deliberately lighter field than the component's 300 default.
 */
const FIELD_DENSITY: Record<Variant, number> = {
  hero: 165,
  section: 130,
  quiet: 110,
};


export function TechBackdrop({
  variant = "section",
  particles = true,
}: {
  variant?: Variant;
  particles?: boolean;
}) {
  const motionEnabled = useMotionEnabled();
  const { finish } = useFinish();
  // The field takes explicit colours rather than CSS variables, so the accent
  // has to be handed to it; a CSS-var override would not reach the shader.
  const ramp = [finish.accent.core, finish.accent.light, finish.accent.deep];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* 1. Blueprint grid, fading out toward the edges so it never ends on a
             hard line. */}
      <div
        className={`absolute inset-0 ${GRID_OPACITY[variant]}`}
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--color-nx-blue) 7%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-nx-blue) 7%, transparent) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 100% 80% at 50% 45%, #000 35%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 100% 80% at 50% 45%, #000 35%, transparent 78%)",
        }}
      />

      {/* 2. Depth washes — barely-there blue, enough to kill the flat white. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 18% 20%, color-mix(in srgb, var(--color-nx-blue) 5%, transparent), transparent 70%), radial-gradient(55% 45% at 85% 75%, color-mix(in srgb, var(--color-nx-blue) 4.5%, transparent), transparent 70%)",
        }}
      />

      {/* 3. Cursor Ring Field. The component binds its pointer listener to the
             window and hit-tests its own bounds, so it still tracks the cursor
             through this pointer-events-none wrapper. */}
      {particles && (
        <div className="absolute inset-0">
          <CursorRingField
            colors={ramp}
            density={FIELD_DENSITY[variant]}
            dotSize={95}
            speed={5}
            opacity={FIELD_OPACITY[variant]}
            paused={!motionEnabled}
            ring={{ radius: 12, width: 9, push: 0, turbulence: 0 }}
          />
        </div>
      )}
    </div>
  );
}
