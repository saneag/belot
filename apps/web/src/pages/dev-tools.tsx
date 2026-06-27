import { FEATURE_TOGGLES, type FeatureToggleName } from "@belot/constants";
import { useDevTools } from "@belot/hooks";
import { formatLocalizationString } from "@belot/localizations";

import { BackButton } from "@/components/backButton";
import { PageHeader } from "@/components/pageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { getDevToolsPassword } from "@/helpers/devToolsPassword";
import { getFromStorage, setToStorage } from "@/helpers/storageHelpers";

const FEATURE_TOGGLE_NAMES = Object.keys(FEATURE_TOGGLES) as FeatureToggleName[];

export default function DevToolsPage() {
  const {
    auth,
    handleSubmit,
    isLocked,
    messages,
    password,
    setFeatureToggle,
    setPassword,
    toggles,
  } = useDevTools({ devToolsPassword: getDevToolsPassword(), getFromStorage, setToStorage });

  return (
    <div className="relative flex h-full flex-col items-center">
      <BackButton />
      <PageHeader title={messages.devToolsTitle} />

      <div className="flex w-full flex-1 flex-col justify-center px-6 pt-20">
        {auth.isAuthenticated ? (
          <div className="flex flex-col gap-3">
            {FEATURE_TOGGLE_NAMES.map((name) => (
              <div
                key={name}
                className="border-border bg-input/20 flex min-h-14 items-center justify-between gap-3 rounded-lg border px-3 py-2"
              >
                <Label htmlFor={`feature-toggle-${name}`} className="text-sm">
                  {name}
                </Label>
                <Switch
                  id={`feature-toggle-${name}`}
                  checked={toggles[name]}
                  onCheckedChange={(enabled) => void setFeatureToggle(name, enabled)}
                  aria-label={formatLocalizationString(messages.devToolsFeatureToggleLabel, [name])}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="dev-tools-password">{messages.devToolsPasswordLabel}</Label>
              <Input
                id="dev-tools-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isLocked}
                autoComplete="current-password"
              />
            </div>
            {auth.error ? <p className="text-destructive text-sm">{auth.error}</p> : null}
            {isLocked ? (
              <p className="text-muted-foreground text-sm">{messages.devToolsTryAgainIn}</p>
            ) : null}
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLocked || password.length === 0}
            >
              {messages.devToolsUnlockButton}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
