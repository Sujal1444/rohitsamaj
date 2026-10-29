import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Boxes, CircleCheck, Clock3, Plus, Store, Users } from "lucide-react";
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
    { label: "Total users", value: data.users, detail: `${data.admins} administrator${data.admins === 1 ? "" : "s"}`, to: "/admin/users" as const, icon: Users, tint: "bg-[#e7f1f6] text-primary" },
    { label: "Published listings", value: data.listings.published, detail: "Visible in the directory", to: "/admin/listings" as const, icon: CircleCheck, tint: "bg-[#edf6ee] text-[#347448]" },
    { label: "Pending review", value: data.listings.pending, detail: "Listings awaiting approval", to: "/admin/listings" as const, icon: Clock3, tint: "bg-[#fff2df] text-[#a65d00]" },
    { label: "Categories", value: data.categories, detail: "Across your directory", to: "/admin/categories" as const, icon: Boxes, tint: "bg-[#fcebea] text-brand" },
  ];

  return <div className="space-y-8">
    <section className="relative overflow-hidden rounded-2xl bg-primary px-6 py-7 text-white sm:px-9 sm:py-9">
      <div className="pointer-events-none absolute -right-12 -top-24 size-72 rounded-full border border-white/10" /><div className="pointer-events-none absolute -right-2 -top-14 size-52 rounded-full border border-white/10" />
      <div className="relative max-w-2xl"><p className="mb-2 text-xs font-semibold uppercase tracking-[.18em] text-white/70">RohitSamaj · Directory management</p><h1 className="text-3xl font-semibold tracking-tight sm:text-[34px]">Your community, at a glance</h1><p className="mt-2 max-w-xl text-sm text-white/75">Keep members connected and local businesses easy to discover.</p>
        <div className="mt-6 flex flex-wrap gap-3"><Link to="/admin/listings" className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-primary shadow-sm hover:bg-[#fff8ef]">Manage listings <ArrowRight size={16} /></Link><Link to="/admin/users" className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10"><Plus size={16} /> Add a user</Link></div>
      </div><span className="absolute bottom-0 right-20 hidden h-1.5 w-24 rounded-t-full bg-gold sm:block" />
    </section>

    <section aria-labelledby="overview-heading"><div className="mb-4 flex items-end justify-between"><div><h2 id="overview-heading" className="text-lg font-semibold">Directory overview</h2><p className="mt-0.5 text-sm text-muted-foreground">A quick summary of your content and members.</p></div></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map((card) => { const Icon = card.icon; return <Link key={card.label} to={card.to} className="group rounded-xl border border-border bg-background p-5 shadow-[0_2px_8px_rgba(19,19,19,.025)] transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"><div className="flex items-start justify-between"><span className="text-sm font-medium text-muted-foreground">{card.label}</span><span className={`flex size-10 items-center justify-center rounded-xl ${card.tint}`}><Icon size={19} strokeWidth={1.8} /></span></div><p className="mt-5 text-3xl font-semibold tracking-tight">{card.value}</p><div className="mt-1 flex items-center justify-between"><span className="text-xs text-muted-foreground">{card.detail}</span><ArrowRight size={15} className="text-primary opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" /></div></Link>; })}</div>
    </section>

    <section aria-label="Administration shortcuts" className="grid gap-4 lg:grid-cols-2">
      <Link to="/admin/listings" className="flex items-center gap-4 rounded-xl border border-border bg-background p-5 transition hover:border-primary/30"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#e7f1f6] text-primary"><Store size={20} /></span><span className="min-w-0 flex-1"><span className="block font-medium">Listing management</span><span className="block text-sm text-muted-foreground">Review, publish, and update business listings.</span></span><ArrowRight size={17} className="shrink-0 text-muted-foreground" /></Link>
      <Link to="/admin/categories" className="flex items-center gap-4 rounded-xl border border-border bg-background p-5 transition hover:border-primary/30"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#fff2df] text-[#a65d00]"><Boxes size={20} /></span><span className="min-w-0 flex-1"><span className="block font-medium">Organize categories</span><span className="block text-sm text-muted-foreground">Keep directory categories and discovery tidy.</span></span><ArrowRight size={17} className="shrink-0 text-muted-foreground" /></Link>
    </section>
  </div>;
}
