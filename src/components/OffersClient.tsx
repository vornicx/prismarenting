"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import VehicleCard from "@/components/VehicleCard";
import { vehicles } from "@/data/vehicles";

type Props = {
  initialFuel: string;
  initialBody: string;
  initialBudget: string;
  initialBrand: string;
};

export default function OffersClient({ initialFuel, initialBody, initialBudget, initialBrand }: Props) {
  const [query, setQuery] = useState("");
  const [fuel, setFuel] = useState(initialFuel);
  const [body, setBody] = useState(initialBody);
  const [budget, setBudget] = useState(initialBudget);
  const [brand, setBrand] = useState(initialBrand);
  const [sort, setSort] = useState("featured");

  const brands = useMemo(() => ["Todas", ...Array.from(new Set(vehicles.map((vehicle) => vehicle.brand)))], []);

  const filtered = useMemo(() => {
    const result = vehicles.filter((vehicle) => {
      const matchesQuery = `${vehicle.brand} ${vehicle.name} ${vehicle.body} ${vehicle.fuel}`.toLowerCase().includes(query.trim().toLowerCase());
      const matchesFuel = fuel === "Todos" || vehicle.fuel === fuel;
      const matchesBody = body === "Todos" || vehicle.body === body;
      const matchesBrand = brand === "Todas" || vehicle.brand === brand;
      const matchesBudget = budget === "Todos" || (budget === "300" ? vehicle.price <= 300 : budget === "450" ? vehicle.price > 300 && vehicle.price <= 450 : vehicle.price > 450);
      return matchesQuery && matchesFuel && matchesBody && matchesBrand && matchesBudget;
    });

    return [...result].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return 0;
    });
  }, [query, fuel, body, budget, brand, sort]);

  const reset = () => {
    setQuery("");
    setFuel("Todos");
    setBody("Todos");
    setBudget("Todos");
    setBrand("Todas");
    setSort("featured");
  };

  const minimum = Math.min(...vehicles.map((vehicle) => vehicle.price));
  const maximum = Math.max(...vehicles.map((vehicle) => vehicle.price));

  return (
    <main className="catalog-page">
      <div className="catalog-header-wrap"><Header theme="dark" /></div>

      <section className="shell catalog-dashboard">
        <div className="catalog-dashboard-title">
          <span>Catálogo PRISMA</span>
          <h1>Coches, no ruido.</h1>
        </div>
        <div className="catalog-dashboard-stats">
          <div><span>Ofertas demo</span><strong>{vehicles.length}</strong></div>
          <div><span>Desde</span><strong>{minimum.toLocaleString("es-ES")} €</strong></div>
          <div><span>Hasta</span><strong>{maximum.toLocaleString("es-ES")} €</strong></div>
          <div><span>Comparador</span><strong>3 máx.</strong></div>
        </div>
      </section>

      <section className="shell catalog-workbench">
        <div className="catalog-search">
          <label htmlFor="vehicle-search">Buscar</label>
          <input id="vehicle-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Modelo, marca, SUV, híbrido…" />
          {query && <button type="button" onClick={() => setQuery("")}>Borrar</button>}
        </div>

        <div className="brand-filter" aria-label="Filtrar por marca">
          {brands.map((item) => (
            <button type="button" key={item} className={brand === item ? "active" : ""} onClick={() => setBrand(item)}>{item}</button>
          ))}
        </div>

        <div className="catalog-filter-row">
          <label><span>Combustible</span><select value={fuel} onChange={(event) => setFuel(event.target.value)}><option>Todos</option><option>Gasolina</option><option>Híbrido</option></select></label>
          <label><span>Carrocería</span><select value={body} onChange={(event) => setBody(event.target.value)}><option>Todos</option><option>SUV</option><option>Urbano</option></select></label>
          <label><span>Cuota</span><select value={budget} onChange={(event) => setBudget(event.target.value)}><option value="Todos">Todas</option><option value="300">Hasta 300 €</option><option value="450">300–450 €</option><option value="451">Más de 450 €</option></select></label>
          <label><span>Orden</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Selección PRISMA</option><option value="price-asc">Precio ↑</option><option value="price-desc">Precio ↓</option></select></label>
        </div>
      </section>

      <section className="shell catalog-results">
        <div className="catalog-top">
          <span><strong>{filtered.length}</strong> {filtered.length === 1 ? "resultado" : "resultados"}</span>
          <button type="button" onClick={reset}>Restablecer</button>
        </div>

        {filtered.length ? (
          <div className="catalog-grid">{filtered.map((vehicle) => <VehicleCard vehicle={vehicle} key={vehicle.slug} />)}</div>
        ) : (
          <div className="catalog-empty">
            <span>0 resultados</span>
            <h2>No te obligamos a empezar de nuevo.</h2>
            <p>Quita un filtro o restablece la búsqueda para volver al catálogo completo.</p>
            <button type="button" className="button button-dark" onClick={reset}>Restablecer filtros</button>
          </div>
        )}
      </section>
    </main>
  );
}
