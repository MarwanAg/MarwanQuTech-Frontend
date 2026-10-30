import Link from "next/link";
import type { Problem } from "@/content/business";
import type { Locale } from "@/lib/i18n";
import { paths } from "@/lib/urls";

/** "Problem → solution" pairs. Each one opens the contact form with that problem already selected. */
export function ProblemList({ problems, locale, action }: { problems: Problem[]; locale: Locale; action: string }) {
  return (
    <ul data-stagger className="grid gap-5 sm:grid-cols-2">
      {problems.map((item) => (
        <li key={item.key} className="lift flex flex-col rounded-2xl border border-line bg-surface/50 p-6 sm:p-7">
          <h3 className="text-xl leading-snug">{item.problem}</h3>
          <p className="mt-3 flex-1 text-slate">{item.solution}</p>
          <Link
            href={paths.contactWith(locale, { problem: item.key })}
            className="mt-5 self-start font-medium text-accent underline-offset-8 hover:underline"
          >
            {action}
          </Link>
        </li>
      ))}
    </ul>
  );
}
