"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Loading, Notice, PageHeader, useNotice } from "@/components/admin/ui";
import { api } from "@/lib/admin/client";
import { errorMessage, formatDateTime, serviceLabels } from "@/lib/admin/messages";
import type { Inquiry } from "@/lib/admin/types";

export default function InquiryPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const notice = useNotice();

  // Opening a message marks it as read (the API does it on GET).
  useEffect(() => {
    api.get<Inquiry>(`/api/admin/inquiries/${id}`).then(setInquiry).catch((e) => notice.error(errorMessage(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function markUnread() {
    try {
      await api.put(`/api/admin/inquiries/${id}/read`, { isRead: false });
      router.push("/admin/inquiries");
    } catch (e) {
      notice.error(errorMessage(e));
    }
  }

  async function remove() {
    if (!confirm("حذف هذه الرسالة نهائياً؟")) return;
    try {
      await api.del(`/api/admin/inquiries/${id}`);
      router.replace("/admin/inquiries");
    } catch (e) {
      notice.error(errorMessage(e));
    }
  }

  if (!inquiry) return notice.notice ? <Notice notice={notice.notice} /> : <Loading />;

  const replySubject = inquiry.language === "En" ? "Re: your request — MarwanQuTech" : "بخصوص طلبك — MarwanQuTech";

  return (
    <>
      <Link href="/admin/inquiries" className="text-sm text-slate hover:text-accent">الرسائل</Link>
      <PageHeader
        title={inquiry.clientName}
        actions={
          <>
            <a
              href={`mailto:${inquiry.email}?subject=${encodeURIComponent(replySubject)}`}
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink hover:opacity-90"
            >
              الرد بالبريد
            </a>
            <Button onClick={markUnread}>تعليم كغير مقروءة</Button>
            <Button variant="danger" onClick={remove}>حذف</Button>
          </>
        }
      />
      <Notice notice={notice.notice} />

      <dl className="grid gap-x-8 gap-y-4 rounded-lg border border-line bg-surface p-5 sm:grid-cols-[10rem_1fr]">
        <dt className="text-sm text-slate">البريد</dt>
        <dd dir="ltr" className="text-start"><a href={`mailto:${inquiry.email}`} className="text-accent hover:underline">{inquiry.email}</a></dd>
        <dt className="text-sm text-slate">الهاتف</dt>
        <dd dir="ltr" className="text-start">{inquiry.phone ? <a href={`tel:${inquiry.phone}`} className="text-accent hover:underline">{inquiry.phone}</a> : "—"}</dd>
        <dt className="text-sm text-slate">الخدمة</dt>
        <dd>{serviceLabels[inquiry.serviceType]}</dd>
        <dt className="text-sm text-slate">لغة الزائر</dt>
        <dd>{inquiry.language === "En" ? "الإنجليزية — ردّ بالإنجليزية" : "العربية"}</dd>
        <dt className="text-sm text-slate">وصلت في</dt>
        <dd>{formatDateTime(inquiry.createdAt)}</dd>
      </dl>

      <h2 className="mt-8 font-semibold">التفاصيل</h2>
      <p dir="auto" className="mt-3 max-w-[70ch] whitespace-pre-wrap rounded-lg border border-line bg-surface p-5 leading-relaxed">
        {inquiry.details}
      </p>
    </>
  );
}
