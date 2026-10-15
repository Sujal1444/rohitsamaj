import { createFileRoute, redirect } from "@tanstack/react-router";
import { defaultDirectorySearch } from "@/lib/directory-content";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/india", search: defaultDirectorySearch });
  },
});
