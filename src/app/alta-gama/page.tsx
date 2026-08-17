import Link from "next/link";
import { ArrowUpRight, Check, WhatsAppMark } from "@/components/Icons";

const premiumOffers = [
  { brand: "Porsche", model: "Cayenne", price: "1.454 €", meta: "SUV Grande · Automático" },
  { brand: "Porsche", model: "911", price: "2.406 €", meta: "Deportivo · Oferta de referencia" },
  { brand: "Aston Martin", model: "Vantage", price: "2.200 €", meta: "Gran turismo · Oferta de referencia" },
];

const brands = ["Aston Martin", "Audi", "Bentley", "BMW", "Ferrari", "Lamborghini", "Land Rover", "Lexus", "Maserati", "Mercedes-Benz", "Porsche", "Rolls-Royce"];

export default function AltaGamaPage() {
  const whatsapp = `https://wa.me/34699242581?text=${encodeURIComponent("Hola, estoy viendo el concepto de Alta Gama. Busco una propuesta de renting premium y me gustaría que me asesoraseis de forma personalizada.")}`;

  return (
    <main className="ag-page">
      <header className="ag-header">
        <div className="ag-shell ag-nav">
          <Link href="/alta-gama" className="ag-logo">ALTA GAMA</Link>
          <nav>
            <a href="#seleccion">Selección</a>
            <a href="#marcas">Marcas</a>
            <a href={whatsapp} target="_blank" rel="noreferrer">Solicitar propuesta</a>
            <Link href="/">PRISMA ↗</Link>
          </nav>
        </div>
      </header>

      <section className="ag-hero">
        <div className="ag-hero-photo" aria-hidden="true" />
        <div className="ag-hero-shade" />
        <div className="ag-shell ag-hero-content">
          <span>Renting de alta gama · Grupo PRISMA</span>
          <h1>El coche que<br /><em>sí querías.</em></h1>
          <div className="ag-hero-footer">
            <p>Una experiencia de marca separada para operaciones premium, conectada al mismo sistema comercial y backoffice de PRISMA.</p>
            <a href="#seleccion">Ver selección <ArrowUpRight /></a>
          </div>
        </div>
      </section>

      <section className="ag-offers" id="seleccion">
        <div className="ag-shell">
          <div className="ag-section-index">01 / Selección actual</div>
          {premiumOffers.map((offer, index) => (
            <article className="ag-offer-row" key={`${offer.brand}-${offer.model}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><small>{offer.brand}</small><h2>{offer.model}</h2></div>
              <p>{offer.meta}</p>
              <div className="ag-offer-price"><small>Desde</small><strong>{offer.price}</strong><span>+ IVA / mes</span></div>
              <a href={whatsapp} target="_blank" rel="noreferrer" aria-label={`Solicitar información sobre ${offer.brand} ${offer.model}`}><ArrowUpRight /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="ag-brand-room" id="marcas">
        <div className="ag-shell ag-brand-room-grid">
          <div className="ag-brand-room-statement">
            <span>02 / Marcas</span>
            <strong>No necesitas cien filtros si ya sabes qué te representa.</strong>
          </div>
          <div className="ag-brand-list">
            {brands.map((brand) => <span key={brand}>{brand}</span>)}
          </div>
        </div>
      </section>

      <section className="ag-service-line">
        <div className="ag-shell ag-service-grid">
          <div><Check /><span>Seguro</span></div>
          <div><Check /><span>Gestión, impuestos e ITV</span></div>
          <div><Check /><span>Mantenimiento y averías</span></div>
          <div><Check /><span>Asistencia en carretera</span></div>
        </div>
      </section>

      <section className="ag-private-brief">
        <div className="ag-shell ag-private-grid">
          <div>
            <span>03 / Private brief</span>
            <h2>Dinos el coche. Nosotros buscamos la operación.</h2>
          </div>
          <a href={whatsapp} target="_blank" rel="noreferrer" className="ag-private-cta">
            <WhatsAppMark />
            <span>Solicitar propuesta privada</span>
            <ArrowUpRight />
          </a>
        </div>
      </section>

      <footer className="ag-footer">
        <div className="ag-shell">
          <span>ALTA GAMA · Grupo PRISMA</span>
          <span>Paseo Imperial 8, 1A · Madrid</span>
          <a href="tel:+34699242581">699 24 25 81</a>
        </div>
      </footer>
    </main>
  );
}
