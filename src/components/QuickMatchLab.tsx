"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "@/components/Icons";
import type { Vehicle } from "@/data/vehicles";

type Need = "Ciudad" | "SUV" | "Premium" | "Cualquiera";

const budgets = [
  { label: "≤ 300 €", value: 300 },
  { label: "≤ 400 €", value: 400 },
  { label: "Sin límite", value: 99999 },
];

export default function QuickMatchLab({ vehicles }: { vehicles: Vehicle[] }) {
  const [profile, setProfile] = useState<"Particular" | "Autónomo" | "Empresa">("Particular");
  const [need, setNeed] = useState<Need>("Cualquiera");
  const [budget, setBudget] = useState(400);

  const result = useMemo(() => {
    const scored = vehicles
      .filter((vehicle) => vehicle.audiences.includes(profile))
      .map((vehicle) => {
        let score = 0;
        if (vehicle.price <= budget) score += 4;
        else score -= Math.min(4, Math.ceil((vehicle.price - budget) / 150));

        if (need === "Cualquiera") score += 1;
        if (need === "Ciudad" && vehicle.body === "Urbano") score += 5;
        if (need === "SUV" && vehicle.body === "SUV") score += 5;
        if (need === "Premium" && (vehicle.badge === "Alta gama" || vehicle.price > 700)) score += 6;

        return { vehicle, score };
      })
      .sort((a, b) => b.score - a.score || a.vehicle.price - b.vehicle.price);

    return scored.slice(0, 3).map((item) => item.vehicle);
  }, [budget, need, profile, vehicles]);

  return (
    <section className="match-lab" id="encuentra">
      <div className="shell match-lab-grid">
        <div className="match-controls">
          <div className="match-lab-label">PRISMA Match</div>
          <h2>Decide por lo que necesitas. No por cien fichas.</h2>

          <fieldset>
            <legend>Perfil</legend>
            <div className="segmented-control">
              {(["Particular", "Autónomo", "Empresa"] as const).map((item) => (
                <button type="button" key={item} className={profile === item ? "active" : ""} onClick={() => setProfile(item)}>{item}</button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Qué buscas</legend>
            <div className="segmented-control segmented-control-wrap">
              {(["Cualquiera", "Ciudad", "SUV", "Premium"] as Need[]).map((item) => (
                <button type="button" key={item} className={need === item ? "active" : ""} onClick={() => setNeed(item)}>{item}</button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Cuota objetivo</legend>
            <div className="segmented-control">
              {budgets.map((item) => (
                <button type="button" key={item.value} className={budget === item.value ? "active" : ""} onClick={() => setBudget(item.value)}>{item.label}</button>
              ))}
            </div>
          </fieldset>

          <p className="match-disclaimer">Selección orientativa sobre las ofertas cargadas en este concepto. Un asesor confirma disponibilidad y condiciones finales.</p>
        </div>

        <div className="match-results" aria-live="polite">
          <div className="match-results-top">
            <span>Mejores coincidencias</span>
            <strong>{result.length}</strong>
          </div>
          {result.map((vehicle, index) => (
            <Link href={`/ofertas/${vehicle.slug}`} className="match-result" key={vehicle.slug}>
              <span className="match-rank">{String(index + 1).padStart(2, "0")}</span>
              <div className="match-car">
                <Image src={vehicle.image} alt="" fill sizes="180px" className="match-car-image" />
              </div>
              <div className="match-copy">
                <span>{vehicle.brand}</span>
                <strong>{vehicle.name}</strong>
                <small>{vehicle.highlight}</small>
              </div>
              <div className="match-price">
                <strong>{vehicle.price.toLocaleString("es-ES")} €</strong>
                <small>/mes + IVA</small>
              </div>
              <ArrowUpRight />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
