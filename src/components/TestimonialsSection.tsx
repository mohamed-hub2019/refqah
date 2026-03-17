import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const TestimonialsSection = () => {
  const { t } = useLanguage();

  const testimonials = [
    { nameKey: "testimonials.t1.name", roleKey: "testimonials.t1.role", contentKey: "testimonials.t1.content", rating: 5 },
    { nameKey: "testimonials.t2.name", roleKey: "testimonials.t2.role", contentKey: "testimonials.t2.content", rating: 5 },
    { nameKey: "testimonials.t3.name", roleKey: "testimonials.t3.role", contentKey: "testimonials.t3.content", rating: 5 },
  ];

  return (
    <section className="py-20 md:py-28 bg-muted">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-primary text-sm font-semibold mb-4">
            {t("testimonials.badge")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary font-arabic mb-4">
            {t("testimonials.title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.nameKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card rounded-3xl shadow-card p-8"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: item.rating }).map((_, j) => (
                  <Star key={j} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground leading-relaxed mb-6 text-sm">"{t(item.contentKey)}"</p>
              <div>
                <div className="font-bold text-secondary font-arabic">{t(item.nameKey)}</div>
                <div className="text-xs text-muted-foreground">{t(item.roleKey)}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
