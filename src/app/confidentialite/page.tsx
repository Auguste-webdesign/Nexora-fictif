import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/sections/footer";
import { TechBackdrop } from "@/components/background/tech-backdrop";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Nexora",
  description:
    "Politique de confidentialité du site de démonstration Nexora : données collectées au moment de la commande, finalité, durée de conservation et droits RGPD.",
  robots: { index: false },
};

/**
 * Privacy policy.
 *
 * The field list mirrors checkout-form.tsx exactly — firstName, lastName,
 * email, phone, address, postalCode, city, country and the optional notes.
 * It is written from the real form rather than from a template, because a
 * policy that lists fields the site does not collect (or omits ones it does)
 * is worse than no policy.
 *
 * The cart section describes localStorage rather than cookies, which is what
 * the site actually uses (lib/cart-store.ts).
 */
const SECTIONS_STYLE = "border-t border-nx-black/10 pt-12";
const H2 =
  "mb-5 text-[clamp(1.3rem,2.2vw,1.7rem)] font-medium tracking-[-0.02em] text-nx-black";
const P = "mb-4 text-[length:var(--text-body-m)] leading-[1.7] text-nx-black/70";
const LI = "mb-2 text-[length:var(--text-body-m)] leading-[1.7] text-nx-black/70";
const LINK = "text-nx-blue underline underline-offset-[3px]";

