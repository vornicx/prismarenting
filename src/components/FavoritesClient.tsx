"use client";

import Link from "next/link";
import VehicleCard from "@/components/VehicleCard";
import { FAVORITES_KEY, useVehicleSelection } from "@/hooks/useVehicleSelection";
import { vehicles } from "@/data/vehicles";

export default function FavoritesClient() {
  const favorites = useVehicleSelection(FAVORITES_KEY);
  const selected = favorites.map((slug) => vehicles.find((vehicle) => vehicle.slug === slug)).filter(Boolean);

  if (!selected.length) {
    return (
      <section className="favorites-empty shell">
        <span>Favoritos</span>
        <h1>Guarda coches.<br/>Vuelve cuando quieras.</h1>
        <p>Marca cualquier oferta con el corazón y aparecerá aquí. No necesitas crear una cuenta para este prototipo.</p>
        <Link href="/ofertas" className="button button-dark">Explorar ofertas</Link>
      </section>
    );
  }

  return (
    <section className="shell favorites-page">
      <div className="favorites-heading">
        <span>Tu selección</span>
        <h1>{selected.length} {selected.length === 1 ? "coche guardado" : "coches guardados"}.</h1>
      </div>
      <div className="catalog-grid">
        {selected.map((vehicle) => vehicle && <VehicleCard key={vehicle.slug} vehicle={vehicle} />)}
      </div>
    </section>
  );
}
