import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { PageShell } from "@/components/site/page-shell";
import { PageHero } from "@/components/site/page-hero";
import { countries, directoryTypes, type Country, type DirectoryType } from "@/lib/directory-content";
import { siteImagePath } from "@/lib/directory-admin";
import { pageHead } from "@/lib/site";
import { getCurrentUser } from "@/api/auth";
import { fetchCategoriesFn } from "@/api/categories";
import { submitListingFn } from "@/api/listings";

export const Route = createFileRoute("/add-listing")({
  head: () =>
    pageHead({
      title: "Add a listing | Rohit Samaj",
      description: "Submit a local business to the Rohit Samaj directory for India or the United Kingdom.",
      path: "/add-listing",
    }),
  beforeLoad: async () => {
    const user = await getCurrentUser();
    if (!user) throw redirect({ to: "/login" });
    return { user };
  },
  loader: async () => {
    const categories = await fetchCategoriesFn({ data: {} });
    return { categories };
  },
  component: AddListingPage,
});

function AddListingPage() {
  const navigate = useNavigate();
  const { user } = Route.useRouteContext();
  const { categories } = Route.useLoaderData();
  const [country, setCountry] = useState<Country>("UK");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [directoryType, setDirectoryType] = useState<DirectoryType>("Business");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [servicesText, setServicesText] = useState("");

  const countryCategories = categories.filter((item) => item.country === country);

  useEffect(() => {
    const first = categories.find((item) => item.country === country)?.name ?? "";
    setCategory(first);
  }, [country, categories]);

  useEffect(() => {
    setName((current) => current || user.name);
  }, [user.name]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!category) {
      setError("Choose a category.");
      return;
    }
    try {
      const result = await submitListingFn({
        data: {
          name,
          category,
          directoryType,
          country,
          city,
          image: siteImagePath(country),
          phone,
          address,
          description,
          serviceDetails: servicesText
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
        },
      });
      setMessage("Listing submitted for admin approval.");
      await navigate({
        to: result.listing.country === "India" ? "/india" : "/uk",
      });
    } catch {
      setError("Could not submit listing. Please try again.");
    }
  }

  return (
    <PageShell>
      <PageHero title="Add a listing" description="Submit your business for review. An admin will publish it after approval." />
      <article className="mx-auto w-full max-w-3xl px-5 py-12">
        <form className="grid gap-4" onSubmit={onSubmit}>
          <label className="grid gap-1 text-sm">
            Country
            <select className="rounded-md border border-border px-3 py-2 text-base" value={country} onChange={(event) => setCountry(event.target.value as Country)}>
              {countries.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            Business name
            <input className="rounded-md border border-border px-3 py-2 text-base" value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <label className="grid gap-1 text-sm">
            Category
            <select className="rounded-md border border-border px-3 py-2 text-base" value={category} onChange={(event) => setCategory(event.target.value)} required>
              {countryCategories.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            Directory type
            <select className="rounded-md border border-border px-3 py-2 text-base" value={directoryType} onChange={(event) => setDirectoryType(event.target.value as DirectoryType)}>
              {directoryTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            City
            <input className="rounded-md border border-border px-3 py-2 text-base" value={city} onChange={(event) => setCity(event.target.value)} required />
          </label>
          <label className="grid gap-1 text-sm">
            Phone
            <input className="rounded-md border border-border px-3 py-2 text-base" value={phone} onChange={(event) => setPhone(event.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            Address
            <input className="rounded-md border border-border px-3 py-2 text-base" value={address} onChange={(event) => setAddress(event.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            Description
            <textarea className="rounded-md border border-border px-3 py-2 text-base" rows={4} value={description} onChange={(event) => setDescription(event.target.value)} />
          </label>
          <label className="grid gap-1 text-sm">
            Services (one per line)
            <textarea className="rounded-md border border-border px-3 py-2 text-base" rows={4} value={servicesText} onChange={(event) => setServicesText(event.target.value)} />
          </label>
          {error ? <p className="text-sm text-brand">{error}</p> : null}
          {message ? <p className="text-sm text-primary">{message}</p> : null}
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="rounded-md bg-brand px-5 py-3 text-sm font-medium text-white">
              Submit for review
            </button>
            <Link to="/account" className="rounded-md border border-border px-5 py-3 text-sm">
              Back to account
            </Link>
          </div>
        </form>
      </article>
    </PageShell>
  );
}
