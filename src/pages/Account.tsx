import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, User as UserIcon, LogOut, ArrowLeft, RefreshCw, Shield, Phone, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { STATUS_COLORS, type BookingStatus } from "@/lib/constants";

type Profile = {
  full_name: string | null;
  phone: string | null;
  city_area: string | null;
  short_address: string | null;
  email: string | null;
};

type Booking = {
  id: string;
  service: string;
  status: BookingStatus;
  city_area: string;
  preferred_time: string | null;
  case_description: string | null;
  created_at: string;
  full_name: string;
  phone: string;
  contact_method: string | null;
  short_address: string | null;
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  new: "جديد",
  confirmed: "مؤكد",
  in_progress: "قيد التنفيذ",
  completed: "مكتمل",
  cancelled: "ملغي",
};

const Account = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  const loadData = async () => {
    if (!user) return;
    const [profileRes, bookingsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("bookings").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]);
    if (profileRes.data) setProfile(profileRes.data as Profile);
    if (bookingsRes.data) setBookings(bookingsRes.data as Booking[]);
    setLoading(false);
  };

  useEffect(() => { loadData(); /* eslint-disable-next-line */ }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    setSavingProfile(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
        city_area: profile.city_area,
        short_address: profile.short_address,
      })
      .eq("user_id", user.id);
    setSavingProfile(false);
    if (error) {
      toast.error("فشل الحفظ");
      return;
    }
    toast.success("تم حفظ بياناتك");
  };

  const handleReorder = async (b: Booking) => {
    if (!user) return;
    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      full_name: b.full_name,
      phone: b.phone,
      service: b.service,
      city_area: b.city_area,
      short_address: b.short_address,
      contact_method: b.contact_method,
      preferred_time: b.preferred_time,
      case_description: b.case_description,
    });
    if (error) {
      toast.error("فشل إعادة الطلب");
      return;
    }
    toast.success("تم إرسال طلب جديد بنفس البيانات");
    loadData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-background via-background to-muted font-arabic">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xl font-bold text-gradient">رفقة</span>
          </Link>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button variant="outline" size="sm" onClick={() => navigate("/admin")}>
                <Shield className="w-4 h-4" />
                لوحة الأدمن
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={async () => { await signOut(); navigate("/"); }}>
              <LogOut className="w-4 h-4" />
              خروج
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-8 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-2">حسابي</h1>
        <p className="text-muted-foreground mb-8">إدارة بياناتك ومتابعة طلباتك</p>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile */}
          <motion.section
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 bg-card rounded-3xl shadow-card p-6"
          >
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-primary" />
              بياناتي الشخصية
            </h2>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">الاسم الكامل</label>
                <input
                  type="text"
                  value={profile?.full_name || ""}
                  onChange={(e) => setProfile({ ...profile!, full_name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">رقم الهاتف</label>
                <input
                  type="tel"
                  dir="ltr"
                  value={profile?.phone || ""}
                  onChange={(e) => setProfile({ ...profile!, phone: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary outline-none text-right"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">المدينة/المنطقة</label>
                <input
                  type="text"
                  value={profile?.city_area || ""}
                  onChange={(e) => setProfile({ ...profile!, city_area: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">العنوان المختصر</label>
                <input
                  type="text"
                  value={profile?.short_address || ""}
                  onChange={(e) => setProfile({ ...profile!, short_address: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                <Phone className="w-3 h-3 inline" /> {user?.email}
              </div>
              <Button variant="cta" size="default" type="submit" className="w-full" disabled={savingProfile}>
                {savingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
                حفظ التغييرات
              </Button>
            </form>
          </motion.section>

          {/* Bookings */}
          <motion.section
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-card rounded-3xl shadow-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">حجوزاتي ({bookings.length})</h2>
              <Button variant="ghost" size="sm" onClick={loadData}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>لا توجد حجوزات بعد</p>
                <Button variant="link" asChild className="mt-2">
                  <Link to="/#booking">احجز خدمتك الأولى</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b.id} className="rounded-2xl bg-muted/50 p-4 border border-border">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <h3 className="font-semibold">{b.service}</h3>
                          <Badge className={STATUS_COLORS[b.status]} variant="outline">
                            {STATUS_LABELS[b.status]}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {b.city_area}</div>
                          <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(b.created_at).toLocaleDateString("ar-EG")}</div>
                          {b.case_description && <p className="line-clamp-2">{b.case_description}</p>}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleReorder(b)}>
                        <RefreshCw className="w-3.5 h-3.5" />
                        اطلب تاني
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.section>
        </div>
      </main>
    </div>
  );
};

export default Account;
