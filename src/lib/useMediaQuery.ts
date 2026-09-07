"use client";

import { useSyncExternalStore } from "react";

/** Media query reativa, segura para SSR (retorna `false` no servidor). */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const FINE_POINTER = "(pointer: fine)";
export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
export const MOBILE = "(max-width: 767px)";
