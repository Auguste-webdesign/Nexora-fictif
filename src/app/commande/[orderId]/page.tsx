import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { readOrder } from "@/lib/orders";
import { formatPrice } from "@/lib/cart";
import { Footer } from "@/components/sections/footer";
import { TechBackdrop } from "@/components/background/tech-backdrop";

export const metadata: Metadata = {
  title: "Commande confirmée — Nexora",
};

/**
 * Confirmation, read back from the stored order rather than from anything the
 * browser carried over. Landing here with an unknown id is a 404, so the page
 * can never present an order that was not actually recorded.
 *
 * `params` is a promise in this version of Next — see
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md
 */
export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await readOrder(orderId);
  if (!order) notFound();

  return (
    <>
      <section className="relative overflow-hidden px-[clamp(1.25rem,4vw,3.5rem)] pb-[clamp(5rem,12vh,8rem)] pt-[clamp(9rem,18vh,12rem)]">
        <TechBackdrop variant="quiet" particles={false} />
        <div className="mx-auto max-w-[900px]">
          <span className="mb-8 inline-flex items-center gap-2.5 rounded-full bg-nx-blue px-4 py-2">
            <Check size={14} strokeWidth={2.5} className="text-nx-white" />
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-nx-white">
              Étape 3 / 3 — Commande confirmée
            </span>
          </span>

          <h1 className="text-[length:var(--text-display-l)] font-medium leading-[0.98] tracking-[-0.035em] text-nx-black">
            Merci, {order.customer.firstName}.
          </h1>
          {/* Deliberately does not claim a confirmation e-mail was sent to the
              customer: nothing is sent to them. The only notification the system
              produces goes to the seller, and even that is conditional on the
              mail transport being configured. Promising an e-mail that never
              arrives is worse than promising nothing. */}
          <p className="mt-6 max-w-lg text-[length:var(--text-body-l)] leading-[1.6] text-nx-black/60">
            Votre commande est bien enregistrée. Nexora vous recontacte à{" "}
            <span className="text-nx-black">{order.customer.email}</span> pour la
            finaliser.
          </p>

          <div className="mt-12 rounded-[2rem] border border-nx-black/10 bg-nx-white/60 p-[clamp(1.75rem,4vw,2.75rem)]">
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-nx-black/10 pb-6">
              <div>
                <p className="nx-eyebrow text-nx-black/45">Numéro de commande</p>
                <p className="mt-2 font-mono text-[1rem] tracking-[0.08em] text-nx-black">
                  {order.id}
                </p>
              </div>
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-nx-black/45">
                {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <ul className="divide-y divide-nx-black/10">
              {order.items.map((item, index) => (
                <li key={`${item.productId}-${index}`} className="flex items-center gap-4 py-5">
                  <span className="font-mono text-[0.75rem] tabular-nums text-nx-black/45">
                    {item.quantity}×
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="nx-eyebrow text-nx-black/45">{item.brand}</p>
                    <p className="mt-1 text-[0.9375rem] font-medium text-nx-black">{item.name}</p>
                    {item.variantLabel && (
                      <p className="mt-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-nx-black/50">
                        {item.variantLabel}
                      </p>
                    )}
                  </div>
                  <p className="font-mono text-[0.8125rem] tabular-nums text-nx-black">
                    {formatPrice(item.lineTotal)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="space-y-2 border-t border-nx-black/10 pt-6 font-mono text-[0.75rem] uppercase tracking-[0.12em]">
              <div className="flex justify-between text-nx-black/60">
                <dt>Sous-total</dt>
                <dd className="tabular-nums">{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between text-nx-black/60">
                <dt>Livraison</dt>
                <dd>{order.shipping === 0 ? "Offerte" : formatPrice(order.shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-nx-black/10 pt-3 text-nx-black">
                <dt className="font-medium">Total</dt>
                <dd className="text-[1.125rem] tabular-nums">{formatPrice(order.total)}</dd>
              </div>
            </dl>

            <div className="mt-8 border-t border-nx-black/10 pt-6">
              <p className="nx-eyebrow mb-3 text-nx-black/45">Livraison</p>
              <p className="font-mono text-[0.75rem] leading-relaxed text-nx-black/70">
                {order.customer.firstName} {order.customer.lastName}
                <br />
                {order.customer.address}
                <br />
                {order.customer.postalCode} {order.customer.city}
                <br />
                {order.customer.country}
              </p>
            </div>
          </div>

          <Link
            href="/catalog"
            className="mt-10 inline-block rounded-full border border-nx-black/20 px-7 py-3.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-nx-black/70 transition-colors hover:border-nx-black/45"
          >
            Retour au catalogue
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
