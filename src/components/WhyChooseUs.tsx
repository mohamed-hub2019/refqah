import { motion } from "framer-motion";
import { Shield, Clock, Award, HeartHandshake } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "كوادر معتمدة",
    description: "جميع الكوادر الطبية والتمريضية مرخصة ومعتمدة من الجهات الصحية المختصة.",
  },
  {
    icon: Clock,
    title: "متاحون 24/7",
    description: "خدماتنا متوفرة على مدار الساعة طوال أيام الأسبوع لراحة بالك.",
  },
  {
    icon: Award,
    title: "جودة عالية",
    description: "نلتزم بأعلى معايير الجودة في تقديم الخدمات الطبية المنزلية.",
  },
  {
    icon: HeartHandshake,
    title: "رعاية إنسانية",
    description: "نؤمن بأن الرعاية الطبية تبدأ بلمسة حانية واهتمام صادق بالمريض.",
  },
];

const WhyChooseUs = () => {
  return (
    <section id="why-us" className="py-20 md:py-28 bg-secondary">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-teal-100 text-sm font-semibold mb-4">
            لماذا رفقة؟
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-foreground font-arabic mb-4">
            نضع ثقتك في المقام الأول
          </h2>
          <p className="text-teal-100/70 text-lg max-w-2xl mx-auto">
            لأن صحة عائلتك أمانة، نحرص على تقديم أفضل مستوى من الرعاية
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center p-8 rounded-3xl bg-forest-700/50 border border-forest-500/20 backdrop-blur-sm"
            >
              <div className="w-16 h-16 mx-auto bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                <feature.icon className="w-8 h-8 text-teal-100" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-secondary-foreground mb-3 font-arabic">{feature.title}</h3>
              <p className="text-teal-100/70 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
