"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/admin/client";
import { errorMessage, fieldErrors } from "@/lib/admin/messages";
import type { ArticleAdmin } from "@/lib/admin/types";
import { MarkdownEditor } from "./MarkdownEditor";
import { BilingualColumns, Button, Field, inputClass, Notice, useNotice } from "./ui";

type Values = {
  titleAr: string; titleEn: string;
  summaryAr: string; summaryEn: string;
  contentAr: string; contentEn: string;
  slugAr: string; slugEn: string;
};

const fromArticle = (a?: ArticleAdmin): Values => ({
  titleAr: a?.titleAr ?? "", titleEn: a?.titleEn ?? "",
  summaryAr: a?.summaryAr ?? "", summaryEn: a?.summaryEn ?? "",
  contentAr: a?.contentAr ?? "", contentEn: a?.contentEn ?? "",
  slugAr: a?.slugAr ?? "", slugEn: a?.slugEn ?? "",
});

const words = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);

/** Article texts in both languages. Arabic title alone is enough for a draft. */
export function ArticleForm({ article, onSaved }: { article?: ArticleAdmin; onSaved?: (a: ArticleAdmin) => void }) {
  const router = useRouter();
  const [values, setValues] = useState<Values>(() => fromArticle(article));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const notice = useNotice();

  const text = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));
  const set = (key: keyof Values) => (value: string) => setValues((v) => ({ ...v, [key]: value }));

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    notice.clear();
    const body = { ...values, slugAr: values.slugAr.trim() || null, slugEn: values.slugEn.trim() || null };

    try {
      if (article) {
        const saved = await api.put<ArticleAdmin>(`/api/admin/articles/${article.id}`, body);
        setValues(fromArticle(saved));
        onSaved?.(saved);
        notice.ok(saved.isPublished ? "حُفظت التعديلات وتحدّث الموقع." : "حُفظت المسودة.");
      } else {
        const created = await api.post<ArticleAdmin>("/api/admin/articles", body);
        router.replace(`/admin/articles/${created.id}?created=1`);
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
            <Field label="الملخص" htmlFor="summaryAr" error={errors.SummaryAr} count={values.summaryAr.length} max={500}>
              <textarea id="summaryAr" rows={3} value={values.summaryAr} onChange={text("summaryAr")} className={inputClass(errors.SummaryAr)} />
            </Field>
            <Field label="الرابط (slug)" hint="فارغ = من العنوان" htmlFor="slugAr" error={errors.SlugAr}>
              <input id="slugAr" value={values.slugAr} onChange={text("slugAr")} className={inputClass(errors.SlugAr)} />
            </Field>
            <Field label="المحتوى" hint={`${words(values.contentAr)} كلمة`} htmlFor="contentAr" error={errors.ContentAr}>
              <MarkdownEditor id="contentAr" dir="rtl" rows={24} value={values.contentAr} onChange={set("contentAr")} error={errors.ContentAr} />
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
            <Field label="Content" hint={`${words(values.contentEn)} words`} htmlFor="contentEn" error={errors.ContentEn}>
              <MarkdownEditor id="contentEn" dir="ltr" rows={24} value={values.contentEn} onChange={set("contentEn")} error={errors.ContentEn} />
            </Field>
          </>
        }
      />
      <Notice notice={notice.notice} />
      <div>
        <Button type="submit" variant="primary" disabled={busy}>
          {busy ? "جارٍ الحفظ…" : article ? "حفظ التعديلات" : "إنشاء المسودة"}
        </Button>
      </div>
    </form>
  );
}

/** Optional search-engine overrides; empty fields fall back to the article title / summary. */
export function SeoForm({ article, onSaved }: { article: ArticleAdmin; onSaved: (a: ArticleAdmin) => void }) {
  const [v, setV] = useState({
    titleAr: article.seoTitleAr,
    titleEn: article.seoTitleEn,
    descriptionAr: article.seoDescriptionAr,
    descriptionEn: article.seoDescriptionEn,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const notice = useNotice();
  const text = (key: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setV((s) => ({ ...s, [key]: e.target.value }));

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    try {
      await api.put(`/api/admin/articles/${article.id}/seo`, v);
      onSaved({ ...article, seoTitleAr: v.titleAr, seoTitleEn: v.titleEn, seoDescriptionAr: v.descriptionAr, seoDescriptionEn: v.descriptionEn });
      notice.ok("حُفظت إعدادات SEO.");
    } catch (error) {
      setErrors(fieldErrors(error));
      notice.error(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="grid gap-5">
      <BilingualColumns
        ar={
          <>
            <Field label="عنوان SEO" hint={`فارغ = ${article.titleAr || "العنوان"}`} htmlFor="seoTitleAr" error={errors.TitleAr} count={v.titleAr.length} max={70}>
              <input id="seoTitleAr" value={v.titleAr} onChange={text("titleAr")} className={inputClass(errors.TitleAr)} />
            </Field>
            <Field label="وصف SEO" hint="فارغ = الملخص" htmlFor="seoDescAr" error={errors.DescriptionAr} count={v.descriptionAr.length} max={160}>
              <textarea id="seoDescAr" rows={3} value={v.descriptionAr} onChange={text("descriptionAr")} className={inputClass(errors.DescriptionAr)} />
            </Field>
          </>
        }
        en={
          <>
            <Field label="SEO title" htmlFor="seoTitleEn" error={errors.TitleEn} count={v.titleEn.length} max={70}>
              <input id="seoTitleEn" dir="ltr" value={v.titleEn} onChange={text("titleEn")} className={inputClass(errors.TitleEn)} />
            </Field>
            <Field label="SEO description" htmlFor="seoDescEn" error={errors.DescriptionEn} count={v.descriptionEn.length} max={160}>
              <textarea id="seoDescEn" dir="ltr" rows={3} value={v.descriptionEn} onChange={text("descriptionEn")} className={inputClass(errors.DescriptionEn)} />
            </Field>
          </>
        }
      />
      <Notice notice={notice.notice} />
      <div>
        <Button type="submit" disabled={busy}>{busy ? "جارٍ الحفظ…" : "حفظ إعدادات SEO"}</Button>
      </div>
    </form>
  );
}
