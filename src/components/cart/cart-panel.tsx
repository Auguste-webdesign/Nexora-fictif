"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "./cart-provider";
import { useFinish } from "@/components/finish-provider";
import { formatPrice, SHIPPING_COST } from "@/lib/cart";

/**
 * Slide-over cart.
 *
 * A panel rather than a page so that adding from the configurator or the
 * catalogue never costs the user their place — "continuer mes achats" is just
 * closing it. The checkout is a real route, because that is a destination.
 *
 * It reads the selected finish for its surface colours so the cart belongs to
 * the same skin as the rest of the site rather than being a bolted-on overlay.
 */
export function CartPanel() {
  const { resolved, count, isOpen, close, setQuantity, remove } = useCart();
  const { finish } = useFinish();

  const subtotal = resolved.reduce((total, line) => total + line.lineTotal, 0);
  const total = subtotal + SHIPPING_COST;

  // Escape to close, and lock the page behind the panel so the background does
  // not scroll under it.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[70]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div
            className="absolute inset-0 bg-nx-black/25 backdrop-blur-sm"
            onClick={close}
            aria-hidden
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Panier"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{ backgroundColor: finish.tint }}
            className="absolute inset-y-0 right-0 flex w-full max-w-[30rem] flex-col shadow-2xl"
          >
            <header
              className="flex items-center justify-between border-b px-7 py-6"
              style={{ borderColor: `${finish.swatch}33`, backgroundColor: finish.wash }}
            >
              <div>
                <p className="nx-eyebrow text-nx-black/45">Panier</p>
                <p className="mt-1 font-mono text-[0.8125rem] uppercase tracking-[0.14em] text-nx-black">
                  {count} article{count > 1 ? "s" : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Fermer le panier"
                className="flex size-9 items-center justify-center rounded-full text-nx-black/60 transition-colors hover:bg-nx-black/10 hover:text-nx-black"
              >
                <X size={17} strokeWidth={1.6} />
              </button>
            </header>

            {resolved.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <ShoppingBag size={30} strokeWidth={1.2} className="text-nx-black/25" />
                <p className="font-mono text-[0.75rem] uppercase tracking-[0.14em] text-nx-black/50">
                  Votre panier est vide
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-2 rounded-full border border-nx-black/20 px-6 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-nx-black/70 transition-colors hover:border-nx-black/45"
                >
                  Parcourir le catalogue
                </button>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-7 py-6">
                  {resolved.map((line) => (
                    <li
                      key={line.key}
                      className="flex gap-4 border-b py-5 first:pt-0"
                      style={{ borderColor: `${finish.swatch}26` }}
                    >
                      <div
                        className="relative size-20 shrink-0 overflow-hidden rounded-2xl"
                        style={{ backgroundColor: finish.wash }}
                      >
                        {line.image && (
                          <Image
                            src={line.image}
                            alt={`${line.brand} ${line.name}`}
                            fill
                            sizes="80px"
                            className="object-contain p-1.5"
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="nx-eyebrow text-nx-black/45">{line.brand}</p>
                        <p className="mt-1 text-[0.9375rem] font-medium leading-snug text-nx-black">
                          {line.name}
                        </p>
                        {line.variantLabel && (
                          <p className="mt-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-nx-black/50">
                            {line.variantLabel}
                          </p>
                        )}

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div
                            className="flex items-center rounded-full border"
                            style={{ borderColor: `${finish.swatch}59` }}
                          >
                            <button
                              type="button"
                              onClick={() => setQuantity(line.key, line.quantity - 1)}
                              aria-label={`Retirer un ${line.name}`}
                              className="flex size-8 items-center justify-center rounded-full text-nx-black/70 transition-colors hover:bg-nx-black/10"
                            >
                              <Minus size={13} strokeWidth={2} />
                            </button>
                            <span
                              aria-live="polite"
                              className="min-w-[2ch] text-center font-mono text-[0.75rem] tabular-nums text-nx-black"
                            >
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQuantity(line.key, line.quantity + 1)}
                              aria-label={`Ajouter un ${line.name}`}
                              className="flex size-8 items-center justify-center rounded-full text-nx-black/70 transition-colors hover:bg-nx-black/10"
                            >
                              <Plus size={13} strokeWidth={2} />
                            </button>
                          </div>

                          <p className="font-mono text-[0.8125rem] tabular-nums text-nx-black">
                            {formatPrice(line.lineTotal)}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => remove(line.key)}
                        aria-label={`Supprimer ${line.name} du panier`}
                        className="flex size-8 shrink-0 items-center justify-center self-start rounded-full text-nx-black/35 transition-colors hover:bg-nx-black/10 hover:text-nx-black"
                      >
                        <Trash2 size={14} strokeWidth={1.6} />
                      </button>
                    </li>
                  ))}
                </ul>

                <footer
                  className="border-t px-7 py-6"
                  style={{ borderColor: `${finish.swatch}33`, backgroundColor: finish.wash }}
                >
                  <dl className="space-y-2 font-mono text-[0.75rem] uppercase tracking-[0.12em]">
                    <div className="flex justify-between text-nx-black/60">
                      <dt>Sous-total</dt>
                      <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between text-nx-black/60">
                      <dt>Livraison</dt>
                      <dd>Offerte</dd>
                    </div>
                    <div
                      className="flex justify-between border-t pt-3 text-nx-black"
                      style={{ borderColor: `${finish.swatch}33` }}
                    >
                      <dt className="font-medium">Total</dt>
                      <dd className="text-[1rem] tabular-nums">{formatPrice(total)}</dd>
                    </div>
                  </dl>

                  <Link
                    href="/checkout"
                    onClick={close}
                    className="nx-metal mt-6 block rounded-full px-8 py-4 text-center font-mono text-[0.75rem] uppercase tracking-[0.18em] text-nx-white transition-[background-position] duration-700 hover:[background-position:100%_50%]"
                  >
                    Passer commande
                  </Link>
                  <button
                    type="button"
                    onClick={close}
                    className="mt-3 w-full py-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-nx-black/55 transition-colors hover:text-nx-black"
                  >
                    Continuer mes achats
                  </button>
                </footer>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
