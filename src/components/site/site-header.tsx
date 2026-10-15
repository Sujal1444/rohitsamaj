import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { countryPath, defaultDirectorySearch, type Country } from "@/lib/directory-content";

const links = [
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/account", label: "Account" },
] as const;

export function SiteHeader({ country = "India" }: { country?: Country }) {
  const [open, setOpen] = useState(false);
  const home = countryPath(country);

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-[76px] w-full max-w-6xl items-center justify-between gap-4 px-5">
        <Link to={home} search={defaultDirectorySearch} className="text-xl leading-7 font-semibold" aria-label="Rohit Samaj home">
          rohit<span className="font-normal">samaj</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm leading-[22px] md:flex" aria-label="Main navigation">
          <Link to={home} search={defaultDirectorySearch} className="font-medium text-primary">
            Home
          </Link>
          {links.map((item) => (
            <Link key={item.to} to={item.to}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-2 text-sm" aria-label="Country">
            <Link to="/india" search={defaultDirectorySearch} className={country === "India" ? "font-semibold text-primary" : "text-muted-foreground"} aria-current={country === "India" ? "page" : undefined}>
              India
            </Link>
            <span className="text-border" aria-hidden="true">/</span>
            <Link to="/uk" search={defaultDirectorySearch} className={country === "UK" ? "font-semibold text-primary" : "text-muted-foreground"} aria-current={country === "UK" ? "page" : undefined}>
              UK
            </Link>
          </nav>
          <Link to="/add-listing" className="hidden rounded-md bg-brand px-4 py-2 text-sm leading-5 font-medium text-white sm:inline-flex">
            Add a listing
          </Link>
          <button type="button" className="inline-flex size-10 items-center justify-center rounded-md md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <nav className="flex flex-col gap-3 border-t border-border px-5 py-4 text-sm md:hidden" aria-label="Mobile navigation">
          <Link to={home} search={defaultDirectorySearch} onClick={() => setOpen(false)}>Home</Link>
          {links.map((item) => (
            <Link key={item.to} to={item.to} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link to="/add-listing" onClick={() => setOpen(false)}>Add a listing</Link>
        </nav>
      ) : null}
    </header>
  );
}
