import type { AuthResponse, LoginInput, RegisterInput, User } from "@belot/types";

import { apiFetch } from "./client";

export interface AuthRequestOptions {
  token?: string;
  credentials?: "omit" | "same-origin" | "include";
}

const authInit = (options?: AuthRequestOptions): RequestInit => ({
  credentials: options?.credentials ?? "include",
  headers: options?.token ? { Authorization: `Bearer ${options.token}` } : undefined,
});

export const register = (baseUrl: string, input: RegisterInput) =>
  apiFetch<AuthResponse>(`${baseUrl.replace(/\/$/, "")}/auth/register`, {
    ...authInit(),
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

export const login = (baseUrl: string, input: LoginInput) =>
  apiFetch<AuthResponse>(`${baseUrl.replace(/\/$/, "")}/auth/login`, {
    ...authInit(),
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

export const getSession = (baseUrl: string, options?: AuthRequestOptions) =>
  apiFetch<{ user: User }>(`${baseUrl.replace(/\/$/, "")}/auth/session`, authInit(options));

export const logout = (baseUrl: string, options?: AuthRequestOptions) =>
  apiFetch<null>(`${baseUrl.replace(/\/$/, "")}/auth/logout`, {
    ...authInit(options),
    method: "POST",
  });
