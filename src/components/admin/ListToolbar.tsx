"use client";

import { inputClass } from "./ui";

export type PublishFilter = "all" | "published" | "draft";

export function ListToolbar({
  search,
  onSearch,
  filter,
  onFilter,
}: {
  search: string;
  onSearch: (value: string) => void;
  filter: PublishFilter;
  onFilter: (value: PublishFilter) => void;
}) {
  return (
    <div className="mb-5 flex flex-wrap gap-3">
      <input
        type="search"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="ابحث في العناوين…"
        aria-label="بحث"
        className={`${inputClass()} max-w-xs`}
      />
      <select value={filter} onChange={(e) => onFilter(e.target.value as PublishFilter)} aria-label="الحالة" className={`${inputClass()} w-auto`}>
        <option value="all">الكل</option>
        <option value="published">المنشور</option>
        <option value="draft">المسودات</option>
      </select>
    </div>
  );
}

export const publishQuery = (filter: PublishFilter) =>
  filter === "all" ? "" : `&isPublished=${filter === "published"}`;

export function SimplePager({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-5 flex items-center gap-3 text-sm">
      <button type="button" disabled={page <= 1} onClick={() => onPage(page - 1)} className="rounded border border-line px-3 py-1 disabled:opacity-40">
        السابق
      </button>
      <span className="text-slate">
        صفحة {page} من {totalPages}
      </span>
      <button type="button" disabled={page >= totalPages} onClick={() => onPage(page + 1)} className="rounded border border-line px-3 py-1 disabled:opacity-40">
        التالي
      </button>
    </div>
  );
}
