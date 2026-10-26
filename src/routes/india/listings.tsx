import { createFileRoute } from "@tanstack/react-router";
import { DirectoryView } from "@/components/site/directory-view";
import { JsonLd } from "@/components/site/json-ld";
import {
  parseDirectoryCategory,
  parseDirectorySearch,
  toDirectoryUrlSearch,
  type DirectoryUrlSearch,
} from "@/lib/directory-content";
import { absoluteUrl, pageHead } from "@/lib/site";
import { fetchCategoriesFn } from "@/api/categories";
import { fetchPublishedListingsFn } from "@/api/listings";

export const Route = createFileRoute("/india/listings")({
  validateSearch: (search: Record<string, unknown>): DirectoryUrlSearch =>
    toDirectoryUrlSearch(parseDirectorySearch(search), parseDirectoryCategory(search)),
  head: ({ match }) => {
    const q = typeof match.search.q === "string" ? match.search.q.trim() : "";
    return pageHead({
      title: q ? `Search “${q}” in India | Rohit Samaj` : "Listings in India | Rohit Samaj",
      description: "Browse and search local businesses, services, and places across India.",
      path: "/india/listings",
    });
  },
  loader: async () => {
    const [listings, categories] = await Promise.all([
      fetchPublishedListingsFn({ data: { country: "India" } }),
      fetchCategoriesFn({ data: { country: "India" } }),
    ]);
    return { listings, categories };
  },
  component: IndiaListingsPage,
});

function IndiaListingsPage() {
  const { listings, categories } = Route.useLoaderData();
  const urlSearch = Route.useSearch();
  const search = parseDirectorySearch(urlSearch);
  const category = parseDirectoryCategory(urlSearch);
  const visible = listings.filter((item) => (category === "All" ? true : item.category === category));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: category === "All" ? "India search results" : `${category} search results in India`,
          itemListElement: visible.slice(0, 20).map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: absoluteUrl(`/india/listing/${item.slug}`),
            name: item.name,
          })),
        }}
      />
      <DirectoryView
        country="India"
        category={category}
        listings={listings}
        categories={categories}
        mode="results"
        initialSearch={search}
      />
    </>
  );
}
