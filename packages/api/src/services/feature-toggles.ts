import type { FeatureToggle } from "@belot/types";

import type { AuthRequestOptions } from "./auth";
import { apiFetch } from "./client";

const root = (baseUrl: string) => `${baseUrl.replace(/\/$/, "")}/feature-toggles`;
const init = (options?: AuthRequestOptions): RequestInit => ({
  credentials: "include",
  headers: options?.token ? { Authorization: `Bearer ${options.token}` } : undefined,
});

export const getFeatureToggles = (baseUrl: string, options?: AuthRequestOptions) =>
  apiFetch<FeatureToggle[]>(root(baseUrl), init(options));
export const createFeatureToggle = (
  baseUrl: string,
  name: string,
  enabled = false,
  options?: AuthRequestOptions,
) =>
  apiFetch<{ message: string }>(root(baseUrl), {
    ...init(options),
    method: "POST",
    headers: { ...init(options).headers, "Content-Type": "application/json" },
    body: JSON.stringify({ name, enabled }),
  });
export const updateFeatureToggle = (
  baseUrl: string,
  name: string,
  enabled: boolean,
  options?: AuthRequestOptions,
) =>
  apiFetch<{ message: string }>(`${root(baseUrl)}/toggle`, {
    ...init(options),
    method: "POST",
    headers: { ...init(options).headers, "Content-Type": "application/json" },
    body: JSON.stringify({ name, enabled }),
  });
