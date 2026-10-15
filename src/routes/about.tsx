import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/page-shell";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead({
      title: "About Rohit Samaj",
      description: "Rohit Samaj is a community directory for local businesses and services in India and the United Kingdom.",
      path: "/about",
    }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell>
      <article className="mx-auto w-full max-w-3xl px-5 py-12">
        <h1 className="text-5xl leading-[56px] font-semibold max-md:text-[32px] max-md:leading-10">About Rohit Samaj</h1>
        <div className="mt-6 space-y-4 text-base leading-[26px]">
          <p>
            Rohit Samaj is a community business directory for people looking for local businesses, professionals, and services in India and the United Kingdom.
          </p>
          <p>
            The directory brings together places to stay, eat, shop, and work, with a page for each category and each business. Listings can be saved on this device, and business owners can submit a new listing.
          </p>
          <h2 className="pt-4 text-[32px] leading-10 font-semibold">What you can do</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Search by name, city, category, and directory type.</li>
            <li>Switch between the India and UK directories.</li>
            <li>Open a business page with its address, phone, and services.</li>
            <li>Save listings and send in a business from this browser.</li>
          </ul>
        </div>
      </article>
    </PageShell>
  );
}
