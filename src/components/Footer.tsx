import { Phone, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  const quickLinks = [
    { label: t("nav.home"), href: "#hero" },
    { label: t("nav.services"), href: "#services" },
    { label: t("nav.shop"), href: "#shop" },
    { label: t("nav.whyUs"), href: "#why-us" },
    { label: t("footer.bookService"), href: "#booking" },
  ];

  const serviceLinks = [
    "services.homeNursing", "services.homeDoctor", "services.physiotherapy",
    "services.homeLab", "services.medicalEquipment",
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <h3 className="text-3xl font-bold text-gradient font-arabic mb-4">رفقة</h3>
            <p className="text-teal-100/70 text-sm leading-relaxed">
              {t("footer.desc")}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-secondary-foreground mb-4">{t("footer.quickLinks")}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-teal-100/60 hover:text-teal-100 transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-secondary-foreground mb-4">{t("footer.ourServices")}</h4>
            <ul className="space-y-3">
              {serviceLinks.map((key) => (
                <li key={key}>
                  <a href="#services" className="text-sm text-teal-100/60 hover:text-teal-100 transition-colors">{t(key)}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-secondary-foreground mb-4">{t("footer.contactUs")}</h4>
            <div className="space-y-4">
              <a href="tel:+966500000000" className="flex items-center gap-3 text-sm text-teal-100/60 hover:text-teal-100 transition-colors">
                <Phone className="w-4 h-4" />
                <span className="tabular-nums">966 50 000 0000+</span>
              </a>
              <a href="mailto:info@refqah.com" className="flex items-center gap-3 text-sm text-teal-100/60 hover:text-teal-100 transition-colors">
                <Mail className="w-4 h-4" />
                info@refqah.com
              </a>
              <div className="flex items-center gap-3 text-sm text-teal-100/60">
                <MapPin className="w-4 h-4" />
                {t("footer.location")}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-forest-500/20 text-center">
          <p className="text-sm text-teal-100/50">
            © {new Date().getFullYear()} رفقة | Refqah. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
