import { Link } from "@tanstack/react-router";
import { defaultDirectorySearch, listingCount, slugify, type Country, type Listing, type Service } from "@/lib/directory-content";

export function CategoryGrid({ country, categories, listings }: { country: Country; categories: Service[]; listings: Listing[] }) {
  return (
    <section className="bg-secondary" aria-labelledby="category-title">
      <div className="mx-auto w-full max-w-6xl px-5 py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 id="category-title" className="text-[32px] leading-10 font-semibold">Browse by category</h2>
            <p className="text-base leading-[26px] text-muted-foreground">Each category opens its own page.</p>
          </div>
          <Link to={country === "India" ? "/india" : "/uk"} search={defaultDirectorySearch} className="text-sm font-medium text-primary">
            Explore all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((item) => {
            const count = listingCount(country, item.name, listings);
            return (
              <Link key={item.name} to={country === "India" ? "/india/category/$slug" : "/uk/category/$slug"} params={{ slug: slugify(item.name) }} search={defaultDirectorySearch} className="overflow-hidden rounded-md border border-border bg-background">
                <img src={item.image} alt={item.name} width={300} height={200} className="aspect-[3/2] w-full object-cover" loading="lazy" />
                <span className="flex items-center justify-between gap-2 px-3 py-2 text-sm leading-[22px]">
                  {item.name}
                  <span className="text-xs text-muted-foreground">{count}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
