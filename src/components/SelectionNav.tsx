"use client";

import Link from "next/link";
import { COMPARE_KEY, FAVORITES_KEY, useVehicleSelection } from "@/hooks/useVehicleSelection";

export default function SelectionNav() {
  const favorites = useVehicleSelection(FAVORITES_KEY);
  const compare = useVehicleSelection(COMPARE_KEY);

  return (
    <div className="selection-nav">
      <Link href="/favoritos" aria-label={`Favoritos: ${favorites.length}`}>
        Favoritos{favorites.length > 0 && <span>{favorites.length}</span>}
      </Link>
      <Link href={compare.length ? `/comparar?cars=${compare.join(",")}` : "/comparar"} aria-label={`Comparar: ${compare.length}`}>
        Comparar{compare.length > 0 && <span>{compare.length}</span>}
      </Link>
    </div>
  );
}
