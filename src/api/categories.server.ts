import { ObjectId } from "mongodb";
import { categoriesFor, categoryGroups, getCategory, slugify, type Country, type Service } from "@/lib/directory-content";
import { requireAdmin } from "./auth.server";
import { categoriesCollection } from "./db.server";
import { seedDatabase } from "./seed.server";
import type { CategoryDoc } from "./types.server";

function toService(doc: CategoryDoc): Service & { id: string; groupIds: string[] } {
  return {
    id: doc._id.toHexString(),
    name: doc.name,
    country: doc.country,
    image: doc.image,
    sourceUrl: doc.sourceUrl,
    groupIds: doc.groupIds,
  } as Service & { id: string; groupIds: string[] };
}

async function ensureSeeded() {
  await seedDatabase();
}

export async function getCategories(country?: Country) {
  try {
    await ensureSeeded();
    const col = await categoriesCollection();
    const query = country ? { country } : {};
    const docs = await col.find(query).sort({ name: 1 }).toArray();
    return docs.map(toService);
  } catch (error) {
    console.error("Unable to load directory categories; using bundled source records:", error);
    return (country ? categoriesFor(country) : categoriesFor("India").concat(categoriesFor("UK"))).map((item) => ({
      ...item,
      groupIds: categoryGroups
        .filter((group) => group.categories?.includes(item.name as never))
        .map((group) => group.id)
        .filter((id) => id !== "all"),
    }));
  }
}

export async function getCategoryBySlug(country: Country, slug: string) {
  try {
    await ensureSeeded();
    const col = await categoriesCollection();
    const doc = await col.findOne({ country, slug });
    return doc ? toService(doc) : null;
  } catch (error) {
    console.error("Unable to load directory category; using bundled source records:", error);
    return getCategory(country, slug) ?? null;
  }
}

export async function adminListCategories(country?: Country) {
  await requireAdmin();
  return getCategories(country);
}

export async function adminSaveCategory(data: {
  id?: string | undefined;
  name: string;
  country: Country;
  image: string;
  groupIds: string[];
  sourceUrl: string;
}) {
  await requireAdmin();
  await ensureSeeded();
  const col = await categoriesCollection();
  const now = new Date();
  const slug = slugify(data.name);

  if (data.id) {
    await col.updateOne(
      { _id: new ObjectId(data.id) },
      {
        $set: {
          name: data.name.trim(),
          slug,
          country: data.country,
          image: data.image,
          groupIds: data.groupIds,
          sourceUrl: data.sourceUrl,
          updatedAt: now,
        },
      },
    );
    const doc = await col.findOne({ _id: new ObjectId(data.id) });
    return { ok: true as const, category: doc ? toService(doc) : null };
  }

  const doc: CategoryDoc = {
    _id: new ObjectId(),
    name: data.name.trim(),
    slug,
    country: data.country,
    image: data.image,
    groupIds: data.groupIds,
    sourceUrl: data.sourceUrl,
    createdAt: now,
    updatedAt: now,
  };
  await col.insertOne(doc);
  return { ok: true as const, category: toService(doc) };
}

export async function adminDeleteCategory(id: string) {
  await requireAdmin();
  const col = await categoriesCollection();
  await col.deleteOne({ _id: new ObjectId(id) });
  return { ok: true as const };
}
