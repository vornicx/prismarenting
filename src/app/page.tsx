import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Finder from "@/components/Finder";
import HeroVehicleStage from "@/components/HeroVehicleStage";
import ProfileRentingSwitch from "@/components/ProfileRentingSwitch";
import RentingNeedNavigator from "@/components/RentingNeedNavigator";
import VehicleCard from "@/components/VehicleCard";
import { ArrowUpRight, Check } from "@/components/Icons";
import { vehicles } from "@/data/vehicles";

const secondaryModalities = [
  ["ECO", "Híbrido · PHEV · Eléctrico", "/modalidades/eco"],
  ["Tradicional", "Cuota fija · largo plazo", "/modalidades/tradicional"],
  ["Segunda mano", "Más acceso · misma lógica de servicio", "/modalidades/segunda-mano"],
  ["A medida", "Modelo · color · equipamiento", "/modalidades/a-medida"],
  ["Motos", "Movilidad sobre dos ruedas", "/modalidades/motos"],
] as const;

const vehicleTypes = [
  ["SUV", "suv"],
  ["Furgonetas", "furgonetas"],
  ["Familiar", "familiar"],
  ["7 plazas", "7-plazas"],
  ["9 plazas", "9-plazas"],
  ["Deportivos", "deportivos"],
  ["Descapotables", "descapotables"],
  ["Pick Up", "pick-up"],
] as const;

const brands = ["Audi", "BMW", "Mercedes-Benz", "Porsche", "Toyota", "Peugeot", "Hyundai", "Nissan", "Kia", "Volkswagen", "Lexus", "Land Rover"] as const;

const process = [
  ["01", "Elige", "Busca, filtra y compara el coche que encaja contigo."],
  ["02", "Contrasta", "PRISMA revisa disponibilidad, operador y condiciones contigo."],
  ["03", "Documentación", "Se prepara la documentación necesaria para el estudio."],
  ["04", "Firma", "Con la operación aprobada, se formaliza el contrato de renting."],
  ["05", "Recoge", "PRISMA coordina la entrega para que empieces a disfrutarlo."],
] as const;

