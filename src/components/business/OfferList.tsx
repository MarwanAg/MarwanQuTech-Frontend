import Link from "next/link";
import type { Offer } from "@/content/business";
import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { paths } from "@/lib/urls";

/** Packages with a clear scope and a starting price. The button pre-fills the contact form. */
export function OfferList({ offers, locale, t }: { offers: Offer[]; locale: Locale; t: Dictionary }) {
  const s = t.solutions;

  return (
    <ul data-stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {offers.map((offer) => {
        const monthly = offer.priceFrom === null;
        return (
          <li
            key={offer.key}
            className={`lift flex flex-col rounded-2xl border p-6 ${monthly ? "border-dashed border-accent/50 bg-accent/5" : "border-line bg-surface/50"}`}
          >
            <h3 className="text-lg">{offer.title}</h3>
            <p className="mt-2 text-slate">{offer.summary}</p>

            <p className="mt-5">
              {monthly ? (
                <span className="font-display text-2xl font-semibold text-accent">{s.priceByAgreement}</span>
              ) : (
                <>
                  <span className="block text-sm text-slate">{s.priceFrom}</span>
                  <span className="font-display text-3xl font-semibold text-accent">
                    {offer.priceFrom}
                    <span className="ms-1.5 text-base font-medium">{s.currency}</span>
                  </span>
                </>
              )}
              {monthly && <span className="ms-2 text-sm text-slate">{s.monthly}</span>}
            </p>

            <ul className="mt-5 grid flex-1 content-start gap-2 border-t border-line pt-5 text-[0.95rem] text-slate">
              {offer.includes.map((line) => (
                <li key={line} className="flex gap-2.5">
                  <span aria-hidden className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <Link
              href={paths.contactWith(locale, { service: offer.serviceType, offer: offer.key })}
              className="mt-6 inline-flex items-center justify-center rounded-full border border-ink/25 px-5 py-2.5 font-medium transition-colors hover:border-accent hover:text-accent"
            >
              {s.requestOffer}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
