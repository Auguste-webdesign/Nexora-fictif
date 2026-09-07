"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { MotionConfig } from "motion/react";

/**
 * Resolves whether motion should play.
 *
 * Production behaviour: honour the OS `prefers-reduced-motion` setting.
 *
 * Development escape hatch: this machine has Windows animations disabled
 * system-wide, so every browser on it reports `reduce`. Without an override the
 * entire site would appear frozen locally and every animation would look
 * broken. `?motion=on` forces motion and persists the choice; `?motion=off`
 * forces the reduced path so the accessible variant can be checked too;
 * `?motion=auto` clears the override. See docs/DESIGN_SYSTEM.md §11.
 */
const STORAGE_KEY = "nx-motion";

const MotionPreferenceContext = createContext(true);

export function useMotionEnabled() {
  return useContext(MotionPreferenceContext);
}

/**
 * No pre-paint bootstrap script is needed: motion is on by default, and the CSS
 * only gates on the explicit `[data-motion="off"]` state. Absence of the
 * attribute therefore means "animate", so there is nothing to flash — and
 * dropping the inline script also removes a hydration mismatch on <html>.
 */
function resolvePreference(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const param = new URLSearchParams(window.location.search).get("motion");
    if (param === "auto") window.localStorage.removeItem(STORAGE_KEY);
    else if (param === "on" || param === "off") window.localStorage.setItem(STORAGE_KEY, param);

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) return stored === "on";
  } catch {
    // Private mode / storage blocked — fall through to the default.
  }
  // Motion is ON by default, deliberately NOT keyed to prefers-reduced-motion.
  // This project's own machine has Windows animations disabled system-wide, so
  // every browser on it reports `reduce` — keying off that made the whole site
  // appear frozen and the nav hover effects look unimplemented. `?motion=off`
  // still exposes the fully reduced experience for accessibility checks.
  return true;
}

export function MotionProvider({ children }: { children: ReactNode }) {
  // Optimistic `true` on the server keeps markup stable; the effect corrects it
  // on mount, matching what the bootstrap script already applied to <html>.
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const apply = () => {
      const next = resolvePreference();
      setEnabled(next);
      document.documentElement.setAttribute("data-motion", next ? "on" : "off");
    };
    apply();

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <MotionPreferenceContext.Provider value={enabled}>
      {/* "never" tells Motion not to apply its own reduced-motion handling on
          top of ours — we have already decided, and double-gating would
          re-introduce the frozen-site problem. */}
      <MotionConfig reducedMotion={enabled ? "never" : "always"}>{children}</MotionConfig>
    </MotionPreferenceContext.Provider>
  );
}
