import type { ReactNode } from "react";
import type { Country } from "@/lib/directory-content";
import { PageTransition } from "./page-transition";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function PageShell({ country, children }: { country?: Country | undefined; children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {country ? <SiteHeader country={country} /> : <SiteHeader />}
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter />
    </div>
  );
}
