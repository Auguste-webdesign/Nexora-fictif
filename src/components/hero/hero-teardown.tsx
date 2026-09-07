"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useFrameSequence } from "@/hooks/use-frame-sequence";
import { useMotionEnabled } from "@/components/motion-provider";
import { TechBackdrop } from "@/components/background/tech-backdrop";
import manifest from "../../../public/frames/manifest.json";

/**
 * Pinned, scroll-scrubbed teardown (docs/DESIGN_SYSTEM.md §4, revised twice).
 *
 * Round-3 review notes:
 *  - The product was never NAMED. The previous pass put an `iPhone 18` wordmark
 *    behind the canvas in near-white gray-100, which is invisible against the
 *    page. The title block is now the loudest thing in the hero at rest: a badge,
 *    a two-line headline with the model number in the metallic accent, and a
 *    one-line subhead.
 *  - The side taglines sat at 5vw, which on a wide viewport is a third of the
 *    screen away from a phone that occupies the middle ~56%. They now sit just
 *    outside the drawn frame so they read as annotations on the object.
 *  - The teardown is drawn at 56% and biased downward, leaving the upper band
 *    to the title rather than letting the two collide.
 *
 * Overlay opacity is written directly to the DOM inside the rAF loop; running
 * this through React state at 60fps would drop frames.
 */
const SCRUB_VH_DESKTOP = 400;
const SCRUB_VH_MOBILE = 300;
const DAMPING = 0.1;

const BEATS = [
  { index: "01", text: "Ingénierie pure.", from: 0.15, to: 0.32, side: "left" as const },
  { index: "02", text: "Rien de caché.", from: 0.38, to: 0.55, side: "right" as const },
  { index: "03", text: "Potentiel infini.", from: 0.6, to: 0.78, side: "left" as const },
];

/**
 * Catalogue products flanking the teardown, so the hero reads as a store rather
 * than a single object on white.
 *
 * Rules governing selection, size and placement:
 *
 *  - APPLE FIRST. Three of the four are Apple, and they take the largest slots.
 *  - WHITE GROUNDS ONLY. These render with mix-blend-multiply so their
 *    background disappears into the page. A tile with a coloured ground — the
 *    grey behind the AirPods Pro, or the three scene photos — would float as a
 *    visible rectangle, so none of those are eligible.
 *  - PLACED, NOT ARRANGED. No mirrored pairs and no shared baseline. The two
 *    anchors sit on opposite diagonals and each bleeds past its own edge, so the
 *    viewport reads as a crop of a wider scene; the two small pieces sit off
 *    that diagonal. Every tile carries an odd rotation (-11 to +13 degrees) —
 *    that tilt is what stops the group reading as a layout grid.
 *  - CLEAR OF EVERY TEXT SLOT, PERMANENTLY. These persist through the whole
 *    scrub, so they cannot be timed around the type — every slot must be missed
 *    outright, including the bottom rail's two mono labels, which occupy the
 *    far-left and far-right corners below y 95%. The side taglines own the
 *    x 6-19% / 80-93% columns at y 48-60%, which is why the large pieces are
 *    tiered above and below that band rather than centred on it.
 *
 * Sizes measured at a 1280px viewport: 316 / 277 / 158 / 117 px — a 2.7x spread,
 * with the display and keyboard deliberately dominant, against the teardown's
 * ~717px. Verified against the live layout: zero collisions with text, zero
 * overlap between tiles.
 */
const SATELLITES = [
  // The display and the keyboard are the anchors — both far larger than the
  // rest, on opposite diagonals, each bleeding past its own edge so the frame
  // reads as a crop of a wider scene rather than a tidy arrangement.
  {
    id: "pro-display-xdr",
    alt: "Apple Pro Display XDR",
    position: "right-[-4vw] top-[13vh] w-[23vw]",
    rotate: -6,
    delay: "-2.2s",
  },
  {
    id: "magic-keyboard",
    alt: "Apple Magic Keyboard",
    position: "left-[-3vw] bottom-[8vh] w-[20vw]",
    rotate: 7,
    delay: "-1.1s",
  },
  // Two smaller pieces, off the diagonal and at odd angles, to break the
  // symmetry the anchors would otherwise imply.
  {
    id: "airpods-max-2",
    alt: "Apple AirPods Max 2",
    position: "left-[6vw] top-[27vh] w-[11vw]",
    rotate: -11,
    delay: "0s",
  },
  {
    id: "wf-1000xm6",
    alt: "Sony WF-1000XM6",
    position: "right-[6vw] bottom-[10vh] w-[8vw]",
    rotate: 13,
    delay: "-3.1s",
  },
];

function beatOpacity(progress: number, from: number, to: number): number {
  if (progress < from || progress > to) return 0;
  const span = to - from;
  const ramp = span * 0.18;
  return Math.min(1, (progress - from) / ramp, (to - progress) / ramp);
}

