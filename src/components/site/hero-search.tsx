import { Search } from "lucide-react";
import { citiesFor, directoryTypes, sortOptions, type Country, type DirectorySearch, type Listing } from "@/lib/directory-content";

export function HeroSearch({
  country,
  category,
  search,
  listings,
  onSearchChange,
  onReset,
}: {
  country: Country;
  category?: string | undefined;
  search: DirectorySearch;
  listings: Listing[];
  onSearchChange: (next: DirectorySearch) => void;
  onReset: () => void;
}) {
  const cities = citiesFor(country, listings);
  const title = category ? `${category} in ${country === "UK" ? "the UK" : "India"}` : country === "UK" ? "Find local businesses in the UK." : "Find local businesses in India.";

  return (
    <section className="bg-hero text-white" aria-labelledby="directory-title">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-16">
        <p className="text-xs leading-4 font-medium tracking-[2px] text-white uppercase">Local business directory</p>
        <h1 id="directory-title" className="max-w-3xl text-5xl leading-[56px] font-semibold max-md:text-[32px] max-md:leading-10">
          {title}
        </h1>
        {category ? null : <p className="text-5xl leading-[56px] font-semibold text-gold max-md:text-[32px] max-md:leading-10">Near you.</p>}
        <p className="max-w-xl text-base leading-[26px] text-white/90">
          Discover businesses, services, and places across {country === "UK" ? "the United Kingdom" : "India"}.
        </p>
        <form
          className="flex max-w-3xl flex-col gap-2 rounded-lg bg-white p-2 text-foreground md:flex-row md:items-center"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2">
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              aria-label="Search businesses"
              className="w-full bg-transparent text-base leading-[26px]"
              placeholder="What are you looking for?"
              value={search.q}
              onChange={(event) => onSearchChange({ ...search, q: event.target.value })}
            />
          </label>
          <label className="border-border px-3 py-2 md:border-l">
            <span className="sr-only">Location</span>
            <select
              aria-label="Location"
              className="w-full bg-transparent text-base"
              value={search.city}
              onChange={(event) => onSearchChange({ ...search, city: event.target.value })}
            >
              <option>All locations</option>
              {cities.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
          </label>
          <label className="px-3 py-2">
            <span className="sr-only">Directory type</span>
            <select
              aria-label="Directory type"
              className="w-full bg-transparent text-base"
              value={search.type}
              onChange={(event) => onSearchChange({ ...search, type: event.target.value })}
            >
              <option value="All">All types</option>
              {directoryTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
          <button type="submit" className="rounded-md bg-brand px-5 py-3 text-sm leading-5 font-medium text-white">
            Search
          </button>
        </form>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <label>
            <span className="sr-only">Sort listings</span>
            <select
              aria-label="Sort listings"
              className="rounded-md bg-white/10 px-3 py-2 text-white"
              value={search.sort}
              onChange={(event) => onSearchChange({ ...search, sort: event.target.value as DirectorySearch["sort"] })}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value} className="text-foreground">
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="text-sm text-white underline" onClick={onReset}>
            View all listings
          </button>
        </div>
      </div>
    </section>
  );
}
