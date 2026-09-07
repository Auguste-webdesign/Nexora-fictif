"use client";

import Link from "next/link";
import { useFinish } from "@/components/finish-provider";

/**
 * Mono-set, dense and technical — the counterweight to the page's white space
 * (docs/DESIGN_SYSTEM.md §7.1).
 */
const COLUMNS = [
  { title: "Catalogue", links: ["Téléphones", "Écouteurs", "Casques", "Moniteurs", "Claviers"] },
  { title: "Nexora", links: ["Vision", "Norme d'inspection", "Boutiques", "Carrières"] },
  { title: "Assistance", links: ["Suivi de commande", "Retours", "Garantie", "Contact"] },
];

export function Footer() {
  // The foot of the page carries the selected colourway, closing the page in
  // the same colour the navigation opens it with.
  const { finish } = useFinish();

  return (
    <footer
      className="border-t border-nx-black/10 px-[clamp(1.25rem,4vw,3.5rem)] py-[clamp(4rem,9vh,6rem)] transition-colors duration-700"
      style={{ backgroundColor: finish.wash }}
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-x-12 gap-y-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="block size-[9px] rounded-full bg-nx-blue" />
              <span className="font-wordmark text-[clamp(1.125rem,1.6vw,1.5rem)] font-bold uppercase leading-none tracking-[0.16em] text-nx-black">
                Nexora
              </span>
            </div>
            <p className="mt-6 max-w-xs font-mono text-[0.6875rem] uppercase leading-[1.8] tracking-[0.12em] text-nx-black/50">
              Technologie premium sélectionnée.
              <br />
              Chaque produit examiné avant expédition.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="nx-eyebrow mb-5 text-nx-black/45">{column.title}</p>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="/catalog"
                      className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-nx-black/65 transition-colors hover:text-nx-black"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-[clamp(3rem,7vh,5rem)] flex flex-wrap items-center justify-between gap-4 border-t border-nx-black/10 pt-8">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-nx-black/50">
              © {new Date().getFullYear()} Nexora
            </p>
            <Link
              href="/mentions-legales"
              className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-nx-black/50 transition-colors hover:text-nx-black"
            >
              Mentions légales
            </Link>
            <Link
              href="/confidentialite"
              className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-nx-black/50 transition-colors hover:text-nx-black"
            >
              Confidentialité
            </Link>
          </div>
          <p className="flex items-center gap-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-nx-black/50">
            <span className="block size-[6px] rounded-full bg-nx-blue" />
            Tous les systèmes opérationnels
          </p>
        </div>
      </div>
    </footer>
  );
}
