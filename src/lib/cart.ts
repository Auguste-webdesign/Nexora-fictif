import {
  FLAGSHIP_ID,
  IPHONE_STORAGE,
  PRODUCTS,
  formatPrice,
  type Product,
} from "./products";
import { FINISHES } from "./finishes";

/**
 * Cart model.
 *
 * A line stores IDENTITY AND QUANTITY ONLY — never a price, a name or an image.
 * Everything displayed is resolved from the catalogue at render time by
 * `resolveLine`, which has two consequences that matter:
 *
 *  - a price change in products.ts is reflected in an already-populated cart
 *    rather than leaving stale money in localStorage, and
 *  - the order endpoint re-resolves the exact same way, so a tampered payload
 *    cannot set its own prices. The client is never trusted for money.
 *
 * The flagship is configurable (storage x finish), so its identity needs those
 * two ids; every other product is identified by its id alone.
 */
export type CartLine = {
  /** Stable identity for a configuration — see `lineKey`. */
  key: string;
  productId: string;
  storageId?: string;
  finishId?: string;
  quantity: number;
};

export type ResolvedLine = CartLine & {
  brand: string;
  name: string;
  /** Human-readable configuration, e.g. "256 Go · Bleu titane". */
  variantLabel?: string;
  image?: string;
  unitPrice: number;
  lineTotal: number;
};

/** Two of the same product in different configurations are different lines. */
export function lineKey(productId: string, storageId?: string, finishId?: string): string {
  return [productId, storageId, finishId].filter(Boolean).join("::");
}

export const MAX_QUANTITY_PER_LINE = 10;

function findProduct(productId: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === productId);
}

/**
 * Resolves a stored line against the catalogue.
 *
 * Returns null for a line whose product no longer exists — a cart restored
 * from localStorage after the catalogue changed must drop it rather than
 * render `undefined` or price it at NaN.
 */
export function resolveLine(line: CartLine): ResolvedLine | null {
  const product = findProduct(line.productId);
  if (!product) return null;

  let unitPrice = product.price;
  let image = product.image;
  const parts: string[] = [];

  if (product.id === FLAGSHIP_ID) {
    const storage = IPHONE_STORAGE.find((option) => option.id === line.storageId);
    const finish = FINISHES.find((option) => option.id === line.finishId);
    // An unknown storage id must not silently fall back to the base price.
    if (!storage || !finish) return null;
    unitPrice = storage.price;
    image = finish.image;
    parts.push(storage.label, finish.label);
  }

  const quantity = clampQuantity(line.quantity);

  return {
    ...line,
    quantity,
    brand: product.brand,
    name: product.name,
    variantLabel: parts.length ? parts.join(" · ") : undefined,
    image,
    unitPrice,
    lineTotal: unitPrice * quantity,
  };
}

export function clampQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 1;
  return Math.max(1, Math.min(MAX_QUANTITY_PER_LINE, Math.floor(quantity)));
}

export function resolveLines(lines: CartLine[]): ResolvedLine[] {
  return lines.map(resolveLine).filter((line): line is ResolvedLine => line !== null);
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((total, line) => total + line.quantity, 0);
}

export function cartSubtotal(lines: CartLine[]): number {
  return resolveLines(lines).reduce((total, line) => total + line.lineTotal, 0);
}

/**
 * Shipping is genuinely free rather than a placeholder figure — inventing a
 * carrier or a rate would be making up business rules that do not exist.
 */
export const SHIPPING_COST = 0;

export function cartTotal(lines: CartLine[]): number {
  return cartSubtotal(lines) + SHIPPING_COST;
}

export { formatPrice };
