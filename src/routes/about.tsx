import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/page-hero";
import { PageShell } from "@/components/site/page-shell";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead({
      title: "About Rohit Samaj",
      description: "Rohit Samaj is a community directory for local businesses and services in India and the United Kingdom.",
      path: "/about",
    }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell>
      <PageHero
        title="About Rohit Samaj"
        description="A community directory for local businesses, professionals, and services across India and the United Kingdom."
      />
      <article className="mx-auto w-full max-w-6xl px-5 py-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4 text-base leading-[26px]">
            <h2 className="text-[32px] leading-10 font-semibold">Built for local discovery</h2>
            <p>
              Rohit Samaj helps people find places to stay, eat, shop, and get things done. Browse by country, open a category page, then visit each business for its address, phone, and services.
            </p>
            <p>
              Listings can be saved in this browser, and business owners can submit a new listing without leaving the site. India and the UK each have their own directory so regional searches stay clear.
            </p>
          </div>
          <aside className="rounded-lg bg-secondary px-6 py-6">
            <h2 className="text-xl leading-7 font-semibold">What you can do</h2>
            <ul className="mt-4 space-y-3 text-base leading-[26px] text-muted-foreground">
              <li>Search by name, city, category, and directory type.</li>
              <li>Switch between the India and UK directories.</li>
              <li>Open a business page with contact details and services.</li>
              <li>Save listings and submit a business from this device.</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/india" className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:text-white">
                Browse India
              </Link>
              <Link to="/contact" className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-primary">
                Contact us
              </Link>
            </div>
          </aside>
        </div>
      </article>
    </PageShell>
  );
}
