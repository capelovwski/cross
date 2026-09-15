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

/**
 * Estado de UMA seção dentro do feed (fornecido pelo FullPageScroll a cada filho).
 * `build` liga a coreografia de "página se construindo" (desktop): os elementos
 * entram quando a seção vira a ativa e se desmontam quando ela sai.
 */
export interface SectionState {
  index: number;
  active: boolean;
  /** posição relativa à seção ativa: <0 acima, 0 ativa, >0 abaixo */
  offset: number;
  build: boolean;
}

export const SectionStateContext = createContext<SectionState | null>(null);

export function useSectionState() {
  return useContext(SectionStateContext);
}
