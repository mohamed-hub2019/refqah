// Refqah company constants
export const COMPANY_PHONE = "+201032269905";
export const COMPANY_PHONE_2 = "+201009906415";
export const COMPANY_WHATSAPP = "201032269905"; // without + for wa.me links
export const COMPANY_NAME_AR = "رفقة";
export const COMPANY_NAME_EN = "Refqah";

export const BOOKING_STATUSES = [
  "new",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const STATUS_COLORS: Record<BookingStatus, string> = {
  new: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  confirmed: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  in_progress: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

/**
 * Build a wa.me link with a pre-filled message containing booking details.
 */
export function buildWhatsappBookingMessage(data: {
  full_name: string;
  service: string;
  city_area: string;
  phone: string;
  preferred_time?: string | null;
  case_description?: string | null;
}) {
  const lines = [
    `🩺 طلب حجز جديد - رفقة`,
    ``,
    `الاسم: ${data.full_name}`,
    `الهاتف: ${data.phone}`,
    `الخدمة: ${data.service}`,
    `المنطقة: ${data.city_area}`,
    data.preferred_time ? `الوقت المفضل: ${data.preferred_time}` : "",
    data.case_description ? `الوصف: ${data.case_description}` : "",
  ].filter(Boolean);
  return `https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`;
}
