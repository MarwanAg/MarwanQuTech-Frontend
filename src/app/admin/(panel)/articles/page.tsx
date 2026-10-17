"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ListToolbar, publishQuery, SimplePager, type PublishFilter } from "@/components/admin/ListToolbar";
import { Loading, Notice, PageHeader, StatusBadge } from "@/components/admin/ui";
import { api } from "@/lib/admin/client";
import { errorMessage, formatDateTime } from "@/lib/admin/messages";
import type { ArticleListItem, Paged } from "@/lib/admin/types";
import { useDebounced } from "@/lib/admin/useDebounced";

export default function ArticlesAdminPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<PublishFilter>("all");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Paged<ArticleListItem> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const term = useDebounced(search);

  useEffect(() => setPage(1), [term, filter]);

  useEffect(() => {
    api
      .get<Paged<ArticleListItem>>(`/api/admin/articles?page=${page}&pageSize=20&search=${encodeURIComponent(term)}${publishQuery(filter)}`)
      .then(setData)
      .catch((e) => setError(errorMessage(e)));
  }, [page, term, filter]);

  return (
    <>
      <PageHeader
        title="المقالات"
        actions={
          <Link href="/admin/articles/new" className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink hover:opacity-90">
            مقال جديد
          </Link>
        }
      />
      <ListToolbar search={search} onSearch={setSearch} filter={filter} onFilter={setFilter} />
      <Notice notice={error ? { kind: "error", text: error } : null} />

      {!data ? (
        <Loading />
      ) : data.items.length === 0 ? (
        <p className="py-10 text-slate">{term || filter !== "all" ? "لا مقالات تطابق البحث." : "لا مقالات بعد. اكتب أول مقال."}</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-line bg-surface">
          <table className="w-full text-sm">
            <thead className="border-b border-line text-slate">
              <tr>
                <th className="px-4 py-3 text-start font-medium">العنوان</th>
                <th className="px-4 py-3 text-start font-medium">الحالة</th>
                <th className="px-4 py-3 text-start font-medium">المشاهدات</th>
                <th className="px-4 py-3 text-start font-medium">آخر تعديل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {data.items.map((a) => (
                <tr key={a.id} className="hover:bg-paper">
                  <td className="px-4 py-3">
                    <Link href={`/admin/articles/${a.id}`} className="font-medium hover:text-accent">{a.titleAr}</Link>
                    <div className="text-slate" dir="ltr">{a.titleEn || "—"}</div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge published={a.isPublished} /></td>
                  <td className="px-4 py-3 font-mono text-slate">{a.viewsCount.toLocaleString("en")}</td>
                  <td className="px-4 py-3 text-slate">{formatDateTime(a.updatedAt ?? a.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {data && <SimplePager page={data.page} totalPages={data.totalPages} onPage={setPage} />}
    </>
  );
}
