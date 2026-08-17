"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Header from "@/components/Header";
import VehicleCard from "@/components/VehicleCard";
import { ArrowUpRight } from "@/components/Icons";
import { vehicles } from "@/data/vehicles";

type Props = {
  initialFuel: string;
  initialBody: string;
  initialBudget: string;
  initialBrand: string;
  initialTransmission: string;
  initialProfile: string;
};

const profileLabel = (value: string) => {
  if (value.toLowerCase() === "particular") return "Particular";
  if (value.toLowerCase() === "autónomo" || value.toLowerCase() === "autonomo") return "Autónomo";
  if (value.toLowerCase() === "empresa") return "Empresa";
  return "Todos";
};

export default function OffersClient({ initialFuel, initialBody, initialBudget, initialBrand, initialTransmission, initialProfile }: Props) {
  const [query, setQuery] = useState("");
  const [fuel, setFuel] = useState(initialFuel);
  const [body, setBody] = useState(initialBody);
  const [budget, setBudget] = useState(initialBudget);
  const [brand, setBrand] = useState(initialBrand);
  const [transmission, setTransmission] = useState(initialTransmission);
  const [profile, setProfile] = useState(profileLabel(initialProfile));
  const [sort, setSort] = useState("featured");

  const brands = useMemo(() => ["Todas", ...Array.from(new Set(vehicles.map((vehicle) => vehicle.brand)))], []);
  const fuels = useMemo(() => ["Todos", ...Array.from(new Set(vehicles.map((vehicle) => vehicle.fuel)))], []);
  const bodies = useMemo(() => ["Todos", ...Array.from(new Set(vehicles.map((vehicle) => vehicle.body)))], []);
  const transmissions = useMemo(() => ["Todas", ...Array.from(new Set(vehicles.map((vehicle) => vehicle.transmission)))], []);

  const filtered = useMemo(() => {
    const result = vehicles.filter((vehicle) => {
      const matchesQuery = `${vehicle.brand} ${vehicle.name} ${vehicle.body} ${vehicle.fuel} ${vehicle.transmission}`.toLowerCase().includes(query.trim().toLowerCase());
      const matchesFuel = fuel === "Todos" || vehicle.fuel === fuel;
      const matchesBody = body === "Todos" || vehicle.body === body;
      const matchesBrand = brand === "Todas" || vehicle.brand === brand;
      const matchesTransmission = transmission === "Todas" || vehicle.transmission === transmission;
      const matchesProfile = profile === "Todos" || vehicle.audiences.includes(profile as "Particular" | "Autónomo" | "Empresa");
      const matchesBudget = budget === "Todos" || (budget === "300" ? vehicle.price <= 300 : budget === "450" ? vehicle.price > 300 && vehicle.price <= 450 : vehicle.price > 450);
      return matchesQuery && matchesFuel && matchesBody && matchesBrand && matchesTransmission && matchesProfile && matchesBudget;
    });

    return [...result].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name, "es");
      return 0;
    });
  }, [query, fuel, body, budget, brand, transmission, profile, sort]);

  const reset = () => {
    setQuery("");
    setFuel("Todos");
    setBody("Todos");
    setBudget("Todos");
    setBrand("Todas");
    setTransmission("Todas");
    setProfile("Todos");
    setSort("featured");
  };

  const minimum = Math.min(...vehicles.map((vehicle) => vehicle.price));
  const maximum = Math.max(...vehicles.map((vehicle) => vehicle.price));
  const hasActiveFilters = query || fuel !== "Todos" || body !== "Todos" || budget !== "Todos" || brand !== "Todas" || transmission !== "Todas" || profile !== "Todos";

  return (
    <main className="catalog-page">
      <div className="catalog-header-wrap"><Header theme="dark" /></div>

      <section className="shell catalog-dashboard">
        <div className="catalog-dashboard-title">
          <span>Ofertas de renting</span>
          <h1>Encuentra el coche.</h1>
        </div>
        <div className="catalog-dashboard-stats">
          <div><span>Ofertas cargadas</span><strong>{vehicles.length}</strong></div>
          <div><span>Cuota mínima</span><strong>{minimum.toLocaleString("es-ES")} €</strong></div>
          <div><span>Cuota máxima</span><strong>{maximum.toLocaleString("es-ES")} €</strong></div>
          <div><span>Comparador</span><strong>Hasta 3</strong></div>
        </div>
      </section>

      <section className="shell catalog-workbench">
        <div className="catalog-search">
          <label htmlFor="vehicle-search">Buscar</label>
          <input id="vehicle-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Modelo, marca, SUV, híbrido, automático…" />
          {query && <button type="button" onClick={() => setQuery("")}>Borrar</button>}
        </div>

        <div className="brand-filter" aria-label="Filtrar por marca">
          {brands.map((item) => (
            <button type="button" key={item} className={brand === item ? "active" : ""} onClick={() => setBrand(item)}>{item}</button>
          ))}
        </div>

        <div className="catalog-filter-row catalog-filter-row-full">
          <label><span>Tipo</span><select value={body} onChange={(event) => setBody(event.target.value)}>{bodies.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span>Transmisión</span><select value={transmission} onChange={(event) => setTransmission(event.target.value)}>{transmissions.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span>Combustible</span><select value={fuel} onChange={(event) => setFuel(event.target.value)}>{fuels.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span>Perfil</span><select value={profile} onChange={(event) => setProfile(event.target.value)}><option>Todos</option><option>Particular</option><option>Autónomo</option><option>Empresa</option></select></label>
          <label><span>Cuota</span><select value={budget} onChange={(event) => setBudget(event.target.value)}><option value="Todos">Todas</option><option value="300">Hasta 300 €</option><option value="450">300–450 €</option><option value="451">Más de 450 €</option></select></label>
          <label><span>Orden</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Selección PRISMA</option><option value="price-asc">Precio ↑</option><option value="price-desc">Precio ↓</option><option value="name">Modelo A–Z</option></select></label>
        </div>
      </section>

      <section className="shell catalog-context-bar">
        <div><span>Resultado</span><strong>{filtered.length} {filtered.length === 1 ? "coche" : "coches"}</strong></div>
        <div><span>Perfil</span><strong>{profile === "Todos" ? "Cualquiera" : profile}</strong></div>
        <div><span>Operación</span><strong>PRISMA confirma disponibilidad y condiciones</strong></div>
        <Link href="/modalidades/a-medida">¿No aparece el tuyo? Pídelo a medida <ArrowUpRight /></Link>
      </section>

      <section className="shell catalog-results">
        <div className="catalog-top">
          <span>{hasActiveFilters ? "Filtros activos" : "Catálogo cargado en el concepto"}</span>
          {hasActiveFilters && <button type="button" onClick={reset}>Restablecer todo</button>}
        </div>

        {filtered.length ? (
          <div className="catalog-grid">{filtered.map((vehicle) => <VehicleCard vehicle={vehicle} key={vehicle.slug} />)}</div>
        ) : (
          <div className="catalog-empty">
            <span>0 resultados</span>
            <h2>Que el filtro no termine la búsqueda.</h2>
            <p>Amplía los criterios o envía una solicitud a medida para que PRISMA busque una alternativa entre operadores.</p>
            <div className="catalog-empty-actions"><button type="button" className="button button-dark" onClick={reset}>Restablecer filtros</button><Link href="/modalidades/a-medida" className="button button-ghost">Solicitar a medida <ArrowUpRight /></Link></div>
          </div>
        )}
      </section>
    </main>
  );
}
