import fs from "node:fs";
import path from "node:path";

export type OriginalImage = {
  src: string;
  alt?: string;
};

export type OriginalProduct = {
  id: string;
  name: string;
  slug: string;
  path: string;
  permalink: string;
  price: number | null;
  description: string;
  shortDescription: string;
  images: OriginalImage[];
  categories: string[];
  tags: string[];
  attributes: Array<{ name: string; terms: string[] }>;
  source: "woocommerce" | "crawl";
};

export type OriginalHeading = {
  level: "h1" | "h2" | "h3" | string;
  text: string;
};

export type OriginalPage = {
  url: string;
  canonical: string;
  path: string;
  type: string;
  title: string;
  meta_description?: string;
  og_title?: string;
  og_description?: string;
  h1?: string[];
  headings?: OriginalHeading[];
  body_text?: string;
  images?: OriginalImage[];
  internal_links?: string[];
  schema_types?: string[];
  tables?: string[][];
  vehicle?: {
    name?: string;
    brand_slug?: string;
    price?: number | null;
    attributes?: string[][];
  };
};

type WooProduct = {
  id?: number | string;
  name?: string;
  slug?: string;
  permalink?: string;
  price?: number | null;
  summary?: string;
  short_description?: string;
  description?: string;
  images?: Array<{ src?: string; alt?: string }>;
  categories?: Array<{ name?: string; slug?: string }>;
  tags?: Array<{ name?: string; slug?: string }>;
  attributes?: Array<{ name?: string; terms?: Array<string | { name?: string }> }>;
};

let pageCache: OriginalPage[] | null = null;
let productCache: OriginalProduct[] | null = null;

function readJson<T>(relativePath: string, fallback: T): T {
  try {
    const fullPath = path.join(process.cwd(), relativePath);
    if (!fs.existsSync(fullPath)) return fallback;
    return JSON.parse(fs.readFileSync(fullPath, "utf8")) as T;
  } catch {
    return fallback;
  }
}

function normalizePath(input: string): string {
  if (!input) return "/";
  try {
    const parsed = new URL(input, "https://prismarenting.com");
    const pathname = parsed.pathname.replace(/\/{2,}/g, "/");
    return pathname.endsWith("/") ? pathname : `${pathname}/`;
  } catch {
    const pathname = input.startsWith("/") ? input : `/${input}`;
    return pathname.endsWith("/") ? pathname : `${pathname}/`;
  }
}

function cleanHtml(value: string | undefined): string {
  if (!value) return "";
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;|&apos;/gi, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .trim();
}

function categoryNames(items: WooProduct["categories"]): string[] {
  return (items ?? []).map((item) => item.name || item.slug || "").filter(Boolean);
}

function tagNames(items: WooProduct["tags"]): string[] {
  return (items ?? []).map((item) => item.name || item.slug || "").filter(Boolean);
}

function normalizeAttributes(items: WooProduct["attributes"]): OriginalProduct["attributes"] {
  return (items ?? []).map((attribute) => ({
    name: attribute.name || "Característica",
    terms: (attribute.terms ?? []).map((term) => typeof term === "string" ? term : term.name || "").filter(Boolean),
  })).filter((attribute) => attribute.terms.length > 0);
}

function normalizeWooProduct(product: WooProduct): OriginalProduct | null {
  if (!product.name) return null;
  const permalink = product.permalink || "";
  const fallbackSlug = product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return {
    id: String(product.id ?? fallbackSlug),
    name: product.name,
    slug: fallbackSlug,
    path: normalizePath(permalink || `/ofertas-de-renting/${fallbackSlug}/`),
    permalink: permalink || `https://prismarenting.com/ofertas-de-renting/${fallbackSlug}/`,
    price: typeof product.price === "number" ? product.price : null,
    description: cleanHtml(product.description),
    shortDescription: cleanHtml(product.short_description || product.summary),
    images: (product.images ?? []).map((image) => ({ src: image.src || "", alt: image.alt || product.name! })).filter((image) => image.src),
    categories: categoryNames(product.categories),
    tags: tagNames(product.tags),
    attributes: normalizeAttributes(product.attributes),
    source: "woocommerce",
  };
}

