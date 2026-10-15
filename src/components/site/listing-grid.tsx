import { Link } from "@tanstack/react-router";
import { Heart, MapPin, Star } from "lucide-react";
import { listingPath, type Listing } from "@/lib/directory-content";

export function ListingGrid({
  listings,
  saved,
  onToggleSaved,
  emptyMessage,
}: {
  listings: Listing[];
  saved: string[];
  onToggleSaved: (id: string) => void;
  emptyMessage: string;
}) {
  if (listings.length === 0) {
    return (
      <div className="rounded-lg bg-secondary px-6 py-12 text-center">
        <p className="text-base">{emptyMessage}</p>
        <Link to="/add-listing" className="mt-4 inline-flex rounded-md border border-border bg-background px-4 py-2 text-sm">
          Add a listing
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {listings.map((item) => (
        <article key={item.id} className="overflow-hidden rounded-lg border border-border bg-background">
          <div className="relative h-44 bg-accent">
            <img src={item.image} alt={item.name} width={360} height={180} className="h-full w-full object-cover" loading="lazy" />
            {item.featured ? <span className="absolute top-3 left-3 rounded bg-background px-2 py-1 text-xs leading-4 font-medium">Popular</span> : null}
            <button
              type="button"
              className="absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-full bg-background"
              aria-label={`${saved.includes(item.id) ? "Unsave" : "Save"} ${item.name}`}
              aria-pressed={saved.includes(item.id)}
              onClick={() => onToggleSaved(item.id)}
            >
              <Heart className="size-4" fill={saved.includes(item.id) ? "currentColor" : "none"} />
            </button>
          </div>
          <div className="space-y-2 p-4">
            <div className="flex items-center justify-between gap-3 text-xs leading-4 text-muted-foreground">
              <span>{item.category}</span>
              {item.rating !== null ? (
                <span className="inline-flex items-center gap-1 text-foreground">
                  <Star className="size-3 fill-gold text-gold" aria-hidden="true" />
                  {item.rating.toFixed(1)} ({item.reviews})
                </span>
              ) : (
                <span>No reviews yet</span>
              )}
            </div>
            <h3 className="text-xl leading-7 font-semibold">
              <Link to={item.country === "India" ? "/india/listing/$slug" : "/uk/listing/$slug"} params={{ slug: item.slug }}>
                {item.name}
              </Link>
            </h3>
            <p className="inline-flex items-center gap-1 text-sm leading-[22px] text-muted-foreground">
              <MapPin className="size-4" aria-hidden="true" />
              {item.city}
            </p>
            <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
              {item.phoneHref ? <a className="text-primary" href={item.phoneHref}>{item.phone}</a> : <span className="text-muted-foreground">{item.directoryType}</span>}
              <Link className="font-medium text-primary" to={item.country === "India" ? "/india/listing/$slug" : "/uk/listing/$slug"} params={{ slug: item.slug }}>
                View details
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
