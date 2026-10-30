import type { Metadata } from "next";
import { OfferList } from "@/components/business/OfferList";
import { ProblemList } from "@/components/business/ProblemList";
import { ServiceGroupList } from "@/components/business/ServiceGroupList";
import { PageIntro } from "@/components/PageIntro";
import { CtaBand, SectionHeading } from "@/components/SectionHeading";
import { business } from "@/content/business";
import { getDictionary } from "@/lib/dictionary";
import { isLocale } from "@/lib/i18n";
import { toJsonLd } from "@/lib/jsonLd";
import { resolveLocale } from "@/lib/page";
import { paths, siteUrl } from "@/lib/urls";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    title: t.solutions.title,
    description: t.solutions.description,
    alternates: { canonical: paths.solutions(locale), languages: { ar: paths.solutions("ar"), en: paths.solutions("en") } },
  };
}

export default async function SolutionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, t } = await resolveLocale(params);
  const content = business[locale];
  const s = t.solutions;

  // Offers as structured data, so search engines can show the services with their starting prices.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "MarwanQuTech",
    url: `${siteUrl()}${paths.solutions(locale)}`,
    areaServed: "JO",
    address: { "@type": "PostalAddress", addressLocality: "Aqaba", addressCountry: "JO" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: s.offersTitle,
      itemListElement: content.offers.map((offer) => ({
        "@type": "Offer",
        name: offer.title,
        description: offer.summary,
        ...(offer.priceFrom !== null
          ? { priceSpecification: { "@type": "PriceSpecification", minPrice: offer.priceFrom, priceCurrency: "JOD" } }
          : {}),
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(jsonLd) }} />
      <PageIntro title={s.title} intro={s.intro} />

      <section aria-labelledby="problems" className="pb-16">
        <SectionHeading id="problems" title={s.problemsTitle} />
        <div className="mt-8">
          <ProblemList problems={content.problems} locale={locale} action={t.home.problemAction} />
        </div>
      </section>

      <section aria-labelledby="groups" className="py-16">
        <SectionHeading id="groups" title={s.groupsTitle} />
        <div className="mt-10">
          <ServiceGroupList groups={content.groups} detailed />
        </div>
      </section>

      <section aria-labelledby="offers" className="py-16">
        <SectionHeading id="offers" title={s.offersTitle} intro={s.offersIntro} />
        <div className="mt-10">
          <OfferList offers={content.offers} locale={locale} t={t} />
        </div>
        <p className="mt-6 max-w-[70ch] text-sm text-slate">{s.pricingNote}</p>
      </section>

      <CtaBand
        id="solutions-cta"
        title={s.ctaTitle}
        body={s.ctaBody}
        action={{ href: paths.contactWith(locale, { service: "Consulting" }), label: s.ctaAction }}
      />
    </>
  );
}
