import type { Metadata } from "next";
import Link from "next/link";
import { about, socialLinks, type TimelineEntry } from "@/content/profile";
import { getDictionary } from "@/lib/dictionary";
import { isLocale } from "@/lib/i18n";
import { resolveLocale } from "@/lib/page";
import { paths, siteUrl } from "@/lib/urls";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    title: t.about.title,
    description: t.about.description,
    alternates: { canonical: paths.about(locale), languages: { ar: paths.about("ar"), en: paths.about("en") } },
    openGraph: { type: "profile", title: t.home.greeting, description: t.about.description },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale, t } = await resolveLocale(params);
  const content = about[locale];
  const [lead, ...rest] = content.bio;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: t.home.greeting,
      jobTitle: t.home.role,
      url: `${siteUrl()}${paths.about(locale)}`,
      address: { "@type": "PostalAddress", addressLocality: "Aqaba", addressCountry: "JO" },
      sameAs: socialLinks.map((l) => l.href),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="grid gap-12 pt-12 pb-16 md:grid-cols-[minmax(0,1.5fr)_minmax(0,0.8fr)] md:pt-20">
        <div>
          <p className="text-slate">{t.home.role}</p>
          <h1 className="mt-4 text-[2.4rem] leading-[1.3] sm:text-[3.2rem]">{t.home.greeting}</h1>
          {lead && <p className="mt-8 max-w-[60ch] text-xl leading-[1.9]">{lead}</p>}
          {rest.map((paragraph) => (
            <p key={paragraph} className="mt-5 max-w-[62ch] text-lg leading-[1.9] text-slate">
              {paragraph}
            </p>
          ))}
        </div>

        <aside aria-labelledby="find-me" className="self-start rounded-2xl border border-line bg-surface/70 p-6 md:mt-24">
          <h2 id="find-me" className="text-lg">
            {t.about.findMe}
          </h2>
          <ul className="mt-5 grid gap-3">
            {socialLinks.map((link) => (
              <li key={link.kind}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="group flex items-center justify-between gap-4 rounded-xl border border-line px-4 py-3 transition-colors hover:border-accent"
                >
                  <span className="font-medium transition-colors group-hover:text-accent" dir="ltr">
                    {link.label}
                  </span>
                  <ExternalIcon />
                  <span className="sr-only">{t.about.opensInNewTab}</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-line pt-5 text-sm text-slate">{t.home.nameMeaning}</p>
        </aside>
      </section>

      {content.experience.length > 0 && <Timeline id="experience" title={t.about.experience} entries={content.experience} />}
      {content.education.length > 0 && <Timeline id="education" title={t.about.education} entries={content.education} />}

      <section
        aria-labelledby="about-cta"
        className="mt-10 grid gap-8 rounded-3xl border border-line bg-[linear-gradient(135deg,var(--brand),var(--paper)_62%,var(--deep))] px-7 py-12 sm:px-12 md:grid-cols-[1fr_auto] md:items-center"
      >
        <div>
          <h2 id="about-cta" className="text-[1.7rem] leading-[1.45] sm:text-[2.1rem]">
            {t.about.ctaTitle}
          </h2>
          <p className="mt-4 max-w-[56ch] text-slate">{t.about.ctaBody}</p>
        </div>
        <Link
          href={paths.contact(locale)}
          className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 font-medium text-accent-ink transition-colors hover:bg-ink"
        >
          {t.about.ctaAction}
        </Link>
      </section>
    </>
  );
}

/** Experience and education share the queue's rail: a real sequence, newest first. */
function Timeline({ id, title, entries }: { id: string; title: string; entries: TimelineEntry[] }) {
  return (
    <section aria-labelledby={id} className="py-14">
      <h2 id={id} className="text-[1.75rem] leading-snug sm:text-[2.15rem]">
        {title}
      </h2>
      <ol className="relative mt-10 max-w-[760px]">
        <span aria-hidden className="absolute inset-y-2 start-[0.4375rem] w-px bg-brand" />
        {entries.map((entry, index) => (
          <li key={`${entry.title}-${entry.period}`} className="relative grid grid-cols-[1rem_1fr] gap-x-6 pb-10 last:pb-0">
            <span className="flex justify-center pt-2.5">
              <span
                aria-hidden
                className={index === 0 ? "size-3 rounded-full bg-accent" : "size-2.5 rounded-full border-2 border-brand bg-paper"}
              />
            </span>
            <div>
              <p className="text-sm text-slate">{entry.period}</p>
              <h3 className="mt-1 text-xl">{entry.title}</h3>
              <p className="text-accent">{entry.place}</p>
              {entry.body && <p className="mt-2 max-w-[62ch] text-slate">{entry.body}</p>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ExternalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden className="text-slate rtl:-scale-x-100">
      <path d="M9 3h4v4" />
      <path d="M13 3L7 9" />
      <path d="M12 9.5V12a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1h2.5" />
    </svg>
  );
}
