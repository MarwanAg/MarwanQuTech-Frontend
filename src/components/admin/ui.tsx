"use client";

import { useEffect, useState } from "react";

// Small, consistent building blocks for the dashboard forms.

export function Field({
  label,
  error,
  hint,
  count,
  max,
  htmlFor,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  count?: number;
  max?: number;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  const over = count !== undefined && max !== undefined && count > max;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-sm font-medium">
          {label}
          {hint && <span className="ms-2 font-normal text-slate">{hint}</span>}
        </label>
        {max !== undefined && (
          <span className={`font-mono text-xs ${over ? "text-[#b45309]" : "text-slate"}`} dir="ltr">
            {count ?? 0}/{max}
          </span>
        )}
      </div>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-sm text-[#fdba74]">{error}</p>}
    </div>
  );
}

export const inputClass = (error?: string) =>
  `w-full rounded-md border bg-surface px-3 py-2 text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-accent/30 ${
    error ? "border-[#b45309]" : "border-line focus:border-accent"
  }`;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" };

export function Button({ variant = "secondary", className = "", ...props }: ButtonProps) {
  const styles = {
    primary: "bg-accent text-accent-ink hover:opacity-90",
    secondary: "border border-line hover:border-accent hover:text-accent",
    danger: "border border-[#b45309]/50 text-[#fdba74] hover:bg-[#b45309]/10",
  }[variant];
  return (
    <button
      type="button"
      {...props}
      className={`rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${className}`}
    />
  );
}

/** Inline result of the last action: what happened, or what went wrong. */
export function Notice({ notice }: { notice: { kind: "ok" | "error"; text: string } | null }) {
  if (!notice) return null;
  return (
    <p
      role={notice.kind === "error" ? "alert" : "status"}
      className={`rounded-md px-4 py-2.5 text-sm ${
        notice.kind === "ok"
          ? "border border-accent/30 bg-accent/10 text-ink"
          : "border border-[#b45309]/40 bg-[#b45309]/10 text-[#fdba74]"
      }`}
    >
      {notice.text}
    </p>
  );
}

export function useNotice() {
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  useEffect(() => {
    if (notice?.kind !== "ok") return;
    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [notice]);
  return {
    notice,
    ok: (text: string) => setNotice({ kind: "ok", text }),
    error: (text: string) => setNotice({ kind: "error", text }),
    clear: () => setNotice(null),
  };
}

export function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        published ? "bg-accent/15 text-accent" : "bg-slate/15 text-slate"
      }`}
    >
      <span aria-hidden className={`size-1.5 rounded-full ${published ? "bg-accent" : "bg-slate"}`} />
      {published ? "منشور" : "مسودة"}
    </span>
  );
}

export function PageHeader({ title, actions }: { title: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Loading() {
  return <p className="py-10 text-slate">جارٍ التحميل…</p>;
}

/** Two side-by-side columns: Arabic and English (English inputs set dir="ltr"). Stacks on small screens. */
export function BilingualColumns({ ar, en }: { ar: React.ReactNode; en: React.ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <fieldset className="grid content-start gap-5 rounded-lg border border-line p-5" dir="rtl" lang="ar">
        <legend className="px-2 text-sm font-semibold">العربية</legend>
        {ar}
      </fieldset>
      <fieldset className="grid content-start gap-5 rounded-lg border border-line p-5">
        <legend className="px-2 text-sm font-semibold">English</legend>
        {en}
      </fieldset>
    </div>
  );
}
