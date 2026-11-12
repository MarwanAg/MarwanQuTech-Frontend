import type { Locale } from "@/lib/i18n";

/**
 * The site's offering: web design services only, for three kinds of website — blogs, portfolio /
 * landing pages, and online stores — plus maintenance & redesign. Everything here is plain content;
 * edit it freely. Prices are in JOD and are starting points — review them before launch.
 *
 * `serviceType` must be one of the API's ServiceType values, because the contact form sends it and the
 * dashboard groups by it. To avoid a database change, the existing enum members are reused as labels
 * for the website kinds (see serviceLabels in src/lib/admin/messages.ts and ServiceNames in the API,
 * which must stay in step):
 *   WebDevelopment   → portfolio / landing page
 *   ProcessAutomation→ blog
 *   SystemArchitecture→ online store
 *   Maintenance      → maintenance & redesign
 *   Consulting       → first consultation
 */

export type ServiceType = "WebDevelopment" | "SystemArchitecture" | "ProcessAutomation" | "Maintenance" | "Consulting" | "Other";

export type GroupKey = "landing" | "blog" | "store" | "care";

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
        key: "landing",
        serviceType: "WebDevelopment",
        title: "الصفحات التعريفية و Landing Pages",
        summary: "موقع يعرّف بك أو بشركتك، أو صفحة هبوط لمنتج أو حملة.",
        includes: ["موقع تعريفي بالعربية والإنجليزية", "صفحة هبوط لمنتج أو حملة", "تصميم يعمل على الجوال أولاً", "نموذج تواصل يصلك على بريدك", "تجهيز أساسي لمحركات البحث"],
      },
      {
        key: "blog",
        serviceType: "ProcessAutomation",
        title: "المدونات",
        summary: "مدونة احترافية تجمع مقالاتك وتعرضها بشكل مرتب.",
        includes: ["تصميم مريح للقراءة", "تنظيم المقالات والتصنيفات", "لوحة بسيطة لإضافة المقالات", "سرعة عالية وتهيئة لمحركات البحث", "دعم العربية والإنجليزية"],
      },
      {
        key: "store",
        serviceType: "SystemArchitecture",
        title: "المتاجر الإلكترونية",
        summary: "متجر يعرض منتجاتك ويستقبل الطلبات.",
        includes: ["عرض المنتجات بالصور والأسعار", "سلة شراء واستقبال الطلبات", "لوحة تحكم لإدارة المنتجات والطلبات", "تصميم متجاوب مع كل الشاشات", "تهيئة لمحركات البحث"],
      },
      {
        key: "care",
        serviceType: "Maintenance",
        title: "الصيانة وإعادة التصميم",
        summary: "تحديث موقعك القديم، أو متابعته بعد الإطلاق.",
        includes: ["إعادة تصميم موقع قديم", "جعل الموقع متجاوباً مع الجوال", "تحسين السرعة والأداء", "تحديثات أمنية ومتابعة دورية"],
      },
    ],
    problems: [
      { key: "no-site", group: "landing", problem: "كل حضورك على السوشال ميديا، وما عندك موقع تملكه؟", solution: "نبنيلك موقعاً تملكه أنت، يظهر على Google ويعرّف بأعمالك باحترافية." },
      { key: "old-site", group: "care", problem: "موقعك قديم وما بيفتح منيح على الجوال؟", solution: "نعيد تصميمه بشكل عصري وسريع، يعمل على كل الشاشات." },
      { key: "no-store", group: "store", problem: "عندك منتجات بس ما في طريقة تبيعها أونلاين؟", solution: "نبنيلك متجراً إلكترونياً يعرض منتجاتك ويستقبل الطلبات." },
      { key: "no-blog", group: "blog", problem: "بتكتب محتوى بس ما عندك مكان احترافي يجمعه؟", solution: "ننشئ مدونة مرتبة وسريعة، مهيّأة للظهور في محركات البحث." },
    ],
    offers: [
      {
        key: "landing",
        serviceType: "WebDevelopment",
        title: "صفحة هبوط",
        summary: "صفحة واحدة تركّز على منتج أو خدمة أو حملة.",
        includes: ["تصميم يعمل على الجوال", "نموذج تواصل يصلك على بريدك", "تجهيز أساسي لمحركات البحث"],
        priceFrom: 100,
      },
      {
        key: "portfolio",
        serviceType: "WebDevelopment",
        title: "موقع تعريفي",
        summary: "موقع متعدّد الصفحات لك أو لشركتك.",
        includes: ["صفحات: الرئيسية، من نحن، الخدمات، تواصل", "بالعربية والإنجليزية", "تصميم متجاوب وتهيئة لمحركات البحث"],
        priceFrom: 150,
      },
      {
        key: "blog",
        serviceType: "ProcessAutomation",
        title: "مدونة",
        summary: "مدونة احترافية مع لوحة لإضافة المقالات.",
        includes: ["تصميم مريح للقراءة", "لوحة لإضافة المقالات والتصنيفات", "سرعة عالية وتهيئة لمحركات البحث"],
        priceFrom: 180,
      },
      {
        key: "store",
        serviceType: "SystemArchitecture",
        title: "متجر إلكتروني",
        summary: "متجر لعرض المنتجات واستقبال الطلبات.",
        includes: ["عرض المنتجات وسلة الشراء", "لوحة تحكم للمنتجات والطلبات", "تصميم متجاوب وتهيئة لمحركات البحث"],
        priceFrom: 350,
      },
    ],
  },
  en: {
    groups: [
      {
        key: "landing",
        serviceType: "WebDevelopment",
        title: "Portfolios & landing pages",
        summary: "A site that introduces you or your company, or a landing page for a product or campaign.",
        includes: ["Company or personal website in Arabic and English", "Landing page for a product or campaign", "Mobile-first design", "Contact form delivered to your email", "Basic search engine setup"],
      },
      {
        key: "blog",
        serviceType: "ProcessAutomation",
        title: "Blogs",
        summary: "A professional blog that gathers your articles and presents them neatly.",
        includes: ["A design that's comfortable to read", "Articles and categories organized", "A simple panel to add articles", "Fast, and tuned for search engines", "Arabic and English support"],
      },
      {
        key: "store",
        serviceType: "SystemArchitecture",
        title: "Online stores",
        summary: "A store that shows your products and takes orders.",
        includes: ["Products with photos and prices", "A cart and order intake", "A dashboard to manage products and orders", "Responsive on every screen", "Search engine setup"],
      },
      {
        key: "care",
        serviceType: "Maintenance",
        title: "Maintenance & redesign",
        summary: "Updating your old site, or looking after it after launch.",
        includes: ["Redesigning an old site", "Making a site mobile-responsive", "Speed and performance improvements", "Security updates and regular check-ups"],
      },
    ],
    problems: [
      { key: "no-site", group: "landing", problem: "All your presence is on social media, with no site of your own?", solution: "I build you a site you own, that shows up on Google and presents your work professionally." },
      { key: "old-site", group: "care", problem: "Your site is old and doesn't open well on phones?", solution: "I redesign it — modern, fast, and working on every screen." },
      { key: "no-store", group: "store", problem: "You have products but no way to sell them online?", solution: "I build you an online store that shows your products and takes orders." },
      { key: "no-blog", group: "blog", problem: "You write content but have no professional place to gather it?", solution: "I set up a tidy, fast blog, tuned to show up in search engines." },
    ],
    offers: [
      {
        key: "landing",
        serviceType: "WebDevelopment",
        title: "Landing page",
        summary: "A single page focused on one product, service or campaign.",
        includes: ["Mobile-friendly design", "Contact form delivered to your email", "Basic search engine setup"],
        priceFrom: 100,
      },
      {
        key: "portfolio",
        serviceType: "WebDevelopment",
        title: "Company / portfolio site",
        summary: "A multi-page site for you or your company.",
        includes: ["Pages: home, about, services, contact", "Arabic and English", "Responsive design and search setup"],
        priceFrom: 150,
      },
      {
        key: "blog",
        serviceType: "ProcessAutomation",
        title: "Blog",
        summary: "A professional blog with a panel to add articles.",
        includes: ["A design that's comfortable to read", "Panel for articles and categories", "Fast, and tuned for search engines"],
        priceFrom: 180,
      },
      {
        key: "store",
        serviceType: "SystemArchitecture",
        title: "Online store",
        summary: "A store to show products and take orders.",
        includes: ["Products and a shopping cart", "Dashboard for products and orders", "Responsive design and search setup"],
        priceFrom: 350,
      },
    ],
  },
};
