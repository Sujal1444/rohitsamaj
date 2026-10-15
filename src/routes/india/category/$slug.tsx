import { createFileRoute, notFound } from "@tanstack/react-router";
import { DirectoryView } from "@/components/site/directory-view";
import { JsonLd } from "@/components/site/json-ld";
import { getCategory, listings } from "@/lib/directory-content";
import { absoluteUrl, pageHead } from "@/lib/site";

export const Route = createFileRoute("/india/category/$slug")({
  loader: ({ params }) => {
    const category = getCategory("India", params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData, params }) => {
    const category = loaderData?.category;
    return pageHead({
      title: `${category?.name ?? "Category"} in India | Rohit Samaj`,
      description: `Find ${category?.name ?? "local"} businesses and services in India on Rohit Samaj.`,
      path: `/india/category/${params.slug}`,
      ...(category ? { image: category.image } : {}),
    });
  },
  component: IndiaCategoryPage,
});

function IndiaCategoryPage() {
  const { category } = Route.useLoaderData();
  const items = listings.filter((item) => item.country === "India" && item.category === category.name);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${category.name} in India`,
          itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: absoluteUrl(`/india/listing/${item.slug}`),
            name: item.name,
          })),
        }}
      />
      <DirectoryView country="India" category={category.name} />
    </>
  );
}
