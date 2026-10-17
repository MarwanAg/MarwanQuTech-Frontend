export function PageIntro({ title, intro }: { title: string; intro?: string }) {
  return (
    <header className="py-12 md:py-16">
      <h1 className="text-[2rem] font-semibold leading-tight sm:text-[2.4rem]">{title}</h1>
      {intro && <p className="mt-4 max-w-[60ch] text-lg text-slate">{intro}</p>}
    </header>
  );
}
