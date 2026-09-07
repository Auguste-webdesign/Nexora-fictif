"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { RandomLetterSwap } from "@/components/ui/random-letter-swap";
import { useFinish } from "@/components/finish-provider";
import { CartTrigger } from "@/components/cart/cart-trigger";
import { withAlpha } from "@/lib/finishes";

/**
 * Persistent navigation (docs/DESIGN_SYSTEM.md §5, revised).
 *
 * Originally this expanded from a micro bar only once the hero scrub finished.
 * That was rejected in review: the nav must be present and complete from first
 * paint. What remains scroll-linked is only the surface treatment — the bar is
 * transparent over the hero and picks up a blurred fill and hairline once the
 * page scrolls, so it never competes with the teardown but never disappears.
 */
const NAV_LINKS = [
  { label: "Puce", href: "/#chip" },
  { label: "Vision", href: "/#vision" },
  { label: "Acquérir", href: "/#acquire" },
  { label: "Catalogue", href: "/catalog" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // The bar itself is tinted with the selected colourway, not just its accent.
  // Translucent over the hero so the teardown reads through it, then denser
  // once the page scrolls and content passes beneath.
  const { finish } = useFinish();

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Plain CSS transition rather than a Motion animation. Motion drives its
          values from a rAF loop and writes them to the element each frame; a
          static tint that only changes on two discrete events (scroll state,
          finish selection) does not need a frame loop, and going through one
          left the bar showing a stale colour whenever frames were throttled.
          A CSS transition is declarative: the browser owns the interpolation. */}
      <div
        style={{
          backgroundColor: withAlpha(finish.wash, scrolled ? 0.92 : 0.55),
          borderBottomColor: withAlpha(finish.swatch, scrolled ? 0.28 : 0.12),
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
        }}
        className="flex h-[72px] items-center backdrop-blur-xl transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
      >
        <nav className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-[clamp(1.25rem,4vw,3.5rem)]">
          {/* The logotype is set in the wordmark face at a size that lets it
              hold the bar, rather than in the mono used for every other label. */}
          <Link href="/" className="group flex items-center gap-2.5">
            <motion.span
              whileTap={{ scale: 0.6 }}
              whileHover={{ scale: 1.35 }}
              transition={{ type: "spring", stiffness: 420, damping: 14 }}
              className="block size-[9px] rounded-full bg-nx-blue"
            />
            <span className="font-wordmark text-[clamp(1.125rem,1.6vw,1.5rem)] font-bold uppercase leading-none tracking-[0.16em] text-nx-black">
              Nexora
            </span>
          </Link>

          <ul className="hidden items-center gap-9 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <NavLink label={link.label} href={link.href} />
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <CartTrigger />

            <motion.div whileTap={{ scale: 0.96 }} className="ml-2 hidden md:block">
              <Link
                href="/#acquire"
                className="nx-metal block rounded-full px-5 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-nx-white transition-[background-position] duration-700 hover:[background-position:100%_50%]"
              >
                Acquérir
              </Link>
            </motion.div>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOpen}
              className="flex size-8 items-center justify-center text-nx-black md:hidden"
            >
              {menuOpen ? <X size={17} strokeWidth={1.5} /> : <Menu size={17} strokeWidth={1.5} />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ backgroundColor: withAlpha(finish.wash, 0.96), borderBottomColor: withAlpha(finish.swatch, 0.28) }}
            className="border-b backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col px-[clamp(1.25rem,4vw,3.5rem)] py-6">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-3 font-mono text-[0.8125rem] uppercase tracking-[0.16em] text-nx-gray-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/**
 * Two layered effects, per the brief:
 *  1. hover — the letters scramble and re-resolve (RandomLetterSwap)
 *  2. hover/press — a blue rule wipes in beneath, and the label dips on click
 */
function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <motion.div whileTap={{ y: 2 }} transition={{ type: "spring", stiffness: 500, damping: 20 }}>
      <Link href={href} className="group relative block py-1">
        <RandomLetterSwap
          label={label}
          className="cursor-pointer font-mono text-[0.75rem] uppercase tracking-[0.16em] text-nx-gray-600 transition-colors duration-300 group-hover:text-nx-black"
          staggerDuration={0.025}
          transition={{ duration: 0.6, type: "spring", bounce: 0.25 }}
        />
        <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-nx-blue transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
      </Link>
    </motion.div>
  );
}
