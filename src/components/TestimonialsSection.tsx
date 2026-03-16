import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "أم عبدالله",
    role: "عميلة - خدمة التمريض المنزلي",
    content: "رفقة غيّرت حياتنا. الممرضة التي أرسلوها لوالدتي كانت محترفة وحنونة، شعرنا بالأمان لأول مرة منذ مرض أمي.",
    rating: 5,
  },
  {
    name: "أبو محمد",
    role: "عميل - العلاج الطبيعي",
    content: "بعد عملية الركبة كنت قلقاً من التأهيل، لكن فريق رفقة للعلاج الطبيعي كان ممتازاً. استعدت حركتي بفضل الله ثم بفضلهم.",
    rating: 5,
  },
  {
    name: "سارة أحمد",
    role: "عميلة - جليس مسنين",
    content: "خدمة جليس المسنين كانت مريحة جداً. أصبحت أذهب لعملي وأنا مطمئنة على والدي. شكراً رفقة!",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 md:py-28 bg-muted">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-primary text-sm font-semibold mb-4">
            آراء عملائنا
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary font-arabic mb-4">
            ثقتكم تسعدنا
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card rounded-3xl shadow-card p-8"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground leading-relaxed mb-6 text-sm">"{t.content}"</p>
              <div>
                <div className="font-bold text-secondary font-arabic">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
