"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArticleForm, SeoForm } from "@/components/admin/ArticleForm";
import { CoverImage } from "@/components/admin/CoverImage";
import { PublishBar } from "@/components/admin/PublishBar";
import { Loading, Notice, PageHeader, useNotice } from "@/components/admin/ui";
import { api } from "@/lib/admin/client";
import { errorMessage } from "@/lib/admin/messages";
import type { ArticleAdmin } from "@/lib/admin/types";

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [article, setArticle] = useState<ArticleAdmin | null>(null);
  const [busy, setBusy] = useState(false);
  const notice = useNotice();
  const message = (kind: "ok" | "error", text: string) => (kind === "ok" ? notice.ok(text) : notice.error(text));

  useEffect(() => {
    api.get<ArticleAdmin>(`/api/admin/articles/${id}`).then(setArticle).catch((e) => notice.error(errorMessage(e)));
    if (new URLSearchParams(window.location.search).get("created") === "1") notice.ok("حُفظت المسودة. أكمل الترجمة ثم انشر.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function action(run: () => Promise<unknown>, success: string) {
    setBusy(true);
    try {
      await run();
      setArticle(await api.get<ArticleAdmin>(`/api/admin/articles/${id}`));
      notice.ok(success);
    } catch (e) {
      notice.error(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!article || !confirm(`حذف "${article.titleAr}" نهائياً؟`)) return;
    setBusy(true);
    try {
      await api.del(`/api/admin/articles/${id}`);
      router.replace("/admin/articles");
    } catch (e) {
      notice.error(errorMessage(e));
      setBusy(false);
    }
  }

  if (!article) return notice.notice ? <Notice notice={notice.notice} /> : <Loading />;

  return (
    <>
      <Link href="/admin/articles" className="text-sm text-slate hover:text-accent">المقالات</Link>
      <PageHeader title={article.titleAr} />

      <div className="grid gap-8">
        <PublishBar
          published={article.isPublished}
          publishedAt={article.publishedAt}
          publicHref={`/ar/blog/${encodeURIComponent(article.slugAr)}`}
          busy={busy}
          onPublish={() => action(() => api.post(`/api/admin/articles/${id}/publish`), "نُشر المقال وتحدّث الموقع.")}
          onUnpublish={() => action(() => api.post(`/api/admin/articles/${id}/unpublish`), "أُخفي المقال من الموقع.")}
          onDelete={remove}
          extra={<span className="self-center text-sm text-slate">{article.viewsCount.toLocaleString("en")} مشاهدة</span>}
        />
        <Notice notice={notice.notice} />

        <section>
          <h2 className="mb-3 font-semibold">صورة الغلاف</h2>
          <CoverImage
            endpoint={`/api/admin/articles/${id}/cover`}
            url={article.coverImageUrl}
            onChange={(url) => setArticle({ ...article, coverImageUrl: url })}
            onMessage={message}
          />
        </section>

        <section>
          <h2 className="mb-3 font-semibold">المحتوى</h2>
          <ArticleForm article={article} onSaved={setArticle} />
        </section>

        <section>
          <h2 className="mb-1 font-semibold">محركات البحث</h2>
          <p className="mb-4 text-sm text-slate">اختياري. اتركها فارغة ليُستخدم العنوان والملخص.</p>
          <SeoForm article={article} onSaved={setArticle} />
        </section>
      </div>
    </>
  );
}
