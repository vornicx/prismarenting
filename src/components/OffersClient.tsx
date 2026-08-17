"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import VehicleCard from "@/components/VehicleCard";
import { vehicles } from "@/data/vehicles";

export default function OffersClient({ initialFuel, initialBody, initialBudget }: { initialFuel: string; initialBody: string; initialBudget: string }) {
  const [query, setQuery] = useState("");
  const [fuel, setFuel] = useState(initialFuel);
  const [body, setBody] = useState(initialBody);
  const [budget, setBudget] = useState(initialBudget);
  const [sort, setSort] = useState("featured");

  const filtered = useMemo(() => {
    const result = vehicles.filter((vehicle) => {
      const matchesQuery = `${vehicle.brand} ${vehicle.name}`.toLowerCase().includes(query.trim().toLowerCase());
      const matchesFuel = fuel === "Todos" || vehicle.fuel === fuel;
      const matchesBody = body === "Todos" || vehicle.body === body;
      const matchesBudget = budget === "Todos" || (budget === "350" ? vehicle.price <= 350 : budget === "500" ? vehicle.price > 350 && vehicle.price <= 500 : vehicle.price > 500);
      return matchesQuery && matchesFuel && matchesBody && matchesBudget;
    });
    return [...result].sort((a, b) => sort === "price-asc" ? a.price - b.price : sort === "price-desc" ? b.price - a.price : 0);
  }, [query, fuel, body, budget, sort]);

  const reset = () => {
    setQuery("");
    setFuel("Todos");
    setBody("Todos");
    setBudget("Todos");
    setSort("featured");
  };

  return (
    <main className="catalog-page">
      <section className="catalog-stage">
        <Header />
        <div className="shell catalog-hero">
          <span className="eyebrow eyebrow-light">Ofertas de renting</span>
          <h1>Elige menos.<br/><span>Elige mejor.</span></h1>
          <p>Busca por modelo, filtra por lo que realmente condiciona la operación y entra en cada coche para ver la propuesta completa.</p>
        </div>
      </section>
      <section className="shell catalog-controls">
        <div className="catalog-search">
          <label htmlFor="vehicle-search">Buscar coche</label>
          <input id="vehicle-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="BMW X5, Fiat 500, Hyundai…" />
        </div>
        <div className="catalog-filter-row">
          <label><span>Combustible</span><select value={fuel} onChange={(event) => setFuel(event.target.value)}><option>Todos</option><option>Gasolina</option><option>Híbrido</option><option>Diésel</option></select></label>
          <label><span>Carrocería</span><select value={body} onChange={(event) => setBody(event.target.value)}><option>Todos</option><option>SUV</option><option>Urbano</option><option>Furgoneta</option></select></label>
          <label><span>Presupuesto</span><select value={budget} onChange={(event) => setBudget(event.target.value)}><option value="Todos">Todos</option><option value="350">Hasta 350 €</option><option value="500">350–500 €</option><option value="501">Más de 500 €</option></select></label>
          <label><span>Ordenar</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Recomendados</option><option value="price-asc">Precio: menor a mayor</option><option value="price-desc">Precio: mayor a menor</option></select></label>
        </div>
      </section>
      <section className="shell catalog-results">
        <div className="catalog-top"><span>{filtered.length} ofertas</span><button onClick={reset}>Limpiar filtros</button></div>
        {filtered.length ? (
          <div className="catalog-grid">{filtered.map((vehicle) => <VehicleCard vehicle={vehicle} key={vehicle.slug} />)}</div>
        ) : (
          <div className="catalog-empty"><h2>No hay coincidencias.</h2><p>Prueba a ampliar presupuesto o quitar algún filtro.</p><button className="button button-dark" onClick={reset}>Ver todas las ofertas</button></div>
        )}
      </section>
    </main>
  );
}
