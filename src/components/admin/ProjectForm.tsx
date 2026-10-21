"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/admin/client";
import { errorMessage, fieldErrors } from "@/lib/admin/messages";
import type { ProjectAdmin } from "@/lib/admin/types";
import { MarkdownEditor } from "./MarkdownEditor";
import { BilingualColumns, Button, Field, inputClass, Notice, useNotice } from "./ui";

type Values = {
  titleAr: string; titleEn: string;
  summaryAr: string; summaryEn: string;
  descriptionAr: string; descriptionEn: string;
  slugAr: string; slugEn: string;
  githubUrl: string; liveUrl: string;
  isReal: boolean; displayOrder: number;
};

const fromProject = (p?: ProjectAdmin): Values => ({
  titleAr: p?.titleAr ?? "", titleEn: p?.titleEn ?? "",
  summaryAr: p?.summaryAr ?? "", summaryEn: p?.summaryEn ?? "",
  descriptionAr: p?.descriptionAr ?? "", descriptionEn: p?.descriptionEn ?? "",
  slugAr: p?.slugAr ?? "", slugEn: p?.slugEn ?? "",
  githubUrl: p?.githubUrl ?? "", liveUrl: p?.liveUrl ?? "",
  isReal: p?.isReal ?? true, displayOrder: p?.displayOrder ?? 0,
});

/** Create or edit the texts, slugs and links of a project. */
export function ProjectForm({ project, onSaved }: { project?: ProjectAdmin; onSaved?: (p: ProjectAdmin) => void }) {
  const router = useRouter();
  const [values, setValues] = useState<Values>(() => fromProject(project));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const notice = useNotice();

  const set = <K extends keyof Values>(key: K) => (value: Values[K]) => setValues((v) => ({ ...v, [key]: value }));
  const text = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    notice.clear();

    const body = {
      ...values,
      slugAr: values.slugAr.trim() || null,
      slugEn: values.slugEn.trim() || null,
      githubUrl: values.githubUrl.trim() || null,
      liveUrl: values.liveUrl.trim() || null,
    };

    try {
      if (project) {
        const saved = await api.put<ProjectAdmin>(`/api/admin/projects/${project.id}`, body);
        setValues(fromProject(saved)); // shows the generated / normalized slugs
        onSaved?.(saved);
        notice.ok(saved.isPublished ? "حُفظت التعديلات وتحدّث الموقع." : "حُفظت التعديلات.");
      } else {
        const created = await api.post<ProjectAdmin>("/api/admin/projects", body);
        router.replace(`/admin/projects/${created.id}?created=1`);
      }
    } catch (error) {
      setErrors(fieldErrors(error));
      notice.error(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="grid gap-6">
      <BilingualColumns
        ar={
          <>
            <Field label="العنوان" htmlFor="titleAr" error={errors.TitleAr} count={values.titleAr.length} max={200}>
              <input id="titleAr" value={values.titleAr} onChange={text("titleAr")} required className={inputClass(errors.TitleAr)} />
            </Field>
            <Field label="الملخص" hint="يظهر في البطاقات ووصف محركات البحث" htmlFor="summaryAr" error={errors.SummaryAr} count={values.summaryAr.length} max={500}>
              <textarea id="summaryAr" rows={3} value={values.summaryAr} onChange={text("summaryAr")} className={inputClass(errors.SummaryAr)} />
            </Field>
            <Field label="الرابط (slug)" hint="اتركه فارغاً ليُولَّد من العنوان" htmlFor="slugAr" error={errors.SlugAr}>
              <input id="slugAr" value={values.slugAr} onChange={text("slugAr")} className={inputClass(errors.SlugAr)} />
            </Field>
            <Field label="الوصف" htmlFor="descriptionAr" error={errors.DescriptionAr}>
              <MarkdownEditor id="descriptionAr" dir="rtl" value={values.descriptionAr} onChange={set("descriptionAr")} error={errors.DescriptionAr} />
            </Field>
          </>
        }
        en={
          <>
            <Field label="Title" htmlFor="titleEn" error={errors.TitleEn} count={values.titleEn.length} max={200}>
              <input id="titleEn" dir="ltr" value={values.titleEn} onChange={text("titleEn")} className={inputClass(errors.TitleEn)} />
            </Field>
            <Field label="Summary" htmlFor="summaryEn" error={errors.SummaryEn} count={values.summaryEn.length} max={500}>
              <textarea id="summaryEn" dir="ltr" rows={3} value={values.summaryEn} onChange={text("summaryEn")} className={inputClass(errors.SummaryEn)} />
            </Field>
            <Field label="Slug" hint="فارغ = من العنوان" htmlFor="slugEn" error={errors.SlugEn}>
              <input id="slugEn" dir="ltr" value={values.slugEn} onChange={text("slugEn")} className={inputClass(errors.SlugEn)} />
            </Field>
            <Field label="Description" htmlFor="descriptionEn" error={errors.DescriptionEn}>
              <MarkdownEditor id="descriptionEn" dir="ltr" value={values.descriptionEn} onChange={set("descriptionEn")} error={errors.DescriptionEn} />
            </Field>
          </>
        }
      />

      <fieldset className="grid gap-5 rounded-lg border border-line p-5 sm:grid-cols-2">
        <legend className="px-2 text-sm font-semibold">روابط وإعدادات</legend>
        <Field label="رابط GitHub" htmlFor="githubUrl" error={errors.GithubUrl}>
          <input id="githubUrl" type="url" dir="ltr" placeholder="https://github.com/…" value={values.githubUrl} onChange={text("githubUrl")} className={inputClass(errors.GithubUrl)} />
        </Field>
        <Field label="رابط النسخة الحية" htmlFor="liveUrl" error={errors.LiveUrl}>
          <input id="liveUrl" type="url" dir="ltr" placeholder="https://…" value={values.liveUrl} onChange={text("liveUrl")} className={inputClass(errors.LiveUrl)} />
        </Field>
        <Field label="ترتيب الظهور" hint="الأصغر يظهر أولاً" htmlFor="displayOrder" error={errors.DisplayOrder}>
          <input id="displayOrder" type="number" min={0} dir="ltr" value={values.displayOrder} onChange={(e) => set("displayOrder")(Number(e.target.value) || 0)} className={inputClass(errors.DisplayOrder)} />
        </Field>
        <label className="flex items-center gap-2 self-end pb-2 text-sm">
          <input type="checkbox" checked={values.isReal} onChange={(e) => set("isReal")(e.target.checked)} className="size-4 accent-[var(--accent)]" />
          مشروع حقيقي لعميل (وليس تجريبياً)
        </label>
      </fieldset>

      <Notice notice={notice.notice} />
      <div className="flex gap-3">
        <Button type="submit" variant="primary" disabled={busy}>
          {busy ? "جارٍ الحفظ…" : project ? "حفظ التعديلات" : "إنشاء المشروع"}
        </Button>
      </div>
    </form>
  );
}
