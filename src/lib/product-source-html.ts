import fs from "node:fs";
import path from "node:path";
import { prepareOriginalHtml } from "@/lib/source-html";

type RawWooProduct = {
  permalink?: string;
  description?: string;
  short_description?: string;
};

let cache: RawWooProduct[] | null = null;

function normalize(value: string) {
  try {
    const parsed = new URL(value, "https://prismarenting.com");
    return parsed.pathname.endsWith("/") ? parsed.pathname : `${parsed.pathname}/`;
  } catch {
    return value;
  }
}

function rawProducts() {
  if (cache) return cache;
  try {
    const file = path.join(/* turbopackIgnore: true */ process.cwd(), "migration-products/products.json");
    cache = JSON.parse(fs.readFileSync(file, "utf8")) as RawWooProduct[];
  } catch {
    cache = [];
  }
  return cache;
}

export function getProductSourceHtml(sourcePath: string) {
  const wanted = normalize(sourcePath);
  const product = rawProducts().find((item) => normalize(item.permalink || "") === wanted);
  return {
    description: prepareOriginalHtml(product?.description || ""),
    shortDescription: prepareOriginalHtml(product?.short_description || ""),
  };
}
