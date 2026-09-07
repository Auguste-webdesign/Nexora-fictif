import { buildOrder, saveOrder } from "@/lib/orders";
import { notifySeller } from "@/lib/notify-seller";

/**
 * POST /api/orders — creates an order.
 *
 * The browser sends product ids, quantities and the customer's details. It does
 * NOT send prices: `buildOrder` re-resolves every line against the catalogue,
 * so the amount stored is the amount we charge regardless of what the payload
 * claimed.
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const result = buildOrder(payload);
  if (!result.ok) {
    return Response.json({ error: "Commande invalide", details: result.errors }, { status: 400 });
  }

  try {
    await saveOrder(result.order);
  } catch (error) {
    console.error("[orders] échec de l'enregistrement", error);
    return Response.json({ error: "Impossible d'enregistrer la commande" }, { status: 500 });
  }

  // Notification is best-effort and deliberately after the save: a mail
  // failure must not lose an order that is already committed.
  const notified = await notifySeller(result.order);

  return Response.json({ orderId: result.order.id, notified }, { status: 201 });
}
