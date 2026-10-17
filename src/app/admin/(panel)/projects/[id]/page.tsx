"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CoverImage } from "@/components/admin/CoverImage";
import { Gallery } from "@/components/admin/Gallery";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { PublishBar } from "@/components/admin/PublishBar";
import { Button, Loading, Notice, PageHeader, useNotice } from "@/components/admin/ui";
import { api } from "@/lib/admin/client";
import { errorMessage } from "@/lib/admin/messages";
import type { ProjectAdmin } from "@/lib/admin/types";

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<ProjectAdmin | null>(null);
  const [busy, setBusy] = useState(false);
  const notice = useNotice();
  const message = (kind: "ok" | "error", text: string) => (kind === "ok" ? notice.ok(text) : notice.error(text));

  useEffect(() => {
    api.get<ProjectAdmin>(`/api/admin/projects/${id}`).then(setProject).catch((e) => notice.error(errorMessage(e)));
    if (new URLSearchParams(window.location.search).get("created") === "1") notice.ok("أُنشئ المشروع كمسودة. أضف الغلاف والصور ثم انشره.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function action(run: () => Promise<unknown>, success: string) {
    setBusy(true);
    try {
      await run();
      setProject(await api.get<ProjectAdmin>(`/api/admin/projects/${id}`));
      notice.ok(success);
    } catch (e) {
      notice.error(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!project || !confirm(`حذف "${project.titleAr}" مع كل صوره نهائياً؟`)) return;
    setBusy(true);
    try {
      await api.del(`/api/admin/projects/${id}`);
      router.replace("/admin/projects");
    } catch (e) {
      notice.error(errorMessage(e));
      setBusy(false);
    }
  }

  if (!project) return notice.notice ? <Notice notice={notice.notice} /> : <Loading />;


  return (
    <>
      <Link href="/admin/projects" className="text-sm text-slate hover:text-accent">المشاريع</Link>
      <PageHeader title={project.titleAr} />

      <div className="grid gap-8">
        <PublishBar
          published={project.isPublished}
          publishedAt={project.publishedAt}
          publicHref={`/ar/projects/${encodeURIComponent(project.slugAr)}`}
          busy={busy}
          onPublish={() => action(() => api.post(`/api/admin/projects/${id}/publish`), "نُشر المشروع وتحدّث الموقع.")}
          onUnpublish={() => action(() => api.post(`/api/admin/projects/${id}/unpublish`), "أُخفي المشروع من الموقع.")}
          onDelete={remove}
          extra={
            project.isPublished && (
              <Button
                onClick={() =>
                  action(
                    () => api.put(`/api/admin/projects/${id}/featured`, { isFeatured: !project.isFeatured }),
                    project.isFeatured ? "أُزيل من الصفحة الرئيسية." : "سيظهر في الصفحة الرئيسية.",
                  )
                }
                disabled={busy}
              >
                {project.isFeatured ? "إلغاء التمييز" : "تمييز في الرئيسية"}
              </Button>
            )
          }
        />
        <Notice notice={notice.notice} />

        <section>
          <h2 className="mb-3 font-semibold">صورة الغلاف</h2>
          <CoverImage
            endpoint={`/api/admin/projects/${id}/cover`}
            url={project.coverImageUrl}
            onChange={(url) => setProject({ ...project, coverImageUrl: url })}
            onMessage={message}
          />
        </section>

        <section>
          <h2 className="mb-3 font-semibold">المحتوى</h2>
          <ProjectForm project={project} onSaved={(saved) => setProject((p) => (p ? { ...saved, images: p.images } : saved))} />
        </section>

        <section>
          <h2 className="mb-3 font-semibold">معرض الصور</h2>
          <Gallery
            projectId={project.id}
            images={project.images}
            onChange={(images) => setProject((p) => (p ? { ...p, images } : p))}
            onMessage={message}
          />
        </section>
      </div>
    </>
  );
}
