"use client";

import { useCallback, useMemo, useState } from "react";
import { motion, type Transition } from "motion/react";
import { useMotionEnabled } from "@/components/motion-provider";

/**
 * Hover effect: each letter slides up and is replaced by the same letter
 * arriving from below, with the letters firing in a random order rather than
 * left-to-right. Reads like a system readout re-resolving itself — which is why
 * the nav sets it in uppercase mono (docs/DESIGN_SYSTEM.md §5).
 *
 * Implemented from the API surface used in the brief: { label, className,
 * staggerDuration, transition }.
 */
type RandomLetterSwapProps = {
  label: string;
  className?: string;
  staggerDuration?: number;
  transition?: Transition;
};

/** Fisher-Yates, so every letter gets a distinct slot in the stagger order. */
function shuffledDelays(length: number, stagger: number): number[] {
  const order = Array.from({ length }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order.map((slot) => slot * stagger);
}

export function RandomLetterSwap({
  label,
  className = "",
  staggerDuration = 0.025,
  transition = { duration: 0.6, type: "spring" } as Transition,
}: RandomLetterSwapProps) {
  const characters = useMemo(() => label.split(""), [label]);
  const [delays, setDelays] = useState<number[]>(() =>
    characters.map((_, i) => i * staggerDuration)
  );
  const [hovered, setHovered] = useState(false);
  const motionEnabled = useMotionEnabled();

  // Re-shuffle on each hover so the effect never looks like a fixed sequence.
  const handleEnter = useCallback(() => {
    setDelays(shuffledDelays(characters.length, staggerDuration));
    setHovered(true);
  }, [characters.length, staggerDuration]);

  if (!motionEnabled) {
    return <span className={className}>{label}</span>;
  }

  const renderRow = (from: string, to: string) => (
    <span aria-hidden className="flex">
      {characters.map((character, index) => (
        <motion.span
          key={`${character}-${index}`}
          className="inline-block"
          initial={{ y: from }}
          animate={{ y: hovered ? to : from }}
          transition={{ ...transition, delay: delays[index] }}
        >
          {/* Spaces collapse in an inline-block, so render them explicitly. */}
          {character === " " ? " " : character}
        </motion.span>
      ))}
    </span>
  );

  return (
    <span
      className={`relative inline-block overflow-hidden whitespace-nowrap ${className}`}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Real text for assistive tech and for layout width; the animated rows
          are decorative duplicates. */}
      <span className="sr-only">{label}</span>
      {renderRow("0%", "-100%")}
      <span className="absolute inset-0">{renderRow("100%", "0%")}</span>
    </span>
  );
}
