"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Finder() {
  const [type, setType] = useState("Particular");
  const router = useRouter();
  return <div className="finder">
    <div className="finder-tabs">{["Particular","Autónomo","Empresa"].map(t=><button key={t} className={type===t?"active":""} onClick={()=>setType(t)}>{t}</button>)}</div>
    <div className="finder-form">
      <div className="field"><label>Qué buscas</label><select><option>Cualquier tipo</option><option>SUV</option><option>Compacto</option><option>Familiar</option></select></div>
      <div className="field"><label>Cuota mensual</label><select><option>Cualquier presupuesto</option><option>Hasta 350 €</option><option>350–500 €</option><option>Más de 500 €</option></select></div>
      <div className="field"><label>Combustible</label><select><option>Todos</option><option>Híbrido</option><option>Eléctrico</option><option>Gasolina</option></select></div>
      <button className="finder-submit" onClick={()=>router.push(`/ofertas?cliente=${type.toLowerCase()}`)}>Encontrar mi coche</button>
    </div>
  </div>
}
