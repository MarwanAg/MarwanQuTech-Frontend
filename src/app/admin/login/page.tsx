"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/admin/AuthProvider";
import { Button, Field, inputClass, Notice } from "@/components/admin/ui";
import { ApiError } from "@/lib/admin/client";
import { errorMessage } from "@/lib/admin/messages";

export default function LoginPage() {
  const { state, login } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (state.status === "authenticated") router.replace("/admin");
  }, [state, router]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);
    try {
      await login(String(data.get("email")), String(data.get("password")));
    } catch (e) {
      let message = errorMessage(e);
      if (e instanceof ApiError && e.code === "Auth.LockedOut") message += " حاول بعد 15 دقيقة.";
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-5">
      <p className="font-mono text-sm" dir="ltr">
        Marwan<span className="text-accent">Qu</span>Tech
      </p>
      <h1 className="mt-2 text-2xl font-semibold">تسجيل الدخول</h1>
      <form onSubmit={submit} className="mt-8 grid gap-5">
        <Field label="البريد الإلكتروني" htmlFor="email">
          <input id="email" name="email" type="email" required autoComplete="username" dir="ltr" className={inputClass()} />
        </Field>
        <Field label="كلمة المرور" htmlFor="password">
          <input id="password" name="password" type="password" required autoComplete="current-password" dir="ltr" className={inputClass()} />
        </Field>
        <Notice notice={error ? { kind: "error", text: error } : null} />
        <Button type="submit" variant="primary" disabled={busy || state.status === "loading"}>
          {busy ? "جارٍ الدخول…" : "دخول"}
        </Button>
      </form>
    </main>
  );
}
