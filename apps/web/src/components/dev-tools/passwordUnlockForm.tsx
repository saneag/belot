import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordUnlockFormProps {
  error: string | null;
  isLocked: boolean;
  onPasswordChange: (password: string) => void;
  onSubmit: () => void;
  password: string;
  passwordLabel: string;
  tryAgainMessage: string;
  unlockButtonLabel: string;
}

export function PasswordUnlockForm({
  error,
  isLocked,
  onPasswordChange,
  onSubmit,
  password,
  passwordLabel,
  tryAgainMessage,
  unlockButtonLabel,
}: PasswordUnlockFormProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <Label htmlFor="dev-tools-password">{passwordLabel}</Label>
        <Input
          id="dev-tools-password"
          type="password"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          disabled={isLocked}
          autoComplete="current-password"
        />
      </div>
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
      {isLocked ? <p className="text-muted-foreground text-sm">{tryAgainMessage}</p> : null}
      <Button type="button" onClick={onSubmit} disabled={isLocked || password.length === 0}>
        {unlockButtonLabel}
      </Button>
    </div>
  );
}
