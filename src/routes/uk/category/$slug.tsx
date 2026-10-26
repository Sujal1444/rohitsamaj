import { createFileRoute, notFound } from "@tanstack/react-router";
import { DirectoryView } from "@/components/site/directory-view";
import { JsonLd } from "@/components/site/json-ld";
import { absoluteUrl, pageHead } from "@/lib/site";
import { fetchCategoriesFn, fetchCategoryFn } from "@/api/categories";
import { fetchPublishedListingsFn } from "@/api/listings";

export const Route = createFileRoute("/uk/category/$slug")({
  loader: async ({ params }) => {
    const [category, listings, categories] = await Promise.all([
      fetchCategoryFn({ data: { country: "UK", slug: params.slug } }),
      fetchPublishedListingsFn({ data: { country: "UK" } }),
      fetchCategoriesFn({ data: { country: "UK" } }),
    ]);
    if (!category) throw notFound();
    return { category, listings, categories };
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
  const { category, listings, categories } = Route.useLoaderData();
  const items = listings.filter((item) => item.category === category.name);
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
      <DirectoryView country="UK" category={category.name} listings={listings} categories={categories} />
    </>
  );
}
