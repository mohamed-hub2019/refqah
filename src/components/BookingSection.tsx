import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, ChevronDown, ChevronUp, Phone, MessageCircle, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const BookingSection = () => {
  const { t } = useLanguage();
  const [selectedService, setSelectedService] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [consent, setConsent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const serviceKeys = [
    "booking.homeNursing", "booking.homeDoctor", "booking.nursingAssistant",
    "booking.elderlyCompanion", "booking.physiotherapy", "booking.homeLab", "booking.medicalEquipment",
  ];

  const timeKeys = [
    { key: "booking.timeSoon", value: "soon" },
    { key: "booking.timeMorning", value: "morning" },
    { key: "booking.timeAfternoon", value: "afternoon" },
    { key: "booking.timeEvening", value: "evening" },
  ];

  const contactMethods = [
    { key: "booking.contactCall", value: "call" },
    { key: "booking.contactWhatsapp", value: "whatsapp" },
    { key: "booking.contactBoth", value: "both" },
  ];

  const faqs = [
    { q: "booking.faq.q1", a: "booking.faq.a1" },
    { q: "booking.faq.q2", a: "booking.faq.a2" },
    { q: "booking.faq.q3", a: "booking.faq.a3" },
  ];

  const tips = ["booking.tips.1", "booking.tips.2", "booking.tips.3"];

  return (
    <section id="booking" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
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

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Form - 2 cols */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 bg-card rounded-3xl shadow-elevated p-8 md:p-10 space-y-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <h3 className="text-xl font-bold text-foreground mb-2">{t("booking.formTitle")}</h3>

            {/* Name + Phone */}
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

            {/* Email + Contact Method */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">{t("booking.email")}</label>
                <input
                  type="email"
                  placeholder={t("booking.emailPlaceholder")}
                  dir="ltr"
                  className="w-full px-4 py-3 rounded-2xl bg-muted border-0 text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary outline-none transition-all text-right"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">{t("booking.contactMethod")}</label>
                <select
                  value={contactMethod}
                  onChange={(e) => setContactMethod(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-muted border-0 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all appearance-none"
                >
                  <option value="">{t("booking.contactCall")}</option>
                  {contactMethods.map((m) => (
                    <option key={m.value} value={m.value}>{t(m.key)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Service + Preferred Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">{t("booking.service")}</label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-muted border-0 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all appearance-none"
                >
                  <option value="">{t("booking.selectService")}</option>
                  {serviceKeys.map((key) => (
                    <option key={key} value={key}>{t(key)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">{t("booking.preferredTime")}</label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-muted border-0 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all appearance-none"
                >
                  {timeKeys.map((tk) => (
                    <option key={tk.value} value={tk.value}>{t(tk.key)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* City/Area + Short Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">{t("booking.cityArea")}</label>
                <input
                  type="text"
                  placeholder={t("booking.cityAreaPlaceholder")}
                  className="w-full px-4 py-3 rounded-2xl bg-muted border-0 text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">{t("booking.shortAddress")}</label>
                <input
                  type="text"
                  placeholder={t("booking.shortAddressPlaceholder")}
                  className="w-full px-4 py-3 rounded-2xl bg-muted border-0 text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            {/* Case Description */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{t("booking.caseDescription")}</label>
              <textarea
                rows={4}
                placeholder={t("booking.caseDescriptionPlaceholder")}
                className="w-full px-4 py-3 rounded-2xl bg-muted border-0 text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
              />
            </div>

            {/* Consent */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-2 border-muted-foreground/30 text-primary focus:ring-primary accent-primary"
              />
              <span className="text-sm text-muted-foreground leading-relaxed">{t("booking.consent")}</span>
            </label>

            <Button variant="cta" size="xl" className="w-full" type="submit" disabled={!consent}>
              <Send className="w-5 h-5" />
              {t("booking.submit")}
            </Button>
          </motion.form>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Tips */}
            <div className="bg-muted rounded-3xl p-6 space-y-4">
              <h4 className="text-lg font-bold text-foreground">{t("booking.tips.title")}</h4>
              <ul className="space-y-3">
                {tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {t(tip)}
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQ */}
            <div className="bg-muted rounded-3xl p-6 space-y-3">
              <h4 className="text-lg font-bold text-foreground">{t("booking.faq.title")}</h4>
              {faqs.map((faq, i) => (
                <div key={i}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between text-sm font-medium text-foreground py-2 hover:text-primary transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-primary">◆</span>
                      {t(faq.q)}
                    </span>
                    {openFaq === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openFaq === i && (
                    <p className="text-sm text-muted-foreground pb-2 ps-6 leading-relaxed">
                      {t(faq.a)}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Contact */}
            <div className="bg-muted rounded-3xl p-6 space-y-3">
              <h4 className="text-lg font-bold text-foreground">{t("booking.quickContact.title")}</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>{t("booking.quickContact.phone")}</span>
                  <span>{t("booking.quickContact.phoneValue")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  <span>{t("booking.quickContact.whatsapp")}</span>
                  <span>{t("booking.quickContact.whatsappValue")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{t("booking.quickContact.hours")}</span>
                  <span>{t("booking.quickContact.hoursValue")}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
