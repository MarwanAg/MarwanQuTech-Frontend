import type { Locale } from "@/lib/i18n";

/**
 * Everything personal on the About page lives here, so it can be edited without touching the layout.
 * Sections with an empty list are hidden on the page.
 */

export type SocialLink = { kind: "linkedin" | "github"; label: string; href: string };

export const socialLinks: SocialLink[] = [
  { kind: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/marwan-abughazaleh-494197262/" },
  { kind: "github", label: "GitHub", href: "https://github.com/MarwanAg" },
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
      "أنا مروان أبوغزالة، مطوّر أنظمة ويب من العقبة في الأردن. أبني المواقع والأنظمة الإدارية وأدوات الأتمتة للشركات وأصحاب المشاريع.",
      "يهمّني أن يكون النظام واضحاً لمن يستخدمه كل يوم، لا لمن بناه فقط. لذلك أبدأ كل مشروع من فهم طريقة العمل الحالية، ثم أبني ما يختصرها ويجعلها أسهل.",
      "وفي المدونة أكتب بالعربية عمّا أتعلّمه أثناء بناء الأنظمة، لعلّه يفيد من يسلك الطريق نفسه.",
    ],
    experience: [],
    education: [],
  },
  en: {
    bio: [
      "I'm Marwan AbuGhazaleh, a web systems developer from Aqaba, Jordan. I build websites, management systems and automation tools for companies and business owners.",
      "I care that a system is clear to the people who use it every day, not only to the person who built it. So every project starts with how the work is done today, and then I build what makes it shorter and easier.",
      "On the blog I write in Arabic about what I learn while building systems, in case it helps someone on the same path.",
    ],
    experience: [],
    education: [],
  },
};
