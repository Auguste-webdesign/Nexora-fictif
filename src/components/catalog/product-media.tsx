import Image from "@/components/ui/app-image";
import { ProductGlyph } from "./product-glyph";
import type { Product } from "@/lib/products";

/**
 * Product visual.
 *
 * Every catalogue entry now ships with real photography, normalised to a single
 * 1200x900 tile by scripts/prepare-products.mjs. Those tiles carry their own
 * background — white for most, a cool grey behind the pale products that would
 * otherwise disappear — so this renders them plainly: no multiply blend and no
 * gradient plate underneath, both of which existed only to give a bare icon
 * something to sit on and would now tint or show through a real photo.
 *
 * The schematic plate is kept for the glyph path, so an entry added before its
 * photograph exists still looks deliberate rather than broken.
 */
export function ProductMedia({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  if (product.image) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 40vw, 22vw"
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
        />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Tinted ground so the tile has weight even without a photo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 0%, rgba(11,95,255,0.055), transparent 62%), linear-gradient(180deg, #fbfbfc 0%, #f4f5f7 100%)",
        }}
      />
      {/* Faint grid, matching the site's blueprint language */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(11,95,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,95,255,0.05) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <ProductGlyph
        category={product.category}
        className="relative h-full w-full p-8 text-nx-gray-400 transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] group-hover:text-nx-blue"
      />
      {/* Registration mark — reads as a spec sheet, not a missing asset */}
      <span className="absolute left-3 top-3 font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-nx-gray-400">
        {product.category.slice(0, 3)}
      </span>
      <span className="absolute bottom-3 right-3 block size-1.5 rounded-full bg-nx-blue/30" />
    </div>
  );
}
