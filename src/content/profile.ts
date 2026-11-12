import type { Locale } from "@/lib/i18n";

/**
 * Everything personal on the About page. Edit freely. The page shows the bio, the links, and the
 * technical skills — on purpose it does not list a job or education.
 */

export type SocialLink = { kind: "linkedin" | "github" | "medium"; label: string; href: string };

export const socialLinks: SocialLink[] = [
  { kind: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/marwan-abughazaleh-494197262/" },
  { kind: "github", label: "GitHub", href: "https://github.com/MarwanAg" },
  { kind: "medium", label: "Medium", href: "https://medium.com/@inblogai2025" },
];

export type SkillGroup = { title: string; items: string[] };

export const about: Record<Locale, { bio: string[]; skills: SkillGroup[] }> = {
  ar: {
    bio: [
      "أنا مروان أبوغزالة، مصمّم ومطوّر مواقع إلكترونية من العقبة في الأردن.",
      "أبني المواقع التعريفية والمدونات والمتاجر الإلكترونية: سريعة، متجاوبة مع الجوال، ومهيّأة للظهور في محركات البحث.",
      "يهمّني أن يكون الموقع واضحاً وسهل الاستخدام لزوّارك، وأن تملكه بالكامل وتقدر تطوّره لاحقاً.",
    ],
    skills: [
      { title: "الواجهات الأمامية", items: ["HTML", "CSS", "JavaScript", "React", "Next.js", "تصميم متجاوب"] },
      { title: "الخلفية وقواعد البيانات", items: ["ASP.NET Core", "C#", "PHP", "Laravel", "MySQL", "SQL Server"] },
      { title: "المتاجر والمحتوى", items: ["متاجر إلكترونية", "لوحات تحكم", "إدارة المحتوى"] },
      { title: "الظهور والأداء", items: ["أساسيات SEO", "تحسين السرعة", "أداء الجوال"] },
      { title: "الأدوات", items: ["Git", "GitHub", "Visual Studio", "VS Code", "Postman"] },
    ],
  },
  en: {
    bio: [
      "I'm Marwan AbuGhazaleh, a web designer and developer from Aqaba, Jordan.",
      "I build portfolio sites, blogs and online stores: fast, mobile-responsive, and tuned to show up in search engines.",
      "I care that a site is clear and easy to use for your visitors, that you own it fully, and that it can grow with you.",
    ],
    skills: [
      { title: "Frontend", items: ["HTML", "CSS", "JavaScript", "React", "Next.js", "Responsive design"] },
      { title: "Backend & databases", items: ["ASP.NET Core", "C#", "PHP", "Laravel", "MySQL", "SQL Server"] },
      { title: "Stores & content", items: ["Online stores", "Dashboards", "Content management"] },
      { title: "Visibility & performance", items: ["SEO fundamentals", "Speed optimization", "Mobile performance"] },
      { title: "Tools", items: ["Git", "GitHub", "Visual Studio", "VS Code", "Postman"] },
    ],
  },
};
