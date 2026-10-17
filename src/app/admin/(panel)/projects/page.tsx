"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ListToolbar, publishQuery, SimplePager, type PublishFilter } from "@/components/admin/ListToolbar";
import { Loading, Notice, PageHeader, StatusBadge } from "@/components/admin/ui";
import { api } from "@/lib/admin/client";
import { errorMessage, formatDateTime } from "@/lib/admin/messages";
import type { Paged, ProjectListItem } from "@/lib/admin/types";
import { useDebounced } from "@/lib/admin/useDebounced";

export default function ProjectsAdminPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<PublishFilter>("all");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Paged<ProjectListItem> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const term = useDebounced(search);

  useEffect(() => setPage(1), [term, filter]);

  useEffect(() => {
    api
      .get<Paged<ProjectListItem>>(`/api/admin/projects?page=${page}&pageSize=20&search=${encodeURIComponent(term)}${publishQuery(filter)}`)
      .then(setData)
      .catch((e) => setError(errorMessage(e)));
  }, [page, term, filter]);

  return (
    <>
      <PageHeader
        title="المشاريع"
        actions={
          <Link href="/admin/projects/new" className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink hover:opacity-90">
            مشروع جديد
          </Link>
        }
      />
      <ListToolbar search={search} onSearch={setSearch} filter={filter} onFilter={setFilter} />
      <Notice notice={error ? { kind: "error", text: error } : null} />

      {!data ? (
        <Loading />
      ) : data.items.length === 0 ? (
        <p className="py-10 text-slate">{term || filter !== "all" ? "لا مشاريع تطابق البحث." : "لا مشاريع بعد. أنشئ أول مشروع."}</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-line bg-surface">
          <table className="w-full text-sm">
            <thead className="border-b border-line text-start text-slate">
              <tr>
                <th className="px-4 py-3 text-start font-medium">العنوان</th>
                <th className="px-4 py-3 text-start font-medium">الحالة</th>
                <th className="px-4 py-3 text-start font-medium">النوع</th>
                <th className="px-4 py-3 text-start font-medium">الترتيب</th>
                <th className="px-4 py-3 text-start font-medium">آخر تعديل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {data.items.map((p) => (
                <tr key={p.id} className="hover:bg-paper">
                  <td className="px-4 py-3">
                    <Link href={`/admin/projects/${p.id}`} className="font-medium hover:text-accent">
                      {p.titleAr}
                    </Link>
                    <div className="text-slate" dir="ltr">{p.titleEn || "—"}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <StatusBadge published={p.isPublished} />
                      {p.isFeatured && <span className="rounded-full bg-signal/20 px-2.5 py-0.5 text-xs font-medium">مميّز</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate">{p.isReal ? "حقيقي" : "تجريبي"}</td>
                  <td className="px-4 py-3 font-mono text-slate">{p.displayOrder}</td>
                  <td className="px-4 py-3 text-slate">{formatDateTime(p.updatedAt ?? p.createdAt)}</td>
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
