/** Serve directory photos from the local public/images folder. */
export function siteImage(filename: string) {
  return `/images/${filename}`;
}