export function HeroTeardown() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [isMobile, setIsMobile] = useState(false);
  const motionEnabled = useMotionEnabled();
  const { getFrame, loadedRatio, ready } = useFrameSequence(
    manifest.frameCount,
    isMobile ? "mobile" : "desktop"
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let frameId = 0;
    let damped = 0;
    let lastDrawn: HTMLImageElement | null = null;
    let cssWidth = 0;
    let cssHeight = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssWidth = canvas.clientWidth;
      cssHeight = canvas.clientHeight;
      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lastDrawn = null;
    };

    const drawFrame = (image: HTMLImageElement) => {
      ctx.clearRect(0, 0, cssWidth, cssHeight);
      // Held well inside the viewport so the 720p source is downscaled, never
      // stretched, and biased downward to clear the title block above it.
      const mobile = cssWidth < 768;
      const fill = mobile ? 0.94 : 0.56;
      const centreY = mobile ? 0.46 : 0.6;
      const scale = Math.min(cssWidth / image.width, cssHeight / image.height) * fill;
      const drawWidth = image.width * scale;
      const drawHeight = image.height * scale;
      ctx.drawImage(
        image,
        (cssWidth - drawWidth) / 2,
        cssHeight * centreY - drawHeight / 2,
        drawWidth,
        drawHeight
      );
    };

    const readTargetProgress = () => {
      const total = section.offsetHeight - window.innerHeight;
      if (total <= 0) return 0;
      return Math.max(0, Math.min(1, (window.scrollY - section.offsetTop) / total));
    };

    const applyOverlays = (progress: number) => {
      if (titleRef.current) {
        const opacity = Math.max(0, 1 - progress / 0.18);
        titleRef.current.style.opacity = String(opacity);
        titleRef.current.style.transform = `translate3d(0, ${(1 - opacity) * -20}px, 0)`;
      }

      // Satellites are NOT faded with the scrub — they stay for the whole
      // sequence, framing the teardown throughout. Their positions are chosen
      // to clear every text slot permanently rather than being timed around it.

      BEATS.forEach((beat, i) => {
        const node = beatRefs.current[i];
        if (!node) return;
        const opacity = beatOpacity(progress, beat.from, beat.to);
        node.style.opacity = String(opacity);
        node.style.transform = `translate3d(0, ${(1 - opacity) * 14}px, 0)`;
      });

      if (ctaRef.current) {
        const opacity = Math.max(0, Math.min(1, (progress - 0.85) / 0.09));
        ctaRef.current.style.opacity = String(opacity);
        ctaRef.current.style.transform = `translate3d(0, ${(1 - opacity) * 16}px, 0)`;
        ctaRef.current.style.pointerEvents = opacity > 0.6 ? "auto" : "none";
      }

      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
      if (readoutRef.current) {
        readoutRef.current.textContent = String(Math.round(progress * 100)).padStart(3, "0");
      }
    };

    const tick = () => {
      const target = readTargetProgress();
      damped = motionEnabled ? damped + (target - damped) * DAMPING : target;
      if (Math.abs(target - damped) < 0.0001) damped = target;

      const image = getFrame(Math.round(damped * (manifest.frameCount - 1)));
      if (image && image !== lastDrawn) {
        drawFrame(image);
        lastDrawn = image;
      }
      applyOverlays(damped);
      frameId = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    frameId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, [getFrame, motionEnabled, isMobile]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      style={{ height: `${isMobile ? SCRUB_VH_MOBILE : SCRUB_VH_DESKTOP}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        <TechBackdrop variant="hero" />

        {/* Decorative geometry — soft accent mass on one side, a punched dot
            field on the other. Both sit behind the canvas, so the teardown's
            multiply blend composites over them rather than covering them. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-[12vw] top-[6vh] z-0 size-[46vw] rounded-full opacity-70 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, rgba(11,95,255,0.14), rgba(127,178,255,0.06) 45%, transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[14vh] left-[3vw] z-0 hidden size-[14vw] opacity-[0.5] md:block"
          style={{
            backgroundImage: "radial-gradient(rgba(11,95,255,0.32) 1.1px, transparent 1.1px)",
            backgroundSize: "14px 14px",
            maskImage: "linear-gradient(135deg, #000, transparent 75%)",
            WebkitMaskImage: "linear-gradient(135deg, #000, transparent 75%)",
          }}
        />

        {/* Title block. The product is named here, loudly, and it is the first
            thing on the page at rest. */}
        <div
          ref={titleRef}
          className="pointer-events-none absolute inset-x-0 top-[11vh] z-20 flex flex-col items-center px-6 text-center md:top-[13vh]"
        >
          <span className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-nx-gray-200 bg-nx-white/70 px-4 py-1.5 backdrop-blur-sm">
            <span className="block size-[6px] rounded-full bg-nx-blue" />
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-nx-gray-600">
              Nouvelle génération · 2026
            </span>
          </span>

          <h1 className="text-[clamp(2.75rem,8.5vw,7.5rem)] font-medium leading-[0.88] tracking-[-0.045em] text-nx-black">
            <span className="block">Le nouvel</span>
            <span className="block">
              iPhone{" "}
              {/* The model number carries the metallic accent — the one place in
                  the hero where the gradient appears on type. */}
              <span className="nx-metal bg-clip-text text-transparent">18</span>
            </span>
          </h1>

          <p className="mt-6 max-w-md text-[length:var(--text-body-l)] leading-[1.5] text-nx-gray-600">
            Démonté couche par couche, sous vos yeux.
          </p>
        </div>

        {/* Catalogue satellites. Hidden below md: a narrow viewport has no side
            columns to place them in without landing on the type. */}
        {SATELLITES.map((satellite) => (
          <div
            key={satellite.id}
            aria-hidden
            // Rotation lives on the outer element and the float on the inner
            // one: both are transforms, so sharing a node would make the
            // animation overwrite the tilt on its first frame.
            style={{ transform: `rotate(${satellite.rotate}deg)` }}
            className={`pointer-events-none absolute z-0 hidden aspect-[4/3] md:block ${satellite.position}`}
          >
            <div className="nx-float relative h-full w-full" style={{ animationDelay: satellite.delay }}>
              <Image
                src={`/products/${satellite.id}.webp`}
                alt={satellite.alt}
                fill
                sizes="14vw"
                className="object-contain mix-blend-multiply"
              />
            </div>
          </div>
        ))}

        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-10 h-full w-full mix-blend-multiply"
          aria-label="Vue éclatée de l'iPhone 18"
        />

        {/* Beats now sit just outside the drawn frame, so they read as
            annotations on the object rather than as text parked at the margins. */}
        {BEATS.map((beat, i) => (
          <div
            key={beat.index}
            ref={(node) => {
              beatRefs.current[i] = node;
            }}
            style={{ opacity: 0 }}
            className={[
              "pointer-events-none absolute bottom-[13%] left-1/2 z-20 w-[min(80vw,20rem)] -translate-x-1/2 text-center",
              "md:bottom-auto md:top-[54%] md:w-[clamp(8.5rem,13vw,12.5rem)] md:-translate-x-0 md:-translate-y-1/2",
              beat.side === "left"
                ? "md:left-[6vw] md:text-right"
                : "md:left-auto md:right-[6vw] md:text-left",
            ].join(" ")}
          >
            <p className="nx-eyebrow mb-2.5 text-nx-blue">{beat.index}</p>
            <p className="text-[clamp(1.25rem,2.1vw,1.875rem)] font-medium leading-[1.1] tracking-[-0.03em] text-nx-black">
              {beat.text}
            </p>
          </div>
        ))}

        {/* Anchored to the SAME band as the title block above, not to the
            bottom: at full scrub the exploded view fills the lower two-thirds
            of the frame, so a bottom-anchored CTA landed on top of the
            components. Opening title and closing CTA now occupy the same slot,
            one fading out as the other fades in. */}
        <div
          ref={ctaRef}
          // pointerEvents starts off: the rAF loop gates it on the scrub, but
          // until the first frame runs the default would leave an invisible
          // full-width strip intercepting clicks just below the navbar.
          style={{ opacity: 0, pointerEvents: "none" }}
          className="absolute inset-x-0 top-[11vh] z-20 flex flex-col items-center gap-6 px-6 text-center md:top-[13vh]"
        >
          {/* Deliberately display-m, not display-l. At display-l this single
              line measured x 14–85% of the viewport, which reserved the entire
              upper band and left no room for the larger satellites on either
              side. The button carries the emphasis at this point anyway. */}
          <h2 className="text-[length:var(--text-display-m)] font-medium leading-[1.05] tracking-[-0.03em] text-nx-black">
            Chaque couche, maîtrisée.
          </h2>
          <Link
            href="#chip"
            className="nx-metal group inline-flex items-center gap-3 rounded-full px-8 py-3.5 font-mono text-[0.75rem] uppercase tracking-[0.18em] text-nx-white transition-[background-position] duration-700 hover:[background-position:100%_50%]"
          >
            Explorer l&apos;architecture
            <ArrowRight
              size={14}
              strokeWidth={2}
              className="transition-transform duration-500 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Persistent rail. Names the product even after the title has faded,
            and states the scrub position rather than instructing the user. */}
        <div className="absolute inset-x-0 bottom-0 z-20">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between px-[clamp(1.25rem,4vw,3.5rem)] pb-5">
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-nx-gray-400">
              iPhone 18 · Démontage
            </span>
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-nx-gray-400">
              {ready ? (
                <>
                  <span ref={readoutRef}>000</span> / 100
                </>
              ) : (
                <>Chargement {Math.round(loadedRatio * 100)}%</>
              )}
            </span>
          </div>
          <div className="h-px bg-nx-gray-200">
            <div
              ref={progressRef}
              className="h-full origin-left bg-nx-blue"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
