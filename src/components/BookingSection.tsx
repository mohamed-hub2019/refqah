import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const BookingSection = () => {
  const [selectedService, setSelectedService] = useState("");
  const { t } = useLanguage();

  const serviceKeys = [
    "booking.homeNursing", "booking.homeDoctor", "booking.nursingAssistant",
    "booking.elderlyCompanion", "booking.physiotherapy", "booking.homeLab", "booking.medicalEquipment",
  ];

  const cityKeys = ["booking.riyadh", "booking.jeddah", "booking.dammam", "booking.makkah", "booking.madinah"];

  return (
    <section id="booking" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-primary text-sm font-semibold mb-4">
              {t("booking.badge")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary font-arabic mb-4">
              {t("booking.title")}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t("booking.desc")}
            </p>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-3xl shadow-elevated p-8 md:p-10 space-y-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">{t("booking.fullName")}</label>
                <input
                  type="text"
                  placeholder={t("booking.fullNamePlaceholder")}
                  className="w-full px-4 py-3 rounded-2xl bg-muted border-0 text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">{t("booking.phone")}</label>
                <input
                  type="tel"
                  placeholder={t("booking.phonePlaceholder")}
                  dir="ltr"
                  className="w-full px-4 py-3 rounded-2xl bg-muted border-0 text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary outline-none transition-all tabular-nums text-right"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{t("booking.service")}</label>
              <div className="flex flex-wrap gap-2">
                {serviceKeys.map((key) => {
                  const label = t(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedService(key)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        selectedService === key
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">{t("booking.city")}</label>
                <select className="w-full px-4 py-3 rounded-2xl bg-muted border-0 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all appearance-none">
                  <option value="">{t("booking.selectCity")}</option>
                  {cityKeys.map((key) => (
                    <option key={key}>{t(key)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">{t("booking.date")}</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 rounded-2xl bg-muted border-0 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{t("booking.notes")}</label>
              <textarea
                rows={3}
                placeholder={t("booking.notesPlaceholder")}
                className="w-full px-4 py-3 rounded-2xl bg-muted border-0 text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
              />
            </div>

            <Button variant="cta" size="xl" className="w-full" type="submit">
              <Send className="w-5 h-5" />
              {t("booking.submit")}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
