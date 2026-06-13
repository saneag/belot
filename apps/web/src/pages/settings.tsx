import { useLocalization } from "@belot/localizations";

export default function SettingsPage() {
  const settingsMsg = useLocalization("settings");

  return (
    <div className="flex h-full flex-1 items-center justify-center px-2.5">
      <h1 className="text-center text-4xl font-normal">{settingsMsg}</h1>
    </div>
  );
}
