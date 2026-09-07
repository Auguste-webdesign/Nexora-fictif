"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Check, MousePointerClick } from "lucide-react";
import { Reveal, SectionEyebrow } from "@/components/ui/reveal";
import { TechBackdrop } from "@/components/background/tech-backdrop";
import { useMotionEnabled } from "@/components/motion-provider";
import { formatPrice, FLAGSHIP_ID, IPHONE_STORAGE } from "@/lib/products";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { useFinish } from "@/components/finish-provider";
import { FINISHES, type Finish } from "@/lib/finishes";

/**
 * §04 — iPhone 18 configuration and the primary conversion point.
 *
 * The section takes on the colour of the selected finish. Picking a new one
 * does not cross-fade the background: a disc of the incoming colour expands
 * from the phone itself until it covers the section, then becomes the resting
 * colour. The origin and radius are measured from the live layout on each
 * click — the phone's centre relative to the section, and the distance to its
 * furthest corner — so the wipe always starts exactly at the product and always
 * finishes covered, at any viewport size.
 *
 * Selecting a finish here is a SITE-WIDE action: the colourways and their
 * accent palettes live in lib/finishes.ts and the choice is held by
 * FinishProvider, which repaints the navbar, every accent button and the §02
 * metric bubbles at the same time. This section owns the artwork and the wipe,
 * not the colour itself.
 *
 * The colourway images carry a real alpha channel and are composited plainly.
 * They must NOT use mix-blend-multiply: animating opacity creates a stacking
 * context, which isolates the blend and makes a white rectangle appear behind
 * the phone for the whole entrance animation.
 */
/** Shared with the cart and the order endpoint — see lib/products.ts. */
const STORAGE_OPTIONS = IPHONE_STORAGE;

type Wipe = { finish: Finish; x: number; y: number; radius: number };

/** Wipe length, and the commit delay that guarantees the colour lands. */
const WIPE_MS = 850;

