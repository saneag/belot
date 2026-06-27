import type { FeatureToggleName } from "@belot/constants";

import type { FeatureTogglesResponse } from "../types";
import { apiFetch } from "./client";

export function buildFeatureTogglesUrl(baseUrl: string): string {
  const normalized = baseUrl.replace(/\/$/, "");
  return `${normalized}/feature-toggles`;
}

export async function getFeatureToggles(baseUrl: string): Promise<FeatureTogglesResponse> {
  return apiFetch<FeatureTogglesResponse>(buildFeatureTogglesUrl(baseUrl));
}

export async function updateFeatureToggle(
  baseUrl: string,
  name: FeatureToggleName,
  enabled: boolean,
): Promise<{ name: FeatureToggleName; enabled: boolean }> {
  return apiFetch<{ name: FeatureToggleName; enabled: boolean }>(
    `${buildFeatureTogglesUrl(baseUrl)}/${name}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ enabled }),
    },
  );
}
