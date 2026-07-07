import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { ACompleter } from "@/components/shared/ACompleter";

export const metadata: Metadata = {
  title: "Conditions générales de vente — Deo Création",
};

export default function PageCGV() {
  return (
    <LegalPage title="Conditions générales de vente">
      <LegalSection title="1. Éditeur du site">
        <p>
          Le présent site est édité par Ouédraogo Dünya-Emmanuel, exploitant
          une raison individuelle non inscrite au registre du commerce sous
          le nom commercial « Deo Création ».
        </p>
        <p>
          Adresse : <ACompleter>adresse postale complète</ACompleter>
          <br />
          Contact : <ACompleter>adresse e-mail de contact</ACompleter>
        </p>
      </LegalSection>

      <LegalSection title="2. Objet">
        <p>
          Les présentes conditions régissent la vente en ligne de tirages
          photographiques d&apos;art (« les Produits »), personnalisables
          selon le format, la finition et le cadre choisis par le client,
          proposée sur ce site.
        </p>
      </LegalSection>

      <LegalSection title="3. Prix">
        <p>
          Les prix sont indiqués en francs suisses (CHF), toutes taxes
          comprises. Deo Création n&apos;étant pas assujetti à la TVA
          (chiffre d&apos;affaires inférieur au seuil légal), aucune TVA
          n&apos;est ajoutée aux prix affichés.{" "}
          <ACompleter>
            à mettre à jour si l&apos;activité devient assujettie à la TVA
          </ACompleter>
        </p>
      </LegalSection>

      <LegalSection title="4. Commande">
        <p>
          Le client sélectionne un tirage et personnalise son format, sa
          finition et son cadre, puis l&apos;ajoute à son panier. La commande
          est définitive au moment de la confirmation du paiement.
        </p>
      </LegalSection>

      <LegalSection title="5. Paiement">
        <p>
          Le paiement s&apos;effectue en ligne, par carte bancaire ou TWINT,
          via le prestataire de paiement Stripe. Deo Création ne stocke ni ne
          voit jamais les coordonnées bancaires du client : elles sont
          transmises directement et de façon chiffrée à Stripe.
        </p>
      </LegalSection>

      <LegalSection title="6. Livraison">
        <p>
          Délai de livraison : <ACompleter>délai indicatif, ex. 5-10 jours ouvrés</ACompleter>
          <br />
          Zone de livraison : <ACompleter>pays/régions livrés</ACompleter>
          <br />
          Frais de livraison : <ACompleter>montant ou mode de calcul</ACompleter>
        </p>
      </LegalSection>

      <LegalSection title="7. Rétractation et retours">
        <p>
          Le droit suisse n&apos;impose pas de délai légal de rétractation
          pour les achats en ligne (contrairement au droit européen).{" "}
          <ACompleter>
            décider et décrire ici une politique de retour volontaire si tu
            souhaites en offrir une (ex. retour possible sous 14 jours,
            produit non personnalisé et non endommagé)
          </ACompleter>
        </p>
      </LegalSection>

      <LegalSection title="8. Garantie">
        <p>
          Les tirages sont couverts par la garantie légale des défauts
          prévue par le droit suisse (art. 197 et suivants du Code des
          obligations). Tout défaut de fabrication doit être signalé dans un
          délai raisonnable après réception.
        </p>
      </LegalSection>

      <LegalSection title="9. Responsabilité">
        <p>
          Deo Création met tout en œuvre pour assurer l&apos;exactitude des
          informations présentées sur le site, sans garantir l&apos;absence
          totale d&apos;erreur. La responsabilité de Deo Création ne saurait
          être engagée en cas de force majeure ou de fait imprévisible et
          insurmontable d&apos;un tiers.
        </p>
      </LegalSection>

      <LegalSection title="10. Droit applicable et for">
        <p>
          Les présentes conditions sont soumises au droit suisse. Le for
          juridique exclusif est <ACompleter>lieu du for (canton/ville)</ACompleter>.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact">
        <p>
          Pour toute question relative à ces conditions ou à une commande :{" "}
          <ACompleter>adresse e-mail de contact</ACompleter>
        </p>
      </LegalSection>
    </LegalPage>
  );
}
