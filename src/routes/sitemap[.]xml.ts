import { createFileRoute } from "@tanstack/react-router";
import { categoriesFor, countries, listings, slugify } from "@/lib/directory-content";
import { absoluteUrl } from "@/lib/site";

const staticPaths = ["/india", "/uk", "/about", "/contact"];

function urls() {
  const categoryUrls = countries.flatMap((country) =>
    categoriesFor(country).map((item) => absoluteUrl(`${country === "India" ? "/india" : "/uk"}/category/${slugify(item.name)}`)),
  );
  const listingUrls = listings.map((item) => absoluteUrl(`${item.country === "India" ? "/india" : "/uk"}/listing/${item.slug}`));
  return [...staticPaths.map((path) => absoluteUrl(path)), ...categoryUrls, ...listingUrls];
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls().map((url) => `  <url><loc>${url}</loc></url>`).join("\n")}
</urlset>`;
        return new Response(body, {
          headers: { "content-type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});
