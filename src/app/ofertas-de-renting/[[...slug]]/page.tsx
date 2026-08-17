import type { Metadata } from "next";
import { notFound } from "next/navigation";
import OriginalCatalogTemplate from "@/components/original/OriginalCatalogTemplate";
import OriginalPageTemplate from "@/components/original/OriginalPageTemplate";
import OriginalVehicleTemplate from "@/components/original/OriginalVehicleTemplate";
import { getOriginalPage, getOriginalProduct } from "@/lib/original-source";

function toPath(parts?: string[]) {
  return parts?.length ? `/ofertas-de-renting/${parts.join("/")}/` : "/ofertas-de-renting/";
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

export default async function OriginalCatalogRoute({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const source = toPath(slug);
  if (source === "/ofertas-de-renting/") return <OriginalCatalogTemplate />;
  const product = getOriginalProduct(source);
  const page = getOriginalPage(source);
  if (product) return <OriginalVehicleTemplate product={product} page={page} />;
  if (page) return <OriginalPageTemplate page={page} />;
  notFound();
}
