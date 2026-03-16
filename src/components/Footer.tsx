import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-3xl font-bold text-gradient font-arabic mb-4">رفقة</h3>
            <p className="text-teal-100/70 text-sm leading-relaxed">
              رعاية طبية متميزة في منزلك. نوفر أفضل الكوادر الطبية والتمريضية لخدمتك أنت وعائلتك.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-secondary-foreground mb-4">روابط سريعة</h4>
            <ul className="space-y-3">
              {["الرئيسية", "خدماتنا", "المتجر الطبي", "لماذا رفقة؟", "احجز خدمتك"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-teal-100/60 hover:text-teal-100 transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-secondary-foreground mb-4">خدماتنا</h4>
            <ul className="space-y-3">
              {["تمريض منزلي", "طبيب منزلي", "علاج طبيعي", "تحاليل منزلية", "أجهزة طبية"].map((s) => (
                <li key={s}>
                  <a href="#services" className="text-sm text-teal-100/60 hover:text-teal-100 transition-colors">{s}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-secondary-foreground mb-4">تواصل معنا</h4>
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
                المملكة العربية السعودية
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-forest-500/20 text-center">
          <p className="text-sm text-teal-100/50">
            © {new Date().getFullYear()} رفقة | Refqah. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
