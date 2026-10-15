type SiteAsset = {
  url?: string;
  original_filename?: string;
};

const modules = import.meta.glob("../assets/current-site/*.asset.json", {
  eager: true,
  import: "default",
}) as Record<string, SiteAsset | string>;

function filenameFromPath(path: string) {
  const base = path.split("/").pop() ?? "";
  return base.replace(/\.asset\.json$/, "");
}

function assetUrl(path: string, asset: SiteAsset | string) {
  if (typeof asset === "string") return asset;
  if (asset.url) return asset.url;
  return `/images/${asset.original_filename ?? filenameFromPath(path)}`;
}

const images = new Map<string, string>();

for (const [path, asset] of Object.entries(modules)) {
  const filename = typeof asset === "string" ? filenameFromPath(path) : (asset.original_filename ?? filenameFromPath(path));
  images.set(filename, assetUrl(path, asset));
}

export function siteImage(filename: string) {
  return images.get(filename) ?? `/images/${filename}`;
}
