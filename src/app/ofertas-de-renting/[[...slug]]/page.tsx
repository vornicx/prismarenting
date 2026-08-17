import type { Metadata } from "next";
import { notFound } from "next/navigation";
import OriginalCatalogTemplate from "@/components/original/OriginalCatalogTemplate";
import OriginalPageTemplate from "@/components/original/OriginalPageTemplate";
import OriginalVehicleTemplate from "@/components/original/OriginalVehicleTemplate";
import { getOriginalPage, getOriginalProduct } from "@/lib/original-source";

function toPath(parts?: string[]) {
  return parts?.length ? `/ofertas-de-renting/${parts.join("/")}/` : "/ofertas-de-renting/";
}

function param(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] || "" : value || "";
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const source = toPath(slug);
  const page = getOriginalPage(source);
  const product = getOriginalProduct(source);
  return {
    title: page?.title || product?.name || (source === "/ofertas-de-renting/" ? "Ofertas de renting | PRISMA Renting" : undefined),
    description: page?.meta_description || product?.shortDescription,
    alternates: { canonical: source },
    openGraph: {
      title: page?.og_title || page?.title || product?.name,
      description: page?.og_description || page?.meta_description || product?.shortDescription,
      url: source,
    },
  };
}

export default async function OriginalCatalogRoute({ params, searchParams }: { params: Promise<{ slug?: string[] }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { slug } = await params;
  const source = toPath(slug);
  if (source === "/ofertas-de-renting/") {
    const query = await searchParams;
    return <OriginalCatalogTemplate initialQuery={param(query.q)} initialMax={param(query.max) || "all"} />;
  }
  const product = getOriginalProduct(source);
  const page = getOriginalPage(source);
  if (product) return <OriginalVehicleTemplate product={product} page={page} />;
  if (page) return <OriginalPageTemplate page={page} />;
  notFound();
}
