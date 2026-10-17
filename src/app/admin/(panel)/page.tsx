"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Loading, Notice, PageHeader } from "@/components/admin/ui";
import { api } from "@/lib/admin/client";
import { errorMessage } from "@/lib/admin/messages";
import type { DashboardStats } from "@/lib/admin/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<DashboardStats>("/api/admin/dashboard").then(setStats).catch((e) => setError(errorMessage(e)));
  }, []);

  if (error) return <Notice notice={{ kind: "error", text: error }} />;
  if (!stats) return <Loading />;

  const n = (value: number) => value.toLocaleString("en");

  return (
    <>
      <PageHeader title="نظرة عامة" />

      <dl className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "رسائل غير مقروءة", value: n(stats.inquiriesUnread), detail: `من أصل ${n(stats.inquiriesTotal)}`, href: "/admin/inquiries?unread=1" },
          { label: "مشاريع منشورة", value: n(stats.projectsPublished), detail: `${n(stats.projectsTotal)} إجمالاً، ${n(stats.projectsFeatured)} مميّزة`, href: "/admin/projects" },
          { label: "مقالات منشورة", value: n(stats.articlesPublished), detail: `${n(stats.articlesTotal)} إجمالاً`, href: "/admin/articles" },
          { label: "مشاهدات المقالات", value: n(stats.articleViewsTotal), detail: "المحفوظة في قاعدة البيانات", href: "/admin/articles" },
        ].map((item) => (
          <Link key={item.label} href={item.href} className="bg-surface p-5 hover:bg-paper">
            <dt className="text-sm text-slate">{item.label}</dt>
            <dd className="mt-1 font-mono text-3xl font-medium" dir="ltr">
              {item.value}
            </dd>
            <dd className="mt-1 text-sm text-slate">{item.detail}</dd>
          </Link>
        ))}
      </dl>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">الأكثر قراءة</h2>
        {stats.topArticles.length === 0 ? (
          <p className="mt-3 text-slate">لا توجد مقالات منشورة بعد. <Link href="/admin/articles/new" className="text-accent hover:underline">اكتب أول مقال</Link></p>
        ) : (
          <ol className="mt-3 divide-y divide-line rounded-lg border border-line bg-surface">
            {stats.topArticles.map((a) => (
              <li key={a.id}>
                <Link href={`/admin/articles/${a.id}`} className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-paper">
                  <span className="truncate">{a.titleAr}</span>
                  <span className="shrink-0 font-mono text-sm text-slate" dir="ltr">
                    {n(a.viewsCount)}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>
    </>
  );
}
