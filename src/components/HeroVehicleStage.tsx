"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import VehicleActions from "@/components/VehicleActions";
import { ArrowUpRight } from "@/components/Icons";
import type { Vehicle } from "@/data/vehicles";

export default function HeroVehicleStage({ vehicles }: { vehicles: Vehicle[] }) {
  const initial = Math.max(0, vehicles.findIndex((vehicle) => vehicle.slug === "bmw-x5"));
  const [index, setIndex] = useState(initial);
  const vehicle = vehicles[index];

  return (
    <div className="hero-vehicle-stage">
      <div className="hero-ghost-brand" aria-hidden="true">{vehicle.brand}</div>

      <div className="hero-vehicle-copy">
        <span className="hero-kicker">{vehicle.badge || "Oferta PRISMA"}</span>
        <p className="hero-brand">{vehicle.brand}</p>
        <h1>{vehicle.name.replace(`${vehicle.brand} `, "") || vehicle.name}</h1>
        <div className="hero-price">
          <span>Desde</span>
          <strong>{vehicle.price.toLocaleString("es-ES")} €</strong>
          <small>/mes + IVA</small>
        </div>
        <div className="hero-vehicle-cta">
          <Link href={`/ofertas/${vehicle.slug}`} className="button button-light">
            Ver oferta <ArrowUpRight />
          </Link>
          <VehicleActions slug={vehicle.slug} compact />
        </div>
      </div>

      <div className="hero-car-frame" key={vehicle.slug}>
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          fill
          priority
          sizes="(max-width: 900px) 96vw, 68vw"
          className="hero-car-image"
        />
      </div>

      <div className="hero-specs">
        <div><span>Uso</span><strong>{vehicle.body}</strong></div>
        <div><span>Motor</span><strong>{vehicle.fuel}</strong></div>
        <div><span>Cambio</span><strong>{vehicle.transmission}</strong></div>
        <div><span>Referencia</span><strong>{vehicle.term} meses · {vehicle.km.toLocaleString("es-ES")} km/año</strong></div>
      </div>

      <div className="hero-model-selector" role="tablist" aria-label="Ofertas destacadas">
        {vehicles.slice(0, 5).map((item, itemIndex) => (
          <button
            type="button"
            key={item.slug}
            className={itemIndex === index ? "active" : ""}
            onClick={() => setIndex(itemIndex)}
            role="tab"
            aria-selected={itemIndex === index}
          >
            <span>{String(itemIndex + 1).padStart(2, "0")}</span>
            <strong>{item.name}</strong>
            <small>{item.price.toLocaleString("es-ES")} €/mes</small>
          </button>
        ))}
      </div>
    </div>
  );
}
