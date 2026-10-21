export function PageIntro({ title, intro }: { title: string; intro?: string }) {
  return (
    <header className="pt-12 pb-10 md:pt-20 md:pb-14">
      <h1 className="text-[2.2rem] leading-[1.35] sm:text-[3rem]">{title}</h1>
      {intro && <p className="mt-5 max-w-[60ch] text-lg leading-[1.9] text-slate">{intro}</p>}
    </header>
  );
}
