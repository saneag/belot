import { type ReactNode, useEffect, useMemo, useState } from "react";

import { getSession, login, logout, register } from "@belot/api-client";
import type { AuthSession, LoginInput, RegisterInput } from "@belot/types";

import { AuthContext, type AuthContextValue } from "@/auth/authContextValue";
import { getApiBaseUrl } from "@/helpers/apiBaseUrl";

const baseUrl = getApiBaseUrl();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    void getSession(baseUrl)
      .then(({ user }) => setSession({ user, expiresAt: "" }))
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);
  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      loading,
      session,
      signIn: async (input: LoginInput) =>
        setSession(await login(baseUrl, input).then((result) => result.session)),
      signUp: async (input: RegisterInput) =>
        setSession(await register(baseUrl, input).then((result) => result.session)),
      signOut: async () => {
        await logout(baseUrl);
        setSession(null);
      },
    }),
    [loading, session],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
