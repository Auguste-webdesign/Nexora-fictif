"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { ProductMedia } from "./product-media";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { FINISHES } from "@/lib/finishes";
import {
  CATEGORIES,
  FLAGSHIP_ID,
  IPHONE_STORAGE,
  PRODUCTS,
  formatPrice,
  type Category,
  type Product,
} from "@/lib/products";

/**
 * Catalog listing (docs/DESIGN_SYSTEM.md §7.2).
 *
 * Multi-select category filtering — a retail catalog usually wants
 * "Earbuds + Headphones" at once, which single-select would prevent.
 *
 * v1 has no product detail routes. Cards open a quick-view instead of linking
 * nowhere, so the grid never feels like a dead end.
 */
export function CatalogGrid() {
  const [active, setActive] = useState<Set<Category>>(new Set());
  const [quickView, setQuickView] = useState<Product | null>(null);

  const visible = useMemo(
    () => (active.size === 0 ? PRODUCTS : PRODUCTS.filter((p) => active.has(p.category))),
    [active]
  );

  const toggle = (category: Category) =>
    setActive((previous) => {
      const next = new Set(previous);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });

  return (
    <>
      {/* Filter rail */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setActive(new Set())}
          aria-pressed={active.size === 0}
          className={`rounded-full border px-5 py-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] transition-colors ${
            active.size === 0
              ? "border-nx-blue text-nx-black"
              : "border-nx-gray-200 text-nx-gray-600 hover:border-nx-gray-400"
          }`}
        >
          Tous
        </button>
        {CATEGORIES.map((category) => {
          const on = active.has(category);
          return (
            <button
              key={category}
              type="button"
              onClick={() => toggle(category)}
              aria-pressed={on}
              className={`rounded-full border px-5 py-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] transition-colors ${
                on
                  ? "border-nx-blue text-nx-black"
                  : "border-nx-gray-200 text-nx-gray-600 hover:border-nx-gray-400"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <p className="mt-8 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-nx-gray-400">
        {visible.length} {visible.length === 1 ? "produit" : "produits"}
      </p>

      {/* Grid */}
      <motion.div
        layout
        className="mt-10 grid grid-cols-1 gap-px border border-nx-black/10 bg-nx-black/10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <AnimatePresence mode="popLayout">
          {visible.map((product) => (
            <motion.button
              key={product.id}
              layout
              type="button"
              onClick={() => setQuickView(product)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col justify-between bg-nx-white/55 p-8 text-left transition-colors duration-500 hover:bg-nx-white/85"
            >
              <div className="flex items-start justify-between">
                <p className="nx-eyebrow">{product.brand}</p>
                {product.flagship && (
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-nx-blue">
                    Vaisseau amiral
                  </span>
                )}
              </div>

              <ProductMedia product={product} className="my-8 aspect-[4/3] w-full" />

              <div>
                <h3 className="text-[1.0625rem] font-medium leading-snug tracking-[-0.015em] text-nx-black">
                  {product.name}
                </h3>
                <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-nx-gray-400">
                  {product.spec}
                </p>
                <p className="mt-5 font-mono text-[0.8125rem] text-nx-black tabular-nums">
                  {formatPrice(product.price)}
                </p>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Quick view */}
      <AnimatePresence>
        {quickView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setQuickView(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${quickView.brand} ${quickView.name}`}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-nx-white/80 p-6 backdrop-blur-xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(event) => event.stopPropagation()}
              className="relative w-full max-w-lg border border-nx-black/10 bg-nx-white/85 p-[clamp(2rem,5vw,3.5rem)] backdrop-blur-xl"
            >
              <button
                type="button"
                onClick={() => setQuickView(null)}
                aria-label="Fermer"
                className="absolute right-5 top-5 flex size-8 items-center justify-center text-nx-gray-400 transition-colors hover:text-nx-black"
              >
                <X size={16} strokeWidth={1.5} />
              </button>

              <p className="nx-eyebrow mb-6">{quickView.brand}</p>
              <ProductMedia product={quickView} className="mb-10 aspect-[4/3] w-full" />
              <h2 className="text-[length:var(--text-display-m)] font-medium leading-[1.1] tracking-[-0.03em] text-nx-black">
                {quickView.name}
              </h2>
              <p className="mt-3 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-nx-gray-400">
                {quickView.category} · {quickView.spec}
              </p>
              <p className="mt-8 text-[2rem] font-medium leading-none tracking-[-0.04em] text-nx-black tabular-nums">
                {formatPrice(quickView.price)}
              </p>
              {/* The flagship is configurable, so adding it from the catalogue
                  needs a configuration: it takes the base storage tier and the
                  default finish, which the Acquire section can then change. */}
              <AddToCartButton
                item={
                  quickView.id === FLAGSHIP_ID
                    ? {
                        productId: quickView.id,
                        storageId: IPHONE_STORAGE[0].id,
                        finishId: FINISHES[0].id,
                      }
                    : { productId: quickView.id }
                }
                className="mt-8 w-full px-8 py-3.5 text-[0.75rem] tracking-[0.18em]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
