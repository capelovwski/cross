"use client";

import { createContext, useContext } from "react";

export interface ScrollApi {
  /** índice da seção ativa */
  index: number;
  count: number;
  /** modo ativo: "snap" = scroll engatado por seção; "native" = rolagem normal (reduced motion) */
  mode: "snap" | "native";
  goTo: (indexOrId: number | string) => void;
  next: () => void;
  prev: () => void;
}

export const ScrollContext = createContext<ScrollApi | null>(null);

export function useSectionScroll() {
  return useContext(ScrollContext);
}
