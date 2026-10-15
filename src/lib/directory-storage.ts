import { slugify, type Country, type DirectoryType, type Listing } from "./directory-content";
import { siteImage } from "./site-images";

const savedKey = "rohit-samaj-saved";
const accountKey = "rohit-samaj-account";
const submissionKey = "rohit-samaj-submissions";

export type Account = { name: string; email: string };

export type SubmissionInput = {
  name: string;
  category: string;
  directoryType: DirectoryType;
  country: Country;
  city: string;
  phone: string;
  address: string;
  description: string;
  serviceDetails: string[];
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? "");
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function readSaved() {
  const value = readJson<unknown>(savedKey, []);
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function toggleSaved(id: string) {
  const current = readSaved();
  const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
  writeJson(savedKey, next);
  return next;
}

export function readAccount(): Account | null {
  const value = readJson<Account | null>(accountKey, null);
  if (!value || typeof value.name !== "string" || typeof value.email !== "string") return null;
  return value;
}

export function saveAccount(account: Account) {
  writeJson(accountKey, account);
}

export function clearAccount() {
  localStorage.removeItem(accountKey);
}

export function readSubmissions(): Listing[] {
  const value = readJson<unknown>(submissionKey, []);
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is Listing => {
    if (!item || typeof item !== "object") return false;
    const listing = item as Partial<Listing>;
    return typeof listing.id === "string" && typeof listing.slug === "string" && typeof listing.country === "string";
  });
}

export function saveSubmission(input: SubmissionInput): Listing {
  const slug = slugify(input.name);
  const listing: Listing = {
    id: `submission-${slug}-${Date.now()}`,
    name: input.name.trim(),
    slug,
    category: input.category,
    directoryType: input.directoryType,
    country: input.country,
    city: input.city.trim(),
    image: siteImage(input.country === "UK" ? "uk-business.png" : "commercial.jpg"),
    rating: null,
    reviews: 0,
    phone: input.phone.trim(),
    phoneHref: input.phone.trim() ? `tel:${input.phone.trim().replace(/\s/g, "")}` : "",
    address: input.address.trim(),
    description: input.description.trim(),
    serviceDetails: input.serviceDetails,
    sourceUrl: "",
    featured: false,
    listedAt: new Date().toISOString().slice(0, 10),
  };
  writeJson(submissionKey, [...readSubmissions(), listing]);
  return listing;
}
