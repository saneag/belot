export function getDevToolsPassword(): string {
  return process.env.EXPO_PUBLIC_DEV_TOOLS_PASSWORD ?? "";
}
