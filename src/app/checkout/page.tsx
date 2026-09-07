import type { Metadata } from "next";
import { CheckoutForm } from "./checkout-form";
import { Footer } from "@/components/sections/footer";
import { TechBackdrop } from "@/components/background/tech-backdrop";

export const metadata: Metadata = {
  title: "Commande — Nexora",
  description: "Finalisez votre commande Nexora.",
};

export default function CheckoutPage() {
  return (
    <>
      <section className="relative overflow-hidden px-[clamp(1.25rem,4vw,3.5rem)] pb-[clamp(5rem,12vh,8rem)] pt-[clamp(9rem,18vh,12rem)]">
        <TechBackdrop variant="quiet" particles={false} />
        <div className="mx-auto max-w-[1200px]">
          <p className="nx-eyebrow mb-6">Étape 2 / 3 — Vos informations</p>
          <h1 className="mb-[clamp(3rem,7vh,4.5rem)] max-w-3xl text-[length:var(--text-display-l)] font-medium leading-[0.98] tracking-[-0.035em] text-nx-black">
            Finaliser la commande.
          </h1>
          <CheckoutForm />
        </div>
      </section>
      <Footer />
    </>
  );
}
