import { Link } from "@tanstack/react-router";
import { absoluteUrl, contact, siteUrl } from "@/lib/site";
import { JsonLd } from "./json-ld";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: contact.name,
          url: siteUrl,
          email: contact.email,
          telephone: contact.phone,
          address: {
            "@type": "PostalAddress",
            streetAddress: contact.address,
            addressLocality: "Leicester",
            addressCountry: "GB",
          },
          sameAs: [absoluteUrl("/india"), absoluteUrl("/uk")],
        }}
      />
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-5 py-8 text-sm leading-[22px] md:grid-cols-3">
        <div>
          <p className="text-xl leading-7 font-semibold">rohitsamaj</p>
          <p className="mt-2 text-xs leading-4 text-muted-foreground">© 2026 Rohit Samaj. All rights reserved.</p>
        </div>
        <address className="not-italic text-muted-foreground">
          <p className="font-medium text-foreground">Contact</p>
          <p>{contact.address}</p>
          <p><a className="text-primary" href={contact.phoneHref}>{contact.phone}</a></p>
          <p><a className="text-primary" href={`mailto:${contact.email}`}>{contact.email}</a></p>
        </address>
        <nav className="flex flex-col gap-2 md:items-end" aria-label="Footer">
          <Link to="/about">About us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/add-listing">Add a listing</Link>
          <Link to="/account">Account</Link>
        </nav>
      </div>
    </footer>
  );
}
