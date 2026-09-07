"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { useFinish } from "@/components/finish-provider";
import { formatPrice, SHIPPING_COST } from "@/lib/cart";

/**
 * Customer details, then order submission.
 *
 * The cart is sent as ids and quantities only — the server prices it. The
 * summary shown here is the client's own resolution of the same catalogue, so
 * the two agree without the browser being authoritative about money.
 */
const FIELDS = [
  { name: "firstName", label: "Prénom", type: "text", autoComplete: "given-name", half: true },
  { name: "lastName", label: "Nom", type: "text", autoComplete: "family-name", half: true },
  { name: "email", label: "E-mail", type: "email", autoComplete: "email", half: true },
  { name: "phone", label: "Téléphone", type: "tel", autoComplete: "tel", half: true },
  { name: "address", label: "Adresse", type: "text", autoComplete: "street-address", half: false },
  { name: "postalCode", label: "Code postal", type: "text", autoComplete: "postal-code", half: true },
  { name: "city", label: "Ville", type: "text", autoComplete: "address-level2", half: true },
  { name: "country", label: "Pays", type: "text", autoComplete: "country-name", half: false },
] as const;

type FieldName = (typeof FIELDS)[number]["name"];

const EMPTY: Record<FieldName | "notes", string> = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  postalCode: "",
  city: "",
  country: "France",
  notes: "",
};

