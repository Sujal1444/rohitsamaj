import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthCard, AuthField, authInputClass } from "@/components/site/auth-card";
import { getCurrentUser } from "@/api/auth";
import { registerFn } from "@/api/auth-actions";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/register")({
  head: () =>
    pageHead({
      title: "Register | Rohit Samaj",
      description: "Create a Rohit Samaj account.",
      path: "/register",
    }),
  beforeLoad: async () => {
    const user = await getCurrentUser();
    if (user) throw redirect({ to: "/account" });
  },
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const result = await registerFn({ data: { name, email, password } });
    setPending(false);
    if (!result.ok) {
      setError(result.error === "EMAIL_IN_USE" ? "That email is already registered." : "Could not create your account.");
      return;
    }
    await navigate({ to: "/account" });
  }

  return (
    <AuthCard
      title="Register"
      description="Create an account with your name, email, and password."
      footer={
        <>
          Already registered?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </>
      }
    >
      <form className="grid gap-4" onSubmit={onSubmit}>
        <AuthField label="Name">
          <input className={authInputClass} value={name} onChange={(e) => setName(e.target.value)} required minLength={2} autoComplete="name" />
        </AuthField>
        <AuthField label="Email">
          <input className={authInputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </AuthField>
        <AuthField label="Password">
          <input className={authInputClass} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete="new-password" />
        </AuthField>
        {error ? <p className="text-sm text-brand">{error}</p> : null}
        <button type="submit" disabled={pending} className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
          {pending ? "Creating…" : "Create account"}
        </button>
      </form>
    </AuthCard>
  );
}
