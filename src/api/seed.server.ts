import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { categoryGroups, listings, services, slugify } from "@/lib/directory-content";
import { categoriesCollection, ensureIndexes, listingsCollection, usersCollection } from "./db.server";
import { getEnv } from "./env.server";
import type { CategoryDoc, ListingDoc, UserDoc } from "./types.server";

function groupsForCategory(name: string) {
  return categoryGroups
    .filter((group) => group.categories?.includes(name as never))
    .map((group) => group.id)
    .filter((id) => id !== "all");
}

export async function seedDatabase() {
  await ensureIndexes();
  const env = getEnv();
  const users = await usersCollection();
  const categories = await categoriesCollection();
  const listingCol = await listingsCollection();

  const adminEmail = env.adminEmail.toLowerCase();
  const admin = await users.findOne({ email: adminEmail });
  if (!admin) {
    const now = new Date();
    const doc: UserDoc = {
      _id: new ObjectId(),
      name: env.adminName,
      email: adminEmail,
      passwordHash: await bcrypt.hash(env.adminPassword, 10),
      role: "admin",
      status: "active",
      savedListingIds: [],
      resetToken: null,
      resetExpires: null,
      createdAt: now,
      updatedAt: now,
    };
    await users.insertOne(doc);
  }

  if ((await categories.countDocuments()) === 0) {
    const now = new Date();
    const docs: CategoryDoc[] = services.map((item) => ({
      _id: new ObjectId(),
      name: item.name,
      slug: slugify(item.name),
      country: item.country,
      image: item.image,
      groupIds: groupsForCategory(item.name),
      sourceUrl: item.sourceUrl,
      createdAt: now,
      updatedAt: now,
    }));
    if (docs.length) await categories.insertMany(docs);
  }

  if ((await listingCol.countDocuments()) === 0) {
    const now = new Date();
    const docs: ListingDoc[] = listings.map((item) => ({
      _id: new ObjectId(),
      id: item.id,
      name: item.name,
      slug: item.slug,
      category: item.category,
      directoryType: item.directoryType,
      country: item.country,
      city: item.city,
      image: item.image,
      rating: item.rating,
      reviews: item.reviews,
      phone: item.phone,
      phoneHref: item.phoneHref,
      address: item.address,
      description: item.description,
      serviceDetails: item.serviceDetails,
      sourceUrl: item.sourceUrl,
      featured: item.featured,
      listedAt: item.listedAt,
      status: "published",
      ownerId: null,
      createdAt: now,
      updatedAt: now,
    }));
    if (docs.length) await listingCol.insertMany(docs);
  }

  return { ok: true as const };
}
