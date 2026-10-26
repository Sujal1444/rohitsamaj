import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthCard, AuthField, authInputClass } from "@/components/site/auth-card";
import { forgotPasswordFn } from "@/api/auth-actions";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/forgot-password")({
  head: () =>
    pageHead({
      title: "Forgot password | Rohit Samaj",
      description: "Reset your Rohit Samaj password.",
      path: "/forgot-password",
    }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setResetUrl("");
    const result = await forgotPasswordFn({ data: { email } });
    setPending(false);
    setMessage("If that email exists, a reset link is ready.");
    if ("resetUrl" in result && result.resetUrl) setResetUrl(result.resetUrl);
  }

  return (
    <AuthCard
      title="Forgot password"
      description="Enter your email and we will send a reset link."
      footer={
        <Link to="/login" className="text-primary hover:underline">
          Back to login
        </Link>
      }
    >
      <form className="grid gap-4" onSubmit={onSubmit}>
        <AuthField label="Email">
          <input className={authInputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </AuthField>
        {message ? <p className="text-sm text-primary">{message}</p> : null}
        {resetUrl ? (
          <p className="break-all text-sm text-muted-foreground">
            Dev reset link:{" "}
            <a className="text-primary underline" href={resetUrl}>
              {resetUrl}
            </a>
          </p>
        ) : null}
        <button type="submit" disabled={pending} className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
          {pending ? "Sending…" : "Send reset link"}
        </button>
      </form>
    </AuthCard>
  );
}
