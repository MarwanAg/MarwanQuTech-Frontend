"use client";

import { Button, StatusBadge } from "./ui";
import { formatDateTime } from "@/lib/admin/messages";

/** Status line + publish / unpublish / delete actions shared by projects and articles. */
export function PublishBar({
  published,
  publishedAt,
  publicHref,
  busy,
  onPublish,
  onUnpublish,
  onDelete,
  extra,
}: {
  published: boolean;
  publishedAt: string | null;
  publicHref: string | null;
  busy: boolean;
  onPublish: () => void;
  onUnpublish: () => void;
  onDelete: () => void;
  extra?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-line bg-surface px-4 py-3">
      <StatusBadge published={published} />
      {publishedAt && <span className="text-sm text-slate">أول نشر: {formatDateTime(publishedAt)}</span>}
      {published && publicHref && (
        <a href={publicHref} target="_blank" rel="noopener" className="text-sm text-accent hover:underline">
          عرض في الموقع
        </a>
      )}
      <div className="ms-auto flex flex-wrap gap-2">
        {extra}
        {published ? (
          <Button onClick={onUnpublish} disabled={busy}>إخفاء من الموقع</Button>
        ) : (
          <Button variant="primary" onClick={onPublish} disabled={busy}>نشر</Button>
        )}
        <Button variant="danger" onClick={onDelete} disabled={busy}>حذف</Button>
      </div>
    </div>
  );
}
