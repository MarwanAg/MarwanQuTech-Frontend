import type { ServiceGroup } from "@/content/business";

/** The four service groups. `detailed` also lists what each group includes. */
export function ServiceGroupList({ groups, detailed = false }: { groups: ServiceGroup[]; detailed?: boolean }) {
  return (
    <dl className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {groups.map((group) => (
        <div key={group.key} className="border-t border-line pt-6">
          <dt className="font-display text-lg font-semibold">{group.title}</dt>
          <dd className="mt-2 text-slate">
            {group.summary}
            {detailed && (
              <ul className="mt-4 grid gap-2 text-[0.95rem]">
                {group.includes.map((line) => (
                  <li key={line} className="flex gap-2.5">
                    <span aria-hidden className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
