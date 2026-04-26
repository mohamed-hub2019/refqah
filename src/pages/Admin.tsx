import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, LogOut, Search, Download, RefreshCw, CheckCircle, Clock, XCircle, AlertCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { STATUS_COLORS, BOOKING_STATUSES, type BookingStatus } from "@/lib/constants";

type Booking = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  service: string;
  city_area: string;
  short_address: string | null;
  case_description: string | null;
  contact_method: string | null;
  preferred_time: string | null;
  status: BookingStatus;
  admin_notes: string | null;
  created_at: string;
  user_id: string | null;
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  new: "جديد",
  confirmed: "مؤكد",
  in_progress: "قيد التنفيذ",
  completed: "مكتمل",
  cancelled: "ملغي",
};

const Admin = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("فشل تحميل الحجوزات");
    } else {
      setBookings((data as Booking[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: BookingStatus) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) {
      toast.error("فشل تحديث الحالة");
      return;
    }
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    toast.success("تم تحديث الحالة");
  };

  const services = useMemo(() => Array.from(new Set(bookings.map((b) => b.service))), [bookings]);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (serviceFilter !== "all" && b.service !== serviceFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          b.full_name.toLowerCase().includes(q) ||
          b.phone.includes(q) ||
          b.city_area.toLowerCase().includes(q) ||
          (b.email?.toLowerCase().includes(q) ?? false)
        );
      }
      return true;
    });
  }, [bookings, search, statusFilter, serviceFilter]);

  const stats = useMemo(() => {
    const counts: Record<string, number> = { total: bookings.length };
    BOOKING_STATUSES.forEach((s) => { counts[s] = 0; });
    bookings.forEach((b) => { counts[b.status] = (counts[b.status] || 0) + 1; });
    return counts;
  }, [bookings]);

  const exportCsv = () => {
    const headers = ["التاريخ", "الاسم", "الهاتف", "البريد", "الخدمة", "المنطقة", "العنوان", "الوصف", "الحالة"];
    const rows = filtered.map((b) => [
      new Date(b.created_at).toLocaleString("ar-EG"),
      b.full_name, b.phone, b.email || "", b.service, b.city_area,
      b.short_address || "", (b.case_description || "").replace(/\n/g, " "),
      STATUS_LABELS[b.status],
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `refqah-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-background via-background to-muted font-arabic">
      <header className="bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xl font-bold text-gradient">رفقة - أدمن</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/account")}>حسابي</Button>
            <Button variant="ghost" size="sm" onClick={async () => { await signOut(); navigate("/"); }}>
              <LogOut className="w-4 h-4" /> خروج
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-8 py-8">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">لوحة التحكم</h1>
            <p className="text-muted-foreground text-sm mt-1">{user?.email}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={load}><RefreshCw className="w-4 h-4" /> تحديث</Button>
            <Button variant="outline" size="sm" onClick={exportCsv}><Download className="w-4 h-4" /> تصدير CSV</Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <StatCard icon={TrendingUp} label="إجمالي" value={stats.total} color="text-primary" />
          <StatCard icon={AlertCircle} label="جديد" value={stats.new || 0} color="text-blue-600" />
          <StatCard icon={Clock} label="قيد التنفيذ" value={(stats.confirmed || 0) + (stats.in_progress || 0)} color="text-amber-600" />
          <StatCard icon={CheckCircle} label="مكتمل" value={stats.completed || 0} color="text-green-600" />
          <StatCard icon={XCircle} label="ملغي" value={stats.cancelled || 0} color="text-red-600" />
        </div>

        {/* Filters */}
        <div className="bg-card rounded-2xl shadow-card p-4 mb-6 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="بحث بالاسم، الهاتف، الإيميل، المنطقة..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full ps-10 pe-3 py-2 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary outline-none text-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="كل الحالات" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الحالات</SelectItem>
              {BOOKING_STATUSES.map((s) => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="كل الخدمات" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الخدمات</SelectItem>
              {services.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          {loading ? (
            <div className="py-16 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">لا توجد حجوزات</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted text-xs">
                  <tr>
                    <th className="text-start p-3">التاريخ</th>
                    <th className="text-start p-3">الاسم</th>
                    <th className="text-start p-3">الهاتف</th>
                    <th className="text-start p-3">الخدمة</th>
                    <th className="text-start p-3">المنطقة</th>
                    <th className="text-start p-3">الحالة</th>
                    <th className="text-start p-3">الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b.id} className="border-t border-border hover:bg-muted/30">
                      <td className="p-3 text-xs whitespace-nowrap">{new Date(b.created_at).toLocaleDateString("ar-EG")}</td>
                      <td className="p-3 font-medium">
                        {b.full_name}
                        {b.case_description && <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1 max-w-[250px]">{b.case_description}</div>}
                      </td>
                      <td className="p-3" dir="ltr">
                        <a href={`tel:${b.phone}`} className="text-primary hover:underline">{b.phone}</a>
                      </td>
                      <td className="p-3 text-xs">{b.service}</td>
                      <td className="p-3 text-xs">{b.city_area}</td>
                      <td className="p-3">
                        <Badge className={STATUS_COLORS[b.status]} variant="outline">{STATUS_LABELS[b.status]}</Badge>
                      </td>
                      <td className="p-3">
                        <Select value={b.status} onValueChange={(v) => updateStatus(b.id, v as BookingStatus)}>
                          <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {BOOKING_STATUSES.map((s) => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) => (
  <div className="bg-card rounded-2xl shadow-card p-4">
    <div className={`flex items-center gap-2 ${color}`}>
      <Icon className="w-4 h-4" />
      <span className="text-xs font-semibold">{label}</span>
    </div>
    <div className="text-2xl font-bold mt-1">{value}</div>
  </div>
);

export default Admin;
