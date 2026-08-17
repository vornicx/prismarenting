"use client";

import { useMemo, useState } from "react";
import OriginalVehicleCard from "@/components/original/OriginalVehicleCard";
import type { OriginalProduct } from "@/lib/original-source";

function canonical(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function visibleAttribute(name: string) {
  const value = canonical(name);
  return ["marca", "tipo", "combustible", "transmision", "cambio", "perfil", "cliente", "carroceria", "segmento", "kilomet", "meses"].some((needle) => value.includes(needle));
}

function friendlyLabel(name: string) {
  const value = canonical(name);
  if (value.includes("combustible")) return "Combustible";
  if (value.includes("transmision") || value.includes("cambio")) return "Cambio";
  if (value.includes("carroceria") || value.includes("tipo") || value.includes("segmento")) return "Tipo de coche";
  if (value.includes("perfil") || value.includes("cliente")) return "Perfil";
  if (value.includes("kilomet")) return "Kilometraje";
  if (value.includes("meses")) return "Plazo";
  if (value.includes("marca")) return "Marca";
  return name;
}

type SortKey = "price-asc" | "price-desc" | "name";

export default function OriginalCatalogClient({ products, initialQuery = "", initialMax = "all" }: { products: OriginalProduct[]; initialQuery?: string; initialMax?: string }) {
  const [search, setSearch] = useState(initialQuery);
  const [sort, setSort] = useState<SortKey>("price-asc");
  const [maxPrice, setMaxPrice] = useState(["250", "300", "400", "500", "700", "1000"].includes(initialMax) ? initialMax : "all");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [visibleCount, setVisibleCount] = useState(24);

  const filterGroups = useMemo(() => {
    const groups = new Map<string, Set<string>>();
    for (const product of products) {
      for (const attribute of product.attributes) {
        if (!visibleAttribute(attribute.name)) continue;
        const label = friendlyLabel(attribute.name);
        const set = groups.get(label) ?? new Set<string>();
        attribute.terms.forEach((term) => term && set.add(term));
        groups.set(label, set);
      }
    }
    const priority = ["Marca", "Tipo de coche", "Combustible", "Cambio", "Perfil", "Kilometraje", "Plazo"];
    return [...groups.entries()]
      .map(([name, values]) => ({ name, values: [...values].sort((a, b) => a.localeCompare(b, "es")) }))
      .filter((group) => group.values.length > 1 && group.values.length <= 80)
      .sort((a, b) => priority.indexOf(a.name) - priority.indexOf(b.name))
      .slice(0, 7);
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
        const matches = product.attributes.some((item) => friendlyLabel(item.name) === name && item.terms.includes(value));
        if (!matches) return false;
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

  const changeSearch = (value: string) => { setSearch(value); setVisibleCount(24); };
  const changeMax = (value: string) => { setMaxPrice(value); setVisibleCount(24); };
  const changeSort = (value: SortKey) => { setSort(value); setVisibleCount(24); };
  const changeFilter = (name: string, value: string) => { setFilters((current) => ({ ...current, [name]: value })); setVisibleCount(24); };

  const reset = () => {
    setSearch("");
    setMaxPrice("all");
    setFilters({});
    setVisibleCount(24);
    window.history.replaceState({}, "", window.location.pathname);
  };

  const activeFilters = [
    search ? `“${search}”` : "",
    maxPrice !== "all" ? `Hasta ${Number(maxPrice).toLocaleString("es-ES")} €` : "",
    ...Object.values(filters).filter((value) => value && value !== "all"),
  ].filter(Boolean);

  return (
    <div className="prisma-catalog-client">
      <aside className="prisma-catalog-filters" aria-label="Filtros del catálogo">
        <div className="prisma-filter-head"><div><span>Encuentra tu coche</span><strong>Filtrar catálogo</strong></div><button type="button" onClick={reset}>Limpiar</button></div>
        <label className="prisma-filter-search"><span>Buscar</span><input value={search} onChange={(event) => changeSearch(event.target.value)} placeholder="Marca, modelo, SUV, híbrido..." /></label>
        <div className="prisma-budget-filter"><span>Cuota máxima</span><div>{[["all","Todas"],["250","250 €"],["300","300 €"],["400","400 €"],["500","500 €"],["700","700 €"],["1000","1.000 €"]].map(([value,label]) => <button type="button" className={maxPrice === value ? "is-active" : ""} onClick={() => changeMax(value)} key={value}>{label}</button>)}</div></div>
        <div className="prisma-filter-selects">{filterGroups.map((group) => <label key={group.name}><span>{group.name}</span><select value={filters[group.name] || "all"} onChange={(event) => changeFilter(group.name,event.target.value)}><option value="all">Todos</option>{group.values.map((value) => <option value={value} key={value}>{value}</option>)}</select></label>)}</div>
      </aside>

      <div className="prisma-catalog-results">
        <div className="prisma-catalog-toolbar"><div><span>Resultados</span><strong>{result.length} vehículos</strong></div><label><span>Ordenar por</span><select value={sort} onChange={(event) => changeSort(event.target.value as SortKey)}><option value="price-asc">Cuota: menor a mayor</option><option value="price-desc">Cuota: mayor a menor</option><option value="name">Marca y modelo</option></select></label></div>
        {activeFilters.length > 0 && <div className="prisma-active-filters">{activeFilters.map((filter) => <span key={filter}>{filter}</span>)}<button type="button" onClick={reset}>Quitar filtros</button></div>}
        {result.length ? <><div className="prisma-catalog-grid">{result.slice(0, visibleCount).map((product) => <OriginalVehicleCard product={product} key={product.path} />)}</div>{visibleCount < result.length && <div className="prisma-load-more"><button type="button" onClick={() => setVisibleCount((current) => current + 24)}>Mostrar 24 más <span>{result.length - visibleCount} restantes</span></button></div>}</> : <div className="prisma-catalog-empty"><span>Sin coincidencias</span><strong>No hay vehículos que encajen con esos filtros.</strong><p>Prueba ampliando la cuota o eliminando algún criterio. También puedes pedir a PRISMA una búsqueda a medida.</p><button type="button" onClick={reset}>Ver catálogo completo</button></div>}
      </div>
    </div>
  );
}
