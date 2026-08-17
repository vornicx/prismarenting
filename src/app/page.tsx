import Link from "next/link";
import Advisor from "@/components/Advisor";
import Finder from "@/components/Finder";
import Header from "@/components/Header";
import VehicleCard from "@/components/VehicleCard";
import { ArrowUpRight } from "@/components/Icons";
import { vehicles } from "@/data/vehicles";

export default function Home() {
  return (
    <main>
      <section className="hero-stage">
        <Header />
        <div className="hero-atmosphere" />
        <div className="hero-product" aria-hidden="true" />
        <div className="hero-gradient" />
        <div className="shell hero-content">
          <p className="hero-overline">PRISMA Renting · Multimarca · Multiooperador</p>
          <h1>El coche correcto.<br/><span>La oferta correcta.</span></h1>
          <p className="hero-lead">Comparamos opciones entre distintas compañías de renting para encontrar una operación que encaje de verdad contigo.</p>
          <div className="hero-actions">
            <Link href="/ofertas" className="button button-light">Explorar ofertas <ArrowUpRight /></Link>
            <Link href="/#asesor" className="hero-link">Hablar con un asesor</Link>
          </div>
        </div>
        <div className="shell hero-model-line">
          <div><span>Destacado</span><strong>BMW X5</strong></div>
          <div><span>Desde</span><strong>1.040 €/mes + IVA</strong></div>
          <div><span>Modalidad</span><strong>Renting sin entrada</strong></div>
          <Link href="/ofertas/bmw-x5" aria-label="Ver oferta BMW X5"><ArrowUpRight /></Link>
        </div>
      </section>

      <div className="finder-dock shell"><Finder /></div>

      <section className="brand-rail" aria-label="Marcas disponibles">
        <div className="shell brand-rail-inner"><span>BMW</span><span>Mercedes-Benz</span><span>Audi</span><span>Volkswagen</span><span>CUPRA</span><span>Porsche</span><span>Hyundai</span></div>
      </section>

      <section className="shell section selection-section">
        <div className="section-head premium-head">
          <div><span className="eyebrow">Selección PRISMA</span><h2>Coches que merece la pena mirar.</h2></div>
          <Link href="/ofertas" className="text-link">Ver todas <ArrowUpRight /></Link>
        </div>
        <div className="vehicle-grid home-grid">{vehicles.slice(0, 3).map((vehicle) => <VehicleCard vehicle={vehicle} key={vehicle.slug} />)}</div>
      </section>

      <section className="experience-story" id="experiencia">
        <div className="experience-image" aria-hidden="true" />
        <div className="experience-overlay" />
        <div className="shell experience-content">
          <span className="eyebrow eyebrow-light">Una posición distinta</span>
          <h2>No vendemos una marca.<br/>Buscamos tu mejor operación.</h2>
          <p>PRISMA trabaja con diferentes compañías de renting. Eso nos permite comparar coche, cuota, kilometraje, plazo y servicios desde el lado del cliente.</p>
          <div className="experience-facts"><span>01 · Cuéntanos qué necesitas</span><span>02 · Contrastamos alternativas</span><span>03 · Te acompañamos hasta la entrega</span></div>
        </div>
      </section>

      <section className="shell section profiles" id="perfiles">
        <div className="profiles-intro"><span className="eyebrow">Una solución para cada uso</span><h2>El mismo nivel de exigencia.<br/>Tres formas de necesitar un coche.</h2></div>
        <div className="profile-list">
          <article><span>01</span><h3>Particulares</h3><p>Cuota clara, sin entrada y con los servicios esenciales incluidos.</p><Link href="/#asesor">Encontrar mi coche <ArrowUpRight /></Link></article>
          <article><span>02</span><h3>Autónomos</h3><p>Movilidad profesional con una operación adaptada a uso, kilómetros y fiscalidad.</p><Link href="/#asesor">Hablar con un asesor <ArrowUpRight /></Link></article>
          <article><span>03</span><h3>Empresas</h3><p>Desde una unidad hasta necesidades de flota, con seguimiento comercial centralizado.</p><Link href="/#asesor">Soluciones para empresa <ArrowUpRight /></Link></article>
        </div>
      </section>

      <section className="heritage-band">
        <div className="shell heritage-grid"><strong>25+</strong><div><span className="eyebrow eyebrow-light">Grupo PRISMA</span><h2>Años dentro del sector de la automoción.</h2><p>Conocimiento del mercado, acuerdos con operadores y asesoramiento personal para convertir una oferta de renting en una decisión mejor tomada.</p></div></div>
      </section>

      <Advisor />

      <footer className="footer">
        <div className="shell footer-top"><div className="footer-logo" aria-label="PRISMA Renting" /><div><span>Madrid</span><p>Paseo Imperial 8, 1A<br/>28005 Madrid</p></div><div><span>Contacto</span><p><a href="tel:+34699242581">699 24 25 81</a><br/><a href="mailto:hola@prismarenting.com">hola@prismarenting.com</a></p></div></div>
        <div className="shell footer-bottom"><span>© 2026 Grupo PRISMA, Especialistas en Automoción, S.L.</span><div><Link href="/ofertas">Ofertas</Link><Link href="/control">PRISMA Control</Link></div></div>
      </footer>
    </main>
  );
}
