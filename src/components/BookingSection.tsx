import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

const services = [
  "تمريض منزلي",
  "طبيب منزلي",
  "مساعد تمريض",
  "جليس مسنين",
  "علاج طبيعي",
  "تحاليل منزلية",
  "أجهزة طبية",
];

const BookingSection = () => {
  const [selectedService, setSelectedService] = useState("");

  return (
    <section id="booking" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-primary text-sm font-semibold mb-4">
              احجز خدمتك
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary font-arabic mb-4">
              ابدأ رحلة الرعاية الآن
            </h2>
            <p className="text-muted-foreground text-lg">
              املأ النموذج وسنتواصل معك خلال دقائق
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
                <label className="block text-sm font-semibold text-foreground mb-2">الاسم الكامل</label>
                <input
                  type="text"
                  placeholder="أدخل اسمك الكامل"
                  className="w-full px-4 py-3 rounded-2xl bg-muted border-0 text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">رقم الجوال</label>
                <input
                  type="tel"
                  placeholder="05XXXXXXXX"
                  dir="ltr"
                  className="w-full px-4 py-3 rounded-2xl bg-muted border-0 text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary outline-none transition-all tabular-nums text-right"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">الخدمة المطلوبة</label>
              <div className="flex flex-wrap gap-2">
                {services.map((service) => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => setSelectedService(service)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedService === service
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">المدينة</label>
                <select className="w-full px-4 py-3 rounded-2xl bg-muted border-0 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all appearance-none">
                  <option value="">اختر المدينة</option>
                  <option>الرياض</option>
                  <option>جدة</option>
                  <option>الدمام</option>
                  <option>مكة المكرمة</option>
                  <option>المدينة المنورة</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">التاريخ المفضل</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 rounded-2xl bg-muted border-0 text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">ملاحظات إضافية</label>
              <textarea
                rows={3}
                placeholder="أخبرنا بتفاصيل حالتك أو أي متطلبات خاصة..."
                className="w-full px-4 py-3 rounded-2xl bg-muted border-0 text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
              />
            </div>

            <Button variant="cta" size="xl" className="w-full" type="submit">
              <Send className="w-5 h-5" />
              ابدأ رحلة الرعاية
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
