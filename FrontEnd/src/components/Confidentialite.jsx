import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Confidentialite() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 mt-16 max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Politique de Confidentialité</h1>
          <p className="text-sm text-gray-400 mb-8">Dernière mise à jour : juin 2026</p>

          <Section title="1. Introduction">
            ArtiPro accorde une grande importance à la protection de vos données personnelles. Cette politique explique quelles données nous collectons, comment nous les utilisons et quels sont vos droits.
          </Section>

          <Section title="2. Données collectées">
            Lors de votre inscription et utilisation de la plateforme, nous collectons les données suivantes : nom et prénom, adresse email, numéro de téléphone (optionnel), wilaya de résidence, informations professionnelles pour les artisans (entreprise, SIRET/RC, expérience), et les contenus que vous publiez (demandes, offres, messages, avis).
          </Section>

          <Section title="3. Finalités du traitement">
            Vos données sont utilisées pour gérer votre compte et votre accès à la plateforme, mettre en relation clients et artisans, envoyer des notifications liées à votre activité sur la plateforme, améliorer nos services, et respecter nos obligations légales.
          </Section>

          <Section title="4. Partage des données">
            Vos données ne sont jamais vendues à des tiers. Certaines informations de votre profil (nom, wilaya, catégories, note) sont visibles par les autres utilisateurs dans le cadre du fonctionnement normal de la plateforme. Nous pouvons partager vos données avec des prestataires techniques dans le strict cadre de nos services.
          </Section>

          <Section title="5. Conservation des données">
            Vos données sont conservées pendant toute la durée de votre inscription sur la plateforme, et supprimées dans un délai de 30 jours après la clôture de votre compte, sauf obligation légale de conservation plus longue.
          </Section>

          <Section title="6. Sécurité">
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou divulgation, notamment le chiffrement des mots de passe et des connexions sécurisées (HTTPS).
          </Section>

          <Section title="7. Vos droits">
            Conformément à la législation algérienne sur la protection des données, vous disposez des droits suivants : droit d'accès à vos données, droit de rectification, droit à l'effacement, droit d'opposition au traitement. Pour exercer ces droits, contactez-nous à : privacy@artipro.dz
          </Section>

          <Section title="8. Cookies">
            La plateforme utilise des cookies techniques nécessaires à son fonctionnement (session d'authentification). Aucun cookie publicitaire ou de tracking n'est utilisé.
          </Section>

          <Section title="9. Contact">
            Pour toute question relative à cette politique, contactez notre délégué à la protection des données à : privacy@artipro.dz
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
