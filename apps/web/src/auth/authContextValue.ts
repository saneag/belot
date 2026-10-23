import { createContext } from "react";

import type { AuthSession, LoginInput, RegisterInput, User } from "@belot/types";

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  session: AuthSession | null;
  signIn: (input: LoginInput) => Promise<void>;
  signUp: (input: RegisterInput) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
