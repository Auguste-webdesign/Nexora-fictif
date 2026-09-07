import type { Category } from "@/lib/products";

/**
 * Technical line-art stand-ins for product photography.
 *
 * Deliberate choice, not a placeholder of convenience: schematic linework suits
 * a brand built on teardowns far better than stock photos would, and it keeps
 * the grid visually uniform. Swap for real product imagery once the catalog
 * assets exist — the card layout does not depend on this component's internals.
 */
const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const GLYPHS: Record<Category, React.ReactNode> = {
  Téléphones: (
    <>
      <rect x="36" y="14" width="28" height="72" rx="6" {...STROKE} />
      <line x1="44" y1="20" x2="56" y2="20" {...STROKE} />
      <rect x="40" y="26" width="20" height="48" rx="2" {...STROKE} />
    </>
  ),
  Écouteurs: (
    <>
      <path d="M38 34a9 9 0 0 1 9 9v10a7 7 0 0 1-14 0V43a9 9 0 0 1 5-9Z" {...STROKE} />
      <path d="M42 60v18a5 5 0 0 0 10 0" {...STROKE} />
      <path d="M62 34a9 9 0 0 1 9 9v10a7 7 0 0 1-14 0V43a9 9 0 0 1 5-9Z" {...STROKE} />
    </>
  ),
  Casques: (
    <>
      <path d="M26 58V50a24 24 0 0 1 48 0v8" {...STROKE} />
      <rect x="18" y="56" width="14" height="24" rx="6" {...STROKE} />
      <rect x="68" y="56" width="14" height="24" rx="6" {...STROKE} />
    </>
  ),
  Moniteurs: (
    <>
      <rect x="14" y="24" width="72" height="44" rx="3" {...STROKE} />
      <line x1="50" y1="68" x2="50" y2="78" {...STROKE} />
      <line x1="34" y1="78" x2="66" y2="78" {...STROKE} />
    </>
  ),
  Claviers: (
    <>
      <rect x="12" y="36" width="76" height="30" rx="3" {...STROKE} />
      {[20, 30, 40, 50, 60, 70].map((x) => (
        <line key={x} x1={x} y1="44" x2={x + 4} y2="44" {...STROKE} />
      ))}
      {[24, 34, 44, 54, 64].map((x) => (
        <line key={x} x1={x} y1="52" x2={x + 4} y2="52" {...STROKE} />
      ))}
      <line x1="36" y1="60" x2="64" y2="60" {...STROKE} />
    </>
  ),
};

export function ProductGlyph({ category, className = "" }: { category: Category; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={className}>
      {GLYPHS[category]}
    </svg>
  );
}
