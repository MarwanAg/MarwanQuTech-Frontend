"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SimplePager } from "@/components/admin/ListToolbar";
import { inputClass, Loading, Notice, PageHeader } from "@/components/admin/ui";
import { api } from "@/lib/admin/client";
import { errorMessage, formatDateTime, serviceLabels } from "@/lib/admin/messages";
import type { InquiryListItem, Paged } from "@/lib/admin/types";
import { useDebounced } from "@/lib/admin/useDebounced";

export default function InquiriesPage() {
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [service, setService] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Paged<InquiryListItem> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const term = useDebounced(search);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("unread") === "1") setUnreadOnly(true);
  }, []);

  useEffect(() => setPage(1), [unreadOnly, service, term]);

  useEffect(() => {
    const query = new URLSearchParams({ page: String(page), pageSize: "20" });
    if (unreadOnly) query.set("isRead", "false");
    if (service) query.set("serviceType", service);
    if (term) query.set("search", term);
    api.get<Paged<InquiryListItem>>(`/api/admin/inquiries?${query}`).then(setData).catch((e) => setError(errorMessage(e)));
  }, [page, unreadOnly, service, term]);

  return (
    <>
      <PageHeader title="الرسائل" />
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث في الأسماء والتفاصيل…" aria-label="بحث" className={`${inputClass()} max-w-xs`} />
        <select value={service} onChange={(e) => setService(e.target.value)} aria-label="نوع الخدمة" className={`${inputClass()} w-auto`}>
          <option value="">كل الخدمات</option>
          {Object.entries(serviceLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={unreadOnly} onChange={(e) => setUnreadOnly(e.target.checked)} className="size-4 accent-[var(--accent)]" />
          غير المقروءة فقط
        </label>
      </div>
      <Notice notice={error ? { kind: "error", text: error } : null} />

      {!data ? (
        <Loading />
      ) : data.items.length === 0 ? (
        <p className="py-10 text-slate">{unreadOnly ? "لا رسائل غير مقروءة." : "لا رسائل بعد. ستظهر هنا رسائل نموذج التواصل."}</p>
      ) : (
        <ul className="divide-y divide-line rounded-lg border border-line bg-surface">
          {data.items.map((m) => (
            <li key={m.id}>
              <Link href={`/admin/inquiries/${m.id}`} className="grid gap-1 px-4 py-3.5 hover:bg-paper sm:grid-cols-[1fr_auto] sm:gap-x-6">
                <span className="flex items-center gap-2">
                  {!m.isRead && <span aria-label="غير مقروءة" className="size-2 shrink-0 rounded-full bg-signal" />}
                  <span className={m.isRead ? "" : "font-semibold"}>{m.clientName}</span>
                  <span className="text-sm text-slate">{serviceLabels[m.serviceType]}</span>
                </span>
                <span className="text-sm text-slate sm:row-span-2 sm:self-center">{formatDateTime(m.createdAt)}</span>
                <span className="line-clamp-1 text-sm text-slate">{m.preview}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {data && <SimplePager page={data.page} totalPages={data.totalPages} onPage={setPage} />}
    </>
  );
}
