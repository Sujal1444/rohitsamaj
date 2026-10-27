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
  groupIds: string[];
  sourceUrl: string;
};

const emptyForm = (): FormState => ({
  name: "",
  country: "UK",
  image: "/images/uk-business.jpg",
  groupIds: [],
  sourceUrl: "",
});

function AdminCategoriesPage() {
  const initial = Route.useLoaderData();
  const [items, setItems] = useState(initial);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [message, setMessage] = useState("");

  async function refresh() {
    setItems(await adminListCategoriesFn({ data: {} }));
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
        groupIds: form.groupIds,
        sourceUrl: form.sourceUrl,
      },
    });
    setForm(emptyForm());
    setMessage("Category saved.");
    await refresh();
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
        <p className="mt-2 text-muted-foreground">Create and edit category tiles for UK and India.</p>
      </div>

      <form onSubmit={onSave} className="grid gap-3 rounded-lg border border-border bg-background p-5 md:grid-cols-2">
        <input className="rounded-md border border-border px-3 py-2 text-sm" placeholder="Category name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <select className="rounded-md border border-border px-3 py-2 text-sm" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value as Country, image: siteImagePath(e.target.value as Country) })}>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
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
              <th className="px-4 py-3 font-medium">Groups</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.country}</td>
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
