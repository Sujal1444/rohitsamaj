import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/page-shell";
import { contact, pageHead } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead({
      title: "Contact Rohit Samaj",
      description: "Contact Rohit Samaj in Leicester by phone or email.",
      path: "/contact",
    }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <PageShell>
      <article className="mx-auto w-full max-w-3xl px-5 py-12">
        <h1 className="text-5xl leading-[56px] font-semibold max-md:text-[32px] max-md:leading-10">Contact Rohit Samaj</h1>
        <p className="mt-4 text-base leading-[26px] text-muted-foreground">
          Use these details for questions about the directory or a business listing.
        </p>
        <address className="mt-8 space-y-3 text-base not-italic leading-[26px]">
          <p>{contact.address}</p>
          <p>
            <a className="text-primary" href={contact.phoneHref}>{contact.phone}</a>
          </p>
          <p>
            <a className="text-primary" href={`mailto:${contact.email}`}>{contact.email}</a>
          </p>
        </address>
      </article>
    </PageShell>
  );
}
