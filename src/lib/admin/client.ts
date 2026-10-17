"use client";

import { publicApiUrl } from "@/lib/urls";
import type { AuthResponse } from "./types";

/**
 * Browser-side API client for the dashboard.
 * - The access token lives only in memory (never localStorage), so an XSS can't steal a lasting session.
 * - The refresh token is the HttpOnly `mqt_refresh` cookie set by the API; `credentials: "include"` sends it.
 * - On 401 the client refreshes once (shared by concurrent calls) and retries; if that fails it emits
 *   `admin:signed-out` so the shell can send the user to the login page.
 */

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public fieldErrors: Record<string, string[]> = {},
  ) {
    super(message);
  }
}

export const SIGNED_OUT_EVENT = "admin:signed-out";

let accessToken: string | null = null;
let refreshing: Promise<AuthResponse | null> | null = null;

export const setSession = (session: AuthResponse | null) => {
  accessToken = session?.accessToken ?? null;
};

/** Exchanges the refresh cookie for a new access token. Concurrent callers share one request. */
export function refreshSession(): Promise<AuthResponse | null> {
  refreshing ??= (async () => {
    try {
      const response = await fetch(`${publicApiUrl()}/api/auth/refresh`, { method: "POST", credentials: "include" });
      if (!response.ok) return null;
      const session = (await response.json()) as AuthResponse;
      setSession(session);
      return session;
    } catch {
      return null;
    } finally {
      queueMicrotask(() => (refreshing = null));
    }
  })();
  return refreshing;
}

type Options = { method?: string; body?: unknown; form?: FormData };

export async function adminFetch<T = void>(path: string, options: Options = {}, retried = false): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  if (options.body !== undefined) headers["Content-Type"] = "application/json";

  let response: Response;
  try {
    response = await fetch(`${publicApiUrl()}${path}`, {
      method: options.method ?? "GET",
      headers,
      credentials: "include",
      body: options.form ?? (options.body !== undefined ? JSON.stringify(options.body) : undefined),
    });
  } catch {
    throw new ApiError(0, "network", "Network error");
  }

  if (response.ok) {
    if (response.status === 204) return undefined as T;
    const text = await response.text();
    return (text ? JSON.parse(text) : undefined) as T;
  }

  const problem = (await response.json().catch(() => ({}))) as {
    code?: string;
    detail?: string;
    title?: string;
    errors?: Record<string, string[]>;
  };

  // A 401 without a code means the access token was rejected (expired). Business 401s
  // such as Auth.WrongPassword carry a code and must not trigger a refresh.
  if (response.status === 401 && !problem.code && !retried) {
    const session = await refreshSession();
    if (session) return adminFetch<T>(path, options, true);
    setSession(null);
    window.dispatchEvent(new Event(SIGNED_OUT_EVENT));
  }

  throw new ApiError(
    response.status,
    problem.code ?? `Http.${response.status}`,
    problem.detail ?? problem.title ?? response.statusText,
    problem.errors ?? {},
  );
}

export const api = {
  get: <T>(path: string) => adminFetch<T>(path),
  post: <T = void>(path: string, body?: unknown) => adminFetch<T>(path, { method: "POST", body }),
  put: <T = void>(path: string, body?: unknown) => adminFetch<T>(path, { method: "PUT", body }),
  del: (path: string) => adminFetch(path, { method: "DELETE" }),
  upload: <T>(path: string, form: FormData, method = "POST") => adminFetch<T>(path, { method, form }),
};
