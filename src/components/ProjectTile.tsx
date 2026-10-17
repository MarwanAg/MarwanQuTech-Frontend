import Link from "next/link";
import type { ProjectCard } from "@/lib/api";
import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { mediaUrl, paths } from "@/lib/urls";

export function ProjectTile({ project, locale, t }: { project: ProjectCard; locale: Locale; t: Dictionary }) {
  const cover = mediaUrl(project.coverImageUrl);

  return (
    <article className="group">
      <Link href={paths.project(locale, project.slug)} className="block">
        <div className="aspect-[16/10] overflow-hidden rounded-md border border-line bg-code">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element -- already resized WebP from the API
            <img src={cover} alt="" loading="lazy" className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-end p-4 font-mono text-sm text-slate" dir="ltr">
              /{project.slug}
            </div>
          )}
        </div>
        <p className="mt-3 text-sm text-slate">{project.isReal ? t.projects.real : t.projects.demo}</p>
        <h3 className="mt-0.5 text-lg font-semibold leading-snug group-hover:text-accent">{project.title}</h3>
        {project.summary && <p className="mt-1 line-clamp-2 text-slate">{project.summary}</p>}
      </Link>
    </article>
  );
}
