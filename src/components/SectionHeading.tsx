import Link from "next/link";

export const buttonPrimary =
  "inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 font-medium text-accent-ink transition-colors hover:bg-ink";
export const buttonSecondary =
  "inline-flex items-center justify-center rounded-full border border-ink/25 px-7 py-3 font-medium transition-colors hover:border-accent hover:text-accent";

export function SectionHeading({
  id,
  title,
  intro,
  action,
}: {
  id: string;
  title: string;
  intro?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div data-reveal className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
      <div>
        <h2 id={id} className="text-[1.75rem] leading-snug sm:text-[2.15rem]">
          {title}
        </h2>
        {intro && <p className="mt-3 max-w-[60ch] text-slate">{intro}</p>}
      </div>
      {action && (
        <Link href={action.href} className="font-medium text-accent underline-offset-8 hover:underline">
          {action.label}
        </Link>
      )}
    </div>
  );
}

/** The closing call to action used at the bottom of the home, solutions and about pages. */
export function CtaBand({ id, title, body, action }: { id: string; title: string; body: string; action: { href: string; label: string } }) {
  return (
    <section
      aria-labelledby={id}
      data-reveal
      className="mt-10 grid gap-8 rounded-3xl border border-line bg-[linear-gradient(135deg,var(--brand),var(--paper)_62%,var(--deep))] px-7 py-12 sm:px-12 md:grid-cols-[1fr_auto] md:items-center"
    >
      <div>
        <h2 id={id} className="max-w-[24ch] text-[1.7rem] leading-[1.45] sm:text-[2.1rem]">
          {title}
        </h2>
        <p className="mt-4 max-w-[56ch] text-slate">{body}</p>
      </div>
      <Link href={action.href} className={buttonPrimary}>
        {action.label}
      </Link>
    </section>
  );
}
