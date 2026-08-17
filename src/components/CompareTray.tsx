"use client";

import Link from "next/link";
import { COMPARE_KEY, useVehicleSelection, writeVehicleSelection } from "@/hooks/useVehicleSelection";
import { vehicles } from "@/data/vehicles";

export default function CompareTray() {
  const selected = useVehicleSelection(COMPARE_KEY);
  const selectedVehicles = selected.map((slug) => vehicles.find((vehicle) => vehicle.slug === slug)).filter(Boolean);

  if (!selectedVehicles.length) return null;

  return (
    <aside className="compare-tray" aria-label="Comparador">
      <div className="compare-tray-label">
        <span>Comparar</span>
        <strong>{selectedVehicles.length}/3</strong>
      </div>
      <div className="compare-tray-cars">
        {selectedVehicles.map((vehicle) => vehicle && <span key={vehicle.slug}>{vehicle.name}</span>)}
      </div>
      <button type="button" onClick={() => writeVehicleSelection(COMPARE_KEY, [])}>Vaciar</button>
      <Link href={`/comparar?cars=${selected.join(",")}`}>Abrir comparación</Link>
    </aside>
  );
}
