import Header from "@/components/Header";
import ComparisonExperience from "@/components/ComparisonExperience";
import { vehicles } from "@/data/vehicles";

type SearchParams = Promise<{ cars?: string | string[] }>;

const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

export default async function ComparePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const slugs = (first(params.cars) || "").split(",").filter(Boolean).slice(0, 3);
  const selected = slugs.map((slug) => vehicles.find((vehicle) => vehicle.slug === slug)).filter((vehicle): vehicle is (typeof vehicles)[number] => Boolean(vehicle));

  return (
    <main className="comparison-page">
      <div className="comparison-header-wrap"><Header theme="dark" /></div>
      <ComparisonExperience selected={selected} />
    </main>
  );
}
