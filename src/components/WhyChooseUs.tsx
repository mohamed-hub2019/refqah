import { motion } from "framer-motion";
import { Shield, Clock, Award, HeartHandshake } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const WhyChooseUs = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Shield, titleKey: "whyUs.certified", descKey: "whyUs.certifiedDesc" },
    { icon: Clock, titleKey: "whyUs.available", descKey: "whyUs.availableDesc" },
    { icon: Award, titleKey: "whyUs.quality", descKey: "whyUs.qualityDesc" },
    { icon: HeartHandshake, titleKey: "whyUs.humanCare", descKey: "whyUs.humanCareDesc" },
  ];

  return (
    <section id="why-us" className="py-20 md:py-28 bg-secondary">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-teal-100 text-sm font-semibold mb-4">
            {t("whyUs.badge")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-foreground font-arabic mb-4">
            {t("whyUs.title")}
          </h2>
          <p className="text-teal-100/70 text-lg max-w-2xl mx-auto">
            {t("whyUs.desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center p-8 rounded-3xl bg-forest-700/50 border border-forest-500/20 backdrop-blur-sm"
            >
              <div className="w-16 h-16 mx-auto bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                <feature.icon className="w-8 h-8 text-teal-100" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-secondary-foreground mb-3 font-arabic">{t(feature.titleKey)}</h3>
              <p className="text-teal-100/70 text-sm leading-relaxed">{t(feature.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
