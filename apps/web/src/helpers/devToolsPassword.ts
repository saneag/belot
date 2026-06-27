export function getDevToolsPassword(): string {
  return import.meta.env.VITE_DEV_TOOLS_PASSWORD ?? "";
}
