import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { categoryGroupOptions, countries, siteImagePath, type Country } from "@/lib/directory-admin";
import { adminDeleteCategoryFn, adminListCategoriesFn, adminSaveCategoryFn } from "@/api/categories";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/admin/categories")({
  head: () => pageHead({ title: "Categories | Admin", description: "Manage directory categories.", path: "/admin/categories" }),
  loader: () => adminListCategoriesFn({ data: {} }),
  component: AdminCategoriesPage,
});

type FormState = {
  id?: string;
  name: string;
  country: Country;
  image: string;
  serviceOrder: number;
  groupIds: string[];
  sourceUrl: string;
};

const emptyForm = (serviceOrder = 1): FormState => ({
  name: "",
  country: "UK",
  image: "/images/uk-business.jpg",
  serviceOrder,
  groupIds: [],
  sourceUrl: "",
});

function AdminCategoriesPage() {
  const initial = Route.useLoaderData();
  const [items, setItems] = useState(initial);
  const [form, setForm] = useState<FormState>(() => emptyForm(initial.filter((item) => item.country === "UK").reduce((max, item) => Math.max(max, item.serviceOrder), 0) + 1));
  const [message, setMessage] = useState("");

  async function refresh() {
    const updated = await adminListCategoriesFn({ data: {} });
    setItems(updated);
    return updated;
  }

  async function onSave(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    await adminSaveCategoryFn({
      data: {
        id: form.id,
        name: form.name,
        country: form.country,
        image: form.image || siteImagePath(form.country),
        serviceOrder: form.serviceOrder,
        groupIds: form.groupIds,
        sourceUrl: form.sourceUrl,
      },
    });
    const updated = await refresh();
    const nextOrder = updated.filter((item) => item.country === form.country).reduce((max, item) => Math.max(max, item.serviceOrder), 0) + 1;
    setForm(emptyForm(nextOrder));
    setMessage("Category saved.");
  }

  function toggleGroup(id: string) {
    setForm((current) => ({
      ...current,
      groupIds: current.groupIds.includes(id) ? current.groupIds.filter((item) => item !== id) : [...current.groupIds, id],
    }));
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Categories</h1>
        <p className="mt-2 text-muted-foreground">Manage directory categories and set their order in the Services For You section.</p>
      </div>

      <form onSubmit={onSave} className="grid gap-3 rounded-lg border border-border bg-background p-5 md:grid-cols-2">
        <input className="rounded-md border border-border px-3 py-2 text-sm" placeholder="Category name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <select className="rounded-md border border-border px-3 py-2 text-sm" value={form.country} onChange={(e) => {
          const country = e.target.value as Country;
          const nextOrder = items.filter((item) => item.country === country).reduce((max, item) => Math.max(max, item.serviceOrder), 0) + 1;
          setForm({ ...form, country, image: siteImagePath(country), serviceOrder: form.id ? form.serviceOrder : nextOrder });
        }}>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-3 text-sm text-muted-foreground">
          Services For You order
          <input className="w-24 rounded-md border border-border px-3 py-2 text-sm text-foreground" type="number" min={1} step={1} value={form.serviceOrder} onChange={(e) => setForm({ ...form, serviceOrder: Number(e.target.value) })} required />
        </label>
        <input className="rounded-md border border-border px-3 py-2 text-sm md:col-span-2" placeholder="Image path" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        <input className="rounded-md border border-border px-3 py-2 text-sm md:col-span-2" placeholder="Source URL" value={form.sourceUrl} onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })} />
        <div className="flex flex-wrap gap-3 md:col-span-2">
          {categoryGroupOptions.map((group) => (
            <label key={group.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.groupIds.includes(group.id)} onChange={() => toggleGroup(group.id)} />
              {group.label}
            </label>
          ))}
        </div>
        <div className="flex gap-2 md:col-span-2">
          <button type="submit" className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white">
            {form.id ? "Update category" : "Create category"}
          </button>
          {form.id ? (
              <button type="button" className="rounded-md border border-border px-4 py-2 text-sm" onClick={() => setForm(emptyForm(items.filter((item) => item.country === form.country).reduce((max, item) => Math.max(max, item.serviceOrder), 0) + 1))}>
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
              <th className="px-4 py-3 font-medium">Services order</th>
              <th className="px-4 py-3 font-medium">Groups</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...items].sort((a, b) => a.country.localeCompare(b.country) || a.serviceOrder - b.serviceOrder || a.name.localeCompare(b.name)).map((item) => (
              <tr key={item.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.country}</td>
                <td className="px-4 py-3">{item.serviceOrder}</td>
                <td className="px-4 py-3">{item.groupIds.join(", ") || "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded border border-border px-2 py-1"
                      onClick={() =>
                        setForm({
                          id: item.id,
                          name: item.name,
                          country: item.country,
                          image: item.image,
                          serviceOrder: item.serviceOrder,
                          groupIds: item.groupIds,
                          sourceUrl: item.sourceUrl,
                        })
                      }
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="rounded border border-border px-2 py-1 text-brand"
                      onClick={async () => {
                        await adminDeleteCategoryFn({ data: { id: item.id } });
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
