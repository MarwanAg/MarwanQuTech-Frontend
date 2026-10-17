"use client";

import Link from "next/link";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { PageHeader } from "@/components/admin/ui";

export default function NewProjectPage() {
  return (
    <>
      <Link href="/admin/projects" className="text-sm text-slate hover:text-accent">المشاريع</Link>
      <PageHeader title="مشروع جديد" />
      <p className="-mt-4 mb-6 max-w-[70ch] text-sm text-slate">
        يكفي العنوان العربي لحفظ مسودة. للنشر يجب تعبئة العنوان والملخص والوصف باللغتين. الغلاف والصور تُضاف بعد الحفظ.
      </p>
      <ProjectForm />
    </>
  );
}
