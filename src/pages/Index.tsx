import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import MedicalShop from "@/components/MedicalShop";
import BookingSection from "@/components/BookingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

const IndexContent = () => {
  const { dir, lang } = useLanguage();
  return (
    <div dir={dir} className={lang === "ar" ? "font-arabic" : "font-sans"}>
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <MedicalShop />
      <WhyChooseUs />
      <TestimonialsSection />
      <BookingSection />
      <Footer />
    </div>
  );
};

const Index = () => (
  <LanguageProvider>
    <IndexContent />
  </LanguageProvider>
);

export default Index;
