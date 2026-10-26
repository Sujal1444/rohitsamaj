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

export const Route = createFileRoute("/uk/listings")({
  validateSearch: (search: Record<string, unknown>): DirectoryUrlSearch =>
    toDirectoryUrlSearch(parseDirectorySearch(search), parseDirectoryCategory(search)),
  head: ({ match }) => {
    const q = typeof match.search.q === "string" ? match.search.q.trim() : "";
    return pageHead({
      title: q ? `Search “${q}” in the UK | Rohit Samaj` : "Listings in the UK | Rohit Samaj",
      description: "Browse and search local businesses, services, and places across the United Kingdom.",
      path: "/uk/listings",
    });
  },
  loader: async () => {
    const [listings, categories] = await Promise.all([
      fetchPublishedListingsFn({ data: { country: "UK" } }),
      fetchCategoriesFn({ data: { country: "UK" } }),
    ]);
    return { listings, categories };
  },
  component: UkListingsPage,
});

function UkListingsPage() {
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
          name: category === "All" ? "UK search results" : `${category} search results in the UK`,
          itemListElement: visible.slice(0, 20).map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: absoluteUrl(`/uk/listing/${item.slug}`),
            name: item.name,
          })),
        }}
      />
      <DirectoryView
        country="UK"
        category={category}
        listings={listings}
        categories={categories}
        mode="results"
        initialSearch={search}
      />
    </>
  );
}
