"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "@/components/Icons";

const needs = [
  {
    id: "inmediata",
    label: "Lo necesito ya",
    title: "Entrega inmediata",
    metric: "Stock sujeto a disponibilidad",
    copy: "Cuando el plazo manda, lo primero es ver unidades que pueden moverse rápido, no leer una explicación sobre renting.",
    href: "/modalidades/entrega-inmediata",
    image: "https://prismarenting.com/wp-content/uploads/2022/02/renting-hyundai-i20.webp",
    vehicle: "HYUNDAI i20",
    price: "310 €/mes + IVA",
  },
  {
    id: "alta-gama",
    label: "Quiero algo especial",
    title: "Alta gama",
    metric: "Selección premium",
    copy: "Una experiencia separada para coches de altas prestaciones y lujo, con el producto por delante de la explicación.",
    href: "/alta-gama",
    image: "https://prismarenting.com/wp-content/uploads/2021/11/renting-bmw-x5-1.webp",
    vehicle: "BMW X5",
    price: "1.040 €/mes + IVA",
  },
  {
    id: "flexible",
    label: "No quiero permanencia larga",
    title: "Renting flexible",
    metric: "Uso por meses",
    copy: "Para necesidades temporales, cambios de proyecto o movilidad inmediata: primero disponibilidad, después condiciones.",
    href: "/modalidades/flexible",
    image: "https://prismarenting.com/wp-content/uploads/2021/09/renting-fiat-500-sport-1-1.webp",
    vehicle: "FIAT 500",
    price: "Modalidad flexible a consultar",
  },
];

export default function RentingNeedNavigator() {
  const [activeId, setActiveId] = useState(needs[0].id);
  const active = needs.find((item) => item.id === activeId) ?? needs[0];

  return (
    <section className="need-navigator" aria-labelledby="need-title">
      <div className="shell need-navigator-shell">
        <div className="need-index">
          <span className="need-index-label">¿Qué necesitas ahora?</span>
          <h2 id="need-title">Tres accesos que PRISMA ya considera prioritarios.</h2>
          <div className="need-tabs" role="tablist" aria-label="Necesidad de renting">
            {needs.map((item, index) => (
              <button
                type="button"
                key={item.id}
                className={activeId === item.id ? "active" : ""}
                onClick={() => setActiveId(item.id)}
                role="tab"
                aria-selected={activeId === item.id}
              >
                <span>0{index + 1}</span>
                <strong>{item.label}</strong>
                <small>{item.title}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="need-stage" role="tabpanel">
          <div className="need-stage-visual">
            <Image src={active.image} alt={active.vehicle} fill sizes="(max-width: 900px) 100vw, 55vw" priority={false} />
            <div className="need-stage-watermark">{active.title}</div>
          </div>
          <div className="need-stage-data">
            <div>
              <span>{active.metric}</span>
              <strong>{active.vehicle}</strong>
              <small>{active.price}</small>
            </div>
            <p>{active.copy}</p>
            <Link href={active.href}>Explorar {active.title.toLowerCase()} <ArrowUpRight /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
