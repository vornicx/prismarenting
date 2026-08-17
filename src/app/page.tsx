import Link from "next/link";
import Advisor from "@/components/Advisor";
import Finder from "@/components/Finder";
import Header from "@/components/Header";
import VehicleCard from "@/components/VehicleCard";
import { ArrowUpRight, Check, Spark } from "@/components/Icons";
import { vehicles } from "@/data/vehicles";

export default function Home() {
  return (
    <main>
      <Header />
      <section className="hero shell">
        <div className="hero-copy">
          <span className="eyebrow"><Spark /> Renting, bien elegido</span>
          <h1>Tu próximo coche.<br/><span>La mejor oferta de renting.</span></h1>
          <p>Comparamos ofertas de distintos operadores para encontrar el vehículo y las condiciones que encajan contigo, seas particular, autónomo o empresa.</p>
          <div className="hero-actions">
            <Link href="/ofertas" className="button dark">Ver ofertas <ArrowUpRight /></Link>
            <a href="#asesor" className="text-link">Hablar con un asesor</a>
          </div>
          <div className="trust-row">
            <span><Check /> Sin entrada</span>
            <span><Check /> Cuota fija</span>
            <span><Check /> Todo incluido</span>
          </div>
        </div>
        <div className="hero-media">
          <div className="hero-photo" aria-label="Vehículo premium en carretera" />
          <div className="floating-offer">
            <span>Oferta destacada</span>
            <strong>Desde 299 €<small>/mes + IVA</small></strong>
            <p>Seguro, mantenimiento e impuestos incluidos.</p>
          </div>
        </div>
      </section>

      <section className="finder-wrap shell">
        <Finder />
      </section>

      <section className="shell section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Selección PRISMA</span>
            <h2>Ofertas que merecen la pena.</h2>
          </div>
          <Link href="/ofertas" className="text-link">Ver todas las ofertas <ArrowUpRight /></Link>
        </div>
        <div className="vehicle-grid">
          {vehicles.slice(0, 3).map((vehicle) => <VehicleCard vehicle={vehicle} key={vehicle.slug} />)}
        </div>
      </section>

      <section className="contrast-section">
        <div className="shell contrast-grid">
          <div className="contrast-copy">
            <span className="eyebrow light">No somos un concesionario</span>
            <h2>Comparamos.<br/>Tú decides.</h2>
            <p>PRISMA trabaja con diferentes compañías de renting. Nuestro trabajo es entender qué necesitas y encontrar una combinación competitiva de coche, cuota, kilómetros y plazo.</p>
          </div>
          <div className="steps">
            <article><span>01</span><div><h3>Cuéntanos qué buscas</h3><p>Uso, presupuesto, kilómetros y cuándo necesitas el coche.</p></div></article>
            <article><span>02</span><div><h3>Buscamos alternativas</h3><p>Contrastamos ofertas y condiciones entre operadores.</p></div></article>
            <article><span>03</span><div><h3>Te acompañamos</h3><p>Un asesor te ayuda hasta la contratación y entrega.</p></div></article>
          </div>
        </div>
      </section>

      <section className="shell section split-section">
        <div className="editorial-image" />
        <div className="editorial-copy">
          <span className="eyebrow">Grupo PRISMA</span>
          <h2>Más de 25 años alrededor del automóvil.</h2>
          <p>Experiencia, conocimiento del sector y un modelo que prioriza el asesoramiento frente a la venta rápida. Renting para particulares, profesionales y flotas.</p>
          <div className="stats">
            <div><strong>25+</strong><span>años en automoción</span></div>
            <div><strong>3</strong><span>perfiles de cliente</span></div>
            <div><strong>1</strong><span>asesor a tu lado</span></div>
          </div>
          <Link href="/ofertas" className="button outline">Explorar catálogo</Link>
        </div>
      </section>

      <Advisor />

      <footer className="footer">
        <div className="shell footer-inner">
          <div><div className="brand inverse">PRISMA<span>RENTING</span></div><p>Tu renting, bien elegido.</p></div>
          <div className="footer-links"><Link href="/ofertas">Ofertas</Link><a href="#asesor">Asesor</a><Link href="/control">PRISMA Control</Link></div>
          <small>Concepto comercial de alta fidelidad · Archic</small>
        </div>
      </footer>
    </main>
  );
}
