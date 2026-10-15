import { type FormEvent, type ReactNode } from "react";
import { ChevronDown, Search } from "lucide-react";
import {
  citiesFor,
  directoryTypes,
  sortOptions,
  type Country,
  type DirectorySearch,
  type Listing,
  type SortValue,
} from "@/lib/directory-content";
import { heroImage } from "@/lib/site";

const fieldClass =
  "grid gap-1.5 rounded-lg border border-border bg-secondary/70 px-4 py-3 transition-colors focus-within:border-primary focus-within:bg-background";
const selectClass =
  "w-full appearance-none bg-transparent pr-8 text-base leading-[26px] font-medium text-foreground outline-none";

function SelectField({
  label,
  name,
  value,
  onChange,
  children,
  tone = "light",
}: {
  label: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <label className={dark ? "grid gap-1.5" : fieldClass}>
      <span className={`text-xs font-medium tracking-wide uppercase ${dark ? "text-white/75" : "text-muted-foreground"}`}>
        {label}
      </span>
      <span className="relative block">
        <select
          {...(name ? { name } : {})}
          aria-label={label}
          className={`${selectClass} ${dark ? "rounded-lg border border-white/25 bg-white/10 px-4 py-3 text-white" : ""}`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {children}
        </select>
        <ChevronDown
          className={`pointer-events-none absolute top-1/2 right-0 size-4 -translate-y-1/2 ${dark ? "right-3 text-white/80" : "text-muted-foreground"}`}
          aria-hidden="true"
        />
      </span>
    </label>
  );
}

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
  const title = category
    ? `${category} in ${country === "UK" ? "the UK" : "India"}`
    : country === "UK"
      ? "Find local businesses in the UK."
      : "Find local businesses in India.";

  function applyFromForm(form: HTMLFormElement) {
    const data = new FormData(form);
    const sortValue = String(data.get("sort") ?? search.sort);
    const sort = sortOptions.some((item) => item.value === sortValue) ? (sortValue as SortValue) : "featured";
    onSearchChange({
      q: String(data.get("q") ?? "").trim(),
      city: String(data.get("city") ?? "All locations") || "All locations",
      type: String(data.get("type") ?? "All") || "All",
      sort,
    });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    applyFromForm(event.currentTarget);
  }

  return (
    <section className="relative isolate overflow-hidden text-white" aria-labelledby="directory-title">
      <img
        src={heroImage}
        alt=""
        width={1920}
        height={720}
        className="absolute inset-0 -z-20 size-full object-cover"
        decoding="async"
      />
      <div className="absolute inset-0 -z-10 bg-hero/70" aria-hidden="true" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 py-16 md:py-20">
        <p className="text-xs leading-4 font-medium tracking-[2px] text-white uppercase">Local business directory</p>
        <h1 id="directory-title" className="max-w-3xl text-5xl leading-[56px] font-semibold max-md:text-[32px] max-md:leading-10">
          {title}
        </h1>
        {category ? null : (
          <p className="text-5xl leading-[56px] font-semibold text-gold max-md:text-[32px] max-md:leading-10">Near you.</p>
        )}
        <p className="max-w-xl text-base leading-[26px] text-white/90">
          Discover businesses, services, and places across {country === "UK" ? "the United Kingdom" : "India"}.
        </p>
        <form
          method="post"
          action=""
          className="grid w-full gap-3 rounded-xl bg-white p-3 text-foreground shadow-lg md:grid-cols-[minmax(0,1.6fr)_minmax(12rem,1fr)_minmax(12rem,1fr)_10rem] md:items-stretch"
          onSubmit={onSubmit}
        >
          <label className={fieldClass}>
            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Search</span>
            <span className="flex min-w-0 items-center gap-2">
              <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <input
                name="q"
                aria-label="Search businesses"
                className="w-full bg-transparent text-base leading-[26px] font-medium outline-none"
                placeholder="What are you looking for?"
                value={search.q}
                onChange={(event) => onSearchChange({ ...search, q: event.target.value })}
              />
            </span>
          </label>
          <SelectField label="Location" name="city" value={search.city} onChange={(city) => onSearchChange({ ...search, city })}>
            <option>All locations</option>
            {cities.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </SelectField>
          <SelectField label="Directory type" name="type" value={search.type} onChange={(type) => onSearchChange({ ...search, type })}>
            <option value="All">All types</option>
            {directoryTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </SelectField>
          <input type="hidden" name="sort" value={search.sort} />
          <button
            type="submit"
            className="flex min-h-[4.75rem] items-center justify-center rounded-lg bg-brand px-6 text-sm leading-5 font-medium text-white hover:text-white md:h-full md:min-h-0"
          >
            Search
          </button>
        </form>
        <div className="flex flex-wrap items-end gap-5">
          <SelectField
            label="Sort listings"
            value={search.sort}
            tone="dark"
            onChange={(sort) => onSearchChange({ ...search, sort: sort as DirectorySearch["sort"] })}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value} className="text-foreground">
                {option.label}
              </option>
            ))}
          </SelectField>
          <button type="button" className="mb-1 text-sm text-white underline underline-offset-4" onClick={onReset}>
            View all listings
          </button>
        </div>
      </div>
    </section>
  );
}
