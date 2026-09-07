"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BASE_PATH } from "@/lib/base-path";

/**
 * Loads the teardown frame sequence for the scrubbed hero.
 *
 * Frames are fetched in a coarse-to-fine order (every 8th, then every 4th, then
 * the rest) rather than 0..N. That way a usable approximation of the whole
 * animation exists after ~12% of the bytes have arrived, so scrubbing can start
 * almost immediately and fills in detail as the user scrolls.
 *
 * `getFrame` falls back to the nearest already-loaded frame, which is what makes
 * that progressive behaviour invisible: the animation is never blank, just
 * temporarily coarser.
 */
export type FrameSequence = {
  getFrame: (index: number) => HTMLImageElement | null;
  loadedRatio: number;
  ready: boolean;
};

/** Coarse-to-fine visit order: strides 8, 4, 2, then 1. */
function loadOrder(count: number): number[] {
  const seen = new Set<number>();
  const order: number[] = [];
  for (const stride of [8, 4, 2, 1]) {
    for (let i = 0; i < count; i += stride) {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
  }
  return order;
}

export function useFrameSequence(
  frameCount: number,
  variant: "desktop" | "mobile",
  /** Fraction of frames that must be present before scrubbing is unlocked. */
  readyThreshold = 0.12
): FrameSequence {
  const framesRef = useRef<(HTMLImageElement | null)[]>([]);
  const loadedRef = useRef<boolean[]>([]);
  const [loadedRatio, setLoadedRatio] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    framesRef.current = new Array(frameCount).fill(null);
    loadedRef.current = new Array(frameCount).fill(false);
    // Deliberately not resetting loadedRatio/ready here: setting state
    // synchronously in an effect body triggers cascading renders. The load loop
    // below reports progress as frames arrive, and on a variant switch holding
    // the previous "ready" state is what we want anyway — the canvas keeps
    // showing the last painted frame instead of flashing a loading readout.
    let cancelled = false;
    let loaded = 0;
    let lastReportedPercent = -1;
    const readyCount = Math.max(1, Math.floor(frameCount * readyThreshold));
    const order = loadOrder(frameCount);
    // A bounded pool keeps the browser from opening 192 parallel requests,
    // which would starve the first (most important) frames of bandwidth.
    const CONCURRENCY = 8;
    let cursor = 0;

    const pump = (): void => {
      if (cancelled || cursor >= order.length) return;
      const index = order[cursor++];
      const img = new Image();
      img.decoding = "async";
      // A raw DOM Image, set outside Next's control — unlike next/image or
      // <Link>, nothing prefixes this automatically, so BASE_PATH is applied
      // by hand. It's "" everywhere except the GitHub Pages build.
      img.src = `${BASE_PATH}/frames/${variant}/frame_${String(index + 1).padStart(4, "0")}.webp`;

      const done = () => {
        if (cancelled) return;
        loaded++;
        // Throttled to whole percent: reporting every single frame would
        // re-render the hero ~192 times during load for no visible benefit.
        const percent = Math.floor((loaded / frameCount) * 100);
        if (percent !== lastReportedPercent) {
          lastReportedPercent = percent;
          setLoadedRatio(loaded / frameCount);
        }
        if (loaded >= readyCount) setReady(true);
        pump();
      };

      img.onload = () => {
        if (cancelled) return;
        framesRef.current[index] = img;
        loadedRef.current[index] = true;
        done();
      };
      // A missing frame must not stall the sequence — getFrame just falls back
      // to a neighbour.
      img.onerror = done;
    };

    for (let i = 0; i < CONCURRENCY; i++) pump();

    return () => {
      cancelled = true;
    };
  }, [frameCount, variant, readyThreshold]);

  // Stable identity: this only ever reads refs, and the hero's render loop has
  // it in an effect dependency list. A fresh function each render would tear
  // down and restart that loop on every state change.
  const getFrame = useCallback(
    (index: number): HTMLImageElement | null => {
      const clamped = Math.max(0, Math.min(frameCount - 1, index));
      if (loadedRef.current[clamped]) return framesRef.current[clamped];

      // Walk outwards for the closest loaded neighbour, so a not-yet-loaded
      // frame renders as a slightly coarser one rather than as nothing.
      for (let offset = 1; offset < frameCount; offset++) {
        const before = clamped - offset;
        if (before >= 0 && loadedRef.current[before]) return framesRef.current[before];
        const after = clamped + offset;
        if (after < frameCount && loadedRef.current[after]) return framesRef.current[after];
      }
      return null;
    },
    [frameCount]
  );

  return { getFrame, loadedRatio, ready };
}
