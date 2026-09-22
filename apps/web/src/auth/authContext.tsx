import { type ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";

import { getSession, login, logout, register } from "@belot/api-client";
import type { AuthSession, LoginInput, RegisterInput, User } from "@belot/types";

import { getApiBaseUrl } from "@/helpers/apiBaseUrl";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  session: AuthSession | null;
  signIn: (input: LoginInput) => Promise<void>;
  signUp: (input: RegisterInput) => Promise<void>;
  signOut: () => Promise<void>;
}
const AuthContext = createContext<AuthContextValue | null>(null);
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
      signIn: async (input) =>
        setSession(await login(baseUrl, input).then((result) => result.session)),
      signUp: async (input) =>
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

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
};
