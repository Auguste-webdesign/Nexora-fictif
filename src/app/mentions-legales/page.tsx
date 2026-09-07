import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/sections/footer";
import { TechBackdrop } from "@/components/background/tech-backdrop";

export const metadata: Metadata = {
  title: "Mentions légales — Nexora",
  description:
    "Mentions légales du site de démonstration Nexora : éditeur, directeur de publication, hébergeur et contact.",
  robots: { index: false },
};

/**
 * Legal notice.
 *
 * Server component, no client state — same shape as /checkout's shell. The
 * layout follows the catalogue page: eyebrow, display heading, then a body
 * capped at a readable measure. Every value is an example and says so inline,
 * because a legal page that looks authoritative while carrying invented
 * registration numbers is worse than one that admits what it is.
 */
const FACTS = [
  { label: "Dénomination", value: "Nexora", note: "entreprise fictive" },
  { label: "Forme juridique et capital", value: "SAS au capital de 50 000 €", note: "valeur d'exemple" },
  { label: "Siège social", value: "9 Rue du Blaireau, 49100 Angers", note: "adresse fictive" },
  { label: "Immatriculation", value: "SIRET 000 000 000 00000", note: "numéro d'exemple, non attribué" },
  { label: "TVA intracommunautaire", value: "FR00 000000000", note: "numéro d'exemple, non attribué" },
];

export default function LegalNoticePage() {
  return (
    <>
      <section className="relative overflow-hidden px-[clamp(1.25rem,4vw,3.5rem)] pb-[clamp(5rem,12vh,8rem)] pt-[clamp(9rem,18vh,12rem)]">
        <TechBackdrop variant="quiet" particles={false} />

        <div className="mx-auto max-w-[900px]">
          <p className="nx-eyebrow mb-6">Informations légales</p>
          <h1 className="text-[length:var(--text-display-l)] font-medium leading-[0.98] tracking-[-0.035em] text-nx-black">
            Mentions légales
          </h1>
          <p className="mt-6 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-nx-black/45">
            Dernière mise à jour : 31 août 2026
          </p>

          {/* Placed before the content, not after: the reader has to know this
              is a demonstration before reading anything that looks official. */}
          <div className="mt-10 rounded-[1.5rem] border border-nx-blue/40 border-l-[3px] border-l-nx-blue bg-nx-white/60 px-7 py-6">
            <p className="text-[length:var(--text-body-m)] leading-[1.7] text-nx-black">
              <strong className="font-medium">Site de démonstration —</strong> Nexora est une
              boutique fictive. Aucune commande n&apos;est réellement traitée et les informations
              légales ci-dessous sont fournies à titre d&apos;exemple.
            </p>
          </div>

          <div className="mt-14 space-y-14">
            <section>
              <h2 className="mb-7 text-[clamp(1.3rem,2.2vw,1.7rem)] font-medium tracking-[-0.02em] text-nx-black">
                Éditeur du site
              </h2>
              <dl className="space-y-6">
                {FACTS.map((fact) => (
                  <div key={fact.label}>
                    <dt className="nx-eyebrow mb-2 text-nx-black/45">{fact.label}</dt>
                    <dd className="text-[length:var(--text-body-m)] leading-[1.7] text-nx-black">
                      {fact.value}{" "}
                      <span className="text-nx-black/45">— {fact.note}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="border-t border-nx-black/10 pt-12">
              <h2 className="mb-5 text-[clamp(1.3rem,2.2vw,1.7rem)] font-medium tracking-[-0.02em] text-nx-black">
                Directeur de la publication
              </h2>
              <p className="text-[length:var(--text-body-m)] leading-[1.7] text-nx-black/70">
                Le représentant légal de Nexora{" "}
                <span className="text-nx-black/45">— personne fictive</span>.
              </p>
            </section>

            <section className="border-t border-nx-black/10 pt-12">
              <h2 className="mb-5 text-[clamp(1.3rem,2.2vw,1.7rem)] font-medium tracking-[-0.02em] text-nx-black">
                Hébergeur
              </h2>
              <p className="mb-5 text-[length:var(--text-body-m)] leading-[1.7] text-nx-black/70">
                Ce site de démonstration fonctionne en local et n&apos;est pas hébergé chez un
                prestataire commercial. Dans une mise en ligne réelle, cette section indiquerait la
                dénomination, l&apos;adresse et le numéro de téléphone de l&apos;hébergeur,
                conformément à l&apos;article 6 III de la loi n° 2004-575 du 21 juin 2004 pour la
                confiance dans l&apos;économie numérique.
              </p>
              <p className="nx-eyebrow mb-2 text-nx-black/45">Hébergeur</p>
              <p className="text-[length:var(--text-body-m)] leading-[1.7] text-nx-black">
                Hébergeur d&apos;exemple{" "}
                <span className="text-nx-black/45">— à remplacer par l&apos;hébergeur réel</span>
              </p>
            </section>

            <section className="border-t border-nx-black/10 pt-12">
              <h2 className="mb-5 text-[clamp(1.3rem,2.2vw,1.7rem)] font-medium tracking-[-0.02em] text-nx-black">
                Contact
              </h2>
              <p className="mb-4 text-[length:var(--text-body-m)] leading-[1.7] text-nx-black/70">
                Pour toute question relative au site :{" "}
                <a
                  href="mailto:contact@nexora.example"
                  className="text-nx-blue underline underline-offset-[3px]"
                >
                  contact@nexora.example
                </a>
                .
              </p>
              <p className="text-[length:var(--text-body-m)] leading-[1.7] text-nx-black/70">
                L&apos;extension <span className="font-mono text-[0.875em]">.example</span> est
                réservée par l&apos;IANA à la documentation : cette adresse ne peut recevoir aucun
                message. Elle est volontairement inutilisable pour éviter d&apos;exposer une adresse
                réelle sur un site de démonstration.
              </p>
            </section>

            <section className="border-t border-nx-black/10 pt-12">
              <h2 className="mb-5 text-[clamp(1.3rem,2.2vw,1.7rem)] font-medium tracking-[-0.02em] text-nx-black">
                Produits et marques citées
              </h2>
              <p className="text-[length:var(--text-body-m)] leading-[1.7] text-nx-black/70">
                Les produits et marques présentés (Apple, Sony, Sennheiser, Bang &amp; Olufsen,
                Keychron et autres) appartiennent à leurs détenteurs respectifs et sont cités à
                titre illustratif dans le cadre de cette démonstration. Nexora n&apos;entretient
                aucune relation commerciale avec eux.
              </p>
            </section>

            <section className="border-t border-nx-black/10 pt-12">
              <h2 className="mb-5 text-[clamp(1.3rem,2.2vw,1.7rem)] font-medium tracking-[-0.02em] text-nx-black">
                Données personnelles
              </h2>
              <p className="text-[length:var(--text-body-m)] leading-[1.7] text-nx-black/70">
                Le tunnel de commande collecte des données personnelles. Leur traitement est détaillé
                dans la{" "}
                <Link
                  href="/confidentialite"
                  className="text-nx-blue underline underline-offset-[3px]"
                >
                  politique de confidentialité
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
