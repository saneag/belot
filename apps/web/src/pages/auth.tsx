import { useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { Layout } from "@/components/_layout";
import PhoneScreen from "@/components/phoneScreen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/auth/authContext";

export default function AuthPage({ mode }: { mode: "login" | "register" }) {
  const isRegister = mode === "register";
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      if (isRegister) await signUp({ username, email, password });
      else await signIn({ identifier: username, password });
      navigate((location.state as { from?: string } | null)?.from ?? "/");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to authenticate");
    }
  };
  return (
    <Layout>
      <PhoneScreen>
        <div className="mx-auto flex h-full w-full max-w-sm flex-col justify-center gap-4 px-6">
          <h1 className="text-2xl font-semibold">{isRegister ? "Create account" : "Sign in"}</h1>
          <form className="flex flex-col gap-3" onSubmit={submit}>
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
            <Button type="submit">{isRegister ? "Register" : "Sign in"}</Button>
            {error && <p className="text-destructive text-sm">{error}</p>}
          </form>
          <Link className="text-sm underline" to={isRegister ? "/login" : "/register"}>
            {isRegister ? "Already have an account? Sign in" : "Need an account? Register"}
          </Link>
        </div>
      </PhoneScreen>
    </Layout>
  );
}
