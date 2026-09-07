import type { Metadata } from "next";
import { CatalogGrid } from "@/components/catalog/catalog-grid";
import { Footer } from "@/components/sections/footer";
import { TechBackdrop } from "@/components/background/tech-backdrop";

export const metadata: Metadata = {
  title: "Catalogue — Nexora",
  description:
    "Tous les produits référencés par Nexora : téléphones, écouteurs, casques, moniteurs, claviers et accessoires.",
};

export default function CatalogPage() {
  return (
    <>
      {/* pt clears the fixed navbar, which mounts expanded on this route. */}
      <section className="relative overflow-hidden px-[clamp(1.25rem,4vw,3.5rem)] pb-[clamp(5rem,12vh,8rem)] pt-[clamp(9rem,18vh,12rem)]">
        <TechBackdrop variant="section" />
        <div className="mx-auto max-w-[1600px]">
          <p className="nx-eyebrow mb-6">Catalogue</p>
          <h1 className="max-w-3xl text-[length:var(--text-display-l)] font-medium leading-[0.98] tracking-[-0.035em] text-nx-black">
            Tout ce que nous référençons.
          </h1>
          <p className="mt-7 max-w-lg text-[length:var(--text-body-l)] leading-[1.6] text-nx-gray-600">
            Une liste courte, volontairement. Chaque produit est inspecté avant
            d&apos;être référencé — et ce qui échoue n&apos;apparaît jamais ici.
          </p>

          <div className="mt-[clamp(3.5rem,9vh,6rem)]">
            <CatalogGrid />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
