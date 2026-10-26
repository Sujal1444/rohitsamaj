import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/page-hero";
import { PageShell } from "@/components/site/page-shell";
import { siteImage } from "@/lib/site-images";
import { pageHead } from "@/lib/site";

const whyChoose = [
  "Easy and fast search functionality",
  "Wide range of business categories",
  "Detailed business profiles",
  "Genuine customer reviews and ratings",
  "Mobile-friendly browsing experience",
  "Support for local businesses and communities",
] as const;

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead({
      title: "About RohitSamaj",
      description:
        "RohitSamaj is a trusted community business directory for local businesses, professionals, services, and organizations across India and the United Kingdom.",
      path: "/about",
      image: siteImage("about-memory.png"),
    }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell>
      <PageHero
        title="About"
        description="Discover and connect with local businesses, professionals, and services in one convenient place."
      />

      <article>
        <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-14 lg:grid-cols-2">
          <div>
            <h2 className="text-[32px] leading-10 font-semibold">
              <span className="text-brand">About</span>{" "}
              <span className="text-brand underline decoration-brand decoration-2 underline-offset-8">RohitSamaj</span>
            </h2>
            <p className="mt-6 text-base leading-[26px] text-muted-foreground">
              <strong className="font-semibold text-foreground">RohitSamaj</strong> is a trusted community business directory designed to help
              users quickly discover and connect with local businesses, professionals, services, educational institutions, healthcare
              providers, and organizations. Our platform makes it easy to search, explore, and find reliable listings in one convenient place.
            </p>
          </div>
          <img
            src={siteImage("about-memory.png")}
            alt="In memory of our father — your love, wisdom and values continue to guide us every day"
            width={580}
            height={398}
            className="w-full rounded-lg object-cover"
            loading="eager"
          />
        </section>

        <section className="bg-[#f7f4ee]">
          <div className="mx-auto w-full max-w-3xl px-5 py-14 text-center">
            <h2 className="text-[32px] leading-10 font-semibold">
              Search Your
              <br />
              Favourite Listings
            </h2>
            <p className="mt-5 text-base leading-[26px] text-muted-foreground">
              Whether you’re looking for a driving school, IT services, survey consultants, restaurants, hospitals, educational institutes, or
              other local businesses, RohitSamaj brings together a wide range of verified listings to help you make informed decisions.
            </p>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-6xl items-start gap-10 px-5 py-14 lg:grid-cols-2">
          <div>
            <h2 className="text-[28px] leading-9 font-semibold">Why Choose RohitSamaj?</h2>
            <ul className="mt-6 space-y-3">
              {whyChoose.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base leading-[26px]">
                  <img src={siteImage("about-tick.png")} alt="" width={18} height={18} className="mt-1 size-[18px] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h3 className="mt-10 text-[28px] leading-9 font-semibold">For Business Owners</h3>
            <p className="mt-4 text-base leading-[26px] text-muted-foreground">
              Our mission is to create a comprehensive and user-friendly directory that connects people with quality businesses and services
              while helping local enterprises increase their visibility and reach more customers.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/uk" className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:text-white">
                Browse listings
              </Link>
              <Link to="/contact" className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-primary">
                Contact us
              </Link>
            </div>
          </div>
          <img
            src={siteImage("about-jobs.jpg")}
            alt="Professionals collaborating around a tablet in a modern office"
            width={580}
            height={518}
            className="w-full rounded-lg object-cover"
            loading="lazy"
          />
        </section>

        <section
          className="bg-[#f7f4ee] bg-cover bg-center"
          style={{ backgroundImage: `linear-gradient(rgba(247, 244, 238, 0.92), rgba(247, 244, 238, 0.92)), url(${siteImage("about-bgg.jpg")})` }}
        >
          <div className="mx-auto grid w-full max-w-6xl gap-6 px-5 py-14 md:grid-cols-2">
            <div className="rounded-lg bg-brand px-8 py-10 text-center text-white">
              <h2 className="text-[28px] leading-9 font-semibold">
                Our Mission
                <span className="mx-auto mt-3 block h-0.5 w-14 bg-white" aria-hidden="true" />
              </h2>
              <p className="mt-5 text-base leading-[26px] text-white/95">
                Our mission is to create a comprehensive and user-friendly directory that connects people with quality businesses and services
                while helping local enterprises increase their visibility and reach more customers.
              </p>
            </div>
            <div className="rounded-lg bg-foreground px-8 py-10 text-center text-white">
              <h2 className="text-[28px] leading-9 font-semibold">
                Our Vision
                <span className="mx-auto mt-3 block h-0.5 w-14 bg-white" aria-hidden="true" />
              </h2>
              <p className="mt-5 text-base leading-[26px] text-white/95">
                We aim to become a leading online directory that empowers communities by making local information accessible, reliable, and easy
                to find for everyone.
              </p>
            </div>
          </div>
        </section>
      </article>
    </PageShell>
  );
}
