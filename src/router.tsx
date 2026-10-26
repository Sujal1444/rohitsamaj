import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import type { PublicUser } from "./lib/auth-types";

export type RouterContext = {
  queryClient: QueryClient;
  user: PublicUser | null;
};

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient, user: null } satisfies RouterContext,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
