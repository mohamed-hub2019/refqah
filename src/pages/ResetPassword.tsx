import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase handles the recovery token from URL hash automatically
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    // also accept if user already in recovery session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("كلمة المرور 8 أحرف على الأقل");
      return;
    }
    if (password !== confirm) {
      toast.error("كلمتا المرور غير متطابقتين");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("تم تحديث كلمة المرور بنجاح");
    navigate("/account", { replace: true });
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center px-4 font-arabic">
      <div className="w-full max-w-md bg-card rounded-3xl shadow-elevated p-8 md:p-10">
        <h1 className="text-2xl font-bold text-foreground mb-2 text-center">تعيين كلمة مرور جديدة</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          {ready ? "أدخل كلمة المرور الجديدة" : "جاري التحقق من رابط الاستعادة..."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">كلمة المرور الجديدة</label>
            <div className="relative">
              <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8 أحرف على الأقل"
                required
                className="w-full ps-10 pe-4 py-3 rounded-2xl bg-muted border-0 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">تأكيد كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full ps-10 pe-4 py-3 rounded-2xl bg-muted border-0 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>
          <Button variant="cta" size="lg" type="submit" className="w-full" disabled={submitting || !ready}>
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            حفظ كلمة المرور
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
