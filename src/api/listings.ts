import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { countries, directoryTypes } from "@/lib/directory-content";
import {
  adminDeleteListing,
  adminListListings,
  adminSaveListing,
  adminSetListingStatus,
  getListingBySlug,
  getPublishedListings,
  getSavedIds,
  getSavedListings,
  submitListing,
  toggleSavedListing,
} from "./listings.server";

const listingInputSchema = z.object({
  name: z.string().min(2),
  category: z.string().min(1),
  directoryType: z.enum(directoryTypes),
  country: z.enum(countries),
  city: z.string().min(1),
  image: z.string().min(1).max(14_000_100),
  phone: z.string().optional().default(""),
  address: z.string().optional().default(""),
  description: z.string().optional().default(""),
  serviceDetails: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  status: z.enum(["published", "pending", "rejected"]).optional(),
  listedAt: z.string().nullable().optional(),
  id: z.string().optional(),
});

export const fetchPublishedListingsFn = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({ country: z.enum(countries).optional() }).parse(data ?? {}))
  .handler(async ({ data }) => getPublishedListings(data.country));

export const fetchListingFn = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({ country: z.enum(countries), slug: z.string() }).parse(data))
  .handler(async ({ data }) => getListingBySlug(data.country, data.slug));

export const submitListingFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => listingInputSchema.omit({ status: true, featured: true, id: true, listedAt: true }).parse(data))
  .handler(async ({ data }) => submitListing(data));

export const adminListListingsFn = createServerFn({ method: "GET" })
  .validator((data: unknown) =>
    z
      .object({
        country: z.enum(countries).optional(),
        status: z.enum(["published", "pending", "rejected"]).optional(),
        q: z.string().optional(),
      })
      .parse(data ?? {}),
  )
  .handler(async ({ data }) => adminListListings(data));

export const adminSaveListingFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => listingInputSchema.parse(data))
  .handler(async ({ data }) => adminSaveListing(data));

export const adminSetListingStatusFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z.object({ id: z.string(), status: z.enum(["published", "pending", "rejected"]) }).parse(data),
  )
  .handler(async ({ data }) => adminSetListingStatus(data));

export const adminDeleteListingFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data }) => adminDeleteListing(data));

export const toggleSavedListingFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ listingId: z.string() }).parse(data))
  .handler(async ({ data }) => toggleSavedListing(data.listingId));

export const getSavedListingsFn = createServerFn({ method: "GET" }).handler(async () => getSavedListings());

export const getSavedIdsFn = createServerFn({ method: "GET" }).handler(async () => getSavedIds());
