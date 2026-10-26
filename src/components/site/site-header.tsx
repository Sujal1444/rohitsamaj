import { Link, useNavigate, useRouterState, useRouteContext } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { countryPath, type Country } from "@/lib/directory-content";
import { logoutFn } from "@/api/auth";

function navClass(active: boolean) {
  return active ? "font-semibold text-primary" : "text-muted-foreground hover:text-foreground";
}

export function SiteHeader({ country = "UK" }: { country?: Country }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useRouteContext({ from: "__root__" });
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const home = countryPath(country);
  const onDirectory = pathname.startsWith("/india") || pathname.startsWith("/uk");
  const onHome = pathname === "/india" || pathname === "/india/" || pathname === "/uk" || pathname === "/uk/";

  const links = [
    { to: "/about" as const, label: "About", match: "/about" },
    { to: "/contact" as const, label: "Contact", match: "/contact" },
    ...(user
      ? [{ to: "/account" as const, label: "Account", match: "/account" }]
      : [{ to: "/login" as const, label: "Login", match: "/login" }]),
  ];

  async function onLogout() {
    await logoutFn();
    setOpen(false);
    await navigate({ to: "/login" });
  }

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-[76px] w-full max-w-6xl items-center justify-between gap-4 px-5">
        <Link to={home} className="text-xl leading-7 font-semibold" aria-label="Rohit Samaj home">
          Rohit<span className="font-normal">samaj</span>
        </Link>
        <nav className="hidden items-center gap-6 text-[16px] leading-6 md:flex" aria-label="Main navigation">
          <Link to={home} className={navClass(onHome)} aria-current={onHome ? "page" : undefined}>
            Home
          </Link>
          {links.map((item) => {
            const active = pathname === item.match || pathname.startsWith(`${item.match}/`);
            return (
              <Link key={item.to} to={item.to} className={navClass(active)} aria-current={active ? "page" : undefined}>
                {item.label}
              </Link>
            );
          })}
          {user?.role === "admin" ? (
            <Link to="/admin" className={navClass(pathname.startsWith("/admin"))} aria-current={pathname.startsWith("/admin") ? "page" : undefined}>
              Admin
            </Link>
          ) : null}
        </nav>
        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-2 text-[16px]" aria-label="Country">
            <Link to="/uk" className={country === "UK" && onDirectory ? "font-semibold text-primary" : "text-muted-foreground"} aria-current={country === "UK" && onDirectory ? "page" : undefined}>
              UK
            </Link>
            <span className="text-border" aria-hidden="true">
              /
            </span>
            <Link to="/india" className={country === "India" && onDirectory ? "font-semibold text-primary" : "text-muted-foreground"} aria-current={country === "India" && onDirectory ? "page" : undefined}>
              India
            </Link>
          </nav>
          {user ? (
            <button type="button" onClick={onLogout} className="hidden rounded-md border border-border px-3 py-2 text-sm font-medium sm:inline-flex">
              Logout
            </button>
          ) : (
            <Link to="/register" className="hidden rounded-md border border-border px-3 py-2 text-sm font-medium sm:inline-flex">
              Register
            </Link>
          )}
          <button type="button" className="inline-flex size-10 items-center justify-center rounded-md md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <nav className="flex flex-col gap-3 border-t border-border px-5 py-4 text-[16px] md:hidden" aria-label="Mobile navigation">
          <Link to={home} className={navClass(onHome)} onClick={() => setOpen(false)} aria-current={onHome ? "page" : undefined}>
            Home
          </Link>
          {links.map((item) => {
            const active = pathname === item.match;
            return (
              <Link key={item.to} to={item.to} className={navClass(active)} onClick={() => setOpen(false)} aria-current={active ? "page" : undefined}>
                {item.label}
              </Link>
            );
          })}
          {user?.role === "admin" ? (
            <Link to="/admin" className={navClass(pathname.startsWith("/admin"))} onClick={() => setOpen(false)}>
              Admin
            </Link>
          ) : null}
          {user ? (
            <button type="button" className="text-left text-muted-foreground" onClick={onLogout}>
              Logout
            </button>
          ) : (
            <Link to="/register" className={navClass(pathname === "/register")} onClick={() => setOpen(false)}>
              Register
            </Link>
          )}
        </nav>
      ) : null}
    </header>
  );
}
