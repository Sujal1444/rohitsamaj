import { createFileRoute } from "@tanstack/react-router";
import { ListingDetails } from "@/components/site/listing-details";
import { pageHead } from "@/lib/site";
import { fetchListingFn } from "@/api/listings";

export const Route = createFileRoute("/uk/listing/$slug")({
  loader: async ({ params }) => ({ listing: await fetchListingFn({ data: { country: "UK", slug: params.slug } }) }),
  head: ({ loaderData, params }) => {
    const listing = loaderData?.listing;
    return pageHead({
      title: listing ? `${listing.name}, ${listing.city} | Rohit Samaj` : "Listing | Rohit Samaj",
      description: listing?.description ?? "Business listing on Rohit Samaj.",
      path: `/uk/listing/${params.slug}`,
      ...(listing?.image ? { image: listing.image } : {}),
    });
  },
  component: UkListingPage,
});

function UkListingPage() {
  const { slug } = Route.useParams();
  const { listing } = Route.useLoaderData();
  return <ListingDetails country="UK" slug={slug} initial={listing} />;
}
