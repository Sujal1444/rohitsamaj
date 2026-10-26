import { ObjectId } from "mongodb";
import { createUser, requireAdmin, toPublicUser } from "./auth.server";
import { categoriesCollection, listingsCollection, usersCollection } from "./db.server";
import { seedDatabase } from "./seed.server";
import type { PublicUser, UserRole, UserStatus } from "./types.server";

export async function adminDashboard() {
  await requireAdmin();
  await seedDatabase();
  const users = await usersCollection();
  const listings = await listingsCollection();
  const categories = await categoriesCollection();

  const [userCount, adminCount, published, pending, rejected, categoryCount] = await Promise.all([
    users.countDocuments(),
    users.countDocuments({ role: "admin" }),
    listings.countDocuments({ status: "published" }),
    listings.countDocuments({ status: "pending" }),
    listings.countDocuments({ status: "rejected" }),
    categories.countDocuments(),
  ]);

  return {
    users: userCount,
    admins: adminCount,
    listings: { published, pending, rejected, total: published + pending + rejected },
    categories: categoryCount,
  };
}

export async function adminListUsers(q?: string) {
  await requireAdmin();
  const users = await usersCollection();
  const query = q?.trim()
    ? {
        $or: [{ name: { $regex: q.trim(), $options: "i" } }, { email: { $regex: q.trim(), $options: "i" } }],
      }
    : {};
  const docs = await users.find(query).sort({ createdAt: -1 }).toArray();
  return docs.map(toPublicUser);
}

export async function adminCreateUser(data: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}) {
  await requireAdmin();
  try {
    const user = await createUser(data);
    return { ok: true as const, user: toPublicUser(user) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "FAILED";
    return { ok: false as const, error: message };
  }
}

export async function adminUpdateUser(data: {
  id: string;
  role?: UserRole | undefined;
  status?: UserStatus | undefined;
  name?: string | undefined;
}) {
  await requireAdmin();
  const users = await usersCollection();
  const user = await users.findOne({ _id: new ObjectId(data.id) });
  if (!user) return { ok: false as const, error: "NOT_FOUND" };

  if (data.status === "disabled" || data.role === "user") {
    const adminCount = await users.countDocuments({ role: "admin", status: "active" });
    if (user.role === "admin" && adminCount <= 1) {
      return { ok: false as const, error: "LAST_ADMIN" };
    }
  }

  const updates: Partial<{ role: UserRole; status: UserStatus; name: string; updatedAt: Date }> = {
    updatedAt: new Date(),
  };
  if (data.role) updates.role = data.role;
  if (data.status) updates.status = data.status;
  if (data.name) updates.name = data.name.trim();

  await users.updateOne({ _id: user._id }, { $set: updates });
  const next = await users.findOne({ _id: user._id });
  return { ok: true as const, user: next ? toPublicUser(next) : (null as PublicUser | null) };
}
