"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  addLine,
  clearCart,
  getServerSnapshot,
  getSnapshot,
  removeLine,
  setLineQuantity,
  subscribe,
} from "@/lib/cart-store";
import { cartCount, resolveLines, type CartLine, type ResolvedLine } from "@/lib/cart";

/**
 * Reads the cart store into React and holds the panel's open/closed state.
 *
 * The cart data itself lives in lib/cart-store.ts (localStorage-backed, shared
 * across tabs). Only the panel's visibility is React state, because that is
 * genuinely per-view and should not persist.
 *
 * Mounted once in the root layout, so the cart survives client-side navigation.
 */
export type AddToCartInput = {
  productId: string;
  storageId?: string;
  finishId?: string;
  quantity?: number;
};

type CartContextValue = {
  lines: CartLine[];
  resolved: ResolvedLine[];
  count: number;
  hydrated: boolean;
  isOpen: boolean;
  add: (input: AddToCartInput) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart doit être utilisé dans <CartProvider>");
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const resolved = useMemo(() => resolveLines(snapshot.lines), [snapshot.lines]);
  const count = useMemo(() => cartCount(snapshot.lines), [snapshot.lines]);

  const value = useMemo(
    () => ({
      lines: snapshot.lines,
      resolved,
      count,
      hydrated: snapshot.hydrated,
      isOpen,
      add: addLine,
      setQuantity: setLineQuantity,
      remove: removeLine,
      clear: clearCart,
      open,
      close,
    }),
    [snapshot.lines, snapshot.hydrated, resolved, count, isOpen, open, close]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
