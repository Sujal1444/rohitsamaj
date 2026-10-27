import { GridFSBucket, MongoClient, type Db } from "mongodb";
import { getEnv } from "./env.server";
import type { CategoryDoc, ListingDoc, SessionDoc, UserDoc } from "./types.server";

declare global {
  // eslint-disable-next-line no-var
  var __rohitMongo: { client: MongoClient; db: Db } | undefined;
}

async function connect() {
  if (globalThis.__rohitMongo) return globalThis.__rohitMongo;
  const env = getEnv();
  const client = new MongoClient(env.mongodbUri);
  await client.connect();
  const db = client.db(env.mongodbDb);
  globalThis.__rohitMongo = { client, db };
  return globalThis.__rohitMongo;
}

export async function getDb() {
  const { db } = await connect();
  return db;
}

export async function listingImagesBucket() {
  return new GridFSBucket(await getDb(), { bucketName: "listingImages" });
}

export async function usersCollection() {
  return (await getDb()).collection<UserDoc>("users");
}

export async function sessionsCollection() {
  return (await getDb()).collection<SessionDoc>("sessions");
}

export async function categoriesCollection() {
  return (await getDb()).collection<CategoryDoc>("categories");
}

export async function listingsCollection() {
  return (await getDb()).collection<ListingDoc>("listings");
}

export async function ensureIndexes() {
  const users = await usersCollection();
  const sessions = await sessionsCollection();
  const categories = await categoriesCollection();
  const listings = await listingsCollection();

  await Promise.all([
    users.createIndex({ email: 1 }, { unique: true }),
    users.createIndex({ resetToken: 1 }, { sparse: true }),
    sessions.createIndex({ tokenHash: 1 }, { unique: true }),
    sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    categories.createIndex({ country: 1, slug: 1 }, { unique: true }),
    listings.createIndex({ country: 1, slug: 1 }, { unique: true }),
    listings.createIndex({ status: 1, country: 1 }),
    listings.createIndex({ id: 1 }, { unique: true }),
  ]);
}
