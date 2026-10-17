import { ApiError } from "./client";

/** Arabic text for the API's stable error codes. Unknown codes fall back to the server's message. */
const byCode: Record<string, string> = {
  network: "تعذّر الاتصال بالخادم. تأكد أن الـ API يعمل.",
  "Validation.Failed": "راجع الحقول المظلّلة.",
  "RateLimit.Exceeded": "محاولات كثيرة خلال وقت قصير. انتظر قليلاً ثم أعد المحاولة.",
  "Auth.InvalidCredentials": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
  "Auth.LockedOut": "الحساب مقفل مؤقتاً بسبب محاولات فاشلة متكررة.",
  "Auth.WrongPassword": "كلمة المرور الحالية غير صحيحة.",
  "Auth.InvalidRefreshToken": "انتهت الجلسة. سجّل الدخول من جديد.",
  "Auth.MissingRefreshToken": "انتهت الجلسة. سجّل الدخول من جديد.",
  "Project.SlugAr.Taken": "الرابط العربي مستخدم في مشروع آخر.",
  "Project.SlugEn.Taken": "الرابط الإنجليزي مستخدم في مشروع آخر.",
  "Article.SlugAr.Taken": "الرابط العربي مستخدم في مقال آخر.",
  "Article.SlugEn.Taken": "الرابط الإنجليزي مستخدم في مقال آخر.",
  "Project.NotFullyLocalized": "لا يمكن النشر قبل تعبئة العنوان والملخص والوصف بالعربية والإنجليزية.",
  "Article.NotFullyLocalized": "لا يمكن النشر قبل تعبئة العنوان والملخص والمحتوى بالعربية والإنجليزية.",
  "Project.NotPublished": "انشر المشروع أولاً قبل تمييزه في الصفحة الرئيسية.",
  "Project.Images.LimitReached": "وصلت إلى الحد الأقصى لعدد الصور (20).",
  "Project.NotFound": "المشروع غير موجود.",
  "Article.NotFound": "المقال غير موجود.",
  "Inquiry.NotFound": "الرسالة غير موجودة.",
  "Slug.Invalid": "الرابط يجب أن يحتوي على حرف أو رقم واحد على الأقل.",
};

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (byCode[error.code]) return byCode[error.code];
    if (error.status >= 500) return "حدث خطأ في الخادم. حاول مجدداً.";
    return error.message;
  }
  return "حدث خطأ غير متوقع.";
}

/** First message per field, keyed by the C# property name (TitleAr, Image, NewPassword…). */
export function fieldErrors(error: unknown): Record<string, string> {
  if (!(error instanceof ApiError)) return {};
  return Object.fromEntries(Object.entries(error.fieldErrors).map(([key, messages]) => [key, messages[0] ?? ""]));
}

export const serviceLabels: Record<string, string> = {
  WebDevelopment: "تطوير مواقع الويب",
  ApiDevelopment: "تطوير واجهات API",
  SystemArchitecture: "تصميم معمارية الأنظمة",
  ProcessAutomation: "أتمتة العمليات",
  Consulting: "استشارات تقنية",
  Maintenance: "صيانة ودعم",
  Other: "أخرى",
};

export function formatDateTime(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("ar-JO-u-nu-latn", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
}
