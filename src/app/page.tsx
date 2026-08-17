import type { Metadata } from "next";
import OriginalHomeTemplate from "@/components/original/OriginalHomeTemplate";
import { getOriginalPage } from "@/lib/original-source";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  const page = getOriginalPage("/");
  return {
    title: page?.title || "PRISMA Renting",
    description: page?.meta_description,
    alternates: { canonical: "/" },
    openGraph: {
      title: page?.og_title || page?.title,
      description: page?.og_description || page?.meta_description,
      url: "/",
    },
  };
}

export default function Home() {
  return <OriginalHomeTemplate />;
}
