"use client";

import { useState } from "react";
import { publicApiUrl } from "@/lib/urls";

type Labels = {
  name: string;
  email: string;
  phone: string;
  optional: string;
  service: string;
  details: string;
  detailsHint: string;
  submit: string;
  sending: string;
  successTitle: string;
  successBody: string;
  sendAnother: string;
};

type Props = {
  language: "Ar" | "En";
  labels: Labels;
  services: { value: string; label: string }[];
  errors: { messages: Record<string, string>; fields: Record<string, string> };
};

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

/**
 * Posts straight from the browser to the API, so the API's per-IP rate limit sees the
 * visitor's real address. Field errors come back as ProblemDetails `errors` keyed by
 * the C# property name (ClientName, Email, …) and are shown under each field.
 */
export function ContactForm({ language, labels, services, errors }: Props) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus({ kind: "sending" });
    setFieldErrors({});

    try {
      const response = await fetch(`${publicApiUrl()}/api/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: data.get("clientName"),
          email: data.get("email"),
          phone: data.get("phone") || null,
          serviceType: data.get("serviceType"),
          details: data.get("details"),
          language,
          website: data.get("website"), // honeypot
        }),
      });

      if (response.ok) {
        form.reset();
        setStatus({ kind: "sent" });
        return;
      }

      const problem = (await response.json().catch(() => ({}))) as {
        code?: string;
        errors?: Record<string, string[]>;
      };

      if (problem.errors) {
        const mapped: Record<string, string> = {};
        for (const key of Object.keys(problem.errors)) mapped[key] = errors.fields[key] ?? problem.errors[key][0];
        setFieldErrors(mapped);
      }

      setStatus({
        kind: "error",
        message: (problem.code && errors.messages[problem.code]) || errors.messages.unknown,
      });
    } catch {
      setStatus({ kind: "error", message: errors.messages.network });
    }
  }

  if (status.kind === "sent") {
    return (
      <div role="status" className="rounded-lg border border-line bg-surface p-6">
        <p className="text-lg font-semibold">{labels.successTitle}</p>
        <p className="mt-1 text-slate">{labels.successBody}</p>
        <button
          type="button"
          onClick={() => setStatus({ kind: "idle" })}
          className="mt-5 rounded-md border border-line px-4 py-2 font-medium hover:border-accent hover:text-accent"
        >
          {labels.sendAnother}
        </button>
      </div>
    );
  }

  const sending = status.kind === "sending";

  return (
    <form onSubmit={submit} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="clientName" label={labels.name} error={fieldErrors.ClientName}>
          <input id="clientName" name="clientName" required minLength={2} maxLength={100} autoComplete="name" className={input(fieldErrors.ClientName)} />
        </Field>
        <Field id="email" label={labels.email} error={fieldErrors.Email}>
          <input id="email" name="email" type="email" required maxLength={254} autoComplete="email" dir="ltr" className={input(fieldErrors.Email)} />
        </Field>
        <Field id="phone" label={labels.phone} hint={labels.optional} error={fieldErrors.Phone}>
          <input id="phone" name="phone" type="tel" maxLength={30} autoComplete="tel" dir="ltr" className={input(fieldErrors.Phone)} />
        </Field>
        <Field id="serviceType" label={labels.service} error={fieldErrors.ServiceType}>
          <select id="serviceType" name="serviceType" required defaultValue={services[0]?.value} className={input(fieldErrors.ServiceType)}>
            {services.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field id="details" label={labels.details} hint={labels.detailsHint} error={fieldErrors.Details}>
        <textarea id="details" name="details" required minLength={10} maxLength={4000} rows={7} className={input(fieldErrors.Details)} />
      </Field>

      {/* Honeypot: invisible to people and screen readers; bots fill every field. */}
      <div aria-hidden="true" className="absolute -start-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {status.kind === "error" && (
        <p role="alert" className="rounded-md border border-[#c2410c]/40 bg-[#c2410c]/10 px-4 py-3 text-[#9a3412] dark:text-[#fdba74]">
          {status.message}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={sending}
          className="rounded-md bg-accent px-6 py-2.5 font-medium text-accent-ink transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {sending ? labels.sending : labels.submit}
        </button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline gap-2 font-medium">
        {label}
        {hint && <span className="text-sm font-normal text-slate">{hint}</span>}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-[#b45309] dark:text-[#fdba74]">
          {error}
        </p>
      )}
    </div>
  );
}

const input = (error?: string) =>
  `w-full rounded-md border bg-surface px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/30 ${
    error ? "border-[#b45309]" : "border-line focus:border-accent"
  }`;
