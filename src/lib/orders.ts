import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import { resolveLine, SHIPPING_COST, type CartLine } from "./cart";

/**
 * Order creation and storage.
 *
 * Orders are written as JSON files under `.data/orders/`. That is a deliberate
 * choice, not a stand-in for something better: the project has no database and
 * no external service configured, and inventing one would mean inventing an
 * integration that does not exist. Files are real persistence — an order
 * survives a restart and can be read back by the confirmation page — and the
 * write is isolated behind this module, so swapping in a database later means
 * changing `saveOrder`/`readOrder` and nothing else.
 *
 * Server-only by construction: the `node:fs` imports below fail to compile if
 * this module is ever pulled into a client bundle, so no extra guard package is
 * needed to enforce it.
 */
const ORDERS_DIR = join(process.cwd(), ".data", "orders");

export type Customer = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  notes?: string;
};

export type OrderItem = {
  productId: string;
  brand: string;
  name: string;
  variantLabel?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type Order = {
  id: string;
  createdAt: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
};

/**
 * Human-readable and hard to guess.
 *
 * The confirmation page is addressed by this id and has no auth in front of it,
 * so a sequential number would let anyone walk other people's orders. The
 * random tail is what prevents that; the date prefix is for the seller reading
 * a list of files.
 */
export function generateOrderId(date = new Date()): string {
  const stamp = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");
  const tail = randomBytes(4).toString("hex").toUpperCase();
  return `NX-${stamp}-${tail}`;
}

/** Only ids we generated ourselves — this value reaches the filesystem. */
export function isValidOrderId(id: string): boolean {
  return /^NX-\d{8}-[0-9A-F]{8}$/.test(id);
}

const REQUIRED_FIELDS: (keyof Customer)[] = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "address",
  "postalCode",
  "city",
  "country",
];

export type ValidationResult =
  | { ok: true; order: Order }
  | { ok: false; errors: string[] };

/**
 * Builds an order from an untrusted payload.
 *
 * Prices are RE-RESOLVED from the catalogue rather than read from the request:
 * the browser sends product ids and quantities, nothing about money. A payload
 * claiming an iPhone costs one euro resolves to the catalogue price anyway.
 */
export function buildOrder(payload: unknown): ValidationResult {
  const errors: string[] = [];
  const body = (payload ?? {}) as { customer?: Partial<Customer>; lines?: CartLine[] };

  const rawCustomer = body.customer ?? {};
  const customer = {} as Customer;
  for (const field of REQUIRED_FIELDS) {
    const value = typeof rawCustomer[field] === "string" ? rawCustomer[field]!.trim() : "";
    if (!value) errors.push(`Champ requis manquant : ${field}`);
    customer[field] = value;
  }
  if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(customer.email)) {
    errors.push("Adresse e-mail invalide");
  }
  const notes = typeof rawCustomer.notes === "string" ? rawCustomer.notes.trim() : "";
  if (notes) customer.notes = notes.slice(0, 2000);

  const lines = Array.isArray(body.lines) ? body.lines : [];
  if (lines.length === 0) errors.push("Le panier est vide");

  const items: OrderItem[] = [];
  for (const line of lines) {
    const resolved = resolveLine(line);
    if (!resolved) {
      errors.push(`Produit inconnu ou configuration invalide : ${line?.productId ?? "?"}`);
      continue;
    }
    items.push({
      productId: resolved.productId,
      brand: resolved.brand,
      name: resolved.name,
      variantLabel: resolved.variantLabel,
      unitPrice: resolved.unitPrice,
      quantity: resolved.quantity,
      lineTotal: resolved.lineTotal,
    });
  }

  if (errors.length > 0) return { ok: false, errors };

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  return {
    ok: true,
    order: {
      id: generateOrderId(),
      createdAt: new Date().toISOString(),
      customer,
      items,
      subtotal,
      shipping: SHIPPING_COST,
      total: subtotal + SHIPPING_COST,
    },
  };
}

export async function saveOrder(order: Order): Promise<void> {
  await mkdir(ORDERS_DIR, { recursive: true });
  await writeFile(join(ORDERS_DIR, `${order.id}.json`), JSON.stringify(order, null, 2), "utf8");
}

export async function readOrder(id: string): Promise<Order | null> {
  if (!isValidOrderId(id)) return null;
  try {
    const raw = await readFile(join(ORDERS_DIR, `${id}.json`), "utf8");
    return JSON.parse(raw) as Order;
  } catch {
    return null;
  }
}
