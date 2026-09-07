"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { ProductMedia } from "@/components/catalog/product-media";
import { TechBackdrop } from "@/components/background/tech-backdrop";
import { PRODUCTS } from "@/lib/products";

/**
 * §05 — the catalog teaser (docs/DESIGN_SYSTEM.md §7.3).
 *
 * Continuous auto-scroll, not scroll-linked: ambient, running on its own at a
 * deliberate pace. The track is duplicated and translated -50% so the loop has
 * no visible seam, and the animation is pure CSS transform, so it costs nothing
 * on the main thread while the rest of the page scrolls.
 *
 * The entire strip is a link into /catalog.
 */
const TICKER_ITEMS = PRODUCTS.filter((product) => !product.flagship).slice(0, 12);

export function Marquee() {
  return (
    <section className="relative overflow-hidden py-[clamp(6rem,14vh,10rem)]">
      <TechBackdrop variant="quiet" />
      <div className="mx-auto mb-[clamp(3rem,7vh,4.5rem)] max-w-[1600px] px-[clamp(1.25rem,4vw,3.5rem)]">
        <Reveal>
          <p className="nx-eyebrow mb-6">05 / Le reste du catalogue</p>
        </Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal delay={0.06}>
            <h2 className="max-w-2xl text-[length:var(--text-display-m)] font-medium leading-[1.1] tracking-[-0.03em] text-nx-black">
              La même exigence, appliquée à tout ce que nous référençons.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <Link
              href="/catalog"
              className="group inline-flex items-center gap-2.5 font-mono text-[0.75rem] uppercase tracking-[0.16em] text-nx-blue"
            >
              Voir tout le catalogue
              <ArrowRight
                size={14}
                strokeWidth={1.75}
                className="transition-transform duration-500 group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>
      </div>

      <Link
        href="/catalog"
        aria-label="Voir tout le catalogue Nexora"
        className="nx-marquee group block overflow-hidden"
        style={{ ["--nx-marquee-duration" as string]: "64s" }}
      >
        {/* Two identical halves: the track is 200% wide and travels exactly -50%,
            so the second half lands where the first began. */}
        <div className="nx-marquee-track flex w-max gap-5">
          {[0, 1].map((half) => (
            <div key={half} className="flex gap-5" aria-hidden={half === 1}>
              {TICKER_ITEMS.map((product) => (
                <article
                  key={`${half}-${product.id}`}
                  className="flex w-[clamp(13rem,20vw,17rem)] shrink-0 flex-col justify-between rounded-[1.5rem] border border-nx-black/10 bg-nx-white/55 p-6 transition-colors duration-500"
                >
                  <ProductMedia product={product} className="aspect-[4/3] w-full" />
                  <div className="mt-8">
                    <p className="nx-eyebrow mb-2">{product.brand}</p>
                    <p className="text-[0.9375rem] font-medium leading-snug tracking-[-0.01em] text-nx-black">
                      {product.name}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ))}
        </div>
      </Link>
    </section>
  );
}
