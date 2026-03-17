import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const HeroSection = () => {
  const { t, lang } = useLanguage();
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt={t("hero.imgAlt")}
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className={`absolute inset-0 ${lang === "ar" ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-forest-900/90 via-forest-800/70 to-transparent`} />
      </div>

      <div className="relative container mx-auto px-4 md:px-8">
        <div className={`max-w-2xl ${lang === "ar" ? "mr-auto text-right" : "ml-auto text-left"}`}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-teal-100 text-sm font-medium mb-6 backdrop-blur-sm">
              {t("hero.badge")}
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 text-primary-foreground font-arabic tracking-tight">
              {t("hero.title1")}
              <br />
              <span className="text-gradient">{t("hero.title2")}</span> {t("hero.title3")}
            </h1>

            <p className={`text-lg md:text-xl leading-relaxed text-teal-100/80 mb-8 max-w-lg ${lang === "ar" ? "mr-0 ml-auto" : "ml-0 mr-auto"}`}>
              {t("hero.desc")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className={`flex flex-col sm:flex-row gap-4 ${lang === "ar" ? "justify-end" : "justify-start"}`}
          >
            <Button variant="hero" size="xl" asChild>
              <a href="#booking" className="gap-3">
                {t("hero.bookVisit")}
                <Arrow className="w-5 h-5" />
              </a>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <a href="#shop" className="gap-3">
                <ShoppingBag className="w-5 h-5" />
                {t("hero.browseEquipment")}
              </a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className={`flex gap-8 mt-12 ${lang === "ar" ? "justify-end" : "justify-start"}`}
          >
            {[
              { number: "+5", label: t("hero.stat.years") },
              { number: "98%", label: t("hero.stat.satisfaction") },
              { number: "24/7", label: t("hero.stat.support") },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary-foreground tabular-nums">{stat.number}</div>
                <div className="text-sm text-teal-100/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
