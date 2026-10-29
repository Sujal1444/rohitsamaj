import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  categoryGroups,
  filterCategoriesByGroup,
  listingCount,
  slugify,
  type CategoryGroupId,
  type Country,
  type Listing,
  type Service,
} from "@/lib/directory-content";

export function CategoryGrid({ country, categories, listings }: { country: Country; categories: Service[]; listings: Listing[] }) {
  const [groupId, setGroupId] = useState<CategoryGroupId>("all");
  const [gridRef, enableAnimations] = useAutoAnimate<HTMLDivElement>({
    duration: 280,
    easing: "ease-in-out",
  });
  const visible = filterCategoriesByGroup(categories, groupId);

  useEffect(() => {
    setGroupId("all");
  }, [country]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => enableAnimations(!media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [enableAnimations]);

  return (
    <section className="bg-secondary" aria-labelledby="category-title">
      <div className="mx-auto w-full max-w-6xl px-5 py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 id="category-title" className="text-[32px] leading-10 font-semibold">Browse by category</h2>
            <p className="text-base leading-[26px] text-muted-foreground">Each category opens its own page.</p>
          </div>
          <Link to={country === "India" ? "/india" : "/uk"} className="text-sm font-medium text-primary">
            Explore all
          </Link>
        </div>
        <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Category filters">
          {categoryGroups.map((group) => {
            const active = group.id === groupId;
            return (
              <button
                key={group.id}
                type="button"
                aria-pressed={active}
                onClick={() => setGroupId(group.id)}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "border border-border bg-background text-foreground hover:border-primary/40 hover:text-primary"
                }`}
              >
                {group.label}
              </button>
            );
          })}
        </div>
        <div ref={gridRef} className={visible.length === 0 ? undefined : "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"}>
          {visible.length === 0 ? (
            <p key="empty" className="text-base leading-[26px] text-muted-foreground">
              No categories in this group yet.
            </p>
          ) : (
            visible.map((item) => {
              const count = listingCount(country, item.name, listings);
              const categoryImage = country !== "UK" ? item.image : item.name === "Driving School" ? "/images/driving-school.png" : item.name === "Handy Man" ? "/images/handyman-category.png" : item.image;
              return (
                <Link
                  key={item.name}
                  to={country === "India" ? "/india/category/$slug" : "/uk/category/$slug"}
                  params={{ slug: slugify(item.name) }}
                  className="group overflow-hidden rounded-md border border-border bg-background transition duration-300 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
                >
                  <img
                    src={categoryImage}
                    alt={item.name}
                    width={300}
                    height={200}
                    className="aspect-[3/2] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <span className="flex items-center justify-between gap-2 px-3 py-2 text-sm leading-[22px]">
                    {item.name}
                    <span className="text-xs text-muted-foreground">{count}</span>
                  </span>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
