import { createFileRoute } from "@tanstack/react-router";
import { DirectoryView } from "@/components/site/directory-view";
import { JsonLd } from "@/components/site/json-ld";
import { listings, parseDirectorySearch } from "@/lib/directory-content";
import { absoluteUrl, pageHead } from "@/lib/site";

export const Route = createFileRoute("/india/")({
  validateSearch: parseDirectorySearch,
  head: () =>
    pageHead({
      title: "Local businesses in India | Rohit Samaj",
      description: "Search local businesses, services, and places across India with Rohit Samaj.",
      path: "/india",
    }),
  component: IndiaPage,
});

function IndiaPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const items = listings.filter((item) => item.country === "India");
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Listings in India",
          itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: absoluteUrl(`/india/listing/${item.slug}`),
            name: item.name,
          })),
        }}
      />
      <DirectoryView
        country="India"
        search={search}
        onSearchChange={(next) => {
          void navigate({ search: next, replace: true });
        }}
      />
    </>
  );
}
