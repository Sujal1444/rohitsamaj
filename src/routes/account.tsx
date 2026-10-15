import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { PageHero } from "@/components/site/page-hero";
import { PageShell } from "@/components/site/page-shell";
import { listings } from "@/lib/directory-content";
import { clearAccount, readAccount, readSaved, readSubmissions, saveAccount, type Account } from "@/lib/directory-storage";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/account")({
  head: () => {
    const head = pageHead({
      title: "Account | Rohit Samaj",
      description: "Keep your Rohit Samaj profile and saved listings on this device.",
      path: "/account",
    });
    return { ...head, meta: [...head.meta, { name: "robots", content: "noindex" }] };
  },
  component: AccountPage,
});

function AccountPage() {
  const [account, setAccount] = useState<Account | null>(null);
  const [savedItems, setSavedItems] = useState<Array<{ id: string; name: string; country: string; slug: string }>>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const current = readAccount();
    setAccount(current);
    if (current) {
      setName(current.name);
      setEmail(current.email);
    }
    const saved = new Set(readSaved());
    const catalog = [...listings, ...readSubmissions()];
    setSavedItems(
      catalog
        .filter((item) => saved.has(item.id))
        .map((item) => ({ id: item.id, name: item.name, country: item.country, slug: item.slug })),
    );
  }, []);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (name.trim().length < 2 || !email.includes("@")) {
      setError("Enter your name and a valid email.");
      setMessage("");
      return;
    }
    const next = { name: name.trim(), email: email.trim() };
    saveAccount(next);
    setAccount(next);
    setError("");
    setMessage("Profile saved on this device.");
  }

  return (
    <PageShell>
      <PageHero
        title="Your account"
        description="Your profile and saved listings stay in this browser. Nothing is sent to a server."
      />
      <article className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-background px-6 py-6">
          <h2 className="text-[32px] leading-10 font-semibold">Profile</h2>
          <p className="mt-2 text-base leading-[26px] text-muted-foreground">
            {account ? `Signed in as ${account.name}.` : "Save a local profile to remember your details on this device."}
          </p>
          <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
            <label className="grid gap-1 text-sm">
              Name
              <input className="rounded-md border border-border px-3 py-2 text-base" value={name} onChange={(event) => setName(event.target.value)} required />
            </label>
            <label className="grid gap-1 text-sm">
              Email
              <input type="email" className="rounded-md border border-border px-3 py-2 text-base" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            {error ? <p className="text-sm text-brand">{error}</p> : null}
            {message ? <p className="text-sm text-primary">{message}</p> : null}
            <div className="flex flex-wrap gap-3">
              <button type="submit" className="rounded-md bg-brand px-5 py-3 text-sm font-medium text-white hover:text-white">
                {account ? "Update profile" : "Save profile"}
              </button>
              {account ? (
                <button
                  type="button"
                  className="rounded-md border border-border px-5 py-3 text-sm"
                  onClick={() => {
                    clearAccount();
                    setAccount(null);
                    setName("");
                    setEmail("");
                    setMessage("Signed out on this device.");
                    setError("");
                  }}
                >
                  Sign out
                </button>
              ) : null}
            </div>
          </form>
        </section>
        <section className="rounded-lg bg-secondary px-6 py-6">
          <h2 className="text-[32px] leading-10 font-semibold">Saved listings</h2>
          <p className="mt-2 text-base leading-[26px] text-muted-foreground">
            Heart a business on a directory page to keep it here.
          </p>
          {savedItems.length === 0 ? (
            <div className="mt-6">
              <p className="text-base leading-[26px]">You have not saved any listings yet.</p>
              <Link to="/india" className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                Browse listings
              </Link>
            </div>
          ) : (
            <ul className="mt-6 space-y-3">
              {savedItems.map((item) => (
                <li key={item.id} className="border-b border-border pb-3 last:border-b-0">
                  <Link
                    to={item.country === "India" ? "/india/listing/$slug" : "/uk/listing/$slug"}
                    params={{ slug: item.slug }}
                    className="text-base font-medium text-primary"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">{item.country}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </article>
    </PageShell>
  );
}
