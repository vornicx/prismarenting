import type { Metadata } from "next";
import OriginalCatalogTemplate from "@/components/original/OriginalCatalogTemplate";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ofertas de renting | PRISMA Renting",
  alternates: { canonical: "/ofertas-de-renting/" },
};

export default function OffersPage() {
  return <OriginalCatalogTemplate />;
}
