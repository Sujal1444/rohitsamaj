import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { PageHero } from "./page-hero";
import { PageShell } from "./page-shell";

export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <PageShell>
      <PageHero title={title} description={description} />
      <div className="mx-auto w-full max-w-md px-5 py-12">
        <div className="rounded-lg border border-border bg-background px-6 py-6">{children}</div>
        {footer ? <div className="mt-4 text-center text-sm text-muted-foreground">{footer}</div> : null}
      </div>
    </PageShell>
  );
}

export function AuthField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1 text-sm">
      {label}
      {children}
    </label>
  );
}

export const authInputClass = "rounded-md border border-border px-3 py-2 text-base";

export function AuthLinks() {
  return (
    <p className="text-sm text-muted-foreground">
      <Link to="/login" className="text-primary hover:underline">
        Login
      </Link>
      {" · "}
      <Link to="/register" className="text-primary hover:underline">
        Register
      </Link>
      {" · "}
      <Link to="/forgot-password" className="text-primary hover:underline">
        Forgot password
      </Link>
    </p>
  );
}
