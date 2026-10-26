import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthCard, AuthField, authInputClass } from "@/components/site/auth-card";
import { getCurrentUser } from "@/api/auth";
import { loginFn } from "@/api/auth-actions";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/login")({
  head: () =>
    pageHead({
      title: "Login | Rohit Samaj",
      description: "Sign in to your Rohit Samaj account.",
      path: "/login",
    }),
  beforeLoad: async () => {
    const user = await getCurrentUser();
    if (user) throw redirect({ to: user.role === "admin" ? "/admin" : "/account" });
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const result = await loginFn({ data: { email, password } });
    setPending(false);
    if (!result.ok) {
      setError(result.error === "DISABLED" ? "This account is disabled." : "Invalid email or password.");
      return;
    }
    await navigate({ to: result.user.role === "admin" ? "/admin" : "/account" });
  }

  return (
    <AuthCard title="Login" description="Sign in with your email and password." footer={<AuthFooter />}>
      <form className="grid gap-4" onSubmit={onSubmit}>
        <AuthField label="Email">
          <input className={authInputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </AuthField>
        <AuthField label="Password">
          <input className={authInputClass} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={5} autoComplete="current-password" />
        </AuthField>
        {error ? <p className="text-sm text-brand">{error}</p> : null}
        <button type="submit" disabled={pending} className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthCard>
  );
}

function AuthFooter() {
  return (
    <>
      No account?{" "}
      <Link to="/register" className="text-primary hover:underline">
        Register
      </Link>
      {" · "}
      <Link to="/forgot-password" className="text-primary hover:underline">
        Forgot password
      </Link>
    </>
  );
}
