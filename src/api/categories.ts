import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { countries } from "@/lib/directory-content";
import {
  adminDeleteCategory,
  adminListCategories,
  adminSaveCategory,
  getCategories,
  getCategoryBySlug,
} from "./categories.server";

export const fetchCategoriesFn = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({ country: z.enum(countries).optional() }).parse(data ?? {}))
  .handler(async ({ data }) => getCategories(data.country));

export const fetchCategoryFn = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({ country: z.enum(countries), slug: z.string() }).parse(data))
  .handler(async ({ data }) => getCategoryBySlug(data.country, data.slug));

export const adminListCategoriesFn = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({ country: z.enum(countries).optional() }).parse(data ?? {}))
  .handler(async ({ data }) => adminListCategories(data.country));

export const adminSaveCategoryFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        id: z.string().optional(),
        name: z.string().min(1),
        country: z.enum(countries),
        image: z.string().min(1),
        groupIds: z.array(z.string()).optional().default([]),
        sourceUrl: z.string().optional().default(""),
      })
      .parse(data),
  )
  .handler(async ({ data }) => adminSaveCategory(data));

export const adminDeleteCategoryFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data }) => adminDeleteCategory(data.id));
