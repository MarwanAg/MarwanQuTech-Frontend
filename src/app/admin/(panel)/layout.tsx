"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/admin/AuthProvider";
import { Loading } from "@/components/admin/ui";
import { api } from "@/lib/admin/client";

const NAV = [
  { href: "/admin", label: "نظرة عامة", exact: true },
  { href: "/admin/projects", label: "المشاريع" },
  { href: "/admin/articles", label: "المقالات" },
  { href: "/admin/inquiries", label: "الرسائل", badge: true },
  { href: "/admin/account", label: "الحساب" },
];

/** Every dashboard page: requires a session, shows the navigation and the unread-messages badge. */
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const { state, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (state.status === "anonymous") router.replace("/admin/login");
  }, [state.status, router]);

  useEffect(() => {
    if (state.status !== "authenticated") return;
    api.get<{ count: number }>("/api/admin/inquiries/unread-count").then((r) => setUnread(r.count)).catch(() => {});
  }, [state.status, pathname]);

  if (state.status !== "authenticated") return <div className="px-6"><Loading /></div>;

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[15rem_1fr]">
      <aside className="border-b border-line bg-surface md:border-b-0 md:border-e">
        <div className="flex items-center justify-between gap-3 px-5 py-4 md:block">
          <Link href="/admin" className="font-mono text-sm" dir="ltr">
            Marwan<span className="text-accent">Qu</span>Tech
          </Link>
          <p className="text-sm text-slate md:mt-1">{state.admin.displayName}</p>
        </div>
        <nav aria-label="لوحة التحكم" className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center justify-between gap-3 whitespace-nowrap rounded-md px-3 py-2 text-sm ${
                  active ? "bg-accent/12 font-medium text-accent" : "text-slate hover:bg-paper hover:text-ink"
                }`}
              >
                {item.label}
                {item.badge && unread > 0 && (
                  <span className="rounded-full bg-signal px-2 text-xs font-semibold text-[#18222c]">{unread}</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="hidden gap-2 px-5 py-6 text-sm md:grid">
          <a href="/" target="_blank" rel="noopener" className="text-slate hover:text-accent">
            فتح الموقع
          </a>
          <button type="button" onClick={() => logout()} className="text-start text-slate hover:text-accent">
            تسجيل الخروج
          </button>
        </div>
      </aside>
      <main className="min-w-0 px-5 py-8 md:px-10">{children}</main>
    </div>
  );
}
