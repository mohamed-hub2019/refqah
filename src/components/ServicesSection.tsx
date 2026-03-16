import { motion } from "framer-motion";
import {
  Heart,
  Stethoscope,
  Dumbbell,
  TestTubes,
  UserCheck,
  ShoppingCart,
  Users,
} from "lucide-react";

const services = [
  {
    icon: Heart,
    title: "تمريض منزلي",
    titleEn: "Home Nursing",
    description: "رعاية تمريضية متخصصة (رجال/سيدات) للحالات الحرجة والمزمنة على مدار الساعة.",
  },
  {
    icon: Stethoscope,
    title: "طبيبك بالمنزل",
    titleEn: "Home Doctor Visit",
    description: "كشف طبي منزلي في مختلف التخصصات بأسرع وقت وبأعلى جودة.",
  },
  {
    icon: Users,
    title: "مساعد تمريض",
    titleEn: "Nursing Assistant",
    description: "مساعدون مدربون لتقديم الرعاية اليومية والدعم للمرضى.",
  },
  {
    icon: UserCheck,
    title: "جليس مسنين",
    titleEn: "Elderly Companion",
    description: "رفقة ورعاية متخصصة لكبار السن لضمان راحتهم وسلامتهم.",
  },
  {
    icon: Dumbbell,
    title: "العلاج الطبيعي",
    titleEn: "Physiotherapy",
    description: "برامج تأهيلية متكاملة لاستعادة الحركة والنشاط في بيئة مريحة.",
  },
  {
    icon: TestTubes,
    title: "المختبر المنزلي",
    titleEn: "Home Lab Tests",
    description: "سحب عينات التحاليل من المنزل وإرسال النتائج إلكترونياً بسرعة.",
  },
  {
    icon: ShoppingCart,
    title: "الأجهزة الطبية",
    titleEn: "Medical Equipment",
    description: "تأجير وبيع الأجهزة والمستلزمات الطبية بأفضل الأسعار.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const } },
};

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-primary text-sm font-semibold mb-4">
            خدماتنا
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary font-arabic mb-4">
            خدمات طبية شاملة في منزلك
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            نقدم مجموعة متكاملة من الخدمات الطبية والتمريضية المنزلية بأيدي كوادر مؤهلة ومعتمدة
          </p>
        </div>

        {/* Grid */}
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
              <p className="text-xs text-muted-foreground mb-3 font-sans">{service.titleEn}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
              <a href="#booking" className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-primary hover:gap-3 transition-all duration-200">
                احجز الآن
                <span className="text-lg">←</span>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
