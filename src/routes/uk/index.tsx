import { createFileRoute } from "@tanstack/react-router";
import { DirectoryView } from "@/components/site/directory-view";
import { JsonLd } from "@/components/site/json-ld";
import { listings } from "@/lib/directory-content";
import { absoluteUrl, pageHead } from "@/lib/site";

export const Route = createFileRoute("/uk/")({
  head: () =>
    pageHead({
      title: "Local businesses in the UK | Rohit Samaj",
      description: "Search local businesses, services, and places across the United Kingdom with Rohit Samaj.",
      path: "/uk",
    }),
  component: UkPage,
});

function UkPage() {
  const items = listings.filter((item) => item.country === "UK");
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Listings in the UK",
          itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: absoluteUrl(`/uk/listing/${item.slug}`),
            name: item.name,
          })),
        }}
      />
      <DirectoryView country="UK" />
    </>
  );
}
