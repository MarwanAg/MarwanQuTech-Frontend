import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { PageIntro } from "@/components/PageIntro";
import { business } from "@/content/business";
import { getDictionary } from "@/lib/dictionary";
import { isLocale } from "@/lib/i18n";
import { resolveLocale } from "@/lib/page";
import { paths } from "@/lib/urls";

const SERVICE_KEYS = [
  "WebDevelopment",
  "SystemArchitecture",
  "ProcessAutomation",
  "Maintenance",
  "Consulting",
  "Other",
] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    title: t.contact.title,
    description: t.contact.intro,
    alternates: { canonical: paths.contact(locale), languages: { ar: paths.contact("ar"), en: paths.contact("en") } },
  };
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export default async function ContactPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: SearchParams }) {
  const { locale, t } = await resolveLocale(params);
  const { fields, ...messages } = t.errors;
  const content = business[locale];
  const query = await searchParams;

  // Links from the solutions/problem cards pre-select what the visitor clicked on.
  const problem = content.problems.find((p) => p.key === first(query.problem));
  const offer = content.offers.find((o) => o.key === first(query.offer));
  const service =
    first(query.service) ??
    offer?.serviceType ??
    (problem ? content.groups.find((g) => g.key === problem.group)?.serviceType : undefined);

  return (
    <div className="grid pb-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:gap-12">
      <PageIntro title={t.contact.title} intro={t.contact.intro} />
      <div className="md:pt-16">
        <ContactForm
          language={locale === "en" ? "En" : "Ar"}
          labels={t.contact}
          choices={{
            services: SERVICE_KEYS.map((key) => ({ value: key, label: t.services[key].title })),
            problems: [
              ...content.problems.map((p) => ({ value: p.key, label: p.problem })),
              { value: "other", label: t.contact.options.problemOther },
            ],
            workflow: t.contact.options.workflow,
            size: t.contact.options.size,
            budget: t.contact.options.budget,
            timeline: t.contact.options.timeline,
            offers: content.offers.map((o) => ({ value: o.key, label: o.title })),
          }}
          preset={{ service, problem: problem?.key, offer: offer?.key }}
          errors={{ messages, fields }}
        />
      </div>
    </div>
  );
}
