import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import { countries, directoryTypes, siteImagePath, type Country } from "@/lib/directory-admin";
import { adminDeleteListingFn, adminListListingsFn, adminSaveListingFn, adminSetListingStatusFn } from "@/api/listings";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/admin/listings")({
  head: () => pageHead({ title: "Listings | Admin", description: "Manage directory listings.", path: "/admin/listings" }),
  loader: () => adminListListingsFn({ data: {} }),
  component: AdminListingsPage,
});

type FormState = {
  id?: string;
  name: string;
  category: string;
  directoryType: (typeof directoryTypes)[number];
  country: Country;
  city: string;
  image: string;
  phone: string;
  address: string;
  description: string;
  serviceDetails: string;
  featured: boolean;
  status: "published" | "pending" | "rejected";
};

const emptyForm = (): FormState => ({
  name: "",
  category: "",
  directoryType: "Business",
  country: "UK",
  city: "",
  image: "/images/uk-business.jpg",
  phone: "",
  address: "",
  description: "",
  serviceDetails: "",
  featured: false,
  status: "published",
});

function AdminListingsPage() {
  const initial = Route.useLoaderData();
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<"all" | "published" | "pending" | "rejected">("all");
  const [form, setForm] = useState<FormState>(emptyForm());
  const [message, setMessage] = useState("");

  const visible = useMemo(() => (filter === "all" ? items : items.filter((item) => item.status === filter)), [items, filter]);

  async function refresh() {
    setItems(await adminListListingsFn({ data: {} }));
  }

  async function onSave(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    await adminSaveListingFn({
      data: {
        id: form.id,
        name: form.name,
        category: form.category,
        directoryType: form.directoryType,
        country: form.country,
        city: form.city,
        image: form.image || siteImagePath(form.country),
        phone: form.phone,
        address: form.address,
        description: form.description,
        serviceDetails: form.serviceDetails
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        featured: form.featured,
        status: form.status,
      },
    });
    setForm(emptyForm());
    setMessage("Listing saved.");
    await refresh();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Listings</h1>
        <p className="mt-2 text-muted-foreground">Create, approve, and edit directory listings.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "published", "pending", "rejected"] as const).map((value) => (
          <button key={value} type="button" onClick={() => setFilter(value)} className={`rounded-md px-3 py-1.5 text-sm ${filter === value ? "bg-primary text-white" : "border border-border bg-background"}`}>
            {value}
          </button>
        ))}
      </div>

      <form onSubmit={onSave} className="grid gap-3 rounded-lg border border-border bg-background p-5 md:grid-cols-2">
        <input className="rounded-md border border-border px-3 py-2 text-sm" placeholder="Business name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="rounded-md border border-border px-3 py-2 text-sm" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
        <select className="rounded-md border border-border px-3 py-2 text-sm" value={form.directoryType} onChange={(e) => setForm({ ...form, directoryType: e.target.value as FormState["directoryType"] })}>
          {directoryTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select className="rounded-md border border-border px-3 py-2 text-sm" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value as Country, image: siteImagePath(e.target.value as Country) })}>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <input className="rounded-md border border-border px-3 py-2 text-sm" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
        <input className="rounded-md border border-border px-3 py-2 text-sm" placeholder="Image path" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        <input className="rounded-md border border-border px-3 py-2 text-sm" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="rounded-md border border-border px-3 py-2 text-sm" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <textarea className="rounded-md border border-border px-3 py-2 text-sm md:col-span-2" placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <textarea className="rounded-md border border-border px-3 py-2 text-sm md:col-span-2" placeholder="Services (one per line)" rows={3} value={form.serviceDetails} onChange={(e) => setForm({ ...form, serviceDetails: e.target.value })} />
        <select className="rounded-md border border-border px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as FormState["status"] })}>
          <option value="published">Published</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
          Featured
        </label>
        <div className="flex gap-2 md:col-span-2">
          <button type="submit" className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white">
            {form.id ? "Update listing" : "Create listing"}
          </button>
          {form.id ? (
            <button type="button" className="rounded-md border border-border px-4 py-2 text-sm" onClick={() => setForm(emptyForm())}>
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>
      {message ? <p className="text-sm text-primary">{message}</p> : null}

      <div className="overflow-x-auto rounded-lg border border-border bg-background">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-secondary">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Country</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.country}</td>
                <td className="px-4 py-3">{item.category}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded border border-border px-2 py-1"
                      onClick={() =>
                        setForm({
                          id: item.id,
                          name: item.name,
                          category: item.category,
                          directoryType: item.directoryType,
                          country: item.country,
                          city: item.city,
                          image: item.image,
                          phone: item.phone,
                          address: item.address,
                          description: item.description,
                          serviceDetails: item.serviceDetails.join("\n"),
                          featured: item.featured,
                          status: item.status,
                        })
                      }
                    >
                      Edit
                    </button>
                    {item.status !== "published" ? (
                      <button type="button" className="rounded border border-border px-2 py-1" onClick={async () => { await adminSetListingStatusFn({ data: { id: item.id, status: "published" } }); await refresh(); }}>
                        Approve
                      </button>
                    ) : null}
                    {item.status !== "rejected" ? (
                      <button type="button" className="rounded border border-border px-2 py-1" onClick={async () => { await adminSetListingStatusFn({ data: { id: item.id, status: "rejected" } }); await refresh(); }}>
                        Reject
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="rounded border border-border px-2 py-1 text-brand"
                      onClick={async () => {
                        await adminDeleteListingFn({ data: { id: item.id } });
                        await refresh();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
