"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { useCart, type AddToCartInput } from "./cart-provider";

/**
 * The single add-to-cart control used everywhere on the site.
 *
 * Every entry point routes through this component rather than calling `add`
 * itself, so the behaviour and the confirmation are identical whether the click
 * happens in the configurator or in a catalogue quick-view.
 *
 * The confirmation is deliberately on the button itself and not a toast: the
 * button is where the user is looking, and the cart badge in the navbar
 * increments at the same moment for the second half of the feedback. The label
 * reverts after a beat so a second add still reads as a new action.
 */
const CONFIRM_MS = 1800;

export function AddToCartButton({
  item,
  label = "Ajouter au panier",
  className = "",
}: {
  item: AddToCartInput;
  label?: string;
  className?: string;
}) {
  const { add } = useCart();
  const [confirmed, setConfirmed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // A component unmounted mid-confirmation (the quick-view modal closing, for
  // instance) must not leave a timer to fire against a dead component.
  useEffect(() => () => clearTimeout(timer.current), []);

  const handleClick = () => {
    add(item);
    setConfirmed(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setConfirmed(false), CONFIRM_MS);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      // aria-live so assistive tech is told about the change too, not just the
      // people who can see the label swap.
      aria-live="polite"
      className={`nx-metal flex items-center justify-center gap-2.5 rounded-full font-mono uppercase text-nx-white transition-[background-position] duration-700 hover:[background-position:100%_50%] ${className}`}
    >
      {confirmed ? (
        <>
          <Check size={15} strokeWidth={2.5} />
          Ajouté au panier
        </>
      ) : (
        label
      )}
    </button>
  );
}
