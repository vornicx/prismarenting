"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "@/components/Icons";
import type { Vehicle } from "@/data/vehicles";

export default function HeroVehicleStage({ vehicles }: { vehicles: Vehicle[] }) {
  const initial = Math.max(0, vehicles.findIndex((vehicle) => vehicle.slug === "bmw-x5"));
  const [index, setIndex] = useState(initial);
  const vehicle = vehicles[index];

  return (
    <div className="prisma-hero-stage">
      <div className="prisma-hero-copy">
        <div className="prisma-hero-eyebrow">
          <span>PRISMA Renting</span>
          <strong>Grupo PRISMA · 25+ años en automoción</strong>
        </div>

        <h1>
          El coche que buscas.
          <em>La operación que encaja.</em>
        </h1>

        <p className="prisma-hero-lead">Renting para particulares, autónomos y empresas. Comparamos alternativas y te acompañamos para que elijas con más contexto que una simple cuota.</p>

        <div className="prisma-hero-actions">
          <Link href="/ofertas" className="button button-dark">Ver ofertas <ArrowUpRight /></Link>
          <a href="tel:+34699242581" className="prisma-hero-link">Hablar con un asesor <ArrowUpRight /></a>
        </div>

        <div className="prisma-hero-proof">
          <div><strong>25+</strong><span>años en automoción</span></div>
          <div><strong>Multioperador</strong><span>alternativas entre distintos operadores</span></div>
          <div><strong>3 perfiles</strong><span>particular · autónomo · empresa</span></div>
        </div>
      </div>

      <div className="prisma-hero-product" key={vehicle.slug}>
        <div className="prisma-hero-model" aria-hidden="true">{vehicle.name.replace(`${vehicle.brand} `, "")}</div>
        <div className="prisma-hero-car">
          <Image
            src={vehicle.image}
            alt={vehicle.name}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 58vw"
          />
        </div>

        <div className="prisma-hero-offer">
          <div className="prisma-hero-offer-top">
            <div>
              <span>{vehicle.badge || "Oferta PRISMA"}</span>
              <strong>{vehicle.name}</strong>
            </div>
            <div className="prisma-hero-offer-price">
              <small>Desde</small>
              <strong>{vehicle.price.toLocaleString("es-ES")} €</strong>
              <span>/mes + IVA</span>
            </div>
          </div>
          <div className="prisma-hero-offer-facts">
            <span>{vehicle.term} meses</span>
            <span>{vehicle.km.toLocaleString("es-ES")} km/año</span>
            <span>{vehicle.fuel}</span>
            <span>{vehicle.transmission}</span>
          </div>
          <div className="prisma-hero-offer-bottom">
            <span>{vehicle.availabilityNote || "Disponibilidad a confirmar con PRISMA"}</span>
            <Link href={`/ofertas/${vehicle.slug}`}>Ver oferta <ArrowUpRight /></Link>
          </div>
        </div>

        <div className="prisma-hero-selector" role="tablist" aria-label="Ofertas destacadas">
          {vehicles.slice(0, 5).map((item, itemIndex) => (
            <button
              type="button"
              key={item.slug}
              className={itemIndex === index ? "active" : ""}
              onClick={() => setIndex(itemIndex)}
              role="tab"
              aria-selected={itemIndex === index}
              aria-label={`Mostrar ${item.name}`}
            >
              <span>{String(itemIndex + 1).padStart(2, "0")}</span>
              <strong>{item.brand}</strong>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
