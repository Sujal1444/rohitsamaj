import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { slugify, type Country, type Service } from "@/lib/directory-content";
import { serviceAsset } from "@/lib/site-images";

export function ServicesForYou({ country, categories }: { country: Country; categories: Service[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || categories.length < 2) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    let frame = 0;
    let paused = false;
    const tick = () => {
      if (!paused && scroller.scrollWidth > scroller.clientWidth) {
        scroller.scrollLeft += 0.45;
        if (scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 1) {
          scroller.scrollLeft = 0;
        }
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);

    const pause = () => {
      paused = true;
    };
    const resume = () => {
      paused = false;
    };
    scroller.addEventListener("pointerenter", pause);
    scroller.addEventListener("pointerleave", resume);
    scroller.addEventListener("focusin", pause);
    scroller.addEventListener("focusout", resume);

    return () => {
      window.cancelAnimationFrame(frame);
      scroller.removeEventListener("pointerenter", pause);
      scroller.removeEventListener("pointerleave", resume);
      scroller.removeEventListener("focusin", pause);
      scroller.removeEventListener("focusout", resume);
    };
  }, [categories.length]);

  if (!categories.length) return null;

  return (
    <section
      className="relative isolate overflow-hidden bg-[#f3f3f3] py-14 md:py-16"
      aria-labelledby="services-for-you-title"
      style={{
        backgroundImage: `url(${serviceAsset("pattern-bg.jpg")})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 -z-10 bg-[#f3f3f3]/88" aria-hidden="true" />
      <div className="mx-auto w-full max-w-6xl px-5">
        <div className="mb-8 text-center">
          <h2 id="services-for-you-title" className="text-[34px] leading-10 font-bold text-foreground md:text-[38px]">
            Services For You
          </h2>
          <p className="mt-2 text-base leading-[26px] text-foreground/85">Professional Services Designed Around You</p>
        </div>

        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          tabIndex={0}
          aria-label="Service categories"
        >
          {categories.map((item) => (
            <Link
              key={item.name}
              to={country === "India" ? "/india/category/$slug" : "/uk/category/$slug"}
              params={{ slug: slugify(item.name) }}
              className="group w-[11.5rem] shrink-0 border border-black bg-background sm:w-[13rem] md:w-[14.5rem]"
            >
              <span className="block overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  width={280}
                  height={360}
                  className="aspect-[3/4] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </span>
              <span className="block bg-black/70 px-3 py-2.5 text-center text-sm font-semibold text-white sm:text-base">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
