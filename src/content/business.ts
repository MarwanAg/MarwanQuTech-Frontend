import type { Locale } from "@/lib/i18n";

/**
 * Business offer of the site: service groups, problems → solutions, and priced packages.
 * Everything here is plain content — edit freely. Prices are in JOD.
 *
 * `serviceType` must be one of the API's ServiceType values (the contact form sends it), so each
 * group maps onto an existing type and no database change is needed.
 */

export type ServiceType = "WebDevelopment" | "SystemArchitecture" | "ProcessAutomation" | "Maintenance" | "Consulting" | "Other";

export type GroupKey = "presence" | "systems" | "data" | "support";

export type ServiceGroup = { key: GroupKey; serviceType: ServiceType; title: string; summary: string; includes: string[] };

export type Problem = { key: string; group: GroupKey; problem: string; solution: string };

export type Offer = {
  key: string;
  serviceType: ServiceType;
  title: string;
  summary: string;
  includes: string[];
  /** Lowest price in JOD, or null when it's agreed case by case. */
  priceFrom: number | null;
};

type Content = { groups: ServiceGroup[]; problems: Problem[]; offers: Offer[] };

export const business: Record<Locale, Content> = {
  ar: {
    groups: [
      {
        key: "presence",
        serviceType: "WebDevelopment",
        title: "الحضور الرقمي",
        summary: "مواقع تعريفية، صفحات هبوط، وكتالوجات إلكترونية.",
        includes: ["موقع تعريفي بالعربية والإنجليزية", "صفحة هبوط لمنتج أو حملة", "كتالوج إلكتروني لمنتجاتك أو خدماتك", "تجهيز أساسي للظهور في محركات البحث"],
      },
      {
        key: "systems",
        serviceType: "SystemArchitecture",
        title: "أنظمة إدارة الأعمال",
        summary: "إدارة الطلبات والعملاء والمخزون والمتابعة.",
        includes: ["تسجيل الطلبات ومتابعة حالة كل طلب", "سجل منظم للعملاء", "متابعة مخزون بسيط", "لوحة تحكم وصلاحيات للمستخدمين", "تقارير يومية جاهزة"],
      },
      {
        key: "data",
        serviceType: "ProcessAutomation",
        title: "الأتمتة وتنظيم البيانات",
        summary: "ملفات Excel أو Google Sheets، نماذج، وربط العمليات.",
        includes: ["جداول منظمة بمعادلات جاهزة", "نماذج إدخال تقلل الأخطاء", "تقارير تُحدَّث تلقائياً", "إدخال بياناتك الحالية وترتيبها", "تحويل السجلات الورقية إلى ملفات رقمية"],
      },
      {
        key: "support",
        serviceType: "Maintenance",
        title: "الصيانة والدعم التقني",
        summary: "إصلاحات، تحديثات، تحسينات، ومتابعة الأنظمة.",
        includes: ["إصلاح الأعطال", "التحديثات الأمنية", "تحسين السرعة والأداء", "دعم شهري بنطاق واضح"],
      },
    ],
    problems: [
      { key: "orders", group: "systems", problem: "الطلبات تضيع بين واتساب والدفاتر؟", solution: "ننظّمها في لوحة متابعة واحدة، تعرف منها حالة كل طلب في أي لحظة." },
      { key: "customers", group: "data", problem: "بيانات العملاء مبعثرة؟", solution: "ننشئ قاعدة بيانات واضحة، يسهل البحث فيها وتحديثها." },
      { key: "website", group: "presence", problem: "موقعك لا يعرض منتجاتك بشكل جيد؟", solution: "ننشئ كتالوجاً إلكترونياً يعرضها بوضوح، على الجوال قبل الكمبيوتر." },
      { key: "reports", group: "data", problem: "تقاريرك تستغرق ساعات؟", solution: "نؤتمت جزءاً من إعدادها، لتجهز في دقائق بدل ساعات." },
    ],
    offers: [
      {
        key: "organize",
        serviceType: "ProcessAutomation",
        title: "تنظيم الأعمال",
        summary: "ملف Excel أو Google Sheets احترافي، مصمّم لطريقة عملك.",
        includes: ["تصميم الجداول والمعادلات", "تنسيق واضح وجاهز للطباعة", "شرح طريقة الاستخدام"],
        priceFrom: 15,
      },
      {
        key: "presence",
        serviceType: "WebDevelopment",
        title: "الحضور الرقمي",
        summary: "موقع تعريفي بسيط أو صفحة هبوط.",
        includes: ["تصميم يعمل على الجوال", "نموذج تواصل يصلك على بريدك", "تجهيز أساسي لمحركات البحث"],
        priceFrom: 100,
      },
      {
        key: "tracking",
        serviceType: "SystemArchitecture",
        title: "نظام متابعة",
        summary: "لوحة إدارية بسيطة حسب احتياجك.",
        includes: ["تسجيل الطلبات أو العملاء", "تحديث الحالة ومتابعتها", "تقارير أساسية", "صلاحيات للمستخدمين"],
        priceFrom: 180,
      },
      {
        key: "support",
        serviceType: "Maintenance",
        title: "الدعم والصيانة الشهرية",
        summary: "مبلغ شهري متفق عليه، مقابل تحديثات ومتابعة وإصلاحات ضمن نطاق واضح.",
        includes: ["متابعة دورية للنظام", "إصلاح الأعطال", "تعديلات صغيرة شهرياً"],
        priceFrom: null,
      },
    ],
  },
  en: {
    groups: [
      {
        key: "presence",
        serviceType: "WebDevelopment",
        title: "Digital presence",
        summary: "Company websites, landing pages and online catalogs.",
        includes: ["Company website in Arabic and English", "Landing page for a product or campaign", "Online catalog of your products or services", "Basic search engine setup"],
      },
      {
        key: "systems",
        serviceType: "SystemArchitecture",
        title: "Business management systems",
        summary: "Orders, customers, stock and follow-up in one place.",
        includes: ["Record orders and track each one's status", "An organized customer record", "Simple stock tracking", "Dashboard with user permissions", "Ready daily reports"],
      },
      {
        key: "data",
        serviceType: "ProcessAutomation",
        title: "Automation & data organization",
        summary: "Excel and Google Sheets files, forms, and connected workflows.",
        includes: ["Organized sheets with ready formulas", "Input forms that reduce mistakes", "Reports that update themselves", "Entering and organizing your existing data", "Turning paper records into digital files"],
      },
      {
        key: "support",
        serviceType: "Maintenance",
        title: "Maintenance & support",
        summary: "Fixes, updates, improvements and system follow-up.",
        includes: ["Fixing faults", "Security updates", "Speed and performance improvements", "Monthly support with a clear scope"],
      },
    ],
    problems: [
      { key: "orders", group: "systems", problem: "Orders get lost between WhatsApp and notebooks?", solution: "We organize them on one tracking board, so you know every order's status at any moment." },
      { key: "customers", group: "data", problem: "Customer data scattered everywhere?", solution: "We build a clear database that's easy to search and update." },
      { key: "website", group: "presence", problem: "Your website doesn't show your products well?", solution: "We build an online catalog that presents them clearly, on phones first." },
      { key: "reports", group: "data", problem: "Reports take you hours?", solution: "We automate part of preparing them, so they're ready in minutes instead of hours." },
    ],
    offers: [
      {
        key: "organize",
        serviceType: "ProcessAutomation",
        title: "Business organization",
        summary: "A professional Excel or Google Sheets file, designed around how you work.",
        includes: ["Sheet and formula design", "Clear, print-ready formatting", "A walkthrough of how to use it"],
        priceFrom: 15,
      },
      {
        key: "presence",
        serviceType: "WebDevelopment",
        title: "Digital presence",
        summary: "A simple company website or landing page.",
        includes: ["Design that works on phones", "Contact form delivered to your email", "Basic search engine setup"],
        priceFrom: 100,
      },
      {
        key: "tracking",
        serviceType: "SystemArchitecture",
        title: "Tracking system",
        summary: "A simple admin dashboard built around your needs.",
        includes: ["Record orders or customers", "Update and follow each status", "Basic reports", "User permissions"],
        priceFrom: 180,
      },
      {
        key: "support",
        serviceType: "Maintenance",
        title: "Monthly support & maintenance",
        summary: "An agreed monthly fee for updates, follow-up and fixes within a clear scope.",
        includes: ["Regular system check-ups", "Fixing faults", "Small monthly changes"],
        priceFrom: null,
      },
    ],
  },
};
