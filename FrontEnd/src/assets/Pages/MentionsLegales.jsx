import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 mt-16 max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Mentions Légales</h1>
          <p className="text-sm text-gray-400 mb-8">Dernière mise à jour : juin 2026</p>

          <Section title="Éditeur de la plateforme">
            <Row label="Nom" value="ArtiPro" />
            <Row label="Forme juridique" value="SARL" />
            <Row label="Siège social" value="Alger, Algérie" />
            <Row label="Email" value="contact@artipro.dz" />
            <Row label="Directeur de publication" value="Équipe ArtiPro" />
          </Section>

          <Section title="Hébergement">
            <p className="text-sm text-gray-600 leading-relaxed">
              La plateforme ArtiPro est hébergée sur des serveurs situés en Algérie, conformément à la réglementation locale sur la protection des données personnelles.
            </p>
          </Section>

          <Section title="Propriété intellectuelle">
            <p className="text-sm text-gray-600 leading-relaxed">
              L'ensemble des contenus présents sur la plateforme ArtiPro (textes, images, logos, icônes, code source) est la propriété exclusive d'ArtiPro ou de ses partenaires et est protégé par les lois algériennes relatives à la propriété intellectuelle. Toute reproduction, distribution ou utilisation sans autorisation préalable est strictement interdite.
            </p>
          </Section>

          <Section title="Responsabilité">
            <p className="text-sm text-gray-600 leading-relaxed">
              ArtiPro met tout en œuvre pour assurer l'exactitude des informations diffusées sur la plateforme. Cependant, ArtiPro ne saurait être tenu responsable des erreurs ou omissions dans les contenus, ni des dommages directs ou indirects résultant de l'utilisation de la plateforme.
            </p>
          </Section>

          <Section title="Liens hypertextes">
            <p className="text-sm text-gray-600 leading-relaxed">
              La plateforme peut contenir des liens vers des sites tiers. ArtiPro n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
            </p>
          </Section>

          <Section title="Droit applicable">
            <p className="text-sm text-gray-600 leading-relaxed">
              Les présentes mentions légales sont régies par le droit algérien. En cas de litige, les tribunaux algériens seront seuls compétents.
            </p>
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
      <h2 className="text-base font-semibold text-gray-800 mb-3">{title}</h2>
      {children}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex gap-2 text-sm py-1.5 border-b border-gray-50">
      <span className="text-gray-400 w-40 flex-shrink-0">{label}</span>
      <span className="text-gray-700 font-medium">{value}</span>
    </div>
  );
}
