import { countries, directoryTypes, type Country } from "@/lib/directory-content";

export { countries, directoryTypes, type Country };

export function siteImagePath(country: Country) {
  return country === "UK" ? "/images/uk-business.jpg" : "/images/commercial.jpg";
}

export const categoryGroupOptions = [
  { id: "food", label: "Food" },
  { id: "property", label: "Property" },
  { id: "services", label: "Services" },
  { id: "lifestyle", label: "Lifestyle" },
] as const;
