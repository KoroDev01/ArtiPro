import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function CGU() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 mt-16 max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Conditions Générales d'Utilisation</h1>
          <p className="text-sm text-gray-400 mb-8">Dernière mise à jour : juin 2026</p>

          <Section title="1. Objet">
            Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme ArtiPro, accessible à l'adresse artipro.dz, qui met en relation des clients particuliers avec des artisans professionnels en Algérie.
          </Section>

          <Section title="2. Acceptation des conditions">
            En accédant à la plateforme, vous acceptez sans réserve les présentes CGU. Si vous n'acceptez pas ces conditions, vous devez cesser d'utiliser la plateforme immédiatement.
          </Section>

          <Section title="3. Inscription et comptes">
            Pour accéder aux fonctionnalités complètes de la plateforme, vous devez créer un compte. Vous vous engagez à fournir des informations exactes, complètes et à jour. Vous êtes responsable de la confidentialité de vos identifiants de connexion. Tout compte artisan doit être validé par notre équipe avant activation.
          </Section>

          <Section title="4. Utilisation de la plateforme">
            La plateforme ArtiPro permet aux clients de publier des demandes de travaux et aux artisans d'y répondre par des offres. ArtiPro agit uniquement en tant qu'intermédiaire et n'est pas partie prenante des contrats conclus entre clients et artisans.
          </Section>

          <Section title="5. Obligations des utilisateurs">
            Vous vous engagez à ne pas utiliser la plateforme à des fins illicites, à ne pas publier de contenu faux ou trompeur, à ne pas harceler d'autres utilisateurs, et à respecter les droits de tiers. Tout manquement peut entraîner la suspension ou la suppression de votre compte.
          </Section>

          <Section title="6. Responsabilité">
            ArtiPro ne peut être tenu responsable des dommages résultant de l'utilisation de la plateforme, des relations contractuelles entre clients et artisans, ou des contenus publiés par les utilisateurs. La plateforme est fournie "en l'état" sans garantie d'aucune sorte.
          </Section>

          <Section title="7. Propriété intellectuelle">
            L'ensemble des éléments de la plateforme (logo, design, contenus) est protégé par le droit de la propriété intellectuelle. Toute reproduction sans autorisation est interdite.
          </Section>

          <Section title="8. Modification des CGU">
            ArtiPro se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés des modifications par notification sur la plateforme. La poursuite de l'utilisation après modification vaut acceptation des nouvelles conditions.
          </Section>

          <Section title="9. Droit applicable">
            Les présentes CGU sont soumises au droit algérien. Tout litige sera soumis à la compétence des tribunaux compétents d'Alger.
          </Section>

          <Section title="10. Contact">
            Pour toute question relative aux présentes CGU, vous pouvez nous contacter à : contact@artipro.dz
          </Section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-7">
      <h2 className="text-base font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-sm text-gray-600 leading-relaxed">{children}</p>
    </div>
  );
}
