import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { adminCreateUser, adminDashboard, adminListUsers, adminUpdateUser } from "./users.server";

export const adminDashboardFn = createServerFn({ method: "GET" }).handler(async () => adminDashboard());

export const adminListUsersFn = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({ q: z.string().optional() }).parse(data ?? {}))
  .handler(async ({ data }) => adminListUsers(data.q));

export const adminCreateUserFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
        role: z.enum(["admin", "user"]),
      })
      .parse(data),
  )
  .handler(async ({ data }) => adminCreateUser(data));

export const adminUpdateUserFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        id: z.string(),
        role: z.enum(["admin", "user"]).optional(),
        status: z.enum(["active", "disabled"]).optional(),
        name: z.string().min(2).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => adminUpdateUser(data));
