import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Star } from "lucide-react";
import { slugify, type Country, type Listing } from "@/lib/directory-content";
import { absoluteUrl } from "@/lib/site";
import { JsonLd } from "./json-ld";
import { PageShell } from "./page-shell";

export function ListingDetails({ country, slug, initial }: { country: Country; slug: string; initial: Listing | null }) {
  const listing = initial;

  if (!listing) {
    return (
      <PageShell country={country}>
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h1 className="text-[32px] leading-10 font-semibold text-foreground">Listing not found</h1>
          <p className="mt-3 text-muted-foreground">This business is not in the {country} directory.</p>
          <Link to={country === "India" ? "/india" : "/uk"} className="mt-6 inline-flex rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:text-white">
            Back to listings
          </Link>
        </div>
      </PageShell>
    );
  }

  const categoryTo = country === "India" ? "/india/category/$slug" : "/uk/category/$slug";
  const homeTo = country === "India" ? "/india" : "/uk";

  return (
    <PageShell country={country}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: listing.name,
          description: listing.description,
          url: absoluteUrl(`${country === "India" ? "/india" : "/uk"}/listing/${listing.slug}`),
          image: absoluteUrl(listing.image),
          telephone: listing.phone || undefined,
          address: listing.address,
        }}
      />

      <section className="relative isolate overflow-hidden text-white">
        <img src={listing.image} alt="" width={1600} height={640} className="absolute inset-0 -z-20 size-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-hero/85" aria-hidden="true" />
        <div className="mx-auto w-full max-w-6xl px-5 py-14 md:py-16">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-white/80" aria-label="Breadcrumb">
            <Link to={homeTo} className="hover:text-white">
              {country === "UK" ? "UK" : "India"}
            </Link>
            <span aria-hidden="true">/</span>
            <Link to={categoryTo} params={{ slug: slugify(listing.category) }} className="hover:text-white">
              {listing.category}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-white">{listing.name}</span>
          </nav>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {listing.featured ? <span className="rounded bg-white px-2 py-1 text-xs font-medium text-foreground">Popular</span> : null}
            <span className="rounded bg-white/15 px-2 py-1 text-xs font-medium text-white">{listing.directoryType}</span>
            <span className="rounded bg-white/15 px-2 py-1 text-xs font-medium text-white">{listing.category}</span>
          </div>
          <h1 className="mt-4 max-w-3xl text-5xl leading-[56px] font-semibold max-md:text-[32px] max-md:leading-10">{listing.name}</h1>
          <p className="mt-3 inline-flex items-center gap-2 text-base text-white/90">
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            {listing.city}
          </p>
        </div>
      </section>

      <article className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <img
            src={listing.image}
            alt={listing.name}
            className="mx-auto block h-auto w-auto max-h-[min(70vh,42rem)] max-w-full rounded-xl bg-accent object-contain"
          />
          <h2 className="mt-8 text-[32px] leading-10 font-semibold text-foreground">About this business</h2>
          <p className="mt-4 text-base leading-[26px] text-foreground">{listing.description}</p>

          {listing.serviceDetails.length > 0 ? (
            <div className="mt-8">
              <h2 className="text-[32px] leading-10 font-semibold text-foreground">Services</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {listing.serviceDetails.map((service) => (
                  <li key={service} className="rounded-lg border border-border bg-secondary px-4 py-3 text-base leading-[26px] text-foreground">
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={categoryTo}
              params={{ slug: slugify(listing.category) }}
              className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-primary"
            >
              More in {listing.category}
            </Link>
            <Link to={homeTo} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Back to {country === "UK" ? "UK" : "India"} listings
            </Link>
          </div>
        </div>

        <aside className="h-fit rounded-xl border border-border bg-secondary px-6 py-6 lg:sticky lg:top-6">
          <h2 className="text-xl leading-7 font-semibold text-foreground">Contact details</h2>
          <div className="mt-5 space-y-4 text-base leading-[26px]">
            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Address</p>
              <p className="mt-1 inline-flex items-start gap-2 text-foreground">
                <MapPin className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{listing.address}</span>
              </p>
            </div>
            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Location</p>
              <p className="mt-1 text-foreground">{listing.city}, {listing.country === "UK" ? "United Kingdom" : "India"}</p>
            </div>
            {listing.phoneHref ? (
              <div>
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Phone</p>
                <p className="mt-1">
                  <a className="inline-flex items-center gap-2 font-medium text-primary" href={listing.phoneHref}>
                    <Phone className="size-4" aria-hidden="true" />
                    {listing.phone}
                  </a>
                </p>
              </div>
            ) : null}
            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Reviews</p>
              {listing.rating !== null ? (
                <p className="mt-1 inline-flex items-center gap-2 text-foreground">
                  <Star className="size-4 fill-gold text-gold" aria-hidden="true" />
                  {listing.rating.toFixed(1)} ({listing.reviews} {listing.reviews === 1 ? "review" : "reviews"})
                </p>
              ) : (
                <p className="mt-1 text-muted-foreground">No reviews yet</p>
              )}
            </div>
          </div>
          {listing.phoneHref ? (
            <a
              href={listing.phoneHref}
              className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-brand px-4 py-3 text-sm font-medium text-white hover:text-white"
            >
              Call now
            </a>
          ) : null}
        </aside>
      </article>
    </PageShell>
  );
}
