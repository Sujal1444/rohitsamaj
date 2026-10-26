import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { getCurrentUser } from "@/api/auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const user = await getCurrentUser();
    if (!user) throw redirect({ to: "/login" });
    if (user.role !== "admin") throw redirect({ to: "/account" });
    return { adminUser: user };
  },
  component: AdminLayout,
});

function AdminLayout() {
  const { adminUser } = Route.useRouteContext();
  return (
    <AdminShell user={adminUser}>
      <Outlet />
    </AdminShell>
  );
}
