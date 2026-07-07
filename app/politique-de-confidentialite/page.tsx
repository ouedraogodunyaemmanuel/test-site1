import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { ACompleter } from "@/components/legal/ACompleter";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Deo Création",
};

export default function PagePolitiqueDeConfidentialite() {
  return (
    <LegalPage title="Politique de confidentialité">
      <LegalSection title="1. Responsable du traitement">
        <p>
          Ouédraogo Dünya-Emmanuel, exploitant la raison individuelle « Deo
          Création », est responsable du traitement des données décrites
          ci-dessous.
        </p>
        <p>
          Contact : <ACompleter>adresse e-mail de contact</ACompleter>
        </p>
      </LegalSection>

      <LegalSection title="2. Données collectées">
        <p>
          Le contenu de votre panier (photos, formats, finitions, cadres
          choisis) est enregistré uniquement dans la mémoire locale de votre
          navigateur (« localStorage ») et n&apos;est transmis à aucun
          serveur tant que vous n&apos;initiez pas un paiement.
        </p>
        <p>
          Au moment du paiement, vos coordonnées et informations de paiement
          sont saisies directement sur la page sécurisée de notre
          prestataire Stripe et ne transitent jamais par nos propres
          serveurs.
        </p>
      </LegalSection>

      <LegalSection title="3. Finalité du traitement">
        <p>
          Les données transmises lors d&apos;un paiement sont utilisées
          exclusivement pour traiter, exécuter et livrer votre commande.
        </p>
      </LegalSection>

      <LegalSection title="4. Destinataires des données">
        <p>
          <strong>Stripe</strong> (prestataire de paiement) traite les
          données de paiement pour notre compte, selon sa propre politique
          de confidentialité.
        </p>
        <p>
          Le site est hébergé par{" "}
          <ACompleter>nom de l&apos;hébergeur, ex. Vercel</ACompleter>.
        </p>
      </LegalSection>

      <LegalSection title="5. Durée de conservation">
        <p>
          <ACompleter>
            durée de conservation des données de commande, ex. durée légale
            de conservation comptable
          </ACompleter>
        </p>
      </LegalSection>

      <LegalSection title="6. Vos droits">
        <p>
          Conformément à la loi fédérale sur la protection des données
          (LPD), vous disposez d&apos;un droit d&apos;accès, de
          rectification et de suppression des données vous concernant. Pour
          exercer ces droits, contactez-nous à{" "}
          <ACompleter>adresse e-mail de contact</ACompleter>.
        </p>
      </LegalSection>

      <LegalSection title="7. Cookies et stockage local">
        <p>
          Ce site n&apos;utilise pas de cookies de suivi publicitaire. Il
          utilise uniquement le stockage local de votre navigateur pour
          mémoriser le contenu de votre panier entre deux visites.
        </p>
      </LegalSection>

      <LegalSection title="8. Sécurité">
        <p>
          Le site est servi en connexion chiffrée (HTTPS). Les paiements
          sont traités par Stripe, certifié selon la norme de sécurité
          PCI-DSS.
        </p>
      </LegalSection>

      <LegalSection title="9. Modification de cette politique">
        <p>
          Cette politique peut être mise à jour ; la version en vigueur est
          toujours celle publiée sur cette page.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
