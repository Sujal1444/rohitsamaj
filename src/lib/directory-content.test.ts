import { describe, expect, it } from "vitest";
import { filterListings, listings, services, slugify, sortListings } from "./directory-content";

describe("Current Rohit Samaj directory content", () => {
  it("contains the original India listing without fictional businesses", () => {
    expect(filterListings("India", "All", "", "All locations").map((item) => item.name)).toEqual(["Shree Sai Survey"]);
    expect(listings.map((item) => item.name)).toEqual([
      "Shree Sai Survey",
      "Arun Parmar",
      "J.Y. School of Motoring",
      "VM IT Solution",
    ]);
  });

  it("returns the original UK businesses independently of India", () => {
    expect(filterListings("UK", "All", "", "All locations").map((item) => item.name)).toEqual([
      "Arun Parmar",
      "J.Y. School of Motoring",
      "VM IT Solution",
    ]);
    expect(filterListings("UK", "IT Services", "", "All locations").map((item) => item.name)).toEqual(["VM IT Solution"]);
  });

  it("keeps the active category while searching", () => {
    expect(filterListings("India", "Automotive", "survey", "All locations").map((item) => item.name)).toEqual([
      "Shree Sai Survey",
    ]);
    expect(filterListings("India", "Cafe", "survey", "All locations")).toEqual([]);
  });

  it("uses source-attributed regional services and the saved photos", () => {
    expect(services.filter((item) => item.country === "India")).toHaveLength(27);
    expect(services.filter((item) => item.country === "UK").length).toBeGreaterThanOrEqual(28);
    expect(services.every((item) => item.sourceUrl.startsWith("https://rohitsamaj.com/"))).toBe(true);
    expect(services.find((item) => item.country === "India" && item.name === "Town House")?.image).toContain("town-house.jpg");
    expect(services.find((item) => item.country === "UK" && item.name === "Cafe")?.image).toContain("uk-cafe.jpg");
    expect(services.find((item) => item.country === "UK" && item.name === "Town House")?.image).toContain("uk-town-house.jpg");
  });

  it("preserves real survey contacts and does not manufacture UK reviews", () => {
    expect(listings.find((item) => item.name === "Shree Sai Survey")?.phone).toBe("09825541011");
    expect(listings.filter((item) => item.country === "UK").map((item) => item.rating)).toEqual([null, null, null]);
    expect(listings.find((item) => item.name === "Shree Sai Survey")?.featured).toBe(true);
    expect(slugify("Health & Beauty")).toBe("health-and-beauty");
  });

  it("sorts featured listings ahead of the rest", () => {
    expect(sortListings(listings, "featured").map((item) => item.name)[0]).toBe("Shree Sai Survey");
  });
});
