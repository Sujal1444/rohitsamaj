import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { PageShell } from "@/components/site/page-shell";
import { clearAccount, readAccount, readSaved, saveAccount, type Account } from "@/lib/directory-storage";
import { listings } from "@/lib/directory-content";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/account")({
  head: () => {
    const head = pageHead({
      title: "Account | Rohit Samaj",
      description: "Sign in on this device to keep your Rohit Samaj profile with your saved listings.",
      path: "/account",
    });
    return { ...head, meta: [...head.meta, { name: "robots", content: "noindex" }] };
  },
  component: AccountPage,
});

function AccountPage() {
  const [account, setAccount] = useState<Account | null>(null);
  const [savedNames, setSavedNames] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const current = readAccount();
    setAccount(current);
    if (current) {
      setName(current.name);
      setEmail(current.email);
    }
    const saved = new Set(readSaved());
    setSavedNames(listings.filter((item) => saved.has(item.id)).map((item) => item.name));
  }, [account?.email]);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (name.trim().length < 2 || !email.includes("@")) {
      setError("Enter your name and a valid email.");
      return;
    }
    const next = { name: name.trim(), email: email.trim() };
    saveAccount(next);
    setAccount(next);
    setError("");
  }

  return (
    <PageShell>
      <article className="mx-auto w-full max-w-3xl px-5 py-12">
        <h1 className="text-5xl leading-[56px] font-semibold max-md:text-[32px] max-md:leading-10">Your account</h1>
        <p className="mt-4 text-base leading-[26px] text-muted-foreground">
          This profile stays in this browser with your saved listings. It is not sent to a server.
        </p>
        <form className="mt-8 grid max-w-lg gap-4" onSubmit={onSubmit}>
          <label className="grid gap-1 text-sm">
            Name
            <input className="rounded-md border border-border px-3 py-2 text-base" value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <label className="grid gap-1 text-sm">
            Email
            <input type="email" className="rounded-md border border-border px-3 py-2 text-base" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          {error ? <p className="text-sm text-brand">{error}</p> : null}
          <div className="flex gap-3">
            <button type="submit" className="rounded-md bg-brand px-5 py-3 text-sm font-medium text-white">
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
                }}
              >
                Sign out
              </button>
            ) : null}
          </div>
        </form>
        <h2 className="mt-10 text-xl leading-7 font-semibold">Saved listings</h2>
        {savedNames.length === 0 ? (
          <p className="mt-2 text-muted-foreground">You have not saved any listings yet.</p>
        ) : (
          <ul className="mt-3 list-disc pl-5">
            {savedNames.map((item) => <li key={item}>{item}</li>)}
          </ul>
        )}
      </article>
    </PageShell>
  );
}
