"use client";

import { useMemo, useState } from "react";
import OriginalVehicleCard from "@/components/original/OriginalVehicleCard";
import type { OriginalProduct } from "@/lib/original-source";

function canonical(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function visibleAttribute(name: string) {
  const value = canonical(name);
  return ["marca", "tipo", "combustible", "transmision", "cambio", "perfil", "cliente", "carroceria", "segmento"].some((needle) => value.includes(needle));
}

type SortKey = "price-asc" | "price-desc" | "name";

export default function OriginalCatalogClient({ products }: { products: OriginalProduct[] }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("price-asc");
  const [maxPrice, setMaxPrice] = useState("all");
  const [filters, setFilters] = useState<Record<string, string>>( {} );

  const filterGroups = useMemo(() => {
    const groups = new Map<string, Set<string>>();
    for (const product of products) {
      for (const attribute of product.attributes) {
        if (!visibleAttribute(attribute.name)) continue;
        const set = groups.get(attribute.name) ?? new Set<string>();
        attribute.terms.forEach((term) => term && set.add(term));
        groups.set(attribute.name, set);
      }
    }
    return [...groups.entries()]
      .map(([name, values]) => ({ name, values: [...values].sort((a, b) => a.localeCompare(b, "es")) }))
      .filter((group) => group.values.length > 1 && group.values.length <= 60)
      .slice(0, 8);
  }, [products]);

  const result = useMemo(() => {
    const query = canonical(search);
    const ceiling = maxPrice === "all" ? null : Number(maxPrice);
    const selected = Object.entries(filters).filter(([, value]) => value && value !== "all");
    const filtered = products.filter((product) => {
      if (query) {
        const blob = canonical([product.name, ...product.categories, ...product.tags, ...product.attributes.flatMap((attribute) => [attribute.name, ...attribute.terms])].join(" "));
        if (!blob.includes(query)) return false;
      }
      if (ceiling !== null && (product.price === null || product.price > ceiling)) return false;
      for (const [name, value] of selected) {
        const attribute = product.attributes.find((item) => item.name === name);
        if (!attribute?.terms.includes(value)) return false;
      }
      return true;
    });
    return filtered.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name, "es");
      const aPrice = a.price ?? Number.POSITIVE_INFINITY;
      const bPrice = b.price ?? Number.POSITIVE_INFINITY;
      return sort === "price-desc" ? bPrice - aPrice : aPrice - bPrice;
    });
  }, [products, search, sort, maxPrice, filters]);

  return (
    <div className="source-catalog-client">
      <aside className="source-catalog-filters" aria-label="Filtros del catálogo">
        <div className="source-catalog-filter-head"><span>Filtrar</span><button type="button" onClick={() => { setSearch(""); setMaxPrice("all"); setFilters({}); }}>Limpiar</button></div>
        <label className="source-catalog-search"><span>Buscar</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Marca, modelo, tipo..." /></label>
        <label><span>Cuota máxima</span><select value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)}><option value="all">Todas</option><option value="250">Hasta 250 €</option><option value="300">Hasta 300 €</option><option value="400">Hasta 400 €</option><option value="500">Hasta 500 €</option><option value="700">Hasta 700 €</option><option value="1000">Hasta 1.000 €</option></select></label>
        {filterGroups.map((group) => (
          <label key={group.name}><span>{group.name}</span><select value={filters[group.name] || "all"} onChange={(event) => setFilters((current) => ({ ...current, [group.name]: event.target.value }))}><option value="all">Todos</option>{group.values.map((value) => <option value={value} key={value}>{value}</option>)}</select></label>
        ))}
      </aside>
      <div className="source-catalog-results">
        <div className="source-catalog-toolbar"><div><strong>{result.length}</strong><span> vehículos</span></div><label><span>Ordenar</span><select value={sort} onChange={(event) => setSort(event.target.value as SortKey)}><option value="price-asc">Cuota: menor a mayor</option><option value="price-desc">Cuota: mayor a menor</option><option value="name">Marca y modelo</option></select></label></div>
        {result.length ? <div className="source-vehicle-grid source-catalog-grid">{result.map((product) => <OriginalVehicleCard product={product} key={product.path} />)}</div> : <div className="source-catalog-empty"><strong>No hay vehículos que coincidan con esos filtros.</strong><button type="button" onClick={() => { setSearch(""); setMaxPrice("all"); setFilters({}); }}>Ver catálogo completo</button></div>}
      </div>
    </div>
  );
}
