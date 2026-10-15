import { heroImage } from "@/lib/site";

export function PageHero({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="relative isolate overflow-hidden text-white">
      <img src={heroImage} alt="" width={1920} height={480} className="absolute inset-0 -z-20 size-full object-cover" decoding="async" />
      <div className="absolute inset-0 -z-10 bg-hero/75" aria-hidden="true" />
      <div className="mx-auto w-full max-w-6xl px-5 py-14 md:py-16">
        <p className="text-xs leading-4 font-medium tracking-[2px] text-white uppercase">Rohit Samaj</p>
        <h1 className="mt-3 max-w-3xl text-5xl leading-[56px] font-semibold max-md:text-[32px] max-md:leading-10">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-[26px] text-white/90">{description}</p>
      </div>
    </section>
  );
}
