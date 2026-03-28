export function getApiBaseUrl(): string {
  const fromEnv = import.meta.env.EXPO_PUBLIC_API_BASE_URL;
  return fromEnv ?? "";
}
