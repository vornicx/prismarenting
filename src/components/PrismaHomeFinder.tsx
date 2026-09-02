"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

export type HomeVehicle = {
  slug: string;
  path: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  imageAlt: string;
  fuel: string;
  body: string;
  transmission: string;
  doors: string;
  seats: string;
  immediate: boolean;
  audiences: Array<"Particular" | "Autónomo" | "Empresa">;
};

type Profile = HomeVehicle["audiences"][number];

const profiles: Profile[] = ["Particular", "Autónomo", "Empresa"];

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
}

export default function PrismaHomeFinder({ vehicles }: { vehicles: HomeVehicle[] }) {
  const [profile, setProfile] = useState<Profile>("Particular");
  const [brand, setBrand] = useState("all");
  const [fuel, setFuel] = useState("all");
  const [body, setBody] = useState("all");
  const [immediateOnly, setImmediateOnly] = useState(false);

  const prices = useMemo(() => vehicles.map((vehicle) => vehicle.price), [vehicles]);
  const maxAvailable = useMemo(() => Math.max(1200, ...prices), [prices]);
  const minAvailable = useMemo(() => Math.max(100, Math.min(...prices)), [prices]);
  const [budget, setBudget] = useState(Math.min(1200, maxAvailable));

  const brands = useMemo(() => unique(vehicles.map((vehicle) => vehicle.brand)), [vehicles]);
  const fuels = useMemo(() => unique(vehicles.map((vehicle) => vehicle.fuel).filter((value) => value !== "Consultar")), [vehicles]);
  const bodies = useMemo(() => unique(vehicles.map((vehicle) => vehicle.body).filter((value) => value !== "Renting")), [vehicles]);

  const matches = useMemo(() => vehicles.filter((vehicle) => {
    if (!vehicle.audiences.includes(profile)) return false;
    if (vehicle.price > budget) return false;
    if (brand !== "all" && vehicle.brand !== brand) return false;
    if (fuel !== "all" && vehicle.fuel !== fuel) return false;
    if (body !== "all" && vehicle.body !== body) return false;
    if (immediateOnly && !vehicle.immediate) return false;
    return true;
  }).sort((a, b) => a.price - b.price), [body, brand, budget, fuel, immediateOnly, profile, vehicles]);

  const reset = () => {
    setProfile("Particular");
    setBrand("all");
    setFuel("all");
    setBody("all");
    setImmediateOnly(false);
    setBudget(Math.min(1200, maxAvailable));
  };

  const strongestQuery = brand !== "all" ? brand : body !== "all" ? body : fuel !== "all" ? fuel : "";
  const catalogueHref = `/ofertas-de-renting/?max=${budget}${strongestQuery ? `&q=${encodeURIComponent(strongestQuery)}` : ""}`;
  const visible = matches.slice(0, 3);

  return (
    <section className="marketplace-finder" aria-label="Buscador de renting">
      <div className="marketplace-shell">
        <div className="finder-profile-tabs" role="group" aria-label="Tipo de cliente">
          {profiles.map((item) => (
            <button type="button" key={item} className={profile === item ? "is-active" : ""} onClick={() => setProfile(item)}>
              {item}
            </button>
          ))}
        </div>

        <div className="finder-panel">
          <label className="finder-budget">
            <span><strong>Cuota/mes</strong><em>{budget.toLocaleString("es-ES")} € máx.</em></span>
            <input
              type="range"
              min={minAvailable}
              max={maxAvailable}
              step="25"
              value={budget}
              onChange={(event) => setBudget(Number(event.target.value))}
              aria-label="Cuota máxima mensual"
            />
            <small><span>{minAvailable.toLocaleString("es-ES")} €</span><span>{maxAvailable.toLocaleString("es-ES")} €+</span></small>
          </label>

          <label><span>Marca</span><select value={brand} onChange={(event) => setBrand(event.target.value)}><option value="all">Todas las marcas</option>{brands.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label><span>Combustible</span><select value={fuel} onChange={(event) => setFuel(event.target.value)}><option value="all">Todos</option>{fuels.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label><span>Carrocería</span><select value={body} onChange={(event) => setBody(event.target.value)}><option value="all">Todas</option>{bodies.map((value) => <option key={value}>{value}</option>)}</select></label>

          <label className="finder-toggle">
            <span>Entrega inmediata</span>
            <input type="checkbox" checked={immediateOnly} onChange={(event) => setImmediateOnly(event.target.checked)} />
            <i aria-hidden="true" />
          </label>

          <div className="finder-submit">
            <Link href={catalogueHref}>Buscar ofertas</Link>
            <button type="button" onClick={reset}>Limpiar filtros</button>
          </div>
        </div>

        <div className="finder-results-head">
          <div><span>Ofertas destacadas</span><strong>{matches.length} opciones encajan con tu búsqueda</strong></div>
          <Link href={catalogueHref}>Ver todas las ofertas <span aria-hidden="true">→</span></Link>
        </div>

        {visible.length > 0 ? (
          <div className="finder-offer-grid" aria-live="polite">
            {visible.map((vehicle) => (
              <article className="finder-offer-card" key={vehicle.slug}>
                <div className="finder-card-top">
                  {vehicle.immediate ? <span>Entrega inmediata</span> : <span>Oferta actual</span>}
                </div>
                <Link href={vehicle.path} className="finder-card-image" aria-label={`Ver ${vehicle.name}`}>
                  <Image src={vehicle.image} alt={vehicle.imageAlt || vehicle.name} fill sizes="(max-width: 760px) 100vw, 33vw" />
                </Link>
                <div className="finder-card-main">
                  <div><span>{vehicle.brand}</span><h3><Link href={vehicle.path}>{vehicle.name}</Link></h3></div>
                  <div className="finder-card-price"><small>Desde</small><strong>{vehicle.price.toLocaleString("es-ES")} €</strong><em>/mes + IVA</em></div>
                </div>
                <div className="finder-card-specs"><span>{vehicle.fuel}</span><span>{vehicle.transmission}</span><span>{vehicle.doors}</span></div>
                <Link href={vehicle.path} className="finder-card-cta">Ver oferta</Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="finder-empty" aria-live="polite">
            <strong>No hay una oferta visible con todos esos criterios.</strong>
            <p>Amplía la cuota o quita un filtro. PRISMA también puede buscar una operación a medida.</p>
            <button type="button" onClick={reset}>Restablecer búsqueda</button>
          </div>
        )}
      </div>
    </section>
  );
}