export function CheckoutForm() {
  const { lines, resolved, clear, hydrated } = useCart();
  const { finish } = useFinish();
  const router = useRouter();

  const [values, setValues] = useState(EMPTY);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const subtotal = resolved.reduce((total, line) => total + line.lineTotal, 0);
  const total = subtotal + SHIPPING_COST;

  const update = (name: string, value: string) =>
    setValues((current) => ({ ...current, [name]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    // Le consentement est vérifié en premier : c'est la condition qui autorise
    // le traitement des données, pas un champ parmi d'autres. Rien ne part sur
    // le réseau tant qu'il n'est pas donné.
    if (!consent) {
      setErrors([
        "Merci de cocher la case de consentement pour valider votre commande.",
      ]);
      return;
    }

    // Client-side check for immediacy only; the server validates the same
    // fields again and is the one that decides.
    const missing = FIELDS.filter((field) => !values[field.name].trim()).map(
      (field) => field.label
    );
    if (missing.length > 0) {
      setErrors([`Champs requis : ${missing.join(", ")}`]);
      return;
    }

    setSubmitting(true);
    setErrors([]);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: values, lines }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrors(data.details ?? [data.error ?? "La commande n'a pas pu être enregistrée."]);
        setSubmitting(false);
        return;
      }
      // Clear only once the server has confirmed — a failed request must leave
      // the cart intact.
      clear();
      router.push(`/commande/${data.orderId}`);
    } catch {
      setErrors(["Impossible de joindre le serveur. Réessayez."]);
      setSubmitting(false);
    }
  };

  if (hydrated && resolved.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-mono text-[0.8125rem] uppercase tracking-[0.14em] text-nx-black/55">
          Votre panier est vide
        </p>
        <Link
          href="/catalog"
          className="mt-6 inline-block rounded-full border border-nx-black/20 px-7 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-nx-black/70 transition-colors hover:border-nx-black/45"
        >
          Parcourir le catalogue
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-x-16 gap-y-12 lg:grid-cols-[1.15fr_0.85fr]">
      <div>
        <p className="nx-eyebrow mb-6 text-nx-black/45">Informations client</p>

        <div className="grid grid-cols-2 gap-4">
          {FIELDS.map((field) => (
            <label key={field.name} className={field.half ? "col-span-2 sm:col-span-1" : "col-span-2"}>
              <span className="mb-2 block font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-nx-black/55">
                {field.label}
              </span>
              <input
                type={field.type}
                name={field.name}
                autoComplete={field.autoComplete}
                required
                value={values[field.name]}
                onChange={(event) => update(field.name, event.target.value)}
                className="w-full rounded-2xl border border-nx-black/15 bg-nx-white px-4 py-3 text-[0.9375rem] text-nx-black outline-none transition-colors focus:border-nx-blue"
              />
            </label>
          ))}

          <label className="col-span-2">
            <span className="mb-2 block font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-nx-black/55">
              Notes (facultatif)
            </span>
            <textarea
              name="notes"
              rows={3}
              value={values.notes}
              onChange={(event) => update("notes", event.target.value)}
              className="w-full resize-none rounded-2xl border border-nx-black/15 bg-nx-white px-4 py-3 text-[0.9375rem] text-nx-black outline-none transition-colors focus:border-nx-blue"
            />
          </label>
        </div>

        {errors.length > 0 && (
          <ul
            role="alert"
            className="mt-6 space-y-1 rounded-2xl border border-red-300 bg-red-50 px-5 py-4 font-mono text-[0.75rem] text-red-700"
          >
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}

        <Link
          href="/catalog"
          className="mt-8 inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-nx-black/55 transition-colors hover:text-nx-black"
        >
          <ArrowLeft size={13} strokeWidth={1.8} />
          Continuer mes achats
        </Link>
      </div>

      {/* Order summary */}
      <div>
        <div
          className="rounded-[2rem] p-7 lg:sticky lg:top-28"
          style={{ backgroundColor: finish.wash }}
        >
          <p className="nx-eyebrow mb-6 text-nx-black/45">Récapitulatif</p>

          <ul className="space-y-4">
            {resolved.map((line) => (
              <li key={line.key} className="flex items-center gap-3">
                <div
                  className="relative size-14 shrink-0 overflow-hidden rounded-xl"
                  style={{ backgroundColor: finish.tint }}
                >
                  {line.image && (
                    <Image
                      src={line.image}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-contain p-1"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.875rem] font-medium text-nx-black">
                    {line.name}
                  </p>
                  <p className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-nx-black/50">
                    {line.quantity} × {formatPrice(line.unitPrice)}
                    {line.variantLabel ? ` · ${line.variantLabel}` : ""}
                  </p>
                </div>
                <p className="font-mono text-[0.75rem] tabular-nums text-nx-black">
                  {formatPrice(line.lineTotal)}
                </p>
              </li>
            ))}
          </ul>

          <dl
            className="mt-7 space-y-2 border-t pt-5 font-mono text-[0.75rem] uppercase tracking-[0.12em]"
            style={{ borderColor: `${finish.swatch}33` }}
          >
            <div className="flex justify-between text-nx-black/60">
              <dt>Sous-total</dt>
              <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-nx-black/60">
              <dt>Livraison</dt>
              <dd>Offerte</dd>
            </div>
            <div
              className="flex justify-between border-t pt-3 text-nx-black"
              style={{ borderColor: `${finish.swatch}33` }}
            >
              <dt className="font-medium">Total</dt>
              <dd className="text-[1rem] tabular-nums">{formatPrice(total)}</dd>
            </div>
          </dl>

          {/* Non pré-cochée et obligatoire : le consentement doit être un acte
              positif. `required` fait échouer la validation native du
              formulaire, et le test dans handleSubmit donne le message en
              français dans la zone d'erreurs existante. */}
          <label className="mt-7 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="consent"
              required
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              className="mt-0.5 size-4 flex-none cursor-pointer accent-nx-blue"
            />
            <span className="text-[0.8125rem] leading-[1.5] text-nx-black/70">
              J&apos;accepte que mes informations soient utilisées pour traiter ma commande. Voir la{" "}
              <Link
                href="/confidentialite"
                className="text-nx-blue underline underline-offset-[3px]"
              >
                politique de confidentialité
              </Link>
              .
            </span>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="nx-metal mt-5 flex w-full items-center justify-center gap-2.5 rounded-full px-8 py-4 font-mono text-[0.75rem] uppercase tracking-[0.18em] text-nx-white transition-[background-position] duration-700 hover:[background-position:100%_50%] disabled:opacity-70"
          >
            {submitting && <Loader2 size={15} className="animate-spin" />}
            {submitting ? "Validation…" : "Valider la commande"}
          </button>

          <p className="mt-4 font-mono text-[0.625rem] uppercase leading-relaxed tracking-[0.12em] text-nx-black/45">
            Aucun paiement n&apos;est demandé à cette étape. Nexora vous
            recontacte pour finaliser la commande.
          </p>
        </div>
      </div>
    </form>
  );
}
