import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const MedicalShop = () => {
  const { t } = useLanguage();

  const products = [
    { nameKey: "shop.product.electricWheelchair", categoryKey: "shop.wheelchairs", rentPrice: "500", buyPrice: "4,500", image: "🦽" },
    { nameKey: "shop.product.oxygenConcentrator", categoryKey: "shop.respiratory", rentPrice: "300", buyPrice: "3,200", image: "🫁" },
    { nameKey: "shop.product.hospitalBed", categoryKey: "shop.beds", rentPrice: "400", buyPrice: "5,800", image: "🛏️" },
    { nameKey: "shop.product.bpMonitor", categoryKey: "shop.dailySupplies", rentPrice: null, buyPrice: "180", image: "💉" },
  ];

  const categories = ["shop.all", "shop.wheelchairs", "shop.respiratory", "shop.beds", "shop.dailySupplies"];

  return (
    <section id="shop" className="py-20 md:py-28 bg-muted">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-primary text-sm font-semibold mb-4">
            {t("shop.badge")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary font-arabic mb-4">
            {t("shop.title")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("shop.desc")}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              className="px-5 py-2 rounded-full text-sm font-medium bg-card text-muted-foreground shadow-card hover:shadow-card-hover hover:text-primary transition-all duration-200 first:bg-primary first:text-primary-foreground"
            >
              {t(cat)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.nameKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-card rounded-3xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
            >
              <div className="h-48 bg-accent flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300 will-change-transform">
                {product.image}
              </div>
              <div className="p-6">
                <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">{t(product.categoryKey)}</span>
                <h3 className="text-lg font-bold text-secondary mt-3 mb-4 font-arabic">{t(product.nameKey)}</h3>
                <div className="flex items-center gap-3 mb-4">
                  {product.rentPrice && (
                    <div className="flex-1 text-center p-2 rounded-xl bg-accent">
                      <div className="text-xs text-muted-foreground">{t("shop.rentMonth")}</div>
                      <div className="text-lg font-bold text-primary tabular-nums">{product.rentPrice} <span className="text-xs">{t("shop.currency")}</span></div>
                    </div>
                  )}
                  <div className="flex-1 text-center p-2 rounded-xl bg-accent">
                    <div className="text-xs text-muted-foreground">{t("shop.buy")}</div>
                    <div className="text-lg font-bold text-secondary tabular-nums">{product.buyPrice} <span className="text-xs">{t("shop.currency")}</span></div>
                  </div>
                </div>
                <Button variant="cta" size="default" className="w-full">
                  {t("shop.orderNow")}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MedicalShop;
