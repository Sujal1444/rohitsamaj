export const siteUrl = "https://rohitsamaj.com";

export const contact = {
  name: "Rohit Samaj",
  address: "Rohitsamaj, Leicester, United Kingdom",
  phone: "+44 7868 607915",
  phoneHref: "tel:+447868607915",
  email: "milaycomputer@hotmail.com",
};

export const heroImage = "https://rohitsamaj.com/wp-content/uploads/2026/04/banner.png";

export function absoluteUrl(path: string) {
  if (path.startsWith("http")) return path;
  return new URL(path, siteUrl).toString();
}

export function pageHead(options: { title: string; description: string; path: string; image?: string | undefined }) {
  const url = absoluteUrl(options.path);
  const image = absoluteUrl(options.image ?? heroImage);
  return {
    meta: [
      { title: options.title },
      { name: "description", content: options.description },
      { property: "og:title", content: options.title },
      { property: "og:description", content: options.description },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: options.title },
      { name: "twitter:description", content: options.description },
      { name: "twitter:image", content: image },
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "alternate", hrefLang: "en-IN", href: absoluteUrl("/india") },
      { rel: "alternate", hrefLang: "en-GB", href: absoluteUrl("/uk") },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl("/india") },
    ],
  };
}
