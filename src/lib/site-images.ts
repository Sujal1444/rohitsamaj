/** Serve directory photos from the local public/images folder. */
export function siteImage(filename: string) {
  return `/images/${filename}`;
}

/** Serve Services For You assets from the local public/assets folder. */
export function serviceAsset(filename: string) {
  return `/assets/services/${filename}`;
}
