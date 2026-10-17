import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { Pagination } from "@/components/Pagination";
import { ProjectTile } from "@/components/ProjectTile";
import { api, emptyPage, safely, type ProjectCard } from "@/lib/api";
import { getDictionary } from "@/lib/dictionary";
import { isLocale } from "@/lib/i18n";
import { pageNumber, resolveLocale } from "@/lib/page";
import { paths } from "@/lib/urls";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    title: t.projects.title,
    description: t.projects.intro,
    alternates: { canonical: paths.projects(locale), languages: { ar: paths.projects("ar"), en: paths.projects("en") } },
  };
}

export default async function ProjectsPage({ params, searchParams }: Props) {
  const { locale, t } = await resolveLocale(params);
  const page = pageNumber((await searchParams).page);

  const result = (await safely(api.projects(locale, { page, pageSize: 12 }), null)) ?? emptyPage<ProjectCard>();

  return (
    <>
      <PageIntro title={t.projects.title} intro={t.projects.intro} />
      {result.items.length === 0 ? (
        <p className="text-slate">{t.projects.empty}</p>
      ) : (
        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {result.items.map((project) => (
            <ProjectTile key={project.id} project={project} locale={locale} t={t} />
          ))}
        </div>
      )}
      <Pagination
        page={result.page}
        totalPages={result.totalPages}
        href={(p) => `${paths.projects(locale)}${p > 1 ? `?page=${p}` : ""}`}
        t={t}
      />
    </>
  );
}
