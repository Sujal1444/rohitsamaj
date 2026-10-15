import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
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
      <PageHero
        title="Contact Rohit Samaj"
        description="Questions about the directory or a business listing? Reach us with the details below."
      />
      <article className="mx-auto w-full max-w-6xl px-5 py-12">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-background px-5 py-6">
            <MapPin className="size-5 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-xl leading-7 font-semibold">Address</h2>
            <p className="mt-2 text-base leading-[26px] text-muted-foreground">{contact.address}</p>
          </div>
          <div className="rounded-lg border border-border bg-background px-5 py-6">
            <Phone className="size-5 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-xl leading-7 font-semibold">Phone</h2>
            <p className="mt-2 text-base leading-[26px]">
              <a className="text-primary" href={contact.phoneHref}>
                {contact.phone}
              </a>
            </p>
          </div>
          <div className="rounded-lg border border-border bg-background px-5 py-6">
            <Mail className="size-5 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-xl leading-7 font-semibold">Email</h2>
            <p className="mt-2 text-base leading-[26px]">
              <a className="text-primary" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </p>
          </div>
        </div>
        <p className="mt-8 max-w-2xl text-base leading-[26px] text-muted-foreground">
          These are the official Rohit Samaj contact details used across the site. For listing updates, include the business name and country in your message.
        </p>
      </article>
    </PageShell>
  );
}
