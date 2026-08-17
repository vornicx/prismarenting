"use client";
import { useMemo, useState } from "react";
import Header from "@/components/Header";
import VehicleCard from "@/components/VehicleCard";
import { vehicles } from "@/data/vehicles";

export default function Offers(){
 const [fuel,setFuel]=useState("Todos"); const [body,setBody]=useState("Todos"); const [budget,setBudget]=useState("Todos");
 const filtered=useMemo(()=>vehicles.filter(v=>(fuel==="Todos"||v.fuel===fuel)&&(body==="Todos"||v.body===body)&&(budget==="Todos"||(budget==="350"?v.price<=350:budget==="500"?v.price>350&&v.price<=500:v.price>500))),[fuel,body,budget]);
 return <main><Header/><section className="shell catalog-hero"><span className="eyebrow">Ofertas de renting</span><h1>Encuentra el que encaja.</h1><p>Una selección clara de vehículos y condiciones. Filtra por lo que importa y compara sin ruido.</p></section><section className="shell catalog-layout"><aside className="filters"><h3>Filtrar resultados</h3><div className="filter-group"><label>Combustible</label><select value={fuel} onChange={e=>setFuel(e.target.value)}><option>Todos</option><option>Gasolina</option><option>Híbrido</option><option>Eléctrico</option></select></div><div className="filter-group"><label>Tipo de coche</label><select value={body} onChange={e=>setBody(e.target.value)}><option>Todos</option><option>SUV</option><option>Compacto</option><option>Berlina</option></select></div><div className="filter-group"><label>Presupuesto</label><select value={budget} onChange={e=>setBudget(e.target.value)}><option value="Todos">Todos</option><option value="350">Hasta 350 €</option><option value="500">350–500 €</option><option value="501">Más de 500 €</option></select></div></aside><div><div className="catalog-top"><span>{filtered.length} ofertas seleccionadas</span><span>Cuota mensual · sin entrada</span></div><div className="catalog-grid">{filtered.map(v=><VehicleCard vehicle={v} key={v.slug}/>)}</div></div></section></main>
}
