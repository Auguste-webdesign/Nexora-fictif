"use client";

import Image from "@/components/ui/app-image";
import { Reveal, SectionEyebrow } from "@/components/ui/reveal";
import { TechBackdrop } from "@/components/background/tech-backdrop";
import { useFinish } from "@/components/finish-provider";

/**
 * §02 — the concrete, technical beat (docs/DESIGN_SYSTEM.md §7.1).
 * The hero stays conceptual; this is where the site names real numbers.
 */
const METRICS = [
  { value: "A19", unit: "Pro", note: "Gravure 3 nm de 2ᵉ génération" },
  { value: "6", unit: "Cœurs GPU", note: "Ray tracing matériel" },
  { value: "38", unit: "TOPS", note: "Neural Engine 16 cœurs" },
  { value: "2,4", unit: "× plus rapide", note: "Face à l'A17 Pro" },
];

const ADVANCES = [
  {
    index: "01",
    title: "Silicium 3 nm de 2ᵉ génération",
    body: "Un budget de transistors consacré à la performance soutenue plutôt qu'aux pics. L'enveloppe thermique tient sous charge au lieu de s'effondrer après la première minute.",
    image: "/stills/separating.webp",
  },
  {
    index: "02",
    title: "Inférence sur l'appareil",
    body: "Un Neural Engine 16 cœurs assez large pour que le modèle s'exécute là où les données se trouvent déjà. Rien ne quitte l'appareil pour être compris.",
    image: "/stills/layers.webp",
  },
  {
    index: "03",
    title: "Titane structurel",
    body: "Un châssis monobloc qui fait passer les efforts par la structure et non par l'écran — précisément ce que le démontage ci-dessus rend visible.",
    image: "/stills/spread.webp",
  },
];

export function ChipSection() {
  // The metric bubbles are filled with the selected colourway's wash, so this
  // section restates the choice made in §04 rather than sitting on flat white.
  const { finish } = useFinish();

  return (
    <section
      id="chip"
      className="scroll-mt-24 relative overflow-hidden px-[clamp(1.25rem,4vw,3.5rem)] py-[clamp(7.5rem,18vh,13.75rem)]"
    >
      <TechBackdrop variant="section" />

      <div className="mx-auto max-w-[1600px]">
        <SectionEyebrow index="02" label="Puce / Performance" />

        <div className="grid items-end gap-x-16 gap-y-12 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <div
              className="rounded-[2.25rem] px-[clamp(1.75rem,3.5vw,3rem)] py-[clamp(2rem,4vw,3.25rem)] transition-colors duration-700"
              style={{ backgroundColor: finish.wash }}
            >
              <h2 className="max-w-3xl text-[length:var(--text-display-l)] font-medium leading-[0.98] tracking-[-0.035em] text-nx-black">
                La part que vous n&apos;auriez jamais dû voir.
              </h2>
              <p className="mt-8 max-w-xl text-[length:var(--text-body-l)] leading-[1.6] text-nx-black/60">
                Nexora annonce le silicium avant le style. Voici ce que l&apos;A19 Pro
                change réellement — mesuré, non revendiqué.
              </p>
            </div>
          </Reveal>

          {/* Real footage, not a placeholder */}
          <Reveal delay={0.16}>
            <div className="relative aspect-[16/10] w-full">
              <Image
                src="/stills/exploded.webp"
                alt="Vue éclatée complète de l'iPhone 18"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-contain mix-blend-multiply"
              />
            </div>
          </Reveal>
        </div>

        <div className="mt-[clamp(4rem,10vh,7rem)] grid grid-cols-2 gap-x-8 gap-y-14 lg:grid-cols-4">
          {METRICS.map((metric, i) => (
            <Reveal key={metric.unit} delay={i * 0.08}>
              <div
                className="h-full rounded-[1.75rem] px-7 py-8 transition-colors duration-700"
                style={{ backgroundColor: finish.wash }}
              >
                <p className="text-[clamp(2.75rem,5.5vw,4.75rem)] font-medium leading-[0.9] tracking-[-0.045em] text-nx-black tabular-nums">
                  {metric.value}
                </p>
                <p className="mt-3 font-mono text-[0.75rem] uppercase tracking-[0.16em] text-nx-black/70">
                  {metric.unit}
                </p>
                {/* black/50 rather than the grey token: the bubble is tinted, so
                    a fixed grey drifts in contrast as the finish changes. */}
                <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-nx-black/50">
                  {metric.note}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-[clamp(5rem,12vh,9rem)] grid gap-x-12 gap-y-14 md:grid-cols-3">
          {ADVANCES.map((advance, i) => (
            <Reveal key={advance.index} delay={i * 0.08}>
              <article
                className="h-full rounded-[2rem] p-[clamp(1.25rem,2vw,1.75rem)] transition-colors duration-700"
                style={{ backgroundColor: finish.wash }}
              >
                <div className="relative mb-8 aspect-[4/3] w-full overflow-hidden rounded-[1.25rem] bg-nx-white/55">
                  <Image
                    src={advance.image}
                    alt={advance.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-cover mix-blend-multiply transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04]"
                  />
                </div>
                <p className="nx-eyebrow mb-4 text-nx-black/45">{advance.index}</p>
                <h3 className="mb-4 text-[1.375rem] font-medium leading-[1.2] tracking-[-0.02em] text-nx-black">
                  {advance.title}
                </h3>
                <p className="text-[length:var(--text-body-m)] leading-[1.65] text-nx-black/60">
                  {advance.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
