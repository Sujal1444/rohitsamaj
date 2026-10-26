import { createFileRoute } from "@tanstack/react-router";
import { slugify } from "@/lib/directory-content";
import { absoluteUrl } from "@/lib/site";
import { fetchCategoriesFn } from "@/api/categories";
import { fetchPublishedListingsFn } from "@/api/listings";

const staticPaths = ["/india", "/uk", "/about", "/contact"];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const [categories, listings] = await Promise.all([
          fetchCategoriesFn({ data: {} }),
          fetchPublishedListingsFn({ data: {} }),
        ]);
        const categoryUrls = categories.map((item) =>
          absoluteUrl(`${item.country === "India" ? "/india" : "/uk"}/category/${slugify(item.name)}`),
        );
        const listingUrls = listings.map((item) => absoluteUrl(`${item.country === "India" ? "/india" : "/uk"}/listing/${item.slug}`));
        const urls = [...staticPaths.map((path) => absoluteUrl(path)), ...categoryUrls, ...listingUrls];
        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join("\n")}
</urlset>`;
        return new Response(body, {
          headers: { "content-type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});
