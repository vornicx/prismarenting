"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Check } from "@/components/Icons";

const profiles = [
  {
    id: "particulares",
    tab: "Particulares",
    lead: "Quiero una cuota clara y olvidarme de los gastos del coche.",
    proof: ["Cuota mensual definida", "Servicios asociados incluidos según oferta", "Sin necesidad de comprar el vehículo"],
    action: "Ver renting para particulares",
  },
  {
    id: "autonomos",
    tab: "Autónomos",
    lead: "Necesito movilidad para trabajar y una operación adaptada a mi actividad.",
    proof: ["Oferta según uso y kilometraje", "Documentación orientada a actividad profesional", "Asesoramiento sobre la operación y sus condiciones"],
    action: "Ver renting para autónomos",
  },
  {
    id: "empresas",
    tab: "Empresas",
    lead: "Necesito uno o varios vehículos y un interlocutor que centralice la operación.",
    proof: ["Necesidades de una unidad o flota", "Seguimiento comercial centralizado", "Alternativas entre distintos operadores"],
    action: "Ver renting para empresas",
  },
];

export default function ProfileRentingSwitch() {
  const [activeId, setActiveId] = useState(profiles[0].id);
  const active = profiles.find((item) => item.id === activeId) ?? profiles[0];

  return (
    <section className="profile-switch" id="perfiles" aria-labelledby="profile-switch-title">
      <div className="shell profile-switch-shell">
        <div className="profile-switch-rail">
          <span>¿Para quién es el renting?</span>
          <div role="tablist" aria-label="Perfil de cliente">
            {profiles.map((profile) => (
              <button
                type="button"
                role="tab"
                aria-selected={active.id === profile.id}
                className={active.id === profile.id ? "active" : ""}
                onClick={() => setActiveId(profile.id)}
                key={profile.id}
              >
                {profile.tab}
              </button>
            ))}
          </div>
        </div>

        <div className="profile-switch-stage" role="tabpanel">
          <div className="profile-question">
            <span>{active.tab}</span>
            <h2 id="profile-switch-title">{active.lead}</h2>
          </div>
          <div className="profile-proof">
            {active.proof.map((item) => <div key={item}><Check /><span>{item}</span></div>)}
          </div>
          <Link href={`/perfil/${active.id}`} className="profile-switch-action">{active.action} <ArrowUpRight /></Link>
        </div>
      </div>
    </section>
  );
}
