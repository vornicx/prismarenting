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
        <div>
          <span>Encuentra tu renting</span>
          <strong>Cuatro decisiones para llegar antes a las ofertas que sí encajan.</strong>
        </div>
        <small>PRISMA confirma disponibilidad, operador y condiciones finales.</small>
      </div>

      <div className="finder-tabs" role="tablist" aria-label="Tipo de cliente">
        {["Particular", "Autónomo", "Empresa"].map((item, index) => (
          <button type="button" key={item} className={type === item ? "active" : ""} onClick={() => setType(item)} role="tab" aria-selected={type === item}>
            <span>0{index + 1}</span>{item}
          </button>
        ))}
      </div>

      <div className="finder-form">
        <label className="field">
          <span>Tipo de coche</span>
          <select aria-label="Tipo de coche" value={body} onChange={(event) => setBody(event.target.value)}>
            {bodies.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Cuota mensual</span>
          <select aria-label="Cuota mensual" value={budget} onChange={(event) => setBudget(event.target.value)}>
            <option value="Todos">Cualquier cuota</option><option value="300">Hasta 300 €</option><option value="450">300–450 €</option><option value="451">Más de 450 €</option>
          </select>
        </label>
        <label className="field">
          <span>Motor</span>
          <select aria-label="Combustible" value={fuel} onChange={(event) => setFuel(event.target.value)}>
            {fuels.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Cambio</span>
          <select aria-label="Transmisión" value={transmission} onChange={(event) => setTransmission(event.target.value)}>
            {transmissions.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <button type="button" className="finder-submit" onClick={submit}>Mostrar ofertas</button>
      </div>
    </div>
  );
}
