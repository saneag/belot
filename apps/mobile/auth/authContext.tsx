import { type ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";

import { getSession, login, logout, register } from "@belot/api-client";
import { StorageKeys } from "@belot/constants";
import type { AuthSession, LoginInput, RegisterInput, User } from "@belot/types";

import { getApiBaseUrl } from "@/helpers/apiBaseUrl";
import { getFromStorage, removeFromStorage, setToStorage } from "@/helpers/storageHelpers";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  session: AuthSession | null;
  signIn: (input: LoginInput) => Promise<void>;
  signUp: (input: RegisterInput) => Promise<void>;
  signOut: () => Promise<void>;
}
const Context = createContext<AuthContextValue | null>(null);
const baseUrl = getApiBaseUrl();
const save = async (session: AuthSession) => {
  await setToStorage(StorageKeys.authSession, JSON.stringify(session));
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    void getFromStorage(StorageKeys.authSession)
      .then(async (raw) => {
        if (!raw) return;
        const saved = JSON.parse(raw) as AuthSession;
        const result = await getSession(baseUrl, { token: saved.token });
        const next = { ...saved, user: result.user };
        setSession(next);
        await save(next);
      })
      .catch(async () => {
        await removeFromStorage(StorageKeys.authSession);
      })
      .finally(() => setLoading(false));
  }, []);
  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      loading,
      session,
      signIn: async (input) => {
        const next = (await login(baseUrl, input)).session;
        setSession(next);
        await save(next);
      },
      signUp: async (input) => {
        const next = (await register(baseUrl, input)).session;
        setSession(next);
        await save(next);
      },
      signOut: async () => {
        if (session?.token) await logout(baseUrl, { token: session.token });
        await removeFromStorage(StorageKeys.authSession);
        setSession(null);
      },
    }),
    [loading, session],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useAuth = () => {
  const value = useContext(Context);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
};
