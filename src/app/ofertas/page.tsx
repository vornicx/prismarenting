import OffersClient from "@/components/OffersClient";

type SearchParams = Promise<{
  fuel?: string | string[];
  body?: string | string[];
  budget?: string | string[];
  brand?: string | string[];
}>;

const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

export default async function OffersPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  return (
    <OffersClient
      initialFuel={first(params.fuel) || "Todos"}
      initialBody={first(params.body) || "Todos"}
      initialBudget={first(params.budget) || "Todos"}
      initialBrand={first(params.brand) || "Todas"}
    />
  );
}
