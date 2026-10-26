import type { ObjectId } from "mongodb";
import type { Country, DirectoryType } from "@/lib/directory-content";
import type { PublicUser, UserRole, UserStatus } from "@/lib/auth-types";

export type { PublicUser, UserRole, UserStatus };
export type ListingStatus = "published" | "pending" | "rejected";

export type UserDoc = {
  _id: ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  savedListingIds: string[];
  resetToken: string | null;
  resetExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type SessionDoc = {
  _id: ObjectId;
  userId: ObjectId;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
};

export type CategoryDoc = {
  _id: ObjectId;
  name: string;
  slug: string;
  country: Country;
  image: string;
  groupIds: string[];
  sourceUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ListingDoc = {
  _id: ObjectId;
  id: string;
  name: string;
  slug: string;
  category: string;
  directoryType: DirectoryType;
  country: Country;
  city: string;
  image: string;
  rating: number | null;
  reviews: number;
  phone: string;
  phoneHref: string;
  address: string;
  description: string;
  serviceDetails: string[];
  sourceUrl: string;
  featured: boolean;
  listedAt: string | null;
  status: ListingStatus;
  ownerId: string | null;
  createdAt: Date;
  updatedAt: Date;
};
