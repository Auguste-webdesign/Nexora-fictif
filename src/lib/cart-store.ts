import { clampQuantity, lineKey, type CartLine } from "./cart";

/**
 * The cart as an external store, read through `useSyncExternalStore`.
 *
 * WHY NOT `useState` + an effect. The obvious shape — state initialised empty,
 * an effect reading localStorage on mount — sets state inside an effect, which
 * causes a cascading render and is rejected by the project's lint rules. It is
 * also the wrong model: the cart genuinely lives outside React (in
 * localStorage, and shared across tabs), which is precisely what
 * `useSyncExternalStore` exists for. React uses `getServerSnapshot` while
 * hydrating and switches to the live snapshot afterwards, so the server's empty
 * cart and the browser's stored one never collide.
 *
 * The snapshot object is replaced, never mutated: `useSyncExternalStore`
 * compares snapshots by identity to decide whether to re-render, so mutating in
 * place would silently stop updating the UI.
 */
const STORAGE_KEY = "nx-cart-v1";

export type CartSnapshot = {
  lines: CartLine[];
  /** False until localStorage has been read — the badge stays hidden until then. */
  hydrated: boolean;
};

/** Constant identity: returning a fresh object here would loop forever. */
const SERVER_SNAPSHOT: CartSnapshot = { lines: [], hydrated: false };

let snapshot: CartSnapshot = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function setLines(lines: CartLine[]) {
  snapshot = { lines, hydrated: true };
  persist(lines);
  emit();
}

function persist(lines: CartLine[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Private mode, quota exceeded, storage blocked: the session's cart keeps
    // working in memory, it just stops being remembered.
  }
}

/**
 * Anything read back from disk is untrusted — it may have been hand-edited or
 * left by an older shape of this code — so each entry is rebuilt field by field
 * rather than spread wholesale.
 */
function parse(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (entry): entry is CartLine =>
          !!entry &&
          typeof entry === "object" &&
          typeof (entry as CartLine).productId === "string" &&
          typeof (entry as CartLine).quantity === "number"
      )
      .map((entry) => ({
        productId: entry.productId,
        storageId: entry.storageId,
        finishId: entry.finishId,
        quantity: clampQuantity(entry.quantity),
        key: lineKey(entry.productId, entry.storageId, entry.finishId),
      }));
  } catch {
    return [];
  }
}

let initialised = false;

function initialise() {
  if (initialised || typeof window === "undefined") return;
  initialised = true;
  try {
    snapshot = { lines: parse(window.localStorage.getItem(STORAGE_KEY)), hydrated: true };
  } catch {
    snapshot = { lines: [], hydrated: true };
  }
  // Another tab changing the cart updates this one. Without it, two open tabs
  // would each hold a divergent cart and the last write would win silently.
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    snapshot = { lines: parse(event.newValue), hydrated: true };
    emit();
  });
}

export function subscribe(listener: () => void): () => void {
  initialise();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): CartSnapshot {
  initialise();
  return snapshot;
}

export function getServerSnapshot(): CartSnapshot {
  return SERVER_SNAPSHOT;
}

/* ------------------------------------------------------------------ actions */

export function addLine(input: {
  productId: string;
  storageId?: string;
  finishId?: string;
  quantity?: number;
}) {
  const key = lineKey(input.productId, input.storageId, input.finishId);
  const amount = clampQuantity(input.quantity ?? 1);
  const current = snapshot.lines;
  const existing = current.find((line) => line.key === key);

  setLines(
    existing
      ? current.map((line) =>
          line.key === key ? { ...line, quantity: clampQuantity(line.quantity + amount) } : line
        )
      : [
          ...current,
          {
            key,
            productId: input.productId,
            storageId: input.storageId,
            finishId: input.finishId,
            quantity: amount,
          },
        ]
  );
}

export function setLineQuantity(key: string, quantity: number) {
  // Stepping below one removes the line, which is what a decrement control at
  // quantity 1 is expected to do.
  if (quantity < 1) {
    removeLine(key);
    return;
  }
  setLines(
    snapshot.lines.map((line) =>
      line.key === key ? { ...line, quantity: clampQuantity(quantity) } : line
    )
  );
}

export function removeLine(key: string) {
  setLines(snapshot.lines.filter((line) => line.key !== key));
}

export function clearCart() {
  setLines([]);
}
