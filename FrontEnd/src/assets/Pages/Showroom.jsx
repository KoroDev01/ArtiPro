import { useSearchParams } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PageBanner from "../../components/PageBanner";
import ShowroomGallery from "../../components/ShowroomGallery";

export default function Showroom() {
  const [searchParams] = useSearchParams();
  const artisanId = searchParams.get("artisan");

  return (
    <div className="page-wrap">
      <Header />

      <PageBanner
        title="Réalisations"
        subtitle={
          artisanId
            ? "Réalisations de l'artisan sélectionné"
            : "Découvrez les travaux réalisés par nos artisans professionnels"
        }
      />

      <main className="page-main max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 md:px-8">
        <ShowroomGallery />
      </main>

      <Footer />
    </div>
  );
}
