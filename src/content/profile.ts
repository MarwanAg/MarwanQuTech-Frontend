import type { Locale } from "@/lib/i18n";

/**
 * Everything personal on the About page lives here, so it can be edited without touching the layout.
 * Sections with an empty list are hidden on the page.
 */

export type SocialLink = { kind: "linkedin" | "github" | "medium"; label: string; href: string };

export const socialLinks: SocialLink[] = [
  { kind: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/marwan-abughazaleh-494197262/" },
  { kind: "github", label: "GitHub", href: "https://github.com/MarwanAg" },
  { kind: "medium", label: "Medium", href: "https://medium.com/@inblogai2025" },
];

/** One step on the experience / education timelines. `period` is free text, e.g. "2024 – الآن". */
export type TimelineEntry = { title: string; place: string; period: string; body?: string };

type Localized<T> = Record<Locale, T>;

export const about: Localized<{
  bio: string[];
  experience: TimelineEntry[];
  education: TimelineEntry[];
}> = {
  ar: {
    bio: [
      "أنا مروان أبوغزالة، مطوّر ويب متكامل من العقبة في الأردن، وخلفيتي الأكاديمية في أمن الشبكات والمعلومات.",
      "أبني تطبيقات ويب تفاعلية وأنظمة إدارية للشركات وأصحاب المشاريع. أهتم بأن يكون الكود نظيفاً والنظام آمناً، وأن يبقى واضحاً لمن يستخدمه كل يوم.",
      "إلى جانب البرمجة أكتب محتوى تقنياً عن تطوير البرمجيات وأدوات الذكاء الاصطناعي والإنتاجية الرقمية، وأطوّر مهاراتي باستمرار لأبني حلولاً رقمية لها أثر حقيقي.",
    ],
    experience: [
      {
        title: "أخصائي إدخال بيانات",
        place: "مؤسسة حكومية، العقبة",
        period: "2025 – الآن",
        body: "إدارة السجلات والمراسلات الرسمية، والحفاظ على دقة البيانات وسريتها.",
      },
      {
        title: "ممثل خدمة عملاء",
        place: "أمنية، العقبة",
        period: "2024 – 2025",
        body: "خدمة العملاء والمبيعات، وحل مشكلات الاتصال الأولية.",
      },
    ],
    education: [
      { title: "تدريب تطوير الويب المتكامل", place: "Coderz للبرمجيات والتدريب", period: "2026" },
      { title: "أساسيات تعلّم الآلة والذكاء الاصطناعي", place: "The Hope International Company", period: "2025" },
      { title: "دبلوم أمن الشبكات والمعلومات", place: "جامعة البلقاء التطبيقية، العقبة", period: "2021 – 2024" },
      { title: "أساسيات تطوير الويب", place: "أكاديمية العزيمة للاستشارات والتدريب", period: "2023" },
    ],
  },
  en: {
    bio: [
      "I'm Marwan AbuGhazaleh, a full-stack web developer from Aqaba, Jordan, with an academic background in network and information security.",
      "I build interactive web applications and management systems for companies and business owners. I care about clean code and secure systems that stay clear to the people who use them every day.",
      "Alongside development I write technical content about building software, AI tools and digital productivity, and I keep growing my skills to build digital solutions that make a real difference.",
    ],
    experience: [
      {
        title: "Data Entry Specialist",
        place: "Government institution, Aqaba",
        period: "2025 – present",
        body: "Managing official records and correspondence, keeping data accurate and confidential.",
      },
      {
        title: "Customer Service Representative",
        place: "Umniah, Aqaba",
        period: "2024 – 2025",
        body: "Customer service and sales, and first-line connectivity troubleshooting.",
      },
    ],
    education: [
      { title: "Full-stack web development training", place: "Coderz for Software and Training", period: "2026" },
      { title: "Machine learning and AI fundamentals", place: "The Hope International Company", period: "2025" },
      { title: "Diploma in Network and Information Security", place: "Al-Balqa Applied University, Aqaba", period: "2021 – 2024" },
      { title: "Web development fundamentals", place: "Al-Azimah Academy for Consulting and Training", period: "2023" },
    ],
  },
};
