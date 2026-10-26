import { createFileRoute } from "@tanstack/react-router";
import { DirectoryView } from "@/components/site/directory-view";
import { JsonLd } from "@/components/site/json-ld";
import { absoluteUrl, pageHead } from "@/lib/site";
import { fetchCategoriesFn } from "@/api/categories";
import { fetchPublishedListingsFn } from "@/api/listings";

export const Route = createFileRoute("/uk/")({
  head: () =>
    pageHead({
      title: "Local businesses in the UK | Rohit Samaj",
      description: "Search local businesses, services, and places across the United Kingdom with Rohit Samaj.",
      path: "/uk",
    }),
  loader: async () => {
    const [listings, categories] = await Promise.all([
      fetchPublishedListingsFn({ data: { country: "UK" } }),
      fetchCategoriesFn({ data: { country: "UK" } }),
    ]);
    return { listings, categories };
  },
  component: UkPage,
});

function UkPage() {
  const { listings, categories } = Route.useLoaderData();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Listings in the UK",
          itemListElement: listings.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: absoluteUrl(`/uk/listing/${item.slug}`),
            name: item.name,
          })),
        }}
      />
      <DirectoryView country="UK" listings={listings} categories={categories} />
    </>
  );
}
