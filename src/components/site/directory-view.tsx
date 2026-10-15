import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  categoriesFor,
  defaultDirectorySearch,
  emptyListingMessage,
  filterListings,
  listings as sourceListings,
  sortListings,
  type Country,
  type DirectorySearch,
} from "@/lib/directory-content";
import { readSaved, readSubmissions, toggleSaved } from "@/lib/directory-storage";
import { CategoryGrid } from "./category-grid";
import { HeroSearch } from "./hero-search";
import { ListingGrid } from "./listing-grid";
import { PageShell } from "./page-shell";

export function DirectoryView({
  country,
  category = "All",
  search,
  onSearchChange,
}: {
  country: Country;
  category?: string;
  search: DirectorySearch;
  onSearchChange: (next: DirectorySearch) => void;
}) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState<string[]>([]);
  const [submissions, setSubmissions] = useState(sourceListings);
  useEffect(() => {
    setSaved(readSaved());
    setSubmissions([...sourceListings, ...readSubmissions()]);
  }, []);

  const visible = sortListings(
    filterListings(country, category, search.q, search.city, search.type, submissions),
    search.sort,
  );

  function reset() {
    onSearchChange(defaultDirectorySearch);
    if (category !== "All") {
      void navigate({ to: country === "India" ? "/india" : "/uk", search: defaultDirectorySearch });
    }
  }

  return (
    <PageShell country={country}>
      <HeroSearch country={country} category={category === "All" ? undefined : category} search={search} listings={submissions} onSearchChange={onSearchChange} onReset={reset} />
      {category === "All" ? <CategoryGrid country={country} categories={categoriesFor(country)} listings={submissions} /> : null}
      <section className="mx-auto w-full max-w-6xl px-5 py-12" aria-labelledby="listings-title">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 id="listings-title" className="text-[32px] leading-10 font-semibold">
              {category === "All" ? `Listings in ${country}` : category}
            </h2>
            <p className="text-base leading-[26px] text-muted-foreground">
              {visible.length} {visible.length === 1 ? "listing" : "listings"}
            </p>
          </div>
          <button type="button" className="text-sm font-medium text-primary" onClick={reset}>
            Explore all
          </button>
        </div>
        <ListingGrid
          listings={visible}
          saved={saved}
          onToggleSaved={(id) => setSaved(toggleSaved(id))}
          emptyMessage={emptyListingMessage(category, search.q, search.type)}
        />
      </section>
    </PageShell>
  );
}
