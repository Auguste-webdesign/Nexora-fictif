"use client";

import { AnimatePresence, motion } from "motion/react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./cart-provider";

/**
 * Navbar entry point to the cart, and the second half of the add-to-cart
 * confirmation: the count animates in as the button label changes.
 *
 * The badge renders only once the cart has hydrated from localStorage — before
 * that the count is genuinely unknown, and showing a 0 that flicks to 3 on load
 * reads as a bug.
 */
export function CartTrigger({ className = "" }: { className?: string }) {
  const { count, hydrated, open } = useCart();

  return (
    <button
      type="button"
      onClick={open}
      aria-label={count > 0 ? `Panier, ${count} article${count > 1 ? "s" : ""}` : "Panier"}
      className={`relative flex size-9 items-center justify-center rounded-full text-nx-black transition-colors hover:bg-nx-black/5 ${className}`}
    >
      <ShoppingBag size={17} strokeWidth={1.6} />
      <AnimatePresence>
        {hydrated && count > 0 && (
          <motion.span
            // Keyed on the count so each change replays the pop rather than
            // silently swapping the digit.
            key={count}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: "spring", stiffness: 480, damping: 22 }}
            className="absolute -right-0.5 -top-0.5 flex min-w-[17px] items-center justify-center rounded-full bg-nx-blue px-1 font-mono text-[0.625rem] font-medium leading-[17px] text-nx-white"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
