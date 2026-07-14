import Header from "../../components/Header";
import Hero from "../../components/Hero";
import Services from "../../components/Services";
import HowItWork from "../../components/HowItWork";
import HomeFaq from "../../components/HomeFaq";
import StructuredData from "../../components/StructuredData";
import Footer from "../../components/Footer";

export default function Acceuil() {
  return (
    <>
      <StructuredData includeFaq />
      <Header />
      <main>
        <Hero />
        <Services />
        <HowItWork />
        <HomeFaq />
      </main>
      <Footer />
    </>
  );
}
