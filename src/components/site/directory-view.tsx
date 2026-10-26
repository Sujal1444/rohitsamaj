import { useEffect, useState } from "react";
import { useNavigate, useRouteContext } from "@tanstack/react-router";
import {
  defaultDirectorySearch,
  emptyListingMessage,
  filterListings,
  sortListings,
  toDirectoryUrlSearch,
  type Country,
  type DirectorySearch,
  type Listing,
  type Service,
} from "@/lib/directory-content";
import { getSavedIdsFn, toggleSavedListingFn } from "@/api/listings";
import { CategoryGrid } from "./category-grid";
import { HeroSearch } from "./hero-search";
import { ListingGrid } from "./listing-grid";
import { PageShell } from "./page-shell";
import { ServicesForYou } from "./services-for-you";

export function DirectoryView({
  country,
  category = "All",
  listings,
  categories,
  mode = "browse",
  initialSearch = defaultDirectorySearch,
}: {
  country: Country;
  category?: string;
  listings: Listing[];
  categories: Array<Service & { id?: string; groupIds?: string[] }>;
  mode?: "browse" | "results";
  initialSearch?: DirectorySearch;
}) {
  const navigate = useNavigate();
  const { user } = useRouteContext({ from: "__root__" });
  const [search, setSearch] = useState<DirectorySearch>(initialSearch);
  const [saved, setSaved] = useState<string[]>([]);
  const listingsRoute = country === "India" ? ("/india/listings" as const) : ("/uk/listings" as const);
  const homeRoute = country === "India" ? ("/india" as const) : ("/uk" as const);

  useEffect(() => {
    if (!user) {
      setSaved([]);
      return;
    }
    void getSavedIdsFn().then(setSaved);
  }, [user]);

  useEffect(() => {
    if (mode === "results") {
      setSearch(initialSearch);
      return;
    }
    setSearch(defaultDirectorySearch);
  }, [country, category, mode, initialSearch.q, initialSearch.city, initialSearch.type, initialSearch.sort]);

  const visible =
    mode === "results"
      ? sortListings(filterListings(country, category, search.q, search.city, search.type, listings), search.sort)
      : sortListings(filterListings(country, category, "", "All locations", "All", listings), "featured");

  function goToResults(next: DirectorySearch, nextCategory = category) {
    void navigate({
      to: listingsRoute,
      search: toDirectoryUrlSearch(next, nextCategory),
    });
  }

  function onSearchSubmit(next: DirectorySearch) {
    setSearch(next);
    if (mode === "browse") {
      goToResults(next);
      return;
    }
    void navigate({
      to: listingsRoute,
      search: toDirectoryUrlSearch(next, category),
    });
  }

  function reset() {
    const cleared = defaultDirectorySearch;
    setSearch(cleared);
    if (mode === "results") {
      void navigate({ to: listingsRoute, search: {} });
      return;
    }
    if (category !== "All") {
      void navigate({ to: homeRoute });
      return;
    }
    goToResults(cleared, "All");
  }

  async function onToggleSaved(id: string) {
    if (!user) {
      await navigate({ to: "/login" });
      return;
    }
    const result = await toggleSavedListingFn({ data: { listingId: id } });
    setSaved(result.saved);
  }

  const listingsTitle =
    mode === "results"
      ? category !== "All"
        ? `Results in ${category}`
        : `Search results in ${country}`
      : category === "All"
        ? `Listings in ${country}`
        : category;

  return (
    <PageShell country={country}>
      <HeroSearch
        country={country}
        category={category === "All" ? undefined : category}
        search={search}
        listings={listings}
        onSearchChange={setSearch}
        onSearchSubmit={onSearchSubmit}
        onReset={reset}
      />
      {mode === "browse" && category === "All" ? (
        <CategoryGrid country={country} categories={categories} listings={listings} />
      ) : null}
      <section id="listings" className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-12" aria-labelledby="listings-title">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 id="listings-title" className="text-[32px] leading-10 font-semibold">
              {listingsTitle}
            </h2>
            <p className="text-base leading-[26px] text-muted-foreground">
              {visible.length} {visible.length === 1 ? "listing" : "listings"}
            </p>
          </div>
          <button type="button" className="cursor-pointer text-sm font-medium text-primary" onClick={reset}>
            {mode === "results" ? "Clear search" : "Explore all"}
          </button>
        </div>
        <ListingGrid
          listings={visible}
          saved={saved}
          onToggleSaved={onToggleSaved}
          emptyMessage={
            mode === "results"
              ? emptyListingMessage(category, search.q, search.type)
              : emptyListingMessage(category, "", "All")
          }
        />
      </section>
      {mode === "browse" && category === "All" ? <ServicesForYou country={country} categories={categories} /> : null}
    </PageShell>
  );
}
