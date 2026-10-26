import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { PageHero } from "@/components/site/page-hero";
import { PageShell } from "@/components/site/page-shell";
import { getCurrentUser, logoutFn } from "@/api/auth";
import { updateProfileFn } from "@/api/auth-actions";
import { getSavedListingsFn } from "@/api/listings";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/account")({
  head: () => {
    const head = pageHead({
      title: "Account | Rohit Samaj",
      description: "Manage your Rohit Samaj profile and saved listings.",
      path: "/account",
    });
    return { ...head, meta: [...head.meta, { name: "robots", content: "noindex" }] };
  },
  beforeLoad: async () => {
    const user = await getCurrentUser();
    if (!user) throw redirect({ to: "/login" });
    return { accountUser: user };
  },
  loader: async () => ({ saved: await getSavedListingsFn() }),
  component: AccountPage,
});

function AccountPage() {
  const { accountUser } = Route.useRouteContext();
  const { saved } = Route.useLoaderData();
  const navigate = useNavigate();
  const [name, setName] = useState(accountUser.name);
  const [email, setEmail] = useState(accountUser.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setName(accountUser.name);
    setEmail(accountUser.email);
  }, [accountUser]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    const result = await updateProfileFn({
      data: {
        name,
        email,
        ...(newPassword ? { currentPassword, newPassword } : {}),
      },
    });
    if (!result.ok) {
      setError(
        result.error === "EMAIL_IN_USE"
          ? "That email is already in use."
          : result.error === "INVALID_CREDENTIALS"
            ? "Current password is incorrect."
            : "Could not update profile.",
      );
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setMessage("Profile updated.");
  }

  async function onLogout() {
    await logoutFn();
    await navigate({ to: "/login" });
  }

  return (
    <PageShell>
      <PageHero title="Your account" description="Manage your profile and saved listings." />
      <article className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-background px-6 py-6">
          <h2 className="text-[32px] leading-10 font-semibold">Profile</h2>
          <p className="mt-2 text-base leading-[26px] text-muted-foreground">
            Signed in as {accountUser.name} ({accountUser.role}).
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
            <label className="grid gap-1 text-sm">
              Current password
              <input type="password" className="rounded-md border border-border px-3 py-2 text-base" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoComplete="current-password" />
            </label>
            <label className="grid gap-1 text-sm">
              New password
              <input type="password" className="rounded-md border border-border px-3 py-2 text-base" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} minLength={6} autoComplete="new-password" />
            </label>
            {error ? <p className="text-sm text-brand">{error}</p> : null}
            {message ? <p className="text-sm text-primary">{message}</p> : null}
            <div className="flex flex-wrap gap-3">
              <button type="submit" className="rounded-md bg-brand px-5 py-3 text-sm font-medium text-white hover:text-white">
                Save profile
              </button>
              <Link to="/add-listing" className="rounded-md bg-brand px-5 py-3 text-sm font-medium text-white hover:text-white">
                Add a listing
              </Link>
              <button type="button" className="rounded-md border border-border px-5 py-3 text-sm" onClick={onLogout}>
                Log out
              </button>
              {accountUser.role === "admin" ? (
                <Link to="/admin" className="rounded-md border border-border px-5 py-3 text-sm">
                  Admin panel
                </Link>
              ) : null}
            </div>
          </form>
        </section>

        <section className="rounded-lg border border-border bg-background px-6 py-6">
          <h2 className="text-[32px] leading-10 font-semibold">Saved listings</h2>
          <p className="mt-2 text-base leading-[26px] text-muted-foreground">Heart a business on a directory page to keep it here.</p>
          {saved.length === 0 ? (
            <div className="mt-6">
              <p className="text-base leading-[26px]">You have not saved any listings yet.</p>
              <Link to="/uk" className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                Browse listings
              </Link>
            </div>
          ) : (
            <ul className="mt-6 space-y-3">
              {saved.map((item) => (
                <li key={item.id} className="border-b border-border pb-3 last:border-b-0">
                  <Link
                    to={item.country === "India" ? "/india/listing/$slug" : "/uk/listing/$slug"}
                    params={{ slug: item.slug }}
                    className="font-medium text-primary"
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
