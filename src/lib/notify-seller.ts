import type { Order } from "./orders";
import { formatPrice } from "./cart";

/**
 * Seller notification, sent through Resend.
 *
 * Resend's REST API is called directly with `fetch` rather than through their
 * SDK: the SDK would be a dependency for one HTTP POST, and this is that POST.
 *
 * CONFIGURATION lives entirely in environment variables, never in this file:
 *   RESEND_API_KEY       — the key, from resend.com/api-keys
 *   NEXORA_SELLER_EMAIL  — where orders are sent
 *   NEXORA_MAIL_FROM     — optional sender; defaults to Resend's shared sandbox
 *
 * Missing configuration is not an error. The order is already persisted by the
 * time this runs, so an unsent notification only means the seller reads
 * `.data/orders/` instead of their inbox — it never loses a sale. That is also
 * why every failure path here returns `false` rather than throwing.
 */
const RESEND_ENDPOINT = "https://api.resend.com/emails";

/**
 * Resend's shared sender works with no domain set up, which is what makes this
 * usable immediately — but it will only deliver to the address that owns the
 * Resend account. Sending anywhere else needs a verified domain and
 * NEXORA_MAIL_FROM pointed at it.
 */
const DEFAULT_FROM = "Nexora <onboarding@resend.dev>";

/** A hung request must not hold the customer's confirmation hostage. */
const TIMEOUT_MS = 8000;

export function formatOrderForEmail(order: Order): { subject: string; body: string } {
  const lines = order.items
    .map(
      (item) =>
        `  - ${item.quantity} x ${item.brand} ${item.name}` +
        (item.variantLabel ? ` (${item.variantLabel})` : "") +
        `  —  ${formatPrice(item.lineTotal)}`
    )
    .join("\n");

  const customer = order.customer;
  const body = [
    `Nouvelle commande ${order.id}`,
    `Passée le ${new Date(order.createdAt).toLocaleString("fr-FR")}`,
    "",
    "ARTICLES",
    lines,
    "",
    `Sous-total : ${formatPrice(order.subtotal)}`,
    `Livraison  : ${order.shipping === 0 ? "Offerte" : formatPrice(order.shipping)}`,
    `TOTAL      : ${formatPrice(order.total)}`,
    "",
    "CLIENT",
    `${customer.firstName} ${customer.lastName}`,
    customer.email,
    customer.phone,
    "",
    "LIVRAISON",
    customer.address,
    `${customer.postalCode} ${customer.city}`,
    customer.country,
    customer.notes ? `\nNOTES\n${customer.notes}` : "",
  ]
    .join("\n")
    .trim();

  return { subject: `Nexora — commande ${order.id} — ${formatPrice(order.total)}`, body };
}

/**
 * Returns whether a notification actually went out, so the caller can be honest
 * about it rather than assuming success.
 */
export async function notifySeller(order: Order): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NEXORA_SELLER_EMAIL;
  const from = process.env.NEXORA_MAIL_FROM || DEFAULT_FROM;
  const { subject, body } = formatOrderForEmail(order);

  if (!apiKey || !to) {
    // The full summary goes to the log so the order is never only half-recorded
    // while the transport is unconfigured.
    console.info(
      `[orders] commande ${order.id} enregistrée. Notification non envoyée ` +
        `(${!apiKey ? "RESEND_API_KEY" : "NEXORA_SELLER_EMAIL"} manquant).\n` +
        `--- ${subject} ---\n${body}\n---`
    );
    return false;
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, text: body, reply_to: order.customer.email }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      // Read the body: Resend explains refusals (unverified domain, bad key) in
      // it, and that message is what makes the failure fixable.
      const detail = await response.text().catch(() => "");
      console.error(
        `[orders] commande ${order.id} : Resend a refusé l'envoi ` +
          `(HTTP ${response.status}). ${detail}`
      );
      return false;
    }

    console.info(`[orders] commande ${order.id} : notification envoyée à ${to}.`);
    return true;
  } catch (error) {
    console.error(`[orders] commande ${order.id} : échec de l'envoi.`, error);
    return false;
  }
}
