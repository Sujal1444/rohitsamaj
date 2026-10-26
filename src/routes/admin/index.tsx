import { createFileRoute, Link } from "@tanstack/react-router";
import { adminDashboardFn } from "@/api/users";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/admin/")({
  head: () => pageHead({ title: "Admin | Rohit Samaj", description: "Rohit Samaj admin dashboard.", path: "/admin" }),
  loader: () => adminDashboardFn(),
  component: AdminDashboard,
});

function AdminDashboard() {
  const data = Route.useLoaderData();
  const cards = [
    { label: "Users", value: data.users, to: "/admin/users" as const },
    { label: "Admins", value: data.admins, to: "/admin/users" as const },
    { label: "Published listings", value: data.listings.published, to: "/admin/listings" as const },
    { label: "Pending listings", value: data.listings.pending, to: "/admin/listings" as const },
    { label: "Categories", value: data.categories, to: "/admin/categories" as const },
  ];

  return (
    <div>
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Manage users, listings, and categories.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.label} to={card.to} className="rounded-lg border border-border bg-background px-5 py-5 hover:border-primary/40">
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold">{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
