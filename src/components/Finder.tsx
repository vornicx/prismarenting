"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
      <div className="finder-topline">
        <span>Encuentra tu renting</span>
        <span className="finder-helper">Sin entrada · cuota fija · asesoramiento personal</span>
      </div>
      <div className="finder-tabs" role="tablist" aria-label="Tipo de cliente">
        {["Particular", "Autónomo", "Empresa"].map((item) => (
          <button key={item} className={type === item ? "active" : ""} onClick={() => setType(item)}>{item}</button>
        ))}
      </div>
      <div className="finder-form">
        <label className="field"><span>Qué buscas</span><select value={body} onChange={(event) => setBody(event.target.value)}><option>Todos</option><option>SUV</option><option>Urbano</option><option>Furgoneta</option></select></label>
        <label className="field"><span>Cuota mensual</span><select value={budget} onChange={(event) => setBudget(event.target.value)}><option value="Todos">Cualquier presupuesto</option><option value="350">Hasta 350 €</option><option value="500">350–500 €</option><option value="501">Más de 500 €</option></select></label>
        <label className="field"><span>Combustible</span><select value={fuel} onChange={(event) => setFuel(event.target.value)}><option>Todos</option><option>Gasolina</option><option>Híbrido</option><option>Diésel</option></select></label>
        <button className="finder-submit" onClick={submit}>Ver coches</button>
      </div>
    </div>
  );
}
