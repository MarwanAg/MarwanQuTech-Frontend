import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { PageIntro } from "@/components/PageIntro";
import { getDictionary } from "@/lib/dictionary";
import { isLocale } from "@/lib/i18n";
import { resolveLocale } from "@/lib/page";
import { paths } from "@/lib/urls";

const SERVICE_KEYS = [
  "WebDevelopment",
  "ApiDevelopment",
  "SystemArchitecture",
  "ProcessAutomation",
  "Consulting",
  "Maintenance",
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

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, t } = await resolveLocale(params);
  const { fields, ...messages } = t.errors;

  return (
    <div className="grid pb-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:gap-12">
      <PageIntro title={t.contact.title} intro={t.contact.intro} />
      <div className="md:pt-16">
        <ContactForm
          language={locale === "en" ? "En" : "Ar"}
          labels={t.contact}
          services={SERVICE_KEYS.map((key) => ({ value: key, label: t.services[key].title }))}
          errors={{ messages, fields }}
        />
      </div>
    </div>
  );
}
