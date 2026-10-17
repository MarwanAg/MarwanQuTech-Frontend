"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { adminFetch, refreshSession, setSession, SIGNED_OUT_EVENT } from "@/lib/admin/client";
import type { AdminProfile, AuthResponse } from "@/lib/admin/types";

type AuthState =
  | { status: "loading" }
  | { status: "anonymous" }
  | { status: "authenticated"; admin: AdminProfile };

type AuthContextValue = {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: (allDevices?: boolean) => Promise<void>;
  /** After password change / profile edit. */
  applySession: (session: AuthResponse) => void;
  setAdmin: (admin: AdminProfile) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: "loading" });

  // On load, a valid refresh cookie silently restores the session (survives page reloads).
  useEffect(() => {
    let cancelled = false;
    refreshSession().then((session) => {
      if (cancelled) return;
      setState(session ? { status: "authenticated", admin: session.admin } : { status: "anonymous" });
    });

    const onSignedOut = () => setState({ status: "anonymous" });
    window.addEventListener(SIGNED_OUT_EVENT, onSignedOut);
    return () => {
      cancelled = true;
      window.removeEventListener(SIGNED_OUT_EVENT, onSignedOut);
    };
  }, []);

  const applySession = useCallback((session: AuthResponse) => {
    setSession(session);
    setState({ status: "authenticated", admin: session.admin });
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const session = await adminFetch<AuthResponse>("/api/auth/login", { method: "POST", body: { email, password } });
      applySession(session);
    },
    [applySession],
  );

  const logout = useCallback(async (allDevices = false) => {
    try {
      await adminFetch(`/api/auth/logout${allDevices ? "?allDevices=true" : ""}`, { method: "POST" });
    } finally {
      setSession(null);
      setState({ status: "anonymous" });
    }
  }, []);

  const setAdmin = useCallback((admin: AdminProfile) => setState({ status: "authenticated", admin }), []);

  return (
    <AuthContext.Provider value={{ state, login, logout, applySession, setAdmin }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside <AuthProvider>");
  return value;
}
