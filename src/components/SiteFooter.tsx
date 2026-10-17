import type { Dictionary } from "@/lib/dictionary";

export function SiteFooter({ t }: { t: Dictionary }) {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-2 px-5 py-8 text-sm text-slate sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {t.home.greeting} — {t.footer.rights}
        </p>
        <p>{t.footer.builtWith}</p>
      </div>
    </footer>
  );
}
