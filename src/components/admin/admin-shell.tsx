import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowUpRight, Boxes, LayoutDashboard, LogOut, Store, Users, type LucideIcon } from "lucide-react";
import { logoutFn } from "@/api/auth";
import type { PublicUser } from "@/lib/auth-types";

const links: { to: "/admin" | "/admin/users" | "/admin/listings" | "/admin/categories"; label: string; icon: LucideIcon; exact?: boolean }[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/listings", label: "Listings", icon: Store },
  { to: "/admin/categories", label: "Categories", icon: Boxes },
];

export function AdminShell({ user, children }: { user: PublicUser; children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();

  async function onLogout() {
    await logoutFn();
    await navigate({ to: "/login" });
  }

  return (
    <div className="admin-workspace min-h-screen bg-secondary text-foreground">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-border bg-background lg:flex">
        <Link to="/admin" className="flex h-[76px] items-center gap-3 border-b border-border px-6">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-sm font-bold tracking-tight text-white">RS</span>
          <span><span className="block text-[15px] font-semibold leading-5">RohitSamaj</span><span className="block text-xs text-muted-foreground">Administration</span></span>
        </Link>
        <div className="px-4 pt-7">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[.16em] text-muted-foreground">Workspace</p>
          <nav className="space-y-1" aria-label="Admin">
            {links.map((item) => {
              const active = item.exact ? pathname === item.to || pathname === `${item.to}/` : pathname.startsWith(item.to);
              const Icon = item.icon;
              return <Link key={item.to} to={item.to} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${active ? "bg-accent font-medium text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}><Icon size={18} strokeWidth={1.8} />{item.label}{active ? <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gold" /> : null}</Link>;
            })}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Link to="/uk" className="flex items-center justify-between rounded-xl border border-border bg-secondary/70 p-3 text-sm hover:border-primary/30">
            <span><span className="block font-medium">RohitSamaj site</span><span className="text-xs text-muted-foreground">Visit public website</span></span><ArrowUpRight size={16} className="text-primary" />
          </Link>
          <div className="mt-4 flex items-center gap-3 border-t border-border px-2 pt-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#fff0df] text-sm font-semibold text-primary">{user.email.slice(0, 1).toUpperCase()}</span>
            <span className="min-w-0 flex-1"><span className="block truncate text-xs font-medium">{user.email}</span><span className="text-[11px] text-muted-foreground">Administrator</span></span>
            <button type="button" onClick={onLogout} aria-label="Log out" title="Log out" className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-brand"><LogOut size={16} /></button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
          <div className="flex h-[76px] items-center justify-between px-5 sm:px-8 lg:px-10">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white lg:hidden">RS</span>
              <div><p className="text-sm font-semibold">Admin workspace</p><p className="text-xs text-muted-foreground">Manage your community directory</p></div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden max-w-52 truncate text-xs text-muted-foreground sm:block">{user.email}</span>
              <Link to="/uk" className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-primary hover:bg-accent">View site <ArrowUpRight size={14} /></Link>
              <button type="button" onClick={onLogout} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground lg:hidden"><LogOut size={15} /><span className="sr-only">Logout</span></button>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-border px-4 py-2 lg:hidden" aria-label="Admin sections">
            {links.map((item) => { const active = item.exact ? pathname === item.to || pathname === `${item.to}/` : pathname.startsWith(item.to); const Icon = item.icon; return <Link key={item.to} to={item.to} className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-xs ${active ? "bg-accent font-medium text-primary" : "text-muted-foreground"}`}><Icon size={15} />{item.label}</Link>; })}
          </nav>
        </header>
        <main className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
