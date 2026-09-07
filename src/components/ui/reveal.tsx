"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * The site's single reveal pattern (docs/DESIGN_SYSTEM.md §8): a short upward
 * translate plus a fade, fired once when the element reaches 75% of the
 * viewport. Deliberately fires once — re-animating on scroll-up reads as cheap.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -25% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Section eyebrow: a mono index and label over a hairline that draws itself in. */
export function SectionEyebrow({ index, label }: { index: string; label: string }) {
  return (
    <div className="mb-[clamp(2.5rem,6vh,4.5rem)]">
      <Reveal>
        <p className="nx-eyebrow mb-4">
          {index} / {label}
        </p>
      </Reveal>
      <motion.div
        className="h-px origin-left bg-nx-gray-200"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "0px 0px -25% 0px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
