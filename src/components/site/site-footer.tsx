import { Link } from "@tanstack/react-router";
import { absoluteUrl, contact, siteUrl } from "@/lib/site";
import { JsonLd } from "./json-ld";

export function SiteFooter() {
  return (
    <footer className="mt-10 bg-hero text-white">
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
          sameAs: [absoluteUrl("/uk"), absoluteUrl("/india")],
        }}
      />
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 text-sm leading-[22px] md:grid-cols-3">
        <div>
          <p className="text-xl leading-7 font-semibold">Rohitsamaj</p>
          <p className="mt-2 text-xs leading-4 text-white/70">© 2026 Rohit Samaj. All rights reserved.</p>
        </div>
        <address className="not-italic text-white/80">
          <p className="font-medium text-white">Contact</p>
          <p>{contact.address}</p>
          <p>
            <a className="text-white underline-offset-2 hover:underline" href={contact.phoneHref}>
              {contact.phone}
            </a>
          </p>
          <p>
            <a className="text-white underline-offset-2 hover:underline" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
          </p>
        </address>
        <nav className="flex flex-col gap-2 md:items-end" aria-label="Footer">
          <Link to="/about" className="text-white/90 hover:text-white">
            About us
          </Link>
          <Link to="/contact" className="text-white/90 hover:text-white">
            Contact
          </Link>
          <Link to="/add-listing" className="text-white/90 hover:text-white">
            Add a listing
          </Link>
          <Link to="/account" className="text-white/90 hover:text-white">
            Account
          </Link>
        </nav>
      </div>
    </footer>
  );
}
