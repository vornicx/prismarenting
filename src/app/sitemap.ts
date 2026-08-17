import type { MetadataRoute } from "next";
import { getOriginalPages, getOriginalProducts } from "@/lib/original-source";

const ORIGIN = "https://prismarenting.com";

function absolute(pathname: string) {
  return new URL(pathname, ORIGIN).toString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = getOriginalPages().map((page) => ({
    url: absolute(page.path),
    lastModified: new Date(),
    changeFrequency: page.type === "blog-post" ? "monthly" as const : "weekly" as const,
    priority: page.path === "/" ? 1 : page.type === "profile" || page.path === "/ofertas-de-renting/" ? .9 : .7,
  }));
  const products = getOriginalProducts().map((product) => ({
    url: absolute(product.path),
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: .8,
  }));
  const extras: MetadataRoute.Sitemap = [
    { url: absolute("/"), changeFrequency: "daily", priority: 1 },
    { url: absolute("/ofertas/"), changeFrequency: "daily", priority: .8 },
    { url: absolute("/perfil/particulares/"), changeFrequency: "weekly", priority: .7 },
    { url: absolute("/perfil/autonomos/"), changeFrequency: "weekly", priority: .7 },
    { url: absolute("/perfil/empresas/"), changeFrequency: "weekly", priority: .7 },
  ];
  const byUrl = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const entry of [...pages, ...products, ...extras]) byUrl.set(entry.url, entry);
  return [...byUrl.values()];
}
