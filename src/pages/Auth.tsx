import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock, User as UserIcon, Phone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage, LanguageProvider } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { z } from "zod";

const signUpSchema = z.object({
  full_name: z.string().trim().min(2, "الاسم قصير جداً").max(100),
  phone: z.string().trim().regex(/^01[0-9]{9}$/, "رقم هاتف مصري غير صحيح (01xxxxxxxxx)"),
  email: z.string().trim().email("بريد إلكتروني غير صحيح").max(255),
  password: z.string().min(8, "كلمة المرور 8 أحرف على الأقل").max(72),
});

const signInSchema = z.object({
  email: z.string().trim().email("بريد إلكتروني غير صحيح"),
  password: z.string().min(1, "أدخل كلمة المرور"),
});

const AuthContent = () => {
  const { dir, lang } = useLanguage();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [submitting, setSubmitting] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!loading && user) navigate("/account", { replace: true });
  }, [user, loading, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signUpSchema.safeParse({ full_name: fullName, phone, email, password });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message || "تأكد من البيانات");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/account`,
        data: {
          full_name: parsed.data.full_name,
          phone: parsed.data.phone,
        },
      },
    });
    setSubmitting(false);
    if (error) {
      if (error.message.includes("already registered") || error.message.includes("already been registered")) {
        toast.error("هذا الإيميل مسجل بالفعل، سجّل الدخول بدلاً من ذلك");
      } else {
        toast.error(error.message);
      }
      return;
    }
    toast.success("تم إنشاء الحساب! تحقق من بريدك لتفعيل الحساب");
    setMode("signin");
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message || "تأكد من البيانات");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    setSubmitting(false);
    if (error) {
      if (error.message.includes("Invalid login")) {
        toast.error("بيانات الدخول غير صحيحة");
      } else if (error.message.includes("Email not confirmed")) {
        toast.error("يرجى تفعيل الإيميل أولاً من الرسالة المرسلة لبريدك");
      } else {
        toast.error(error.message);
      }
      return;
    }
    toast.success("تم تسجيل الدخول بنجاح");
    navigate("/account", { replace: true });
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("أدخل بريدك الإلكتروني");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("تم إرسال رابط استعادة كلمة المرور إلى بريدك");
  };

  return (
    <div dir={dir} className={`min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center px-4 py-12 ${lang === "ar" ? "font-arabic" : "font-sans"}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card rounded-3xl shadow-elevated p-8 md:p-10"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" />
          العودة للرئيسية
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient">رفقة</h1>
          <p className="text-muted-foreground mt-2">
            {mode === "signin" && "سجّل الدخول إلى حسابك"}
            {mode === "signup" && "أنشئ حساباً جديداً"}
            {mode === "forgot" && "استعادة كلمة المرور"}
          </p>
        </div>

        {mode === "signup" && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <Field icon={UserIcon} label="الاسم الكامل" value={fullName} onChange={setFullName} placeholder="أحمد محمد" />
            <Field icon={Phone} label="رقم الهاتف" value={phone} onChange={setPhone} placeholder="01xxxxxxxxx" type="tel" />
            <Field icon={Mail} label="البريد الإلكتروني" value={email} onChange={setEmail} placeholder="name@example.com" type="email" />
            <Field icon={Lock} label="كلمة المرور" value={password} onChange={setPassword} placeholder="8 أحرف على الأقل" type="password" />
            <Button variant="cta" size="lg" type="submit" className="w-full" disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              إنشاء حساب
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              عندك حساب؟{" "}
              <button type="button" onClick={() => setMode("signin")} className="text-primary font-semibold hover:underline">
                سجّل الدخول
              </button>
            </p>
          </form>
        )}

        {mode === "signin" && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <Field icon={Mail} label="البريد الإلكتروني" value={email} onChange={setEmail} placeholder="name@example.com" type="email" />
            <Field icon={Lock} label="كلمة المرور" value={password} onChange={setPassword} placeholder="********" type="password" />
            <div className="text-end">
              <button type="button" onClick={() => setMode("forgot")} className="text-sm text-primary hover:underline">
                نسيت كلمة المرور؟
              </button>
            </div>
            <Button variant="cta" size="lg" type="submit" className="w-full" disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              تسجيل الدخول
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              ليس لديك حساب؟{" "}
              <button type="button" onClick={() => setMode("signup")} className="text-primary font-semibold hover:underline">
                أنشئ حساباً
              </button>
            </p>
          </form>
        )}

        {mode === "forgot" && (
          <form onSubmit={handleForgot} className="space-y-4">
            <Field icon={Mail} label="البريد الإلكتروني" value={email} onChange={setEmail} placeholder="name@example.com" type="email" />
            <Button variant="cta" size="lg" type="submit" className="w-full" disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              إرسال رابط الاستعادة
            </Button>
            <p className="text-center text-sm">
              <button type="button" onClick={() => setMode("signin")} className="text-primary hover:underline">
                العودة لتسجيل الدخول
              </button>
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
};

const Field = ({
  icon: Icon, label, value, onChange, placeholder, type = "text",
}: {
  icon: any; label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) => (
  <div>
    <label className="block text-sm font-semibold text-foreground mb-2">{label}</label>
    <div className="relative">
      <Icon className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="w-full ps-10 pe-4 py-3 rounded-2xl bg-muted border-0 text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary outline-none transition-all"
      />
    </div>
  </div>
);

const Auth = () => (
  <LanguageProvider>
    <AuthContent />
  </LanguageProvider>
);

export default Auth;
