import { createFileRoute } from "@tanstack/react-router";
import { DirectoryView } from "@/components/site/directory-view";
import { JsonLd } from "@/components/site/json-ld";
import { listings, parseDirectorySearch } from "@/lib/directory-content";
import { absoluteUrl, pageHead } from "@/lib/site";

export const Route = createFileRoute("/uk/")({
  validateSearch: parseDirectorySearch,
  head: () =>
    pageHead({
      title: "Local businesses in the UK | Rohit Samaj",
      description: "Search local businesses, services, and places across the United Kingdom with Rohit Samaj.",
      path: "/uk",
    }),
  component: UkPage,
});

function UkPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
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
      <DirectoryView
        country="UK"
        search={search}
        onSearchChange={(next) => {
          void navigate({ search: next, replace: true });
        }}
      />
    </>
  );
}
