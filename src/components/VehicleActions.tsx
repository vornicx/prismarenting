"use client";

import { Compare, Heart } from "@/components/Icons";
import { COMPARE_KEY, FAVORITES_KEY, toggleVehicleSelection, useVehicleSelection } from "@/hooks/useVehicleSelection";

export default function VehicleActions({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const favorites = useVehicleSelection(FAVORITES_KEY);
  const compare = useVehicleSelection(COMPARE_KEY);
  const isFavorite = favorites.includes(slug);
  const isCompared = compare.includes(slug);
  const compareFull = compare.length >= 3 && !isCompared;

  return (
    <div className={`vehicle-actions ${compact ? "vehicle-actions-compact" : ""}`}>
      <button
        type="button"
        className={isFavorite ? "active" : ""}
        onClick={() => toggleVehicleSelection(FAVORITES_KEY, slug)}
        aria-pressed={isFavorite}
        title={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
      >
        <Heart filled={isFavorite} />
        {!compact && <span>{isFavorite ? "Guardado" : "Favorito"}</span>}
      </button>
      <button
        type="button"
        className={isCompared ? "active" : ""}
        onClick={() => toggleVehicleSelection(COMPARE_KEY, slug, 3)}
        aria-pressed={isCompared}
        disabled={compareFull}
        title={compareFull ? "Puedes comparar un máximo de 3 coches" : isCompared ? "Quitar de la comparación" : "Añadir a comparar"}
      >
        <Compare />
        {!compact && <span>{compareFull ? "Máx. 3" : isCompared ? "Comparando" : "Comparar"}</span>}
      </button>
    </div>
  );
}
