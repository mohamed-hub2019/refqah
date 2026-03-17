import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "ar" | "en";

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
}

const translations: Record<string, Record<Lang, string>> = {
  // Navbar
  "nav.home": { ar: "الرئيسية", en: "Home" },
  "nav.services": { ar: "خدماتنا", en: "Services" },
  "nav.shop": { ar: "المتجر الطبي", en: "Medical Shop" },
  "nav.whyUs": { ar: "لماذا رفقة؟", en: "Why Refqah?" },
  "nav.contact": { ar: "تواصل معنا", en: "Contact Us" },
  "nav.bookNow": { ar: "احجز الآن", en: "Book Now" },

  // Hero
  "hero.badge": { ar: "خدمات طبية متميزة على مدار الساعة 24/7", en: "Premium Medical Services 24/7" },
  "hero.title1": { ar: "رفقة.. رعاية طبية", en: "Refqah.. Medical Care" },
  "hero.title2": { ar: "بلمسة حانية", en: "With a Gentle Touch" },
  "hero.title3": { ar: "في منزلك", en: "At Your Home" },
  "hero.desc": {
    ar: "نوفر لك ولعائلتك نخبة من الكوادر الطبية والتمريضية لضمان حياة صحية آمنة دون الحاجة لمغادرة المنزل.",
    en: "We provide you and your family with elite medical and nursing staff to ensure a healthy and safe life without leaving home.",
  },
  "hero.bookVisit": { ar: "احجز زيارة الآن", en: "Book a Visit Now" },
  "hero.browseEquipment": { ar: "تصفح الأجهزة الطبية", en: "Browse Medical Equipment" },
  "hero.stat.years": { ar: "سنوات خبرة", en: "Years Experience" },
  "hero.stat.satisfaction": { ar: "رضا العملاء", en: "Client Satisfaction" },
  "hero.stat.support": { ar: "دعم متواصل", en: "24/7 Support" },
  "hero.imgAlt": { ar: "ممرضة تقدم رعاية منزلية لمريضة مسنة", en: "Nurse providing home care to an elderly patient" },

  // Services
  "services.badge": { ar: "خدماتنا", en: "Our Services" },
  "services.title": { ar: "خدمات طبية شاملة في منزلك", en: "Comprehensive Medical Services at Your Home" },
  "services.desc": {
    ar: "نقدم مجموعة متكاملة من الخدمات الطبية والتمريضية المنزلية بأيدي كوادر مؤهلة ومعتمدة",
    en: "We offer a complete range of home medical and nursing services by qualified and certified professionals",
  },
  "services.bookNow": { ar: "احجز الآن", en: "Book Now" },
  "services.homeNursing": { ar: "تمريض منزلي", en: "Home Nursing" },
  "services.homeNursingDesc": { ar: "رعاية تمريضية متخصصة (رجال/سيدات) للحالات الحرجة والمزمنة على مدار الساعة.", en: "Specialized nursing care (male/female) for critical and chronic cases around the clock." },
  "services.homeDoctor": { ar: "طبيبك بالمنزل", en: "Home Doctor Visit" },
  "services.homeDoctorDesc": { ar: "كشف طبي منزلي في مختلف التخصصات بأسرع وقت وبأعلى جودة.", en: "Home medical consultation across various specialties quickly and with the highest quality." },
  "services.nursingAssistant": { ar: "مساعد تمريض", en: "Nursing Assistant" },
  "services.nursingAssistantDesc": { ar: "مساعدون مدربون لتقديم الرعاية اليومية والدعم للمرضى.", en: "Trained assistants to provide daily care and support for patients." },
  "services.elderlyCompanion": { ar: "جليس مسنين", en: "Elderly Companion" },
  "services.elderlyCompanionDesc": { ar: "رفقة ورعاية متخصصة لكبار السن لضمان راحتهم وسلامتهم.", en: "Specialized companionship and care for the elderly to ensure their comfort and safety." },
  "services.physiotherapy": { ar: "العلاج الطبيعي", en: "Physiotherapy" },
  "services.physiotherapyDesc": { ar: "برامج تأهيلية متكاملة لاستعادة الحركة والنشاط في بيئة مريحة.", en: "Comprehensive rehabilitation programs to restore mobility and activity in a comfortable environment." },
  "services.homeLab": { ar: "المختبر المنزلي", en: "Home Lab Tests" },
  "services.homeLabDesc": { ar: "سحب عينات التحاليل من المنزل وإرسال النتائج إلكترونياً بسرعة.", en: "Home sample collection and fast electronic delivery of results." },
  "services.medicalEquipment": { ar: "الأجهزة الطبية", en: "Medical Equipment" },
  "services.medicalEquipmentDesc": { ar: "تأجير وبيع الأجهزة والمستلزمات الطبية بأفضل الأسعار.", en: "Rental and sale of medical equipment and supplies at the best prices." },

  // Shop
  "shop.badge": { ar: "المتجر الطبي", en: "Medical Shop" },
  "shop.title": { ar: "أجهزة ومستلزمات طبية", en: "Medical Equipment & Supplies" },
  "shop.desc": { ar: "تأجير وبيع الأجهزة الطبية بأسعار منافسة مع خدمة توصيل وتركيب مجانية", en: "Rental and sale of medical equipment at competitive prices with free delivery and installation" },
  "shop.all": { ar: "الكل", en: "All" },
  "shop.wheelchairs": { ar: "كراسي متحركة", en: "Wheelchairs" },
  "shop.respiratory": { ar: "أجهزة تنفس", en: "Respiratory" },
  "shop.beds": { ar: "أسرّة طبية", en: "Medical Beds" },
  "shop.dailySupplies": { ar: "مستلزمات يومية", en: "Daily Supplies" },
  "shop.rentMonth": { ar: "إيجار/شهر", en: "Rent/Month" },
  "shop.buy": { ar: "شراء", en: "Buy" },
  "shop.orderNow": { ar: "اطلب الآن", en: "Order Now" },
  "shop.currency": { ar: "ج.م", en: "EGP" },
  "shop.product.electricWheelchair": { ar: "كرسي متحرك كهربائي", en: "Electric Wheelchair" },
  "shop.product.oxygenConcentrator": { ar: "جهاز أكسجين منزلي", en: "Home Oxygen Concentrator" },
  "shop.product.hospitalBed": { ar: "سرير طبي كهربائي", en: "Electric Hospital Bed" },
  "shop.product.bpMonitor": { ar: "جهاز قياس ضغط الدم", en: "Blood Pressure Monitor" },

  // Why Us
  "whyUs.badge": { ar: "لماذا رفقة؟", en: "Why Refqah?" },
  "whyUs.title": { ar: "نضع ثقتك في المقام الأول", en: "Your Trust Comes First" },
  "whyUs.desc": { ar: "لأن صحة عائلتك أمانة، نحرص على تقديم أفضل مستوى من الرعاية", en: "Because your family's health is a trust, we ensure the best level of care" },
  "whyUs.certified": { ar: "كوادر معتمدة", en: "Certified Staff" },
  "whyUs.certifiedDesc": { ar: "جميع الكوادر الطبية والتمريضية مرخصة ومعتمدة من الجهات الصحية المختصة.", en: "All medical and nursing staff are licensed and certified by relevant health authorities." },
  "whyUs.available": { ar: "متاحون 24/7", en: "Available 24/7" },
  "whyUs.availableDesc": { ar: "خدماتنا متوفرة على مدار الساعة طوال أيام الأسبوع لراحة بالك.", en: "Our services are available around the clock, seven days a week for your peace of mind." },
  "whyUs.quality": { ar: "جودة عالية", en: "High Quality" },
  "whyUs.qualityDesc": { ar: "نلتزم بأعلى معايير الجودة في تقديم الخدمات الطبية المنزلية.", en: "We adhere to the highest quality standards in providing home medical services." },
  "whyUs.humanCare": { ar: "رعاية إنسانية", en: "Compassionate Care" },
  "whyUs.humanCareDesc": { ar: "نؤمن بأن الرعاية الطبية تبدأ بلمسة حانية واهتمام صادق بالمريض.", en: "We believe medical care starts with a gentle touch and genuine concern for the patient." },

  // Testimonials
  "testimonials.badge": { ar: "آراء عملائنا", en: "Client Testimonials" },
  "testimonials.title": { ar: "ثقتكم تسعدنا", en: "Your Trust Makes Us Happy" },
  "testimonials.t1.name": { ar: "أم عبدالله", en: "Um Abdullah" },
  "testimonials.t1.role": { ar: "عميلة - خدمة التمريض المنزلي", en: "Client - Home Nursing Service" },
  "testimonials.t1.content": { ar: "رفقة غيّرت حياتنا. الممرضة التي أرسلوها لوالدتي كانت محترفة وحنونة، شعرنا بالأمان لأول مرة منذ مرض أمي.", en: "Refqah changed our lives. The nurse they sent for my mother was professional and caring. We felt safe for the first time since my mother got sick." },
  "testimonials.t2.name": { ar: "أبو محمد", en: "Abu Mohammed" },
  "testimonials.t2.role": { ar: "عميل - العلاج الطبيعي", en: "Client - Physiotherapy" },
  "testimonials.t2.content": { ar: "بعد عملية الركبة كنت قلقاً من التأهيل، لكن فريق رفقة للعلاج الطبيعي كان ممتازاً. استعدت حركتي بفضل الله ثم بفضلهم.", en: "After my knee surgery I was worried about rehabilitation, but Refqah's physiotherapy team was excellent. I regained my mobility by God's grace and then theirs." },
  "testimonials.t3.name": { ar: "سارة أحمد", en: "Sara Ahmed" },
  "testimonials.t3.role": { ar: "عميلة - جليس مسنين", en: "Client - Elderly Companion" },
  "testimonials.t3.content": { ar: "خدمة جليس المسنين كانت مريحة جداً. أصبحت أذهب لعملي وأنا مطمئنة على والدي. شكراً رفقة!", en: "The elderly companion service was very convenient. I can go to work feeling reassured about my father. Thank you Refqah!" },

  // Booking
  "booking.badge": { ar: "احجز خدمتك", en: "Book Your Service" },
  "booking.title": { ar: "طلب خدمة / حجز زيارة", en: "Request a Service / Book a Visit" },
  "booking.desc": { ar: "نموذج بسيط — سيتم حفظ الطلب مباشرة في النظام.", en: "Simple form — your request will be saved directly in the system." },
  "booking.formTitle": { ar: "بيانات الطلب", en: "Request Details" },
  "booking.fullName": { ar: "الاسم الكامل", en: "Full Name" },
  "booking.fullNamePlaceholder": { ar: "مثال: أحمد محمد", en: "e.g. Ahmed Mohammed" },
  "booking.phone": { ar: "رقم الهاتف", en: "Phone Number" },
  "booking.phonePlaceholder": { ar: "مثال: 01xxxxxxxxx", en: "e.g. 01xxxxxxxxx" },
  "booking.email": { ar: "البريد الإلكتروني (اختياري)", en: "Email (Optional)" },
  "booking.emailPlaceholder": { ar: "name@example.com", en: "name@example.com" },
  "booking.contactMethod": { ar: "طريقة التواصل", en: "Contact Method" },
  "booking.contactCall": { ar: "اتصال", en: "Phone Call" },
  "booking.contactWhatsapp": { ar: "واتساب", en: "WhatsApp" },
  "booking.contactBoth": { ar: "اتصال + واتساب", en: "Call + WhatsApp" },
  "booking.service": { ar: "الخدمة المطلوبة", en: "Requested Service" },
  "booking.selectService": { ar: "اختر خدمة...", en: "Select a service..." },
  "booking.preferredTime": { ar: "الوقت المناسب", en: "Preferred Time" },
  "booking.timeSoon": { ar: "في أقرب وقت", en: "As soon as possible" },
  "booking.timeMorning": { ar: "صباحاً", en: "Morning" },
  "booking.timeAfternoon": { ar: "بعد الظهر", en: "Afternoon" },
  "booking.timeEvening": { ar: "مساءً", en: "Evening" },
  "booking.cityArea": { ar: "المدينة/المنطقة", en: "City/Area" },
  "booking.cityAreaPlaceholder": { ar: "مثال: القاهرة - مدينة نصر", en: "e.g. Cairo - Nasr City" },
  "booking.shortAddress": { ar: "العنوان المختصر", en: "Short Address" },
  "booking.shortAddressPlaceholder": { ar: "شارع/عمارة/دور", en: "Street/Building/Floor" },
  "booking.caseDescription": { ar: "وصف الحالة/المطلوب", en: "Case Description" },
  "booking.caseDescriptionPlaceholder": { ar: "مثال: مريض سكري يحتاج متابعة ضغط/سكر + حقن...", en: "e.g. Diabetic patient needs BP/sugar monitoring + injections..." },
  "booking.consent": { ar: "أوافق على مشاركة البيانات مع فريق رفقة لأغراض التواصل وتقديم الخدمة.", en: "I agree to share data with Refqah team for communication and service delivery purposes." },
  "booking.submit": { ar: "إرسال الطلب", en: "Submit Request" },
  "booking.homeNursing": { ar: "تمريض منزلي", en: "Home Nursing" },
  "booking.homeDoctor": { ar: "طبيب منزلي", en: "Home Doctor" },
  "booking.nursingAssistant": { ar: "مساعد تمريض", en: "Nursing Assistant" },
  "booking.elderlyCompanion": { ar: "جليس مسنين", en: "Elderly Companion" },
  "booking.physiotherapy": { ar: "علاج طبيعي", en: "Physiotherapy" },
  "booking.homeLab": { ar: "تحاليل منزلية", en: "Home Lab Tests" },
  "booking.medicalEquipment": { ar: "أجهزة طبية", en: "Medical Equipment" },

  // Booking Sidebar
  "booking.tips.title": { ar: "نصائح قبل الزيارة", en: "Tips Before the Visit" },
  "booking.tips.1": { ar: "جهّز قائمة بالأدوية الحالية والتحاليل الأخيرة إن وجدت.", en: "Prepare a list of current medications and recent test results if available." },
  "booking.tips.2": { ar: "اذكر أي حساسية أو أمراض مزمنة لتحديد الطاقم المناسب.", en: "Mention any allergies or chronic conditions to assign the right staff." },
  "booking.tips.3": { ar: "للمعدات الطبية: حدّد إن كنت تريد الإيجار أم الشراء ومدة الاستخدام.", en: "For medical equipment: specify if you want rental or purchase and usage duration." },
  "booking.faq.title": { ar: "الأسئلة الشائعة", en: "Frequently Asked Questions" },
  "booking.faq.q1": { ar: "كم يستغرق تأكيد الطلب؟", en: "How long does order confirmation take?" },
  "booking.faq.a1": { ar: "عادةً خلال 30 دقيقة إلى ساعة من استلام الطلب.", en: "Usually within 30 minutes to 1 hour of receiving the request." },
  "booking.faq.q2": { ar: "هل يمكن اختيار تمريض (ذكر/أنثى)؟", en: "Can I choose male/female nursing?" },
  "booking.faq.a2": { ar: "نعم، يمكنك تحديد ذلك في وصف الحالة وسنلبي طلبك.", en: "Yes, you can specify that in the case description and we'll accommodate your request." },
  "booking.faq.q3": { ar: "هل التحاليل تشمل سحب عينة في المنزل؟", en: "Do lab tests include home sample collection?" },
  "booking.faq.a3": { ar: "نعم، فريقنا يأتي لمنزلك لسحب العينات وإرسال النتائج إلكترونياً.", en: "Yes, our team comes to your home for sample collection and sends results electronically." },
  "booking.quickContact.title": { ar: "تواصل سريع", en: "Quick Contact" },
  "booking.quickContact.phone": { ar: "الهاتف:", en: "Phone:" },
  "booking.quickContact.whatsapp": { ar: "واتساب:", en: "WhatsApp:" },
  "booking.quickContact.hours": { ar: "ساعات العمل:", en: "Working Hours:" },
  "booking.quickContact.phoneValue": { ar: "سيتم إضافته لاحقاً", en: "To be added soon" },
  "booking.quickContact.whatsappValue": { ar: "سيتم إضافته لاحقاً", en: "To be added soon" },
  "booking.quickContact.hoursValue": { ar: "24/7", en: "24/7" },

  // Cities (Egyptian)
  "booking.city": { ar: "المدينة", en: "City" },
  "booking.selectCity": { ar: "اختر المدينة", en: "Select City" },
  "booking.cairo": { ar: "القاهرة", en: "Cairo" },
  "booking.giza": { ar: "الجيزة", en: "Giza" },
  "booking.alexandria": { ar: "الإسكندرية", en: "Alexandria" },
  "booking.mansoura": { ar: "المنصورة", en: "Mansoura" },
  "booking.tanta": { ar: "طنطا", en: "Tanta" },
  "booking.assiut": { ar: "أسيوط", en: "Assiut" },
  "booking.zagazig": { ar: "الزقازيق", en: "Zagazig" },
  "booking.portSaid": { ar: "بورسعيد", en: "Port Said" },
  "booking.suez": { ar: "السويس", en: "Suez" },
  "booking.ismailia": { ar: "الإسماعيلية", en: "Ismailia" },

  // Footer
  "footer.desc": { ar: "رعاية طبية متميزة في منزلك. نوفر أفضل الكوادر الطبية والتمريضية لخدمتك أنت وعائلتك.", en: "Premium medical care at your home. We provide the best medical and nursing staff to serve you and your family." },
  "footer.quickLinks": { ar: "روابط سريعة", en: "Quick Links" },
  "footer.ourServices": { ar: "خدماتنا", en: "Our Services" },
  "footer.contactUs": { ar: "تواصل معنا", en: "Contact Us" },
  "footer.bookService": { ar: "احجز خدمتك", en: "Book Service" },
  "footer.location": { ar: "جمهورية مصر العربية", en: "Egypt" },
  "footer.rights": { ar: "جميع الحقوق محفوظة.", en: "All rights reserved." },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("ar");

  const toggleLang = () => setLang((prev) => (prev === "ar" ? "en" : "ar"));

  const t = (key: string): string => {
    return translations[key]?.[lang] ?? key;
  };

  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
