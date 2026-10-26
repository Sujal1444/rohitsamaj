import { ObjectId } from "mongodb";
import {
  slugify,
  type Country,
  type DirectoryType,
  type Listing,
} from "@/lib/directory-content";
import { getSessionUser, requireAdmin, requireUser } from "./auth.server";
import { listingsCollection, usersCollection } from "./db.server";
import { seedDatabase } from "./seed.server";
import type { ListingDoc, ListingStatus } from "./types.server";

function phoneHref(phone: string, country: Country) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  const local = digits.replace(/^0/, "");
  return country === "India" ? `tel:+91${local}` : `tel:+44${local}`;
}

export function toListing(doc: ListingDoc): Listing & { status: ListingStatus; ownerId: string | null } {
  return {
    id: doc.id,
    name: doc.name,
    slug: doc.slug,
    category: doc.category,
    directoryType: doc.directoryType,
    country: doc.country,
    city: doc.city,
    image: doc.image,
    rating: doc.rating,
    reviews: doc.reviews,
    phone: doc.phone,
    phoneHref: doc.phoneHref,
    address: doc.address,
    description: doc.description,
    serviceDetails: doc.serviceDetails,
    sourceUrl: doc.sourceUrl,
    featured: doc.featured,
    listedAt: doc.listedAt,
    status: doc.status,
    ownerId: doc.ownerId,
  };
}

async function ensureSeeded() {
  await seedDatabase();
}

export async function getPublishedListings(country?: Country) {
  await ensureSeeded();
  const col = await listingsCollection();
  const query: Record<string, unknown> = { status: "published" };
  if (country) query.country = country;
  const docs = await col.find(query).sort({ featured: -1, name: 1 }).toArray();
  return docs.map(toListing);
}

export async function getListingBySlug(country: Country, slug: string) {
  await ensureSeeded();
  const col = await listingsCollection();
  const doc = await col.findOne({ country, slug, status: "published" });
  return doc ? toListing(doc) : null;
}

export async function submitListing(data: {
  name: string;
  category: string;
  directoryType: DirectoryType;
  country: Country;
  city: string;
  image: string;
  phone: string;
  address: string;
  description: string;
  serviceDetails: string[];
}) {
  const user = await requireUser();
  await ensureSeeded();
  const col = await listingsCollection();
  const slug = slugify(data.name);
  const now = new Date();
  const id = `submission-${slug}-${Date.now()}`;
  const doc: ListingDoc = {
    _id: new ObjectId(),
    id,
    name: data.name.trim(),
    slug,
    category: data.category,
    directoryType: data.directoryType,
    country: data.country,
    city: data.city.trim(),
    image: data.image,
    rating: null,
    reviews: 0,
    phone: data.phone.trim(),
    phoneHref: phoneHref(data.phone, data.country),
    address: data.address.trim(),
    description: data.description.trim(),
    serviceDetails: data.serviceDetails.filter(Boolean),
    sourceUrl: "",
    featured: false,
    listedAt: now.toISOString().slice(0, 10),
    status: "pending",
    ownerId: user.id,
    createdAt: now,
    updatedAt: now,
  };
  await col.insertOne(doc);
  return { ok: true as const, listing: toListing(doc) };
}

export async function adminListListings(data: {
  country?: Country;
  status?: ListingStatus;
  q?: string;
}) {
  await requireAdmin();
  await ensureSeeded();
  const col = await listingsCollection();
  const query: Record<string, unknown> = {};
  if (data.country) query.country = data.country;
  if (data.status) query.status = data.status;
  if (data.q?.trim()) query.name = { $regex: data.q.trim(), $options: "i" };
  const docs = await col.find(query).sort({ updatedAt: -1 }).toArray();
  return docs.map(toListing);
}

export async function adminSaveListing(data: {
  id?: string;
  name: string;
  category: string;
  directoryType: DirectoryType;
  country: Country;
  city: string;
  image: string;
  phone: string;
  address: string;
  description: string;
  serviceDetails: string[];
  featured?: boolean;
  status?: ListingStatus;
  listedAt?: string | null;
}) {
  await requireAdmin();
  await ensureSeeded();
  const col = await listingsCollection();
  const now = new Date();
  const slug = slugify(data.name);
  const status = data.status ?? "published";

  if (data.id) {
    await col.updateOne(
      { id: data.id },
      {
        $set: {
          name: data.name.trim(),
          slug,
          category: data.category,
          directoryType: data.directoryType,
          country: data.country,
          city: data.city.trim(),
          image: data.image,
          phone: data.phone.trim(),
          phoneHref: phoneHref(data.phone, data.country),
          address: data.address.trim(),
          description: data.description.trim(),
          serviceDetails: data.serviceDetails.filter(Boolean),
          featured: data.featured ?? false,
          listedAt: data.listedAt ?? now.toISOString().slice(0, 10),
          status,
          updatedAt: now,
        },
      },
    );
    const doc = await col.findOne({ id: data.id });
    return { ok: true as const, listing: doc ? toListing(doc) : null };
  }

  const id = `listing-${slug}-${Date.now()}`;
  const doc: ListingDoc = {
    _id: new ObjectId(),
    id,
    name: data.name.trim(),
    slug,
    category: data.category,
    directoryType: data.directoryType,
    country: data.country,
    city: data.city.trim(),
    image: data.image,
    rating: null,
    reviews: 0,
    phone: data.phone.trim(),
    phoneHref: phoneHref(data.phone, data.country),
    address: data.address.trim(),
    description: data.description.trim(),
    serviceDetails: data.serviceDetails.filter(Boolean),
    sourceUrl: "",
    featured: data.featured ?? false,
    listedAt: data.listedAt ?? now.toISOString().slice(0, 10),
    status,
    ownerId: null,
    createdAt: now,
    updatedAt: now,
  };
  await col.insertOne(doc);
  return { ok: true as const, listing: toListing(doc) };
}

export async function adminSetListingStatus(data: { id: string; status: ListingStatus }) {
  await requireAdmin();
  const col = await listingsCollection();
  await col.updateOne({ id: data.id }, { $set: { status: data.status, updatedAt: new Date() } });
  return { ok: true as const };
}

export async function adminDeleteListing(data: { id: string }) {
  await requireAdmin();
  const col = await listingsCollection();
  await col.deleteOne({ id: data.id });
  return { ok: true as const };
}

export async function toggleSavedListing(listingId: string) {
  const session = await getSessionUser();
  if (!session) throw new Error("UNAUTHORIZED");
  const users = await usersCollection();
  const user = await users.findOne({ email: session.email });
  if (!user) throw new Error("UNAUTHORIZED");
  const saved = new Set(user.savedListingIds);
  if (saved.has(listingId)) saved.delete(listingId);
  else saved.add(listingId);
  const next = [...saved];
  await users.updateOne({ _id: user._id }, { $set: { savedListingIds: next, updatedAt: new Date() } });
  return { ok: true as const, saved: next };
}

export async function getSavedListings() {
  const session = await getSessionUser();
  if (!session) return [];
  const users = await usersCollection();
  const user = await users.findOne({ email: session.email });
  if (!user?.savedListingIds.length) return [];
  await ensureSeeded();
  const col = await listingsCollection();
  const docs = await col.find({ id: { $in: user.savedListingIds }, status: "published" }).toArray();
  return docs.map(toListing);
}

export async function getSavedIds() {
  const session = await getSessionUser();
  if (!session) return [] as string[];
  const users = await usersCollection();
  const user = await users.findOne({ email: session.email });
  return user?.savedListingIds ?? [];
}
