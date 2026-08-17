import type { Metadata } from "next";
import { notFound } from "next/navigation";
import OriginalPageTemplate from "@/components/original/OriginalPageTemplate";
import OriginalProfileTemplate, { type OriginalProfileKey } from "@/components/original/OriginalProfileTemplate";
import { getOriginalPage } from "@/lib/original-source";

const profileRoutes: Record<string, OriginalProfileKey> = {
  "/renting-coches-particulares/": "particulares",
  "/renting-coches-autonomos/": "autonomos",
  "/renting-coches-empresas/": "empresas",
};

function toPath(parts: string[]) {
  return `/${parts.join("/")}/`.replace(/\/{2,}/g, "/");
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ sourcePath: string[] }> }): Promise<Metadata> {
  const { sourcePath } = await params;
  const source = toPath(sourcePath);
  const page = getOriginalPage(source);
  if (!page) return {};
  return {
    title: page.title || page.h1?.[0],
    description: page.meta_description || page.og_description,
    alternates: { canonical: source },
    openGraph: {
      title: page.og_title || page.title,
      description: page.og_description || page.meta_description,
      url: source,
    },
  };
}

export default async function OriginalRoutePage({ params }: { params: Promise<{ sourcePath: string[] }> }) {
  const { sourcePath } = await params;
  const source = toPath(sourcePath);
  const profile = profileRoutes[source];
  if (profile) return <OriginalProfileTemplate profile={profile} />;
  const page = getOriginalPage(source);
  if (!page) notFound();
  return <OriginalPageTemplate page={page} />;
}
