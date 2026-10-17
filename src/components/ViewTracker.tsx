"use client";

import { useEffect } from "react";
import { publicApiUrl } from "@/lib/urls";

/**
 * Counts one view per browser tab. The API also de-duplicates per visitor, so reloads
 * and bots hammering the endpoint don't inflate the number.
 */
export function ViewTracker({ articleId }: { articleId: number }) {
  useEffect(() => {
    const key = `viewed:${articleId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // storage unavailable (private mode) — still count once per mount
    }

    fetch(`${publicApiUrl()}/api/articles/${articleId}/views`, { method: "POST", keepalive: true }).catch(() => {});
  }, [articleId]);

  return null;
}
