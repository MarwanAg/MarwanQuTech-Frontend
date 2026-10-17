"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded px-2.5 py-1.5 text-[0.95rem] transition-colors ${
        active ? "text-ink underline decoration-accent decoration-2 underline-offset-8" : "text-slate hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}
