"use client";

import Link from "next/link";
import { useState } from "react";

type BrandData = { metrics: Array<[string, string]>; inventory: Array<[string, string, string, string]> };

const brandData: Record<"PRISMA Renting" | "Alta Gama", BrandData> = {
  "PRISMA Renting": {
    metrics: [["Ofertas publicadas", "5"], ["Leads demo", "18"], ["Por contactar", "7"], ["Comparaciones", "12"]],
    inventory: [
      ["Hyundai i20", "310 €", "Urbano", "Publicado"],
      ["Fiat 500", "253 €", "Urbano", "Publicado"],
      ["BMW X5", "1.040 €", "SUV", "Publicado"],
      ["Opel Corsa", "244 €", "Urbano", "Publicado"],
    ],
  },
  "Alta Gama": {
    metrics: [["Ofertas referencia", "3"], ["Leads demo", "6"], ["Por contactar", "2"], ["Briefs privados", "4"]],
    inventory: [
      ["Porsche Cayenne", "1.454 €", "SUV Grande", "Referencia"],
      ["Porsche 911", "2.406 €", "Deportivo", "Referencia"],
      ["Aston Martin Vantage", "2.200 €", "Gran turismo", "Referencia"],
    ],
  },
};

const leads = [
  ["Lucía Serrano", "Particular", "BMW X5", "Nuevo", "Hoy · 09:42"],
  ["Antonio Marín", "Autónomo", "Fiat 500", "Contactado", "Hoy · 08:15"],
  ["Grupo Nexo SL", "Empresa", "3 vehículos", "Propuesta", "Ayer · 17:30"],
];

export default function ControlDashboard() {
  const [brand, setBrand] = useState<keyof typeof brandData>("PRISMA Renting");
  const data = brandData[brand];

  return (
    <main className="control-page">
      <div className="control-shell">
        <aside className="control-side">
          <div className="brand inverse">PRISMA<span>CONTROL</span></div>
          <nav>
            <span className="active">Resumen</span>
            <span>Leads</span>
            <span>Inventario</span>
            <span>Clientes</span>
            <span>Analytics</span>
            <Link href="/">← Ver web</Link>
          </nav>
        </aside>

        <section className="control-main">
          <div className="control-head">
            <div>
              <div className="control-demo-badge">DEMO COMERCIAL · DATOS NO REALES</div>
              <h1>PRISMA Control</h1>
              <p>Un backoffice. Varias marcas y experiencias.</p>
            </div>
            <span className="control-button">+ Nueva oferta</span>
          </div>

          <div className="control-brand-switch" role="tablist" aria-label="Marca">
            {(Object.keys(brandData) as Array<keyof typeof brandData>).map((item) => (
              <button type="button" key={item} className={brand === item ? "active" : ""} onClick={() => setBrand(item)}>{item}</button>
            ))}
          </div>

          <div className="metric-grid">
            {data.metrics.map(([label, value]) => <article className="metric" key={label}><span>{label}</span><strong>{value}</strong></article>)}
          </div>

          <div className="control-section">
            <div className="control-section-head"><h2>Inventario · {brand}</h2><a>Gestionar ofertas →</a></div>
            <table className="lead-table">
              <thead><tr><th>Vehículo</th><th>Cuota ref.</th><th>Tipo</th><th>Estado</th></tr></thead>
              <tbody>{data.inventory.map((row) => <tr key={row[0]}><td className="lead-name">{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td><td><span className="pill">{row[3]}</span></td></tr>)}</tbody>
            </table>
          </div>

          <div className="control-section">
            <div className="control-section-head"><h2>Últimos leads demo</h2><a>Ver pipeline →</a></div>
            <table className="lead-table">
              <thead><tr><th>Cliente</th><th>Perfil</th><th>Interés</th><th>Estado</th><th>Entrada</th></tr></thead>
              <tbody>{leads.map((row) => <tr key={row[0]}><td className="lead-name">{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td><td><span className="pill">{row[3]}</span></td><td>{row[4]}</td></tr>)}</tbody>
            </table>
          </div>

          <div className="control-section">
            <div className="control-section-head"><h2>Pipeline comercial</h2><a>Pipeline completo →</a></div>
            <div className="pipeline">
              <div className="pipeline-col"><span>Nuevo · demo</span><div className="mini-lead">Lucía Serrano<br/>BMW X5</div></div>
              <div className="pipeline-col"><span>Contactado · demo</span><div className="mini-lead">Antonio Marín<br/>Fiat 500</div></div>
              <div className="pipeline-col"><span>Propuesta · demo</span><div className="mini-lead">Grupo Nexo SL<br/>3 vehículos</div></div>
              <div className="pipeline-col"><span>Documentación · demo</span><div className="mini-lead">Miguel Rojas<br/>Pendiente</div></div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
