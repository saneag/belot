import { useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { useLocalization } from "@belot/localizations";

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
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();
  const loginLabel = useLocalization("login");
  const navigate = useNavigate();
  const location = useLocation();
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      if (isRegister) await signUp({ username, email, password });
      else await signIn({ identifier: username, password });
      void navigate((location.state as { from?: string } | null)?.from ?? "/");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to authenticate");
    }
  };
  return (
    <Layout>
      <PhoneScreen>
        <BackButton />
        <div className="mx-auto flex h-full w-full max-w-sm flex-col justify-center gap-4 px-6">
          <h1 className="text-2xl font-semibold">{isRegister ? "Create account" : loginLabel}</h1>
          <form className="flex flex-col gap-3" onSubmit={(event) => void submit(event)}>
            {isRegister && (
              <>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </>
            )}
            <Label htmlFor="identifier">{isRegister ? "Username" : "Username or email"}</Label>
            <Input
              id="identifier"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit">{isRegister ? "Register" : loginLabel}</Button>
            {error && <p className="text-destructive text-sm">{error}</p>}
          </form>
          <Link
            className="w-fit self-center text-sm underline"
            replace
            to={isRegister ? "/login" : "/register"}
          >
            {isRegister ? `Already have an account? ${loginLabel}` : "Need an account? Register"}
          </Link>
        </div>
      </PhoneScreen>
    </Layout>
  );
}
