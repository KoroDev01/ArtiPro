import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PageBanner from "../../components/PageBanner";
import ShowroomGallery from "../../components/ShowroomGallery";
import { useAuth } from "../../context/AuthContext";

export default function Showroom() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const artisanId = searchParams.get("artisan");
  const [publishOpen, setPublishOpen] = useState(false);
  const publishRef = useRef(null);

  const canPost =
    user?.role === "pro" && user?.proStatus === "approved";

  const openPublish = () => {
    setPublishOpen(true);
    setTimeout(
      () => publishRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      100,
    );
  };

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
        action={
          canPost ? (
            <button
              type="button"
              onClick={openPublish}
              className="btn-primary inline-flex items-center gap-2">
              <FiPlus size={18} />
              Publier une réalisation
            </button>
          ) : user?.role === "pro" ? (
            <span className="text-xs text-amber-400 sm:text-sm">
              Compte en attente de validation
            </span>
          ) : null
        }
      />

      <main className="page-main max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 md:px-8">
        <ShowroomGallery
          publishOpen={publishOpen}
          setPublishOpen={setPublishOpen}
          publishRef={publishRef}
        />
      </main>

      <Footer />
    </div>
  );
}
