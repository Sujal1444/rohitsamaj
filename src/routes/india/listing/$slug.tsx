import { createFileRoute } from "@tanstack/react-router";
import { ListingDetails } from "@/components/site/listing-details";
import { getListing } from "@/lib/directory-content";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/india/listing/$slug")({
  loader: ({ params }) => ({ listing: getListing("India", params.slug) ?? null }),
  head: ({ loaderData, params }) => {
    const listing = loaderData?.listing;
    return pageHead({
      title: listing ? `${listing.name}, ${listing.city} | Rohit Samaj` : "Listing | Rohit Samaj",
      description: listing?.description ?? "Business listing on Rohit Samaj.",
      path: `/india/listing/${params.slug}`,
      ...(listing?.image ? { image: listing.image } : {}),
    });
  },
  component: IndiaListingPage,
});

function IndiaListingPage() {
  const { slug } = Route.useParams();
  const { listing } = Route.useLoaderData();
  return <ListingDetails country="India" slug={slug} initial={listing} />;
}
