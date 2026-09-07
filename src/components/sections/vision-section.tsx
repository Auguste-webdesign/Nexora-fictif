"use client";

import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { TechBackdrop } from "@/components/background/tech-backdrop";
import { useFinish } from "@/components/finish-provider";

/**
 * §03 — the breathing-room beat (docs/DESIGN_SYSTEM.md §7.1).
 * Follows the density of §02 with almost nothing: one statement, wide margins.
 * The alternation between dense and empty is the rhythm the whole page rests on.
 */
export function VisionSection() {
  // Both the statement bubble and the phone follow the selected colourway.
  const { finish } = useFinish();

  return (
    <section
      id="vision"
      className="scroll-mt-24 relative isolate overflow-hidden px-[clamp(1.25rem,4vw,3.5rem)] py-[clamp(8rem,22vh,15rem)]"
    >
      <TechBackdrop variant="section" />

      <div className="mx-auto grid max-w-[1600px] items-center gap-x-16 gap-y-14 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
          <div
            className="rounded-[2.5rem] px-[clamp(1.75rem,3.5vw,3.25rem)] py-[clamp(2.25rem,4.5vw,3.5rem)] transition-colors duration-700"
            style={{ backgroundColor: finish.wash }}
          >
            <p className="nx-eyebrow mb-[clamp(2rem,5vh,3rem)] text-nx-black/45">03 / Vision</p>
            <blockquote className="max-w-3xl text-[length:var(--text-display-l)] font-medium leading-[1.05] tracking-[-0.035em] text-nx-black">
              Nous ne vendons rien que nous n&apos;ayons démonté.
            </blockquote>
            <p className="mt-[clamp(2.25rem,5vh,3rem)] max-w-lg text-[length:var(--text-body-l)] leading-[1.65] text-nx-black/60">
              La plupart des boutiques vous montrent une photo et un prix. Nexora
              vous montre l&apos;assemblage, les tolérances et les pièces que vous
              ne toucherez jamais — puis vous laisse décider.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={finish.image}
              alt={`iPhone 18, finition ${finish.label.toLowerCase()}`}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-contain"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
