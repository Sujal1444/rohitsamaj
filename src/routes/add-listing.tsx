import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { PageShell } from "@/components/site/page-shell";
import { categoriesFor, countries, directoryTypes, type Country, type DirectoryType } from "@/lib/directory-content";
import { readAccount, saveSubmission } from "@/lib/directory-storage";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/add-listing")({
  head: () =>
    pageHead({
      title: "Add a listing | Rohit Samaj",
      description: "Submit a local business to the Rohit Samaj directory for India or the United Kingdom.",
      path: "/add-listing",
    }),
  component: AddListingPage,
});

function AddListingPage() {
  const navigate = useNavigate();
  const [country, setCountry] = useState<Country>("India");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState(categoriesFor("India")[0]?.name ?? "");
  const [directoryType, setDirectoryType] = useState<DirectoryType>("Business");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [servicesText, setServicesText] = useState("");

  useEffect(() => {
    const account = readAccount();
    if (account && !name) setName(account.name);
  }, [name]);

  function onCountryChange(next: Country) {
    setCountry(next);
    setCategory(categoriesFor(next)[0]?.name ?? "");
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (name.trim().length < 2 || city.trim().length < 2 || description.trim().length < 10) {
      setError("Enter a business name, city, and a short description.");
      return;
    }
    const listing = saveSubmission({
      name,
      category,
      directoryType,
      country,
      city,
      phone,
      address,
      description,
      serviceDetails: servicesText.split("\n").map((item) => item.trim()).filter(Boolean),
    });
    void navigate({ to: listing.country === "India" ? "/india/listing/$slug" : "/uk/listing/$slug", params: { slug: listing.slug } });
  }

  return (
    <PageShell country={country}>
      <article className="mx-auto w-full max-w-3xl px-5 py-12">
        <h1 className="text-5xl leading-[56px] font-semibold max-md:text-[32px] max-md:leading-10">Add a listing</h1>
        <p className="mt-4 text-base leading-[26px] text-muted-foreground">
          Submissions are saved in this browser and appear in the directory on this device.
        </p>
        <form className="mt-8 grid gap-4" onSubmit={onSubmit}>
          <label className="grid gap-1 text-sm">
            Business name
            <input className="rounded-md border border-border px-3 py-2 text-base" value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">
              Country
              <select className="rounded-md border border-border px-3 py-2 text-base" value={country} onChange={(event) => onCountryChange(event.target.value as Country)}>
                {countries.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="grid gap-1 text-sm">
              Directory type
              <select className="rounded-md border border-border px-3 py-2 text-base" value={directoryType} onChange={(event) => setDirectoryType(event.target.value as DirectoryType)}>
                {directoryTypes.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
          </div>
          <label className="grid gap-1 text-sm">
            Category
            <select className="rounded-md border border-border px-3 py-2 text-base" value={category} onChange={(event) => setCategory(event.target.value)}>
              {categoriesFor(country).map((item) => <option key={item.name}>{item.name}</option>)}
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
            <textarea className="min-h-28 rounded-md border border-border px-3 py-2 text-base" value={description} onChange={(event) => setDescription(event.target.value)} required />
          </label>
          <label className="grid gap-1 text-sm">
            Services, one per line
            <textarea className="min-h-24 rounded-md border border-border px-3 py-2 text-base" value={servicesText} onChange={(event) => setServicesText(event.target.value)} />
          </label>
          {error ? <p className="text-sm text-brand">{error}</p> : null}
          <button type="submit" className="w-fit rounded-md bg-brand px-5 py-3 text-sm font-medium text-white">
            Publish listing
          </button>
        </form>
      </article>
    </PageShell>
  );
}
