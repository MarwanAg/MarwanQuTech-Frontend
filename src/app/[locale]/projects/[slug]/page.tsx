import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Markdown } from "@/components/Markdown";
import { api } from "@/lib/api";
import { formatDate, isLocale, otherLocale, type Locale } from "@/lib/i18n";
import { decodeSlug, resolveLocale } from "@/lib/page";
import { mediaUrl, paths } from "@/lib/urls";

export const revalidate = 3600;

export function generateStaticParams() {
  return []; // rendered on first visit, then cached until the API revalidates it
}

type Props = { params: Promise<{ locale: string; slug: string }> };

/**
 * Loads the project in the requested language. If the slug belongs to the other language
 * (e.g. after switching language on this page), redirects to the matching slug.
 */
async function load(locale: Locale, rawSlug: string) {
  const slug = decodeSlug(rawSlug);
  const project = await api.project(locale, slug);
  if (project) return project;

  const other = await api.project(otherLocale(locale), slug);
  if (other?.alternateSlug) redirect(paths.project(locale, other.alternateSlug));

  notFound();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const project = await api.project(locale, decodeSlug(slug));
  if (!project) return {};

  const cover = mediaUrl(project.coverImageUrl);
  const ar = locale === "ar" ? project.slug : project.alternateSlug;
  const en = locale === "en" ? project.slug : project.alternateSlug;

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: paths.project(locale, project.slug),
      languages: {
        ...(ar ? { ar: paths.project("ar", ar) } : {}),
        ...(en ? { en: paths.project("en", en) } : {}),
      },
    },
    openGraph: { title: project.title, description: project.summary, images: cover ? [cover] : undefined },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { locale, t } = await resolveLocale(params);
  const project = await load(locale, (await params).slug);
  const cover = mediaUrl(project.coverImageUrl);

  return (
    <article className="pb-8">
      <header className="py-12 md:py-16">
        <Link href={paths.projects(locale)} className="text-sm text-slate hover:text-accent">
          {t.projects.back}
        </Link>
        <p className="mt-6 text-sm text-slate">{project.isReal ? t.projects.real : t.projects.demo}</p>
        <h1 className="mt-1 max-w-[24ch] text-[2rem] font-semibold leading-tight sm:text-[2.6rem]">{project.title}</h1>
        {project.summary && <p className="mt-4 max-w-[60ch] text-lg text-slate">{project.summary}</p>}

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-accent px-5 py-2 font-medium text-accent-ink transition-colors hover:bg-ink">
              {t.projects.live}
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="rounded-md border border-line px-4 py-2 font-medium hover:border-accent hover:text-accent">
              {t.projects.source}
            </a>
          )}
          {project.publishedAt && (
            <span className="text-slate">
              {t.projects.published} <time dateTime={project.publishedAt}>{formatDate(project.publishedAt, locale)}</time>
            </span>
          )}
        </div>
      </header>

      {cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cover} alt={project.title} className="mb-12 w-full rounded-md border border-line" />
      )}

      <Markdown source={project.description} />

      {project.images.length > 0 && (
        <section aria-labelledby="gallery" className="mt-16 border-t border-line pt-10">
          <h2 id="gallery" className="text-xl font-semibold">
            {t.projects.gallery}
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {project.images.map((image) => (
              <figure key={image.url}>
                <a href={mediaUrl(image.url) ?? undefined} target="_blank" rel="noopener noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={mediaUrl(image.url) ?? ""} alt={image.alt} loading="lazy" className="w-full rounded-md border border-line" />
                </a>
                {image.alt !== project.title && <figcaption className="mt-2 text-sm text-slate">{image.alt}</figcaption>}
              </figure>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

