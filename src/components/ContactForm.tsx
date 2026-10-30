"use client";

import { useState } from "react";
import { publicApiUrl } from "@/lib/urls";

type Option = { value: string; label: string };

type Labels = {
  name: string;
  email: string;
  phone: string;
  optional: string;
  service: string;
  problem: string;
  workflow: string;
  size: string;
  budget: string;
  timeline: string;
  choose: string;
  offer: string;
  details: string;
  detailsHint: string;
  submit: string;
  sending: string;
  successTitle: string;
  successBody: string;
  sendAnother: string;
  summaryHeading: string;
  summaryLabels: { problem: string; workflow: string; size: string; budget: string; timeline: string; offer: string };
};

export type ContactChoices = {
  services: Option[];
  problems: Option[];
  workflow: string[];
  size: string[];
  budget: string[];
  timeline: string[];
  offers: Option[];
};

type Props = {
  language: "Ar" | "En";
  labels: Labels;
  choices: ContactChoices;
  /** Values pre-selected from the link that opened the page (?service=…&problem=…&offer=…). */
  preset: { service?: string; problem?: string; offer?: string };
  errors: { messages: Record<string, string>; fields: Record<string, string> };
};

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

const MAX_DETAILS = 4000;

/**
 * Posts straight from the browser to the API, so the API's per-IP rate limit sees the
 * visitor's real address. Field errors come back as ProblemDetails `errors` keyed by
 * the C# property name (ClientName, Email, …) and are shown under each field.
 *
 * The qualifying questions (problem, current workflow, size, budget, timeline, offer) are sent as a
 * short summary at the top of the request details, so they reach the dashboard and the notification
 * e-mail without any change to the API.
 */
export function ContactForm({ language, labels, choices, preset, errors }: Props) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function details(data: FormData) {
    const labelOf = (options: Option[], value: FormDataEntryValue | null) =>
      options.find((o) => o.value === value)?.label ?? "";
    const text = (key: string) => String(data.get(key) ?? "").trim();

    const summary: [string, string][] = [
      [labels.summaryLabels.offer, labelOf(choices.offers, data.get("offer"))],
      [labels.summaryLabels.problem, labelOf(choices.problems, data.get("problem"))],
      [labels.summaryLabels.workflow, text("workflow")],
      [labels.summaryLabels.size, text("size")],
      [labels.summaryLabels.budget, text("budget")],
      [labels.summaryLabels.timeline, text("timeline")],
    ];
    const lines = summary.filter(([, value]) => value).map(([label, value]) => `- ${label}: ${value}`);
    const message = text("details");

    if (lines.length === 0) return message;
    return `${labels.summaryHeading}\n${lines.join("\n")}${message ? `\n\n${message}` : ""}`.slice(0, MAX_DETAILS);
  }

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
          details: details(data),
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
          className="mt-5 rounded-full border border-ink/25 px-5 py-2 font-medium transition-colors hover:border-accent hover:text-accent"
        >
          {labels.sendAnother}
        </button>
      </div>
    );
  }

  const sending = status.kind === "sending";
  const defaultService = choices.services.some((s) => s.value === preset.service) ? preset.service : choices.services[0]?.value;

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
          <select id="serviceType" name="serviceType" required defaultValue={defaultService} className={input(fieldErrors.ServiceType)}>
            {choices.services.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <fieldset className="grid gap-5 rounded-2xl border border-line p-5 sm:grid-cols-2">
        <Choice id="problem" label={labels.problem} placeholder={labels.choose} options={choices.problems} defaultValue={preset.problem} />
        <Choice id="workflow" label={labels.workflow} placeholder={labels.choose} options={plain(choices.workflow)} />
        <Choice id="size" label={labels.size} placeholder={labels.choose} options={plain(choices.size)} />
        <Choice id="timeline" label={labels.timeline} placeholder={labels.choose} options={plain(choices.timeline)} />
        <Choice id="budget" label={labels.budget} hint={labels.optional} placeholder={labels.choose} options={plain(choices.budget)} />
        <Choice id="offer" label={labels.offer} hint={labels.optional} placeholder={labels.choose} options={choices.offers} defaultValue={preset.offer} />
      </fieldset>

      <Field id="details" label={labels.details} hint={labels.detailsHint} error={fieldErrors.Details}>
        <textarea id="details" name="details" maxLength={3500} rows={6} className={input(fieldErrors.Details)} />
      </Field>

      {/* Honeypot: invisible to people and screen readers; bots fill every field. */}
      <div aria-hidden="true" className="absolute -start-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {status.kind === "error" && (
        <p role="alert" className="rounded-md border border-[#c2410c]/40 bg-[#c2410c]/10 px-4 py-3 text-[#fdba74]">
          {status.message}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={sending}
          className="rounded-full bg-accent px-7 py-3 font-medium text-accent-ink transition-colors hover:bg-ink disabled:opacity-60"
        >
          {sending ? labels.sending : labels.submit}
        </button>
      </div>
    </form>
  );
}

const plain = (values: string[]): Option[] => values.map((v) => ({ value: v, label: v }));

function Choice({
  id,
  label,
  hint,
  placeholder,
  options,
  defaultValue,
}: {
  id: string;
  label: string;
  hint?: string;
  placeholder: string;
  options: Option[];
  defaultValue?: string;
}) {
  const initial = options.some((o) => o.value === defaultValue) ? defaultValue : "";
  return (
    <Field id={id} label={label} hint={hint}>
      <select id={id} name={id} defaultValue={initial} className={input()}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
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
        <p id={`${id}-error`} className="mt-1.5 text-sm text-[#fdba74]">
          {error}
        </p>
      )}
    </div>
  );
}

const input = (error?: string) =>
  `w-full rounded-lg border bg-deep/40 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/30 ${
    error ? "border-[#b45309]" : "border-line focus:border-accent"
  }`;
