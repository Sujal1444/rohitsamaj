import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthCard, AuthField, authInputClass } from "@/components/site/auth-card";
import { resetPasswordFn } from "@/api/auth-actions";
import { pageHead } from "@/lib/site";
import { z } from "zod";

const searchSchema = z.object({
  token: z.string().optional().default(""),
});

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () =>
    pageHead({
      title: "Reset password | Rohit Samaj",
      description: "Choose a new Rohit Samaj password.",
      path: "/reset-password",
    }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!token) {
      setError("Missing reset token.");
      return;
    }
    setPending(true);
    setError("");
    const result = await resetPasswordFn({ data: { token, password } });
    setPending(false);
    if (!result.ok) {
      setError("This reset link is invalid or expired.");
      return;
    }
    await navigate({ to: "/login" });
  }

  return (
    <AuthCard
      title="Reset password"
      description="Enter a new password for your account."
      footer={
        <Link to="/login" className="text-primary hover:underline">
          Back to login
        </Link>
      }
    >
      <form className="grid gap-4" onSubmit={onSubmit}>
        <AuthField label="New password">
          <input className={authInputClass} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete="new-password" />
        </AuthField>
        {error ? <p className="text-sm text-brand">{error}</p> : null}
        <button type="submit" disabled={pending || !token} className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
          {pending ? "Saving…" : "Update password"}
        </button>
      </form>
    </AuthCard>
  );
}
