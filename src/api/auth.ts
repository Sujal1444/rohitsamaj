import { createServerFn } from "@tanstack/react-start";
import { destroySession, getSessionUser } from "./auth.server";

export const getCurrentUser = createServerFn({ method: "GET" }).handler(async () => {
  return getSessionUser();
});

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  await destroySession();
  return { ok: true };
});
