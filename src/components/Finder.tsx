"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Finder() {
  const [type, setType] = useState("Particular");
  const [body, setBody] = useState("Todos");
  const [budget, setBudget] = useState("Todos");
  const [fuel, setFuel] = useState("Todos");
  const router = useRouter();

  const submit = () => {
    const params = new URLSearchParams();
    params.set("cliente", type.toLowerCase());
    if (body !== "Todos") params.set("body", body);
    if (budget !== "Todos") params.set("budget", budget);
    if (fuel !== "Todos") params.set("fuel", fuel);
    router.push(`/ofertas?${params.toString()}`);
  };

  return (
    <div className="finder">
      <div className="finder-command">
        <span>PRISMA Finder</span>
        <strong>Filtra lo suficiente para empezar.</strong>
      </div>

      <div className="finder-tabs" role="tablist" aria-label="Tipo de cliente">
        {["Particular", "Autónomo", "Empresa"].map((item) => (
          <button type="button" key={item} className={type === item ? "active" : ""} onClick={() => setType(item)} role="tab" aria-selected={type === item}>{item}</button>
        ))}
      </div>

      <div className="finder-form">
        <label className="field">
          <span>Formato</span>
          <select value={body} onChange={(event) => setBody(event.target.value)}>
            <option>Todos</option><option>SUV</option><option>Urbano</option>
          </select>
        </label>
        <label className="field">
          <span>Cuota</span>
          <select value={budget} onChange={(event) => setBudget(event.target.value)}>
            <option value="Todos">Cualquiera</option><option value="300">Hasta 300 €</option><option value="450">300–450 €</option><option value="451">Más de 450 €</option>
          </select>
        </label>
        <label className="field">
          <span>Motor</span>
          <select value={fuel} onChange={(event) => setFuel(event.target.value)}>
            <option>Todos</option><option>Gasolina</option><option>Híbrido</option>
          </select>
        </label>
        <button type="button" className="finder-submit" onClick={submit}>Mostrar coches</button>
      </div>
    </div>
  );
}