export function AcquireSection() {
  const [storage, setStorage] = useState<(typeof STORAGE_OPTIONS)[number]>(STORAGE_OPTIONS[0]);
  // The selected finish is site-wide state: it also repaints the navbar, every
  // accent button and the metric bubbles (see FinishProvider).
  const { finish, setFinish } = useFinish();
  /** The colour fully painted across the section — the wipe's starting ground. */
  const [painted, setPainted] = useState<Finish>(FINISHES[0]);
  /** The disc mid-expansion, if any. */
  const [wipe, setWipe] = useState<Wipe | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const motionEnabled = useMotionEnabled();

  /**
   * Drives the wipe from the selection rather than from the click handler, and
   * commits on a TIMER rather than on the animation's completion callback.
   *
   * The previous version committed in `onAnimationComplete`. That made the
   * section's resting colour depend on an animation actually finishing, and it
   * silently failed in two ways: interrupting a wipe by picking another finish
   * unmounted the first layer before it could commit, so the ground never
   * advanced past its starting colour and the discs piled up instead of being
   * replaced. Driving it from an effect keyed on the selection means the state
   * converges on the selected finish no matter how the animation goes.
   */
  useEffect(() => {
    if (painted.id === finish.id) return;

    const section = sectionRef.current;
    const phone = phoneRef.current;
    if (!section || !phone || !motionEnabled) {
      setPainted(finish);
      return;
    }

    // Origin: the phone's centre, in the section's own coordinate space.
    const sectionBox = section.getBoundingClientRect();
    const phoneBox = phone.getBoundingClientRect();
    const x = phoneBox.left - sectionBox.left + phoneBox.width / 2;
    const y = phoneBox.top - sectionBox.top + phoneBox.height / 2;

    // Radius: reach the furthest corner, so the disc always finishes covered.
    const radius = Math.max(
      Math.hypot(x, y),
      Math.hypot(sectionBox.width - x, y),
      Math.hypot(x, sectionBox.height - y),
      Math.hypot(sectionBox.width - x, sectionBox.height - y)
    );

    setWipe({ finish, x, y, radius });
    const commit = setTimeout(() => {
      setPainted(finish);
      setWipe(null);
    }, WIPE_MS + 60);
    return () => clearTimeout(commit);
  }, [finish, painted.id, motionEnabled]);

  return (
    <section
      id="acquire"
      ref={sectionRef}
      className="scroll-mt-24 relative isolate overflow-hidden px-[clamp(1.25rem,4vw,3.5rem)] py-[clamp(7.5rem,18vh,13.75rem)] transition-colors duration-500"
    >
      {/* Resting colour */}
      <div className="absolute inset-0 -z-20" style={{ backgroundColor: painted.wash }} />

      {/* Expanding disc. On completion it becomes the resting colour and is
          unmounted in the same commit, so there is no flash between the two. */}
      <AnimatePresence>
        {wipe && (
          <motion.div
            key={wipe.finish.id}
            className="absolute inset-0 -z-20"
            style={{ backgroundColor: wipe.finish.wash }}
            initial={{ clipPath: `circle(0px at ${wipe.x}px ${wipe.y}px)` }}
            animate={{ clipPath: `circle(${wipe.radius}px at ${wipe.x}px ${wipe.y}px)` }}
            transition={{ duration: WIPE_MS / 1000, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </AnimatePresence>

      <TechBackdrop variant="quiet" />

      <div className="mx-auto max-w-[1600px]">
        <SectionEyebrow index="04" label="Acquérir" />

        <div className="grid gap-x-16 gap-y-14 lg:grid-cols-[1fr_1fr_auto]">
          {/* The colourway, and the origin of the wipe */}
          <Reveal>
            <div className="relative">
              <div ref={phoneRef} className="relative aspect-[3/4] w-full">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={finish.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 0.9, y: 18 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.04 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Image
                      src={finish.image}
                      alt={`iPhone 18, finition ${finish.label.toLowerCase()}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 30vw"
                      className="object-contain"
                      priority={finish.id === "blue"}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <h2 className="max-w-2xl text-[length:var(--text-display-l)] font-medium leading-[0.98] tracking-[-0.035em] text-nx-black">
                iPhone&nbsp;18
              </h2>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="mt-6 max-w-md text-[length:var(--text-body-l)] leading-[1.6] text-nx-gray-600">
                Configuré, examiné et expédié par Nexora. Chaque exemplaire passe
                l&apos;inspection de démontage que vous venez de voir.
              </p>
            </Reveal>

            {/* The wordmark sits behind BOTH selectors. It is placed on the
                wrapper rather than inside either Reveal, because Reveal animates
                opacity and would trap it in its own stacking context.
                top-[36%] rather than centred: the wrapper's midpoint sits below
                the "Stockage" label, so a centred word cleared it entirely —
                this centres on the midpoint of the two labels instead.

                -z-10 is load-bearing, not belt-and-braces. An absolutely
                positioned element paints ABOVE static siblings regardless of
                DOM order, so without it the word covers the labels and swatches
                as soon as Reveal's transform settles back to none and its
                children stop being painted as positioned. */}
            <div className="relative mt-14">
              <span
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-[36%] -z-10 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-wordmark text-[clamp(6.5rem,21vw,19rem)] font-bold uppercase leading-none tracking-[-0.03em] text-nx-white"
              >
                New
              </span>

            <Reveal delay={0.14}>
              <div>
                <p className="nx-eyebrow mb-5">Stockage</p>
                <div className="flex flex-wrap gap-3">
                  {STORAGE_OPTIONS.map((option) => {
                    const active = option.id === storage.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setStorage(option)}
                        aria-pressed={active}
                        style={
                          active
                            ? {
                                backgroundColor: finish.accent.core,
                                // Gap in the panel colour, then a hard rule: the
                                // selected state has to survive the panel itself
                                // changing colour with the finish.
                                boxShadow: `0 0 0 3px ${finish.wash}, 0 0 0 5px #000`,
                              }
                            : undefined
                        }
                        className={`rounded-full px-6 py-3 font-mono text-[0.75rem] uppercase tracking-[0.14em] transition-colors ${
                          active
                            ? "text-nx-white"
                            : "border border-nx-black/20 bg-nx-white text-nx-black/70 hover:border-nx-black/45"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-12">
                <p className="nx-eyebrow mb-5">Finition</p>
                <div className="flex flex-wrap gap-3">
                  {FINISHES.map((option) => {
                    const active = option.id === finish.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setFinish(option)}
                        aria-pressed={active}
                        aria-label={option.label}
                        style={{
                          backgroundColor: option.deep,
                          boxShadow: active
                            ? `0 0 0 3px ${finish.wash}, 0 0 0 5px #000`
                            : undefined,
                        }}
                        className={`flex items-center gap-2.5 rounded-full py-3 pl-4 pr-5 transition-opacity ${
                          active ? "opacity-100" : "opacity-70 hover:opacity-100"
                        }`}
                      >
                        {/* The tick is the unambiguous read; the ring and full
                            opacity reinforce it. */}
                        <Check
                          size={14}
                          strokeWidth={2.5}
                          className={active ? "text-nx-white" : "text-nx-white/0"}
                        />
                        <span className="font-mono text-[0.75rem] uppercase tracking-[0.14em] text-nx-white">
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-5 flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-nx-black/60">
                  <MousePointerClick size={13} strokeWidth={1.75} className="text-nx-blue" />
                  Cliquez pour changer la couleur
                </p>
              </div>
            </Reveal>
            </div>
          </div>

          <Reveal delay={0.24} className="lg:w-[22rem]">
            <div className="border-t border-nx-black/15 pt-8 lg:sticky lg:top-28">
              <p className="nx-eyebrow mb-4">Configuration</p>
              <p className="font-mono text-[0.8125rem] leading-relaxed text-nx-gray-600">
                iPhone 18 · {storage.label}
                <br />
                {finish.label}
              </p>
              <p className="mt-8 text-[clamp(2.25rem,4vw,3.25rem)] font-medium leading-none tracking-[-0.04em] text-nx-black tabular-nums">
                {formatPrice(storage.price)}
              </p>
              <AddToCartButton
                item={{ productId: FLAGSHIP_ID, storageId: storage.id, finishId: finish.id }}
                className="mt-8 w-full px-8 py-4 text-[0.75rem] tracking-[0.18em]"
              />
              <p className="mt-5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-nx-gray-400">
                Rapport d&apos;inspection offert · 2 ans de garantie
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