function normalizeCrawlVehicle(page: OriginalPage): OriginalProduct | null {
  if (!page.vehicle?.name) return null;
  const pagePath = normalizePath(page.path || page.canonical || page.url);
  const slug = pagePath.split("/").filter(Boolean).at(-1) || page.vehicle.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return {
    id: `crawl:${pagePath}`,
    name: page.vehicle.name,
    slug,
    path: pagePath,
    permalink: page.canonical || page.url,
    price: typeof page.vehicle.price === "number" ? page.vehicle.price : null,
    description: page.body_text || "",
    shortDescription: page.meta_description || "",
    images: (page.images ?? []).filter((image) => image.src),
    categories: [],
    tags: [],
    attributes: (page.vehicle.attributes ?? []).map((row) => ({ name: row[0] || "Característica", terms: row.slice(1).filter(Boolean) })),
    source: "crawl",
  };
}

export function getOriginalPages(): OriginalPage[] {
  if (pageCache) return pageCache;
  const pages = readJson<OriginalPage[]>("migration-output/pages.json", []);
  const vehicles = readJson<OriginalPage[]>("migration-output/vehicles.json", []);
  pageCache = [...pages, ...vehicles].map((page) => ({ ...page, path: normalizePath(page.path || page.canonical || page.url) }));
  return pageCache;
}

export function getOriginalProducts(): OriginalProduct[] {
  if (productCache) return productCache;
  const woo = readJson<WooProduct[]>("migration-products/products.json", []).map(normalizeWooProduct).filter((item): item is OriginalProduct => Boolean(item));
  const crawl = getOriginalPages().filter((page) => page.type === "vehicle").map(normalizeCrawlVehicle).filter((item): item is OriginalProduct => Boolean(item));
  const byPath = new Map<string, OriginalProduct>();
  for (const product of crawl) byPath.set(product.path, product);
  for (const product of woo) byPath.set(product.path, product);
  productCache = [...byPath.values()];
  return productCache;
}

export function getOriginalPage(sourcePath: string): OriginalPage | undefined {
  const wanted = normalizePath(sourcePath);
  return getOriginalPages().find((page) => normalizePath(page.path) === wanted);
}

export function getOriginalProduct(sourcePath: string): OriginalProduct | undefined {
  const wanted = normalizePath(sourcePath);
  return getOriginalProducts().find((product) => product.path === wanted);
}

export function getProductsLinkedFromPage(sourcePath: string): OriginalProduct[] {
  const page = getOriginalPage(sourcePath);
  if (!page?.internal_links?.length) return [];
  const linkedPaths = new Set(page.internal_links.map(normalizePath));
  return getOriginalProducts().filter((product) => linkedPaths.has(product.path));
}

export function getProductsForProfile(profile: "particulares" | "autonomos" | "empresas"): OriginalProduct[] {
  const originalPath = profile === "particulares"
    ? "/renting-coches-particulares/"
    : profile === "autonomos"
      ? "/renting-coches-autonomos/"
      : "/renting-coches-empresas/";
  const linked = getProductsLinkedFromPage(originalPath);
  if (linked.length) return linked;

  const needles = profile === "particulares"
    ? ["particular", "particulares"]
    : profile === "autonomos"
      ? ["autonomo", "autónomo", "autonomos", "autónomos"]
      : ["empresa", "empresas"];
  return getOriginalProducts().filter((product) => {
    const haystack = [...product.categories, ...product.tags, ...product.attributes.flatMap((attribute) => [attribute.name, ...attribute.terms])].join(" ").toLowerCase();
    return needles.some((needle) => haystack.includes(needle));
  });
}

export function getOriginalPaths(): string[] {
  return [...new Set([...getOriginalPages().map((page) => page.path), ...getOriginalProducts().map((product) => product.path)])];
}

export function originalDataSummary() {
  const pages = getOriginalPages();
  const products = getOriginalProducts();
  return {
    pages: pages.length,
    products: products.length,
    profileProducts: {
      particulares: getProductsForProfile("particulares").length,
      autonomos: getProductsForProfile("autonomos").length,
      empresas: getProductsForProfile("empresas").length,
    },
  };
}
