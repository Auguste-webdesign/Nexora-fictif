"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_FINISH, type Finish } from "@/lib/finishes";

/**
 * Holds the selected iPhone colourway for the whole site and repaints the
 * accent from it.
 *
 * HOW THE RECOLOURING WORKS. Tailwind v4 emits every `@theme` token as a CSS
 * custom property, and utilities reference it — `bg-nx-blue` compiles to
 * `background-color: var(--color-nx-blue)`. Overriding those three variables on
 * <html> therefore restyles every accent on the page at once: the navbar mark
 * and CTA, the metallic buttons, focus rings, selection, section eyebrows, the
 * scrub progress bar. No component needs to know the finish changed, and there
 * is no prop drilling and no second source of truth for the colour.
 *
 * The variables are set in an effect rather than during render, so the server
 * markup keeps the default blue and hydration matches.
 */
type FinishContextValue = {
  finish: Finish;
  setFinish: (finish: Finish) => void;
};

const FinishContext = createContext<FinishContextValue>({
  finish: DEFAULT_FINISH,
  setFinish: () => {},
});

export function useFinish() {
  return useContext(FinishContext);
}

export function FinishProvider({ children }: { children: ReactNode }) {
  const [finish, setFinish] = useState<Finish>(DEFAULT_FINISH);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--color-nx-blue", finish.accent.core);
    root.style.setProperty("--color-nx-blue-deep", finish.accent.deep);
    root.style.setProperty("--color-nx-blue-light", finish.accent.light);
    // Exposed for the layers that paint large tinted areas rather than accents.
    root.style.setProperty("--nx-finish-wash", finish.wash);
    // The page ground. Every surface that used to be pure white reads from this.
    root.style.setProperty("--nx-page-tint", finish.tint);
  }, [finish]);

  const value = useMemo(() => ({ finish, setFinish }), [finish]);

  return <FinishContext.Provider value={value}>{children}</FinishContext.Provider>;
}
