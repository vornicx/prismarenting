import type { Metadata } from "next";
import { notFound } from "next/navigation";
import OriginalPageTemplate from "@/components/original/OriginalPageTemplate";
import { getOriginalPage } from "@/lib/original-source";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  const page = getOriginalPage("/alta-gama/");
  return {
    title: page?.title,
    description: page?.meta_description,
    alternates: { canonical: "/alta-gama/" },
    openGraph: {
      title: page?.og_title || page?.title,
      description: page?.og_description || page?.meta_description,
      url: "/alta-gama/",
    },
  };
}

export default function AltaGamaPage() {
  const page = getOriginalPage("/alta-gama/");
  if (!page) notFound();
  return <OriginalPageTemplate page={page} />;
}
