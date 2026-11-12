import type { Metadata } from "next";
import { toJsonLd } from "@/lib/jsonLd";
import { CtaBand } from "@/components/SectionHeading";
import { about, socialLinks, type SkillGroup } from "@/content/profile";
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(jsonLd) }} />

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

      {content.skills.length > 0 && <Skills title={t.about.skills} groups={content.skills} />}

      <CtaBand
        id="about-cta"
        title={t.about.ctaTitle}
        body={t.about.ctaBody}
        action={{ href: paths.contact(locale), label: t.about.ctaAction }}
      />
    </>
  );
}

/** Technical skills, grouped. Each group is a labelled set of chips. */
function Skills({ title, groups }: { title: string; groups: SkillGroup[] }) {
  return (
    <section aria-labelledby="skills" className="py-14" data-reveal>
      <h2 id="skills" className="text-[1.75rem] leading-snug sm:text-[2.15rem]">
        {title}
      </h2>
      <dl className="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-2">
        {groups.map((group) => (
          <div key={group.title} className="border-t border-line pt-5">
            <dt className="font-display text-lg font-semibold">{group.title}</dt>
            <dd>
              <ul className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className="rounded-full border border-line bg-surface/60 px-3 py-1 text-sm text-slate" dir="auto">
                    {item}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
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
