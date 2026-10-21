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
        <div className="aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-surface transition-colors group-hover:border-accent/60">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element -- already resized WebP from the API
            <img src={cover} alt="" loading="lazy" className="size-full object-cover" />
          ) : (
            // No cover yet: the brand mark on the navy gradient, so the grid never shows an empty box.
            <div
              aria-hidden
              className="grid size-full place-items-center bg-[linear-gradient(135deg,var(--brand),var(--deep))]"
            >
              <span className="font-display text-6xl font-semibold text-accent/45" dir="ltr">
                Qu
              </span>
            </div>
          )}
        </div>
        <p className="mt-4 text-sm text-slate">
          <span
            className={`inline-block rounded-full border px-2.5 py-0.5 ${
              project.isReal ? "border-accent/50 text-accent" : "border-line"
            }`}
          >
            {project.isReal ? t.projects.real : t.projects.demo}
          </span>
        </p>
        <h3 className="mt-3 text-xl leading-snug transition-colors group-hover:text-accent">{project.title}</h3>
        {project.summary && <p className="mt-1.5 line-clamp-2 text-slate">{project.summary}</p>}
      </Link>
    </article>
  );
}
