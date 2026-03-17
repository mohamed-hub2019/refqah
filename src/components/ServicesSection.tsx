import { motion } from "framer-motion";
import {
  Heart, Stethoscope, Dumbbell, TestTubes, UserCheck, ShoppingCart, Users,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ServicesSection = () => {
  const { t, lang } = useLanguage();

  const services = [
    { icon: Heart, title: t("services.homeNursing"), titleEn: "Home Nursing", desc: t("services.homeNursingDesc") },
    { icon: Stethoscope, title: t("services.homeDoctor"), titleEn: "Home Doctor Visit", desc: t("services.homeDoctorDesc") },
    { icon: Users, title: t("services.nursingAssistant"), titleEn: "Nursing Assistant", desc: t("services.nursingAssistantDesc") },
    { icon: UserCheck, title: t("services.elderlyCompanion"), titleEn: "Elderly Companion", desc: t("services.elderlyCompanionDesc") },
    { icon: Dumbbell, title: t("services.physiotherapy"), titleEn: "Physiotherapy", desc: t("services.physiotherapyDesc") },
    { icon: TestTubes, title: t("services.homeLab"), titleEn: "Home Lab Tests", desc: t("services.homeLabDesc") },
    { icon: ShoppingCart, title: t("services.medicalEquipment"), titleEn: "Medical Equipment", desc: t("services.medicalEquipmentDesc") },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const } },
  };

  return (
    <section id="services" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-primary text-sm font-semibold mb-4">
            {t("services.badge")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary font-arabic mb-4">
            {t("services.title")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("services.desc")}
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={item}
              className="group p-6 md:p-8 bg-card rounded-3xl shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer"
            >
              <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center mb-5 group-hover:bg-teal-100 transition-colors duration-300">
                <service.icon className="w-7 h-7 text-primary" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-1 font-arabic">{service.title}</h3>
              {lang === "ar" && <p className="text-xs text-muted-foreground mb-3 font-sans">{service.titleEn}</p>}
              <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
              <a href="#booking" className={`inline-flex items-center gap-2 mt-4 text-sm font-semibold text-primary hover:gap-3 transition-all duration-200`}>
                {t("services.bookNow")}
                <span className="text-lg">{lang === "ar" ? "←" : "→"}</span>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
