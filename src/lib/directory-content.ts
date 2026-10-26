import { serviceAsset, siteImage } from "./site-images";

export const countries = ["UK", "India"] as const;
export type Country = (typeof countries)[number];
export const directoryTypes = ["Business", "Classified", "General", "Hotels", "Place", "Restaurant"] as const;
export type DirectoryType = (typeof directoryTypes)[number];
export const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "name-asc", label: "A to Z" },
  { value: "name-desc", label: "Z to A" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
] as const;
export type SortValue = (typeof sortOptions)[number]["value"];

export type DirectorySearch = {
  q: string;
  city: string;
  type: string;
  sort: SortValue;
};

export const defaultDirectorySearch: DirectorySearch = {
  q: "",
  city: "All locations",
  type: "All",
  sort: "featured",
};

const indiaCategories = [
  ["Apartment", "apartment.jpg"],
  ["Automotive", "automotive.jpg"],
  ["Buffet", "buffet.jpg"],
  ["Cafe", "cafe.jpg"],
  ["Casual Dining", "casual-dining.jpg"],
  ["Commercial", "commercial.jpg"],
  ["Coworking", "coworking.jpg"],
  ["Culture", "culture.jpg"],
  ["Education", "education.jpg"],
  ["Electronics", "electronics.jpg"],
  ["Family House", "family-house.jpg"],
  ["Fast Food", "fast-food.jpg"],
  ["Fine Dining", "fine-dining.jpg"],
  ["Food", "food.jpg"],
  ["Gym & Fitness", "gym-fitness.jpg"],
  ["Health & Beauty", "health-beauty.jpg"],
  ["Homes", "homes.jpg"],
  ["Hotels", "hotels.jpg"],
  ["Office", "office.jpg"],
  ["Outdoor Activities", "outdoor-activities.jpg"],
  ["Place", "place.jpg"],
  ["Property", "property.jpg"],
  ["Residential", "residential.jpg"],
  ["Salon", "salon.jpg"],
  ["Shopping", "shopping.jpg"],
  ["Tour", "tour.jpg"],
  ["Town House", "town-house.jpg"],
] as const;

const ukCategories = [
  ["Apartment", "apartment.jpg"],
  ["Driving School", "car.png"],
  ["Buffet", "buffet.jpg"],
  ["Business", "business.png"],
  ["Cafe", "cafe.jpg"],
  ["Casual Dining", "casual-dining.jpg"],
  ["Commercial", "commercial.jpg"],
  ["Coworking", "coworking.jpg"],
  ["Culture", "culture.jpg"],
  ["Education", "education.jpg"],
  ["Electronics", "electronics.jpg"],
  ["Family House", "family-house.jpg"],
  ["Fast Food", "fast-food.jpg"],
  ["Fine Dining", "fine-dining.jpg"],
  ["Food", "food.jpg"],
  ["Gym & Fitness", "gym-fitness.jpg"],
  ["Handy Man", "handy.png"],
  ["Health & Beauty", "health-beauty.jpg"],
  ["Homes", "homes.jpg"],
  ["Hotels", "hotels.jpg"],
  ["IT Services", "it-services.jpg"],
  ["Office", "office.jpg"],
  ["Outdoor Activities", "outdoor-activities.jpg"],
  ["Place", "place.jpg"],
  ["Property", "property.jpg"],
  ["Residential", "residential.jpg"],
  ["Salon", "salon.jpg"],
  ["Shopping", "shopping.jpg"],
  ["Tour", "tour.jpg"],
  ["Town House", "town-house.jpg"],
] as const;

const ukLocalImageFiles = new Set(["car.png", "handy.png"]);

function categorySource(country: Country, name: string) {
  const slug = slugify(name);
  if (country === "India") return `https://rohitsamaj.com/en-us/single-category/${slug}/`;
  return `https://rohitsamaj.com/en-uk/single-category-uk/?category=${slug}-uk&directory_type=business`;
}

export const services = [
  ...indiaCategories.map(([name, file]) => ({
    name,
    country: "India" as const,
    image: siteImage(file),
    sourceUrl: categorySource("India", name),
  })),
  ...ukCategories.map(([name, file]) => ({
    name,
    country: "UK" as const,
    image: ukLocalImageFiles.has(file) ? siteImage(file) : serviceAsset(file),
    sourceUrl: categorySource("UK", name),
  })),
];

export type Service = (typeof services)[number];

export type Listing = {
  id: string;
  name: string;
  slug: string;
  category: string;
  directoryType: DirectoryType;
  country: Country;
  city: string;
  image: string;
  rating: number | null;
  reviews: number;
  phone: string;
  phoneHref: string;
  address: string;
  description: string;
  serviceDetails: string[];
  sourceUrl: string;
  featured: boolean;
  listedAt: string | null;
};

