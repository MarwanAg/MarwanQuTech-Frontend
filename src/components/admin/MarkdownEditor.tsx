"use client";

import { useState } from "react";
import { Markdown } from "@/components/Markdown";
import { inputClass } from "./ui";

/** Plain textarea with a preview tab that uses the exact renderer of the public site. */
export function MarkdownEditor({
  id,
  value,
  onChange,
  dir,
  rows = 18,
  error,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  dir: "rtl" | "ltr";
  rows?: number;
  error?: string;
}) {
  const [preview, setPreview] = useState(false);

  return (
    <div>
      <div role="tablist" className="mb-2 flex gap-1 text-sm">
        {[
          { key: false, label: "كتابة" },
          { key: true, label: "معاينة" },
        ].map((tab) => (
          <button
            key={String(tab.key)}
            type="button"
            role="tab"
            aria-selected={preview === tab.key}
            onClick={() => setPreview(tab.key)}
            className={`rounded px-3 py-1 ${preview === tab.key ? "bg-accent/15 text-accent" : "text-slate hover:text-ink"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {preview ? (
        <div dir={dir} className="min-h-40 rounded-md border border-line bg-surface p-4">
          {value.trim() ? <Markdown source={value} /> : <p className="text-slate">لا يوجد محتوى للمعاينة.</p>}
        </div>
      ) : (
        <textarea
          id={id}
          dir={dir}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck
          className={`${inputClass(error)} text-sm leading-relaxed ${dir === "ltr" ? "font-mono" : ""}`}
        />
      )}
    </div>
  );
}
