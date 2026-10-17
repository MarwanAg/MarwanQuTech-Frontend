"use client";

import { LocaleFallback } from "@/components/LocaleFallback";

/** Shown when the API is unreachable while rendering a detail page. */
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <LocaleFallback kind="error" onRetry={reset} />;
}
