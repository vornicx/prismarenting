import type { Metadata } from "next";
import { notFound } from "next/navigation";
import OriginalProfileTemplate, { type OriginalProfileKey } from "@/components/original/OriginalProfileTemplate";
import { getOriginalPage } from "@/lib/original-source";

const profiles: Record<string, { key: OriginalProfileKey; canonical: string }> = {
  particulares: { key: "particulares", canonical: "/renting-coches-particulares/" },
  autonomos: { key: "autonomos", canonical: "/renting-coches-autonomos/" },
  empresas: { key: "empresas", canonical: "/renting-coches-empresas/" },
};

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return Object.keys(profiles).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const profile = profiles[slug];
  if (!profile) return {};
  const source = getOriginalPage(profile.canonical);
  return {
    title: source?.title,
    description: source?.meta_description,
    alternates: { canonical: profile.canonical },
  };
}

export default async function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = profiles[slug];
  if (!profile) notFound();
  return <OriginalProfileTemplate profile={profile.key} />;
}