export default function Home() {
  return (
    <main className="home-focus">
      <section className="hero-stage">
        <Header />
        <div className="shell hero-stage-shell"><HeroVehicleStage vehicles={vehicles} /></div>
      </section>

      <div className="finder-dock shell"><Finder /></div>

      <section className="shell trust-system home-trust" aria-label="Por qué PRISMA Renting">
        <div className="trust-major"><strong>25+</strong><span>años en automoción</span></div>
        <div className="trust-cell"><span>Multioperador</span><strong>Alternativas entre distintos operadores.</strong></div>
        <div className="trust-cell"><span>Asesoramiento</span><strong>Un especialista acompaña cada operación.</strong></div>
        <div className="trust-cell"><span>Para quién</span><strong>Particulares · Autónomos · Empresas.</strong></div>
        <div className="trust-cell"><span>Contacto directo</span><strong><a href="tel:+34699242581">699 24 25 81</a></strong></div>
      </section>

      <section className="offer-deck shell home-offers" aria-labelledby="featured-offers-title">
        <div className="offer-deck-topline">
          <div><span>Ofertas de renting destacadas</span><strong id="featured-offers-title">El coche primero.</strong></div>
          <Link href="/ofertas">Ver todas las ofertas <ArrowUpRight /></Link>
        </div>
        <div className="offer-rail">{vehicles.map((vehicle) => <VehicleCard key={vehicle.slug} vehicle={vehicle} mode="rail" />)}</div>
      </section>

      <section className="vehicle-taxonomy" aria-label="Explorar renting por tipo de vehículo">
        <div className="shell vehicle-taxonomy-inner">
          <span>Explora por tipo</span>
          <div>
            {vehicleTypes.map(([label, slug]) => <Link href={`/tipo/${slug}`} key={slug}>{label} <ArrowUpRight /></Link>)}
          </div>
        </div>
      </section>

      <RentingNeedNavigator />

      <section className="secondary-routes" aria-labelledby="secondary-routes-title">
        <div className="shell secondary-routes-shell">
          <div className="secondary-routes-intro">
            <span>Más formas de renting</span>
            <h2 id="secondary-routes-title">La operación se adapta al uso, no al revés.</h2>
          </div>
          <div className="secondary-routes-list">
            {secondaryModalities.map(([name, meta, href], index) => (
              <Link href={href} key={name}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{name}</strong>
                <small>{meta}</small>
                <ArrowUpRight />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="prisma-authority" aria-labelledby="authority-title">
        <div className="shell prisma-authority-grid">
          <div className="authority-visual">
            <div className="authority-years"><strong>25+</strong><span>años de experiencia en automoción</span></div>
            <Image src="https://prismarenting.com/wp-content/uploads/2021/11/renting-bmw-x5-1.webp" alt="BMW X5 de renting en PRISMA" fill sizes="(max-width: 900px) 100vw, 48vw" />
          </div>
          <div className="authority-copy">
            <span>Grupo PRISMA · Especialistas en automoción</span>
            <h2 id="authority-title">No se trata solo de encontrar coche. Se trata de encontrar una operación que encaje.</h2>
            <p>PRISMA Renting forma parte de Grupo PRISMA y trabaja con distintos operadores. El equipo compara alternativas y acompaña la contratación según vehículo, presupuesto, kilometraje, plazo y perfil.</p>
            <div className="authority-facts">
              <div><Check /><span>Comparación multioperador</span></div>
              <div><Check /><span>Asesoramiento personal</span></div>
              <div><Check /><span>Renting tradicional, flexible y a medida</span></div>
            </div>
            <Link href="/ofertas" className="authority-action">Explorar ofertas <ArrowUpRight /></Link>
          </div>
        </div>
        <div className="shell authority-brand-line">
          <span>Una búsqueda abierta a las marcas que necesita cada operación</span>
          <div>{brands.map((brand) => <strong key={brand}>{brand}</strong>)}</div>
        </div>
      </section>

      <ProfileRentingSwitch />

      <section className="renting-console home-inclusions">
        <div className="shell renting-console-grid">
          <div className="renting-console-title"><span>Servicios habituales en la cuota</span><h2>Más control sobre el coste del coche, mes a mes.</h2></div>
          <div className="renting-inclusions">
            <div><Check /><span>Seguro</span><strong>Incluido*</strong></div>
            <div><Check /><span>Mantenimiento</span><strong>Incluido*</strong></div>
            <div><Check /><span>Impuestos e ITV</span><strong>Incluidos*</strong></div>
            <div><Check /><span>Asistencia</span><strong>Incluida*</strong></div>
            <div><Check /><span>Entrada</span><strong>Según oferta</strong></div>
          </div>
          <small>*Los servicios y condiciones concretas dependen del operador y de la oferta final confirmada por PRISMA.</small>
        </div>
      </section>

      <section className="renting-process home-process" aria-labelledby="process-title">
        <div className="shell renting-process-head"><span>Contratación</span><h2 id="process-title">De elegir el coche a recibir las llaves.</h2><a href="tel:+34699242581">Hablar con un asesor <ArrowUpRight /></a></div>
        <div className="shell renting-process-track">
          {process.map(([number, title, copy]) => <div className="renting-process-step" key={number}><span>{number}</span><strong>{title}</strong><p>{copy}</p></div>)}
        </div>
      </section>

      <section className="home-closing" aria-labelledby="home-closing-title">
        <div className="shell home-closing-grid">
          <div className="home-closing-copy">
            <span>Renting a medida</span>
            <h2 id="home-closing-title">¿Tienes claro el coche pero no encuentras la oferta?</h2>
            <p>Dinos modelo, uso, presupuesto y kilometraje. PRISMA puede contrastar alternativas y preparar una propuesta adaptada a tu operación.</p>
            <div>
              <Link href="/modalidades/a-medida" className="button button-light">Preparar solicitud <ArrowUpRight /></Link>
              <a href="tel:+34699242581" className="home-closing-phone">699 24 25 81</a>
            </div>
          </div>
          <div className="home-closing-car" aria-hidden="true">
            <Image src="https://prismarenting.com/wp-content/uploads/2022/02/renting-hyundai-i20.webp" alt="" fill sizes="(max-width: 900px) 100vw, 52vw" />
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="shell footer-top">
          <div className="footer-logo" aria-label="PRISMA Renting" />
          <div><span>Perfiles</span><p><Link href="/perfil/particulares">Particulares</Link><br /><Link href="/perfil/autonomos">Autónomos</Link><br /><Link href="/perfil/empresas">Empresas</Link></p></div>
          <div><span>Modalidades</span><p><Link href="/modalidades/entrega-inmediata">Entrega inmediata</Link><br /><Link href="/modalidades/flexible">Flexible</Link><br /><Link href="/alta-gama">Alta Gama</Link></p></div>
          <div><span>Contacto</span><p><a href="tel:+34699242581">699 24 25 81</a><br /><a href="mailto:hola@prismarenting.com">hola@prismarenting.com</a><br />Paseo Imperial 8, 1A · Madrid</p></div>
        </div>
        <div className="shell footer-bottom"><span>© 2026 Grupo PRISMA, Especialistas en Automoción, S.L.</span><div><Link href="/ofertas">Ofertas</Link><Link href="/favoritos">Favoritos</Link><Link href="/comparar">Comparar</Link><a href="https://prismarenting.com/blog/" target="_blank" rel="noreferrer">Blog</a><Link href="/control">PRISMA Control</Link></div></div>
      </footer>
    </main>
  );
}