export default function PrivacyPage() {
  return (
    <>
      <section className="relative overflow-hidden px-[clamp(1.25rem,4vw,3.5rem)] pb-[clamp(5rem,12vh,8rem)] pt-[clamp(9rem,18vh,12rem)]">
        <TechBackdrop variant="quiet" particles={false} />

        <div className="mx-auto max-w-[900px]">
          <p className="nx-eyebrow mb-6">Protection des données</p>
          <h1 className="text-[length:var(--text-display-l)] font-medium leading-[0.98] tracking-[-0.035em] text-nx-black">
            Politique de confidentialité
          </h1>
          <p className="mt-6 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-nx-black/45">
            Dernière mise à jour : 31 août 2026
          </p>

          <div className="mt-10 rounded-[1.5rem] border border-nx-blue/40 border-l-[3px] border-l-nx-blue bg-nx-white/60 px-7 py-6">
            <p className="text-[length:var(--text-body-m)] leading-[1.7] text-nx-black">
              <strong className="font-medium">Site de démonstration —</strong> Nexora est une
              boutique fictive. <strong className="font-medium">Aucune commande n&apos;est
              réellement traitée</strong>, aucun paiement n&apos;est demandé et aucun produit
              n&apos;est expédié. Cette politique décrit le traitement qui serait mis en œuvre dans
              une exploitation réelle, et ce que le site fait réellement aujourd&apos;hui.
            </p>
          </div>

          <div className="mt-14 space-y-14">
            <section>
              <h2 className={H2}>Responsable du traitement</h2>
              <p className={P}>
                Nexora, 9 Rue du Blaireau, 49100 Angers{" "}
                <span className="text-nx-black/45">— entreprise et adresse fictives</span>. Contact :{" "}
                <a href="mailto:contact@nexora.example" className={LINK}>
                  contact@nexora.example
                </a>{" "}
                (adresse d&apos;exemple, non fonctionnelle).
              </p>
            </section>

            <section className={SECTIONS_STYLE}>
              <h2 className={H2}>Quelles données sont collectées</h2>
              <p className={P}>
                Les données personnelles sont saisies au moment de la validation de commande. Les
                champs sont les suivants :
              </p>
              <ul className="mb-4 list-disc pl-5">
                <li className={LI}>
                  <strong className="font-medium text-nx-black">Prénom et nom</strong> — obligatoires,
                  pour identifier la commande et le destinataire.
                </li>
                <li className={LI}>
                  <strong className="font-medium text-nx-black">Adresse e-mail</strong> — obligatoire,
                  pour confirmer la commande et son suivi.
                </li>
                <li className={LI}>
                  <strong className="font-medium text-nx-black">Numéro de téléphone</strong> —
                  obligatoire, pour la livraison.
                </li>
                <li className={LI}>
                  <strong className="font-medium text-nx-black">Adresse, code postal, ville, pays</strong>{" "}
                  — obligatoires, pour l&apos;expédition.
                </li>
                <li className={LI}>
                  <strong className="font-medium text-nx-black">Notes</strong> — facultatives, pour
                  vos consignes de livraison éventuelles.
                </li>
              </ul>
              <p className={P}>
                S&apos;y ajoutent le contenu de la commande (produits, quantités, montants) et sa
                date. Aucune donnée bancaire n&apos;est demandée : le site ne comporte aucun système
                de paiement.
              </p>
              <p className={P}>
                Aucune donnée dite sensible n&apos;est collectée. Aucun profilage ni décision
                automatisée n&apos;est effectué.
              </p>
            </section>

            <section className={SECTIONS_STYLE}>
              <h2 className={H2}>Pourquoi ces données sont collectées</h2>
              <p className={P}>
                <strong className="font-medium text-nx-black">Finalité :</strong> traiter et livrer
                votre commande — l&apos;enregistrer, la préparer, l&apos;expédier et vous
                recontacter en cas de besoin.
              </p>
              <p className={P}>
                <strong className="font-medium text-nx-black">Base légale :</strong> l&apos;exécution
                du contrat de vente auquel vous êtes partie, au sens de l&apos;article 6.1.b du
                RGPD. Sans ces données, la commande ne peut pas être honorée.
              </p>
              <p className={P}>
                Une case à cocher, non pré-cochée, recueille votre accord explicite avant la
                validation. Sans cet accord, la commande ne peut pas être envoyée.
              </p>
            </section>

            <section className={SECTIONS_STYLE}>
              <h2 className={H2}>Combien de temps elles sont conservées</h2>
              <ul className="mb-4 list-disc pl-5">
                <li className={LI}>
                  <strong className="font-medium text-nx-black">Données de commande</strong> —
                  conservées 5 ans, durée correspondant aux obligations comptables et à la garantie
                  légale de conformité.
                </li>
                <li className={LI}>
                  <strong className="font-medium text-nx-black">Panier non validé</strong> — stocké
                  uniquement dans votre navigateur, jamais transmis, et effacé si vous videz les
                  données du site.
                </li>
              </ul>
              <p className={P}>
                Dans la version de démonstration actuelle, les commandes sont écrites dans un
                fichier local sur la machine qui exécute le site, et rien n&apos;est transmis à un
                tiers en dehors de la notification décrite ci-dessous.
              </p>
            </section>

            <section className={SECTIONS_STYLE}>
              <h2 className={H2}>Qui y a accès</h2>
              <p className={P}>
                Les données sont destinées à Nexora. Dans une exploitation réelle, elles seraient
                également transmises à deux catégories de destinataires :
              </p>
              <ul className="mb-4 list-disc pl-5">
                <li className={LI}>
                  <strong className="font-medium text-nx-black">Prestataire de paiement</strong> —
                  pour encaisser la commande.{" "}
                  <span className="text-nx-black/45">
                    Aucun prestataire n&apos;est branché sur ce site de démonstration : il n&apos;y a
                    pas de paiement.
                  </span>
                </li>
                <li className={LI}>
                  <strong className="font-medium text-nx-black">Transporteur</strong> — pour livrer
                  le colis.{" "}
                  <span className="text-nx-black/45">
                    Aucun transporteur n&apos;est branché : rien n&apos;est expédié.
                  </span>
                </li>
              </ul>
              <p className={P}>
                Le récapitulatif de commande est envoyé par e-mail au vendeur via le service
                d&apos;acheminement Resend, qui traite ce message pour le compte de Nexora. Aucune
                donnée n&apos;est vendue, louée ni transmise à des fins publicitaires.
              </p>
            </section>

            <section className={SECTIONS_STYLE}>
              <h2 className={H2}>Cookies et stockage local</h2>
              <p className={P}>
                Ce site <strong className="font-medium text-nx-black">ne dépose aucun cookie</strong>{" "}
                de mesure d&apos;audience, de statistiques ou de publicité, et ne charge aucun
                traceur tiers.
              </p>
              <p className={P}>
                Il utilise en revanche le{" "}
                <strong className="font-medium text-nx-black">stockage local</strong> de votre
                navigateur (<span className="font-mono text-[0.875em]">localStorage</span>) pour
                conserver le contenu de votre panier d&apos;une page à l&apos;autre. Ce stockage est
                strictement technique : il est nécessaire au fonctionnement de la boutique, ne
                permet pas de vous identifier, et ne quitte jamais votre navigateur.{" "}
                <strong className="font-medium text-nx-black">Base légale :</strong> l&apos;intérêt
                légitime de Nexora à fournir une fonction de panier opérante. Vous pouvez
                l&apos;effacer à tout moment en vidant les données du site dans votre navigateur.
              </p>
            </section>

            <section className={SECTIONS_STYLE}>
              <h2 className={H2}>Vos droits</h2>
              <p className={P}>
                Conformément aux articles 15 à 21 du RGPD, vous disposez des droits suivants sur vos
                données :
              </p>
              <ul className="mb-4 list-disc pl-5">
                <li className={LI}>
                  <strong className="font-medium text-nx-black">Droit d&apos;accès</strong> — obtenir
                  la copie des données vous concernant.
                </li>
                <li className={LI}>
                  <strong className="font-medium text-nx-black">Droit de rectification</strong> —
                  faire corriger une donnée inexacte ou incomplète.
                </li>
                <li className={LI}>
                  <strong className="font-medium text-nx-black">Droit à l&apos;effacement</strong> —
                  demander la suppression de vos données, sous réserve des obligations comptables.
                </li>
                <li className={LI}>
                  <strong className="font-medium text-nx-black">Droit d&apos;opposition</strong> —
                  vous opposer au traitement pour un motif tenant à votre situation.
                </li>
                <li className={LI}>
                  <strong className="font-medium text-nx-black">Droit à la limitation</strong> —
                  demander le gel temporaire du traitement.
                </li>
                <li className={LI}>
                  <strong className="font-medium text-nx-black">Droit à la portabilité</strong> —
                  récupérer vos données dans un format lisible par machine.
                </li>
              </ul>
              <p className={P}>
                Pour exercer l&apos;un de ces droits, écrivez à{" "}
                <a href="mailto:contact@nexora.example" className={LINK}>
                  contact@nexora.example
                </a>{" "}
                ou par courrier au 9 Rue du Blaireau, 49100 Angers. Une réponse vous est apportée
                dans un délai d&apos;un mois.
              </p>
              <p className={P}>
                En cas de désaccord persistant, vous pouvez introduire une réclamation auprès de la
                CNIL —{" "}
                <a
                  href="https://www.cnil.fr"
                  rel="noopener noreferrer"
                  target="_blank"
                  className={LINK}
                >
                  www.cnil.fr
                </a>
                .
              </p>
            </section>

            <section className={SECTIONS_STYLE}>
              <h2 className={H2}>Sécurité</h2>
              <p className={P}>
                Les montants d&apos;une commande sont recalculés côté serveur à partir du catalogue
                et ne peuvent pas être modifiés depuis le navigateur. Dans une exploitation réelle,
                les données seraient transmises en HTTPS et l&apos;accès restreint aux seules
                personnes ayant à en connaître.
              </p>
            </section>

            <section className={SECTIONS_STYLE}>
              <h2 className={H2}>Modification de cette politique</h2>
              <p className={P}>
                Cette politique peut être mise à jour. La date figurant en haut de page indique sa
                dernière révision. Voir également les{" "}
                <Link href="/mentions-legales" className={LINK}>
                  mentions légales
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
