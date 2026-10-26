import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { logoutFn } from "@/api/auth";
import type { PublicUser } from "@/lib/auth-types";

const links = [
  { to: "/admin" as const, label: "Dashboard", exact: true },
  { to: "/admin/users" as const, label: "Users" },
  { to: "/admin/listings" as const, label: "Listings" },
  { to: "/admin/categories" as const, label: "Categories" },
];

export function AdminShell({ user, children }: { user: PublicUser; children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();

  async function onLogout() {
    await logoutFn();
    await navigate({ to: "/login" });
  }

  return (
    <div className="min-h-screen bg-secondary text-foreground">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-5">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="font-semibold">
              RohitSamaj Admin
            </Link>
            <nav className="hidden items-center gap-4 text-sm md:flex" aria-label="Admin">
              {links.map((item) => {
                const active = item.exact ? pathname === item.to || pathname === `${item.to}/` : pathname.startsWith(item.to);
                return (
                  <Link key={item.to} to={item.to} className={active ? "font-semibold text-primary" : "text-muted-foreground hover:text-foreground"}>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-muted-foreground sm:inline">{user.email}</span>
            <Link to="/uk" className="text-primary hover:underline">
              View site
            </Link>
            <button type="button" onClick={onLogout} className="rounded-md border border-border px-3 py-1.5">
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}
