import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { defaultDirectorySearch, getListing, slugify, type Country, type Listing } from "@/lib/directory-content";
import { readSubmissions } from "@/lib/directory-storage";
import { absoluteUrl } from "@/lib/site";
import { JsonLd } from "./json-ld";
import { PageShell } from "./page-shell";

export function ListingDetails({ country, slug, initial }: { country: Country; slug: string; initial: Listing | null }) {
  const [listing, setListing] = useState(initial);
  useEffect(() => {
    if (!initial) setListing(getListing(country, slug, readSubmissions()) ?? null);
  }, [country, initial, slug]);

  if (!listing) {
    return (
      <PageShell country={country}>
        <div className="mx-auto max-w-3xl px-5 py-16">
          <h1 className="text-[32px] leading-10 font-semibold">Listing not found</h1>
          <p className="mt-3 text-muted-foreground">This business is not in the {country} directory.</p>
          <Link to={country === "India" ? "/india" : "/uk"} search={defaultDirectorySearch} className="mt-6 inline-flex text-primary">
            Back to listings
          </Link>
        </div>
      </PageShell>
    );
  }

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
      <article className="mx-auto w-full max-w-3xl px-5 py-12">
        <img src={listing.image} alt={listing.name} width={960} height={540} className="mb-6 h-64 w-full rounded-lg bg-accent object-cover" />
        <p className="text-sm text-primary">{listing.category}</p>
        <h1 className="mt-2 text-5xl leading-[56px] font-semibold max-md:text-[32px] max-md:leading-10">{listing.name}</h1>
        <p className="mt-4 text-base leading-[26px]">{listing.description}</p>
        <div className="mt-6 space-y-2 text-base text-muted-foreground">
          <p className="inline-flex items-center gap-2">
            <MapPin className="size-4" aria-hidden="true" /> {listing.address}
          </p>
          <p>
            {listing.directoryType}
            {listing.rating !== null ? ` · ${listing.rating.toFixed(1)} (${listing.reviews} review)` : " · No reviews yet"}
          </p>
          {listing.phoneHref ? (
            <p>
              <a className="text-primary" href={listing.phoneHref}>
                {listing.phone}
              </a>
            </p>
          ) : null}
        </div>
        {listing.serviceDetails.length > 0 ? (
          <>
            <h2 className="mt-8 text-xl leading-7 font-semibold">Services</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              {listing.serviceDetails.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </>
        ) : null}
        <Link
          to={country === "India" ? "/india/category/$slug" : "/uk/category/$slug"}
          params={{ slug: slugify(listing.category) }}
          search={defaultDirectorySearch}
          className="mt-8 inline-flex text-sm font-medium text-primary"
        >
          More in {listing.category}
        </Link>
      </article>
    </PageShell>
  );
}
