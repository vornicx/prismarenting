import type { Metadata } from "next";
import OriginalBlogIndexTemplate from "@/components/original/OriginalBlogIndexTemplate";
import { getOriginalPage } from "@/lib/original-source";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  const page = getOriginalPage("/blog/");
  return {
    title: page?.title || "Blog",
    description: page?.meta_description,
    alternates: { canonical: "/blog/" },
  };
}

export default function BlogPage() {
  return <OriginalBlogIndexTemplate />;
}
