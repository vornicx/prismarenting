"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { vehicles } from "@/data/vehicles";

export default function Finder() {
  const [type, setType] = useState("Particular");
  const [body, setBody] = useState("Todos");
  const [budget, setBudget] = useState("Todos");
  const [fuel, setFuel] = useState("Todos");
  const [transmission, setTransmission] = useState("Todas");
  const router = useRouter();

  const bodies = useMemo(() => ["Todos", ...Array.from(new Set(vehicles.map((vehicle) => vehicle.body)))], []);
  const fuels = useMemo(() => ["Todos", ...Array.from(new Set(vehicles.map((vehicle) => vehicle.fuel)))], []);
  const transmissions = useMemo(() => ["Todas", ...Array.from(new Set(vehicles.map((vehicle) => vehicle.transmission)))], []);

  const submit = () => {
    const params = new URLSearchParams();
    params.set("cliente", type.toLowerCase());
    if (body !== "Todos") params.set("body", body);
    if (budget !== "Todos") params.set("budget", budget);
    if (fuel !== "Todos") params.set("fuel", fuel);
    if (transmission !== "Todas") params.set("transmission", transmission);
    router.push(`/ofertas?${params.toString()}`);
  };

  return (
    <div className="finder">
      <div className="finder-command">
        <span>Encuentra tu renting</span>
        <strong>Perfil, coche y cuota. PRISMA confirma después la operación.</strong>
      </div>

      <div className="finder-tabs" role="tablist" aria-label="Tipo de cliente">
        {["Particular", "Autónomo", "Empresa"].map((item) => (
          <button type="button" key={item} className={type === item ? "active" : ""} onClick={() => setType(item)} role="tab" aria-selected={type === item}>{item}</button>
        ))}
      </div>

      <div className="finder-form">
        <label className="field">
          <span>Tipo</span>
          <select value={body} onChange={(event) => setBody(event.target.value)}>
            {bodies.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Cuota</span>
          <select value={budget} onChange={(event) => setBudget(event.target.value)}>
            <option value="Todos">Cualquiera</option><option value="300">Hasta 300 €</option><option value="450">300–450 €</option><option value="451">Más de 450 €</option>
          </select>
        </label>
        <label className="field">
          <span>Combustible</span>
          <select value={fuel} onChange={(event) => setFuel(event.target.value)}>
            {fuels.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Cambio</span>
          <select value={transmission} onChange={(event) => setTransmission(event.target.value)}>
            {transmissions.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <button type="button" className="finder-submit" onClick={submit}>Ver coches</button>
      </div>
    </div>
  );
}
