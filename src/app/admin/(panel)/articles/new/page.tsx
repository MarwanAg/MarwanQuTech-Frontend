"use client";

import Link from "next/link";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { PageHeader } from "@/components/admin/ui";

export default function NewArticlePage() {
  return (
    <>
      <Link href="/admin/articles" className="text-sm text-slate hover:text-accent">المقالات</Link>
      <PageHeader title="مقال جديد" />
      <p className="-mt-4 mb-6 max-w-[70ch] text-sm text-slate">
        اكتب النسخة العربية أولاً واحفظها كمسودة، وأضف الترجمة لاحقاً. النشر يتطلب العنوان والملخص والمحتوى باللغتين.
      </p>
      <ArticleForm />
    </>
  );
}
