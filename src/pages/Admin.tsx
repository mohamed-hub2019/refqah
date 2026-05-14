import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Loader2, ArrowLeft, LogOut, Search, Download, RefreshCw,
  CheckCircle, Clock, XCircle, AlertCircle, TrendingUp,
  Eye, Phone, MessageCircle, ShieldCheck, ShieldOff, UserPlus, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  STATUS_COLORS, BOOKING_STATUSES, COMPANY_WHATSAPP, type BookingStatus,
} from "@/lib/constants";

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

type UserRow = {
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  is_admin: boolean;
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

  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  // Users state
  const [users, setUsers] = useState<UserRow[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [confirmTarget, setConfirmTarget] = useState<UserRow | null>(null);

  const loadBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("فشل تحميل الحجوزات");
    else setBookings((data as Booking[]) || []);
    setLoading(false);
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    const [{ data: profiles, error: pErr }, { data: roles, error: rErr }] = await Promise.all([
      supabase.from("profiles").select("user_id, full_name, email, phone"),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    if (pErr || rErr) {
      toast.error("فشل تحميل المستخدمين");
      setUsersLoading(false);
      return;
    }
    const adminSet = new Set((roles || []).filter((r) => r.role === "admin").map((r) => r.user_id));
    const rows: UserRow[] = (profiles || []).map((p) => ({
      user_id: p.user_id,
      full_name: p.full_name,
      email: p.email,
      phone: p.phone,
      is_admin: adminSet.has(p.user_id),
    }));
    rows.sort((a, b) => Number(b.is_admin) - Number(a.is_admin));
    setUsers(rows);
    setUsersLoading(false);
  };

  useEffect(() => {
    loadBookings();
    loadUsers();

    // Realtime: new booking toasts
    const channel = supabase
      .channel("admin-bookings")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bookings" },
        (payload) => {
          const b = payload.new as Booking;
          toast.success(`🔔 حجز جديد من ${b.full_name}`, { description: b.service });
          setBookings((prev) => [b, ...prev]);
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "bookings" },
        (payload) => {
          const b = payload.new as Booking;
          setBookings((prev) => prev.map((x) => (x.id === b.id ? b : x)));
        },
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const updateStatus = async (id: string, status: BookingStatus) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) return toast.error("فشل تحديث الحالة");
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    toast.success("تم تحديث الحالة");
  };

  const saveNotes = async () => {
    if (!selected) return;
    setSavingNotes(true);
    const { error } = await supabase
      .from("bookings")
      .update({ admin_notes: notesDraft })
      .eq("id", selected.id);
    setSavingNotes(false);
    if (error) return toast.error("فشل حفظ الملاحظات");
    setBookings((prev) => prev.map((b) => (b.id === selected.id ? { ...b, admin_notes: notesDraft } : b)));
    toast.success("تم حفظ الملاحظات");
  };

  const toggleAdmin = async (target: UserRow) => {
    if (target.user_id === user?.id) {
      toast.error("لا يمكنك تعديل صلاحياتك بنفسك");
      return;
    }
    if (target.is_admin) {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", target.user_id)
        .eq("role", "admin");
      if (error) return toast.error("فشل إزالة الصلاحية");
      toast.success(`تم إزالة صلاحية الأدمن من ${target.email}`);
    } else {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: target.user_id, role: "admin" });
      if (error) return toast.error("فشل الترقية");
      toast.success(`تم ترقية ${target.email} لأدمن`);
    }
    setConfirmTarget(null);
    loadUsers();
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

  const filteredUsers = useMemo(() => {
    if (!userSearch) return users;
    const q = userSearch.toLowerCase();
    return users.filter(
      (u) =>
        u.email?.toLowerCase().includes(q) ||
        u.full_name?.toLowerCase().includes(q) ||
        u.phone?.includes(q),
    );
  }, [users, userSearch]);

  const stats = useMemo(() => {
    const counts: Record<string, number> = { total: bookings.length };
    BOOKING_STATUSES.forEach((s) => { counts[s] = 0; });
    bookings.forEach((b) => { counts[b.status] = (counts[b.status] || 0) + 1; });
    return counts;
  }, [bookings]);

  // Analytics: last 14 days + top services
  const analytics = useMemo(() => {
    const days: { date: string; label: string; count: number }[] = [];
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({
        date: key,
        label: d.toLocaleDateString("ar-EG", { day: "numeric", month: "short" }),
        count: 0,
      });
    }
    const byDay = new Map(days.map((d) => [d.date, d]));
    const serviceCounts: Record<string, number> = {};
    bookings.forEach((b) => {
      const k = b.created_at.slice(0, 10);
      const row = byDay.get(k);
      if (row) row.count++;
      serviceCounts[b.service] = (serviceCounts[b.service] || 0) + 1;
    });
    const topServices = Object.entries(serviceCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
    return { days, topServices };
  }, [bookings]);

  const exportCsv = () => {
    const headers = ["التاريخ", "الاسم", "الهاتف", "البريد", "الخدمة", "المنطقة", "العنوان", "الوصف", "الحالة", "ملاحظات"];
    const rows = filtered.map((b) => [
      new Date(b.created_at).toLocaleString("ar-EG"),
      b.full_name, b.phone, b.email || "", b.service, b.city_area,
      b.short_address || "", (b.case_description || "").replace(/\n/g, " "),
      STATUS_LABELS[b.status], (b.admin_notes || "").replace(/\n/g, " "),
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

  const openDetails = (b: Booking) => {
    setSelected(b);
    setNotesDraft(b.admin_notes || "");
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
            <Button variant="outline" size="sm" onClick={() => { loadBookings(); loadUsers(); }}>
              <RefreshCw className="w-4 h-4" /> تحديث
            </Button>
            <Button variant="outline" size="sm" onClick={exportCsv}>
              <Download className="w-4 h-4" /> تصدير CSV
            </Button>
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

        <Tabs defaultValue="bookings" className="space-y-4">
          <TabsList>
            <TabsTrigger value="bookings">الحجوزات</TabsTrigger>
            <TabsTrigger value="analytics">التقارير</TabsTrigger>
            <TabsTrigger value="users"><Users className="w-4 h-4 ms-1" /> المستخدمين</TabsTrigger>
          </TabsList>

          {/* BOOKINGS */}
          <TabsContent value="bookings" className="space-y-4">
            <div className="bg-card rounded-2xl shadow-card p-4 flex flex-wrap gap-3 items-center">
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
                        <th className="text-start p-3">إجراء</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((b) => (
                        <tr key={b.id} className="border-t border-border hover:bg-muted/30">
                          <td className="p-3 text-xs whitespace-nowrap">{new Date(b.created_at).toLocaleDateString("ar-EG")}</td>
                          <td className="p-3 font-medium">
                            {b.full_name}
                            {b.admin_notes && <div className="text-xs text-amber-600 mt-0.5">📝 ملاحظة</div>}
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
                            <div className="flex items-center gap-1">
                              <Button size="icon" variant="ghost" onClick={() => openDetails(b)} title="عرض">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Select value={b.status} onValueChange={(v) => updateStatus(b.id, v as BookingStatus)}>
                                <SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {BOOKING_STATUSES.map((s) => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ANALYTICS */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="bg-card rounded-2xl shadow-card p-6">
              <h3 className="font-semibold mb-4">الحجوزات - آخر 14 يوم</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.days}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <RTooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-card p-6">
              <h3 className="font-semibold mb-4">أكثر الخدمات طلباً</h3>
              {analytics.topServices.length === 0 ? (
                <p className="text-muted-foreground text-sm">لا توجد بيانات بعد</p>
              ) : (
                <div className="space-y-3">
                  {analytics.topServices.map((s) => {
                    const max = analytics.topServices[0].count;
                    const pct = (s.count / max) * 100;
                    return (
                      <div key={s.name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{s.name}</span>
                          <span className="font-semibold">{s.count}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          {/* USERS */}
          <TabsContent value="users" className="space-y-4">
            <div className="bg-card rounded-2xl shadow-card p-4">
              <div className="relative">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="بحث بالاسم أو الإيميل أو الهاتف..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="ps-10"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                💡 لإضافة أدمن جديد: المستخدم لازم يسجل حساب أولاً من <Link to="/auth" className="text-primary hover:underline">/auth</Link>، وبعدين رقّيه من هنا.
              </p>
            </div>

            <div className="bg-card rounded-2xl shadow-card overflow-hidden">
              {usersLoading ? (
                <div className="py-16 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></div>
              ) : filteredUsers.length === 0 ? (
                <div className="py-16 text-center text-muted-foreground">لا يوجد مستخدمين</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted text-xs">
                      <tr>
                        <th className="text-start p-3">الاسم</th>
                        <th className="text-start p-3">الإيميل</th>
                        <th className="text-start p-3">الهاتف</th>
                        <th className="text-start p-3">الصلاحية</th>
                        <th className="text-start p-3">إجراء</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.user_id} className="border-t border-border hover:bg-muted/30">
                          <td className="p-3 font-medium">{u.full_name || "—"}</td>
                          <td className="p-3" dir="ltr">{u.email}</td>
                          <td className="p-3" dir="ltr">{u.phone || "—"}</td>
                          <td className="p-3">
                            {u.is_admin ? (
                              <Badge className="bg-primary/10 text-primary border-primary/30" variant="outline">
                                <ShieldCheck className="w-3 h-3 ms-1" /> أدمن
                              </Badge>
                            ) : (
                              <Badge variant="outline">مستخدم</Badge>
                            )}
                          </td>
                          <td className="p-3">
                            {u.user_id === user?.id ? (
                              <span className="text-xs text-muted-foreground">(أنت)</span>
                            ) : u.is_admin ? (
                              <Button size="sm" variant="outline" onClick={() => setConfirmTarget(u)}>
                                <ShieldOff className="w-4 h-4" /> إزالة
                              </Button>
                            ) : (
                              <Button size="sm" onClick={() => setConfirmTarget(u)}>
                                <UserPlus className="w-4 h-4" /> ترقية لأدمن
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Booking details dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent dir="rtl" className="max-w-lg font-arabic">
          <DialogHeader>
            <DialogTitle>تفاصيل الحجز</DialogTitle>
            <DialogDescription>
              {selected && new Date(selected.created_at).toLocaleString("ar-EG")}
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <Field label="الاسم" value={selected.full_name} />
              <Field label="الهاتف" value={selected.phone} ltr />
              <Field label="الإيميل" value={selected.email || "—"} ltr />
              <Field label="الخدمة" value={selected.service} />
              <Field label="المنطقة" value={selected.city_area} />
              <Field label="العنوان" value={selected.short_address || "—"} />
              <Field label="الوقت المفضل" value={selected.preferred_time || "—"} />
              <Field label="طريقة التواصل" value={selected.contact_method || "—"} />
              <Field label="الوصف" value={selected.case_description || "—"} multiline />
              <div className="flex gap-2 pt-2">
                <Button asChild size="sm" variant="outline" className="flex-1">
                  <a href={`tel:${selected.phone}`}><Phone className="w-4 h-4" /> اتصال</a>
                </Button>
                <Button asChild size="sm" variant="outline" className="flex-1">
                  <a href={`https://wa.me/${selected.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4" /> واتساب
                  </a>
                </Button>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">ملاحظات الأدمن</label>
                <Textarea
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  rows={3}
                  placeholder="ملاحظات داخلية..."
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSelected(null)}>إغلاق</Button>
            <Button onClick={saveNotes} disabled={savingNotes}>
              {savingNotes && <Loader2 className="w-4 h-4 animate-spin" />} حفظ الملاحظات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm role change */}
      <AlertDialog open={!!confirmTarget} onOpenChange={(o) => !o && setConfirmTarget(null)}>
        <AlertDialogContent dir="rtl" className="font-arabic">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmTarget?.is_admin ? "إزالة صلاحية الأدمن؟" : "ترقية إلى أدمن؟"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmTarget?.is_admin
                ? `سيفقد ${confirmTarget?.email} الوصول للوحة التحكم.`
                : `سيحصل ${confirmTarget?.email} على صلاحيات كاملة لإدارة الحجوزات والمستخدمين.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmTarget && toggleAdmin(confirmTarget)}>
              تأكيد
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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

const Field = ({ label, value, ltr, multiline }: { label: string; value: string; ltr?: boolean; multiline?: boolean }) => (
  <div className="flex gap-2">
    <span className="text-muted-foreground min-w-[100px]">{label}:</span>
    <span className={`font-medium flex-1 ${multiline ? "whitespace-pre-wrap" : ""}`} dir={ltr ? "ltr" : undefined}>{value}</span>
  </div>
);

export default Admin;
