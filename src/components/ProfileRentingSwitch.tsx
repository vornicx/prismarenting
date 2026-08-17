"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "@/components/Icons";

const profiles = [
  {
    id: "particulares",
    tab: "Particulares",
    eyebrow: "Uso personal",
    lead: "Quiero elegir coche y saber qué operación estoy valorando.",
    copy: "PRISMA parte de tu presupuesto, kilometraje y tipo de coche para comparar alternativas sin convertir la búsqueda en una lista interminable.",
    proof: ["Cuota y plazo de referencia", "Servicios incluidos según oferta", "Disponibilidad y operador confirmados antes de contratar"],
    action: "Explorar renting para particulares",
  },
  {
    id: "autonomos",
    tab: "Autónomos",
    eyebrow: "Actividad profesional",
    lead: "Necesito un coche que tenga sentido para cómo trabajo.",
    copy: "El uso profesional cambia el kilometraje, la documentación y el tipo de operación. PRISMA ordena esas variables antes de comparar propuestas.",
    proof: ["Uso y kilometraje profesional", "Documentación de la operación", "Alternativas entre distintos operadores"],
    action: "Explorar renting para autónomos",
  },
  {
    id: "empresas",
    tab: "Empresas",
    eyebrow: "Movilidad de empresa",
    lead: "Necesito una o varias unidades y un interlocutor que ordene la operación.",
    copy: "Desde una unidad hasta necesidades de flota, PRISMA centraliza la búsqueda y mantiene el contexto comercial de cada vehículo y usuario.",
    proof: ["Una unidad o varias necesidades", "Interlocución comercial centralizada", "Seguimiento de alternativas y disponibilidad"],
    action: "Explorar renting para empresas",
  },
];

export default function ProfileRentingSwitch() {
  const [activeId, setActiveId] = useState(profiles[0].id);
  const active = profiles.find((item) => item.id === activeId) ?? profiles[0];

  return (
    <section className="profile-switch" id="perfiles" aria-labelledby="profile-switch-title">
      <div className="shell profile-switch-shell">
        <div className="profile-switch-head">
          <span>Una operación distinta para cada perfil</span>
          <h2 id="profile-switch-title">El mismo coche puede necesitar una lógica distinta.</h2>
          <p>Particular, autónomo o empresa: PRISMA cambia el punto de partida sin cambiar la claridad de la decisión.</p>
        </div>

        <div className="profile-switch-nav" role="tablist" aria-label="Perfil de cliente">
          {profiles.map((profile, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={active.id === profile.id}
              className={active.id === profile.id ? "active" : ""}
              onClick={() => setActiveId(profile.id)}
              key={profile.id}
            >
              <span>0{index + 1}</span>
              <strong>{profile.tab}</strong>
              <small>{profile.eyebrow}</small>
            </button>
          ))}
        </div>

        <div className="profile-switch-stage" role="tabpanel">
          <div className="profile-switch-statement">
            <span>{active.eyebrow}</span>
            <h3>{active.lead}</h3>
            <p>{active.copy}</p>
            <Link href={`/perfil/${active.id}`} className="profile-switch-action">{active.action} <ArrowUpRight /></Link>
          </div>

          <div className="profile-switch-details">
            <span>En qué se fija PRISMA</span>
            <div>
              {active.proof.map((item, index) => (
                <p key={item}><small>0{index + 1}</small><strong>{item}</strong></p>
              ))}
            </div>
          </div>

          <div className="profile-switch-mark" aria-hidden="true">
            <span>PRISMA / {active.tab}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
