import { createFileRoute } from "@tanstack/react-router";
import { DirectoryView } from "@/components/site/directory-view";
import { JsonLd } from "@/components/site/json-ld";
import { absoluteUrl, pageHead } from "@/lib/site";
import { fetchCategoriesFn } from "@/api/categories";
import { fetchPublishedListingsFn } from "@/api/listings";

export const Route = createFileRoute("/india/")({
  head: () =>
    pageHead({
      title: "Local businesses in India | Rohit Samaj",
      description: "Search local businesses, services, and places across India with Rohit Samaj.",
      path: "/india",
    }),
  loader: async () => {
    const [listings, categories] = await Promise.all([
      fetchPublishedListingsFn({ data: { country: "India" } }),
      fetchCategoriesFn({ data: { country: "India" } }),
    ]);
    return { listings, categories };
  },
  component: IndiaPage,
});

function IndiaPage() {
  const { listings, categories } = Route.useLoaderData();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Listings in India",
          itemListElement: listings.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: absoluteUrl(`/india/listing/${item.slug}`),
            name: item.name,
          })),
        }}
      />
      <DirectoryView country="India" listings={listings} categories={categories} />
    </>
  );
}
