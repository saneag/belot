import { useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  formatLocalizationKey,
  getAuthErrorLocalizationKey,
  useLocalizations,
} from "@belot/localizations";

import { Layout } from "@/components/_layout";
import { BackButton } from "@/components/backButton";
import PhoneScreen from "@/components/phoneScreen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/auth/useAuth";

export default function AuthPage({ mode }: { mode: "login" | "register" }) {
  const isRegister = mode === "register";
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorKey, setErrorKey] = useState<ReturnType<typeof getAuthErrorLocalizationKey> | null>(
    null,
  );
  const { signIn, signUp } = useAuth();
  const messages = useLocalizations([
    { key: "login" },
    { key: "auth.create.account.title" },
    { key: "auth.register" },
    { key: "auth.email.label" },
    { key: "auth.username.label" },
    { key: "auth.identifier.label" },
    { key: "auth.password.label" },
    { key: "auth.need.account" },
    { key: "auth.already.have.account" },
    { key: errorKey ?? "auth.error.generic" },
  ]);
  const errorMessage = messages[formatLocalizationKey(errorKey ?? "auth.error.generic")];
  const navigate = useNavigate();
  const location = useLocation();
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorKey(null);
    try {
      if (isRegister) await signUp({ username, email, password });
      else await signIn({ identifier: username, password });
      void navigate((location.state as { from?: string } | null)?.from ?? "/");
    } catch (reason) {
      setErrorKey(getAuthErrorLocalizationKey(reason));
    }
  };
  return (
    <Layout>
      <PhoneScreen>
        <BackButton />
        <div className="mx-auto flex h-full w-full max-w-sm flex-col justify-center gap-4 px-6">
          <h1 className="text-2xl font-semibold">
            {isRegister ? messages.authCreateAccountTitle : messages.login}
          </h1>
          <form className="flex flex-col gap-3" onSubmit={(event) => void submit(event)}>
            {isRegister && (
              <>
                <Label htmlFor="email">{messages.authEmailLabel}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </>
            )}
            <Label htmlFor="identifier">
              {isRegister ? messages.authUsernameLabel : messages.authIdentifierLabel}
            </Label>
            <Input
              id="identifier"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Label htmlFor="password">{messages.authPasswordLabel}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit">{isRegister ? messages.authRegister : messages.login}</Button>
            {errorKey && <p className="text-destructive text-sm">{errorMessage}</p>}
          </form>
          <Link
            className="w-fit self-center text-sm underline"
            replace
            to={isRegister ? "/login" : "/register"}
          >
            {isRegister ? messages.authAlreadyHaveAccount : messages.authNeedAccount}
          </Link>
        </div>
      </PhoneScreen>
    </Layout>
  );
}
