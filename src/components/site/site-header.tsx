import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { countryPath, type Country } from "@/lib/directory-content";

const links = [
  { to: "/about", label: "About", match: "/about" },
  { to: "/contact", label: "Contact", match: "/contact" },
  { to: "/account", label: "Account", match: "/account" },
] as const;

function navClass(active: boolean) {
  return active ? "font-semibold text-primary" : "text-muted-foreground hover:text-foreground";
}

export function SiteHeader({ country = "India" }: { country?: Country }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const home = countryPath(country);
  const onDirectory = pathname.startsWith("/india") || pathname.startsWith("/uk");
  const onHome = pathname === "/india" || pathname === "/india/" || pathname === "/uk" || pathname === "/uk/";

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-[76px] w-full max-w-6xl items-center justify-between gap-4 px-5">
        <Link to={home} className="text-xl leading-7 font-semibold" aria-label="Rohit Samaj home">
          rohit<span className="font-normal">samaj</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm leading-[22px] md:flex" aria-label="Main navigation">
          <Link to={home} className={navClass(onHome)} aria-current={onHome ? "page" : undefined}>
            Home
          </Link>
          {links.map((item) => {
            const active = pathname === item.match;
            return (
              <Link key={item.to} to={item.to} className={navClass(active)} aria-current={active ? "page" : undefined}>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-2 text-sm" aria-label="Country">
            <Link to="/india" className={country === "India" && onDirectory ? "font-semibold text-primary" : "text-muted-foreground"} aria-current={country === "India" && onDirectory ? "page" : undefined}>
              India
            </Link>
            <span className="text-border" aria-hidden="true">/</span>
            <Link to="/uk" className={country === "UK" && onDirectory ? "font-semibold text-primary" : "text-muted-foreground"} aria-current={country === "UK" && onDirectory ? "page" : undefined}>
              UK
            </Link>
          </nav>
          <Link
            to="/add-listing"
            className={`hidden rounded-md px-4 py-2 text-sm leading-5 font-medium sm:inline-flex ${pathname === "/add-listing" ? "bg-brand text-white ring-2 ring-primary ring-offset-2" : "bg-brand text-white hover:text-white"}`}
            aria-current={pathname === "/add-listing" ? "page" : undefined}
          >
            Add a listing
          </Link>
          <button type="button" className="inline-flex size-10 items-center justify-center rounded-md md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <nav className="flex flex-col gap-3 border-t border-border px-5 py-4 text-sm md:hidden" aria-label="Mobile navigation">
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
          <Link to="/add-listing" className={navClass(pathname === "/add-listing")} onClick={() => setOpen(false)} aria-current={pathname === "/add-listing" ? "page" : undefined}>
            Add a listing
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