function phoneHref(phone: string, country: Country) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  const local = digits.replace(/^0/, "");
  return country === "India" ? `tel:+91${local}` : `tel:+44${local}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function listing(input: Omit<Listing, "slug" | "phoneHref"> & { phone: string }): Listing {
  return { ...input, slug: slugify(input.name), phoneHref: phoneHref(input.phone, input.country) };
}

export const listings: Listing[] = [
  listing({
    id: "shree-sai-survey",
    name: "Shree Sai Survey",
    category: "Automotive",
    directoryType: "Business",
    country: "India",
    city: "Surat",
    image: siteImage("survey.png"),
    rating: 5,
    reviews: 1,
    phone: "09825541011",
    address: "308 Lalbhai Contractor Complex, Nanpura, Surat, India",
    description:
      "Shree Sai Survey is a professional surveying and geospatial services company committed to delivering accurate, reliable, and cost-effective survey solutions.",
    serviceDetails: [
      "Topographical and contour surveys",
      "Demarcation surveys and layout design",
      "Industrial and landscape surveys",
      "Road development and alignment surveys",
    ],
    sourceUrl: "https://rohitsamaj.com/en-us/directory/business/shree-sai-survey/",
    featured: true,
    listedAt: "2026-05-13",
  }),
  listing({
    id: "arun-parmar",
    name: "Arun Parmar",
    category: "Handy Man",
    directoryType: "Business",
    country: "UK",
    city: "Leicester",
    image: siteImage("handy.png"),
    rating: null,
    reviews: 0,
    phone: "07989153562",
    address: "City of Leicester, England, United Kingdom",
    description: "Arun Parmar provides reliable and affordable handyman services for residential and commercial properties.",
    serviceDetails: ["General maintenance and house work", "Painting and decorating", "Electrical work", "Plumbing"],
    sourceUrl: "https://rohitsamaj.com/en-uk/directory/business-uk/arun-parmar/",
    featured: false,
    listedAt: null,
  }),
  listing({
    id: "jy-school-of-motoring",
    name: "J.Y. School of Motoring",
    category: "Driving School",
    directoryType: "Business",
    country: "UK",
    city: "United Kingdom",
    image: siteImage("jy-school-of-motoring.jpeg"),
    rating: null,
    reviews: 0,
    phone: "07894543199",
    address: "United Kingdom",
    description: "J.Y. School of Motoring is committed to providing high-quality driving instruction for learners of all experience levels.",
    serviceDetails: [
      "Beginner and advanced driving lessons",
      "Refresher driving courses",
      "Defensive driving techniques",
      "Test preparation and motorway driving lessons",
    ],
    sourceUrl: "https://rohitsamaj.com/en-uk/directory/business-uk/j-y-school-of-motoring/",
    featured: false,
    listedAt: null,
  }),
  listing({
    id: "vm-it-solution",
    name: "VM IT Solution",
    category: "IT Services",
    directoryType: "Business",
    country: "UK",
    city: "United Kingdom",
    image: siteImage("it.png"),
    rating: null,
    reviews: 0,
    phone: "",
    address: "United Kingdom",
    description: "VM IT Solution is a technology services company dedicated to delivering innovative, reliable, and cost-effective IT solutions.",
    serviceDetails: [
      "Software, website and mobile application development",
      "Cloud solutions and IT consulting",
      "Network setup and management",
      "Cybersecurity and technical maintenance",
    ],
    sourceUrl: "https://rohitsamaj.com/en-uk/directory/business-uk/vm-it-solution/",
    featured: false,
    listedAt: null,
  }),
];

export function countryPath(country: Country) {
  return country === "India" ? "/india" : "/uk";
}

export function categoryPath(country: Country, name: string) {
  return `${countryPath(country)}/category/${slugify(name)}`;
}

export function listingPath(country: Country, slug: string) {
  return `${countryPath(country)}/listing/${slug}`;
}

export const categoryGroups = [
  {
    id: "all",
    label: "All",
    categories: null,
  },
  {
    id: "food",
    label: "Food",
    categories: ["Buffet", "Cafe", "Casual Dining", "Fast Food", "Fine Dining", "Food"],
  },
  {
    id: "property",
    label: "Property",
    categories: ["Apartment", "Commercial", "Coworking", "Family House", "Homes", "Hotels", "Office", "Property", "Residential", "Town House"],
  },
  {
    id: "services",
    label: "Services",
    categories: ["Automotive", "Business", "Driving School", "Education", "Electronics", "Handy Man", "IT Services"],
  },
  {
    id: "lifestyle",
    label: "Lifestyle",
    categories: ["Culture", "Gym & Fitness", "Health & Beauty", "Outdoor Activities", "Place", "Salon", "Shopping", "Tour"],
  },
] as const;

export type CategoryGroupId = (typeof categoryGroups)[number]["id"];

export function categoriesFor(country: Country) {
  return services.filter((item) => item.country === country);
}

export function filterCategoriesByGroup(
  categories: Array<Service & { groupIds?: string[] }>,
  groupId: CategoryGroupId,
) {
  const group = categoryGroups.find((item) => item.id === groupId) ?? categoryGroups[0];
  if (!group.categories) return categories;
  const allowed = new Set<string>(group.categories);
  return categories.filter((item) => {
    if (item.groupIds?.length) return item.groupIds.includes(groupId);
    return allowed.has(item.name);
  });
}

export function getCategory(country: Country, slug: string) {
  return categoriesFor(country).find((item) => slugify(item.name) === slug);
}

export function getListing(country: Country, slug: string, source: Listing[] = listings) {
  return source.find((item) => item.country === country && item.slug === slug);
}

export function citiesFor(country: Country, source: Listing[] = listings) {
  return [...new Set(source.filter((item) => item.country === country).map((item) => item.city))].sort();
}

export function listingCount(country: Country, category: string, source: Listing[] = listings) {
  return source.filter((item) => item.country === country && item.category === category).length;
}

export type DirectoryUrlSearch = {
  q?: string;
  city?: string;
  type?: string;
  sort?: SortValue;
  category?: string;
};

export function parseDirectorySearch(search: Record<string, unknown>): DirectorySearch {
  const sortValue = search["sort"];
  const sort = sortOptions.some((item) => item.value === sortValue) ? (sortValue as SortValue) : "featured";
  const query = search["q"];
  const city = search["city"];
  const type = search["type"];
  return {
    q: typeof query === "string" ? query : "",
    city: typeof city === "string" && city ? city : "All locations",
    type: typeof type === "string" && type ? type : "All",
    sort,
  };
}

export function parseDirectoryCategory(search: Record<string, unknown>) {
  const category = search["category"];
  return typeof category === "string" && category.trim() ? category.trim() : "All";
}

export function toDirectoryUrlSearch(search: DirectorySearch, category = "All"): DirectoryUrlSearch {
  return {
    ...(search.q.trim() ? { q: search.q.trim() } : {}),
    ...(search.city && search.city !== "All locations" ? { city: search.city } : {}),
    ...(search.type && search.type !== "All" ? { type: search.type } : {}),
    ...(search.sort && search.sort !== "featured" ? { sort: search.sort } : {}),
    ...(category !== "All" ? { category } : {}),
  };
}

export function listingsPathFor(country: Country) {
  return country === "India" ? "/india/listings" : "/uk/listings";
}

export function filterListings(
  country: string,
  category: string,
  query: string,
  city: string,
  directoryType = "All",
  source: Listing[] = listings,
) {
  const needle = query.trim().toLowerCase();
  return source.filter((item) => {
    if (item.country !== country) return false;
    if (category !== "All" && item.category !== category) return false;
    if (city !== "All locations" && item.city !== city) return false;
    if (directoryType !== "All" && item.directoryType !== directoryType) return false;
    if (!needle) return true;
    const haystack = `${item.name} ${item.category} ${item.city} ${item.description} ${item.serviceDetails.join(" ")}`.toLowerCase();
    return haystack.includes(needle);
  });
}

export function sortListings(items: Listing[], sort: SortValue) {
  const copy = [...items];
  if (sort === "name-asc") return copy.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "name-desc") return copy.sort((a, b) => b.name.localeCompare(a.name));
  if (sort === "newest") {
    return copy.sort((a, b) => {
      if (a.listedAt && b.listedAt) return b.listedAt.localeCompare(a.listedAt);
      if (a.listedAt) return -1;
      if (b.listedAt) return 1;
      return a.name.localeCompare(b.name);
    });
  }
  if (sort === "oldest") {
    return copy.sort((a, b) => {
      if (a.listedAt && b.listedAt) return a.listedAt.localeCompare(b.listedAt);
      if (a.listedAt) return -1;
      if (b.listedAt) return 1;
      return a.name.localeCompare(b.name);
    });
  }
  return copy.sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name));
}

export function emptyListingMessage(category: string, query: string, directoryType: string) {
  if (!query.trim() && category !== "All") return `No businesses in ${category} yet.`;
  if (!query.trim() && directoryType !== "All") return `No ${directoryType.toLowerCase()} listings yet.`;
  return "No listings match your search.";
}

