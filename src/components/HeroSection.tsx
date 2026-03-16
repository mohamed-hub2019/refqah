import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="ممرضة تقدم رعاية منزلية لمريضة مسنة"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-forest-900/90 via-forest-800/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 md:px-8">
        <div className="max-w-2xl mr-auto text-right">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-teal-100 text-sm font-medium mb-6 backdrop-blur-sm">
              خدمات طبية متميزة على مدار الساعة 24/7
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 text-primary-foreground font-arabic tracking-tight">
              رفقة.. رعاية طبية
              <br />
              <span className="text-gradient">بلمسة حانية</span> في منزلك
            </h1>

            <p className="text-lg md:text-xl leading-relaxed text-teal-100/80 mb-8 max-w-lg mr-0 ml-auto font-arabic">
              نوفر لك ولعائلتك نخبة من الكوادر الطبية والتمريضية لضمان حياة صحية آمنة دون الحاجة لمغادرة المنزل.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-end"
          >
            <Button variant="hero" size="xl" asChild>
              <a href="#booking" className="gap-3">
                احجز زيارة الآن
                <ArrowLeft className="w-5 h-5" />
              </a>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <a href="#shop" className="gap-3">
                <ShoppingBag className="w-5 h-5" />
                تصفح الأجهزة الطبية
              </a>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex gap-8 mt-12 justify-end"
          >
            {[
              { number: "+5", label: "سنوات خبرة" },
              { number: "98%", label: "رضا العملاء" },
              { number: "24/7", label: "دعم متواصل" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary-foreground tabular-nums">{stat.number}</div>
                <div className="text-sm text-teal-100/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
