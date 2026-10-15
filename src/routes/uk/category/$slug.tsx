import { createFileRoute, notFound } from "@tanstack/react-router";
import { DirectoryView } from "@/components/site/directory-view";
import { JsonLd } from "@/components/site/json-ld";
import { getCategory, listings, parseDirectorySearch } from "@/lib/directory-content";
import { absoluteUrl, pageHead } from "@/lib/site";

export const Route = createFileRoute("/uk/category/$slug")({
  validateSearch: parseDirectorySearch,
  loader: ({ params }) => {
    const category = getCategory("UK", params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData, params }) => {
    const category = loaderData?.category;
    return pageHead({
      title: `${category?.name ?? "Category"} in the UK | Rohit Samaj`,
      description: `Find ${category?.name ?? "local"} businesses and services in the United Kingdom on Rohit Samaj.`,
      path: `/uk/category/${params.slug}`,
      ...(category ? { image: category.image } : {}),
    });
  },
  component: UkCategoryPage,
});

function UkCategoryPage() {
  const { category } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const items = listings.filter((item) => item.country === "UK" && item.category === category.name);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${category.name} in the UK`,
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
        category={category.name}
        search={search}
        onSearchChange={(next) => {
          void navigate({ search: next, replace: true });
        }}
      />
    </>
  );
}
