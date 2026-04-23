export function getApiBaseUrl(): string {
  const fromEnv = import.meta.env.EXPO_PUBLIC_API_BASE_URL as string | undefined;
  return typeof fromEnv === "string" ? fromEnv : "";
}
