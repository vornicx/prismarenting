import Link from "next/link";
import Header from "@/components/Header";
import Finder from "@/components/Finder";
import HeroVehicleStage from "@/components/HeroVehicleStage";
import ProfileRentingSwitch from "@/components/ProfileRentingSwitch";
import QuickMatchLab from "@/components/QuickMatchLab";
import RentingNeedNavigator from "@/components/RentingNeedNavigator";
import VehicleCard from "@/components/VehicleCard";
import { ArrowUpRight, Check } from "@/components/Icons";
import { vehicles } from "@/data/vehicles";

const modalities = [
  ["Eco", "Híbrido · PHEV · Eléctrico", "/modalidades/eco"],
  ["Tradicional", "Cuota fija · largo plazo", "/modalidades/tradicional"],
  ["Flexible", "Movilidad por meses", "/modalidades/flexible"],
  ["Segunda mano", "Más acceso · misma lógica de servicio", "/modalidades/segunda-mano"],
  ["A medida", "Modelo · color · equipamiento", "/modalidades/a-medida"],
  ["Motos", "Movilidad sobre dos ruedas", "/modalidades/motos"],
] as const;

const vehicleTypes = [
  ["SUV", "suv"], ["Furgonetas", "furgonetas"], ["Descapotables", "descapotables"],
  ["Todoterreno", "todoterreno"], ["Alta Gama", "alta-gama"], ["Van", "van"],
  ["Deportivos", "deportivos"], ["Monovolumen", "monovolumen"], ["7 plazas", "7-plazas"],
  ["9 plazas", "9-plazas"], ["Familiar", "familiar"], ["Pick Up", "pick-up"],
] as const;

const process = [
  ["01", "Elige", "Busca, filtra, guarda o compara el coche que encaja contigo."],
  ["02", "Habla con PRISMA", "Un asesor contrasta la operación y disponibilidad real."],
  ["03", "Documentación", "Se prepara la documentación necesaria para el estudio."],
  ["04", "Firma", "Con la operación aprobada, se formaliza el contrato de renting."],
  ["05", "Recoge", "Recibes el vehículo y empiezas a disfrutarlo."],
] as const;

export default function Home() {
  return (
    <main>
      <section className="hero-stage">
        <Header />
        <div className="shell hero-stage-shell">
          <HeroVehicleStage vehicles={vehicles} />
        </div>
      </section>

      <div className="finder-dock shell"><Finder /></div>

      <section className="offer-deck shell" aria-labelledby="featured-offers-title">
        <div className="offer-deck-topline">
          <div>
            <span>Ofertas de renting destacadas</span>
            <strong id="featured-offers-title">Primero, coches.</strong>
          </div>
          <Link href="/ofertas">Ver todas las ofertas <ArrowUpRight /></Link>
        </div>
        <div className="offer-rail">
          {vehicles.map((vehicle) => <VehicleCard key={vehicle.slug} vehicle={vehicle} mode="rail" />)}
        </div>
      </section>

      <RentingNeedNavigator />

      <section className="modality-board shell" aria-labelledby="modalities-title">
        <div className="modality-board-intro">
          <span>Elige la modalidad</span>
          <h2 id="modalities-title">No todo el renting resuelve el mismo problema.</h2>
          <p>PRISMA ya separa estas formas de contratación. Aquí las convertimos en accesos claros para que el usuario se reconozca antes de pedir ayuda.</p>
        </div>
        <div className="modality-lines">
          {modalities.map(([name, meta, href], index) => (
            <Link href={href} key={name} className="modality-line">
              <span>0{index + 1}</span>
              <strong>{name}</strong>
              <small>{meta}</small>
              <ArrowUpRight />
            </Link>
          ))}
        </div>
      </section>

      <section className="vehicle-type-browser" aria-labelledby="vehicle-types-title">
        <div className="shell vehicle-type-browser-head">
          <div><span>Buscar por carrocería o uso</span><h2 id="vehicle-types-title">¿Qué forma tiene el coche que necesitas?</h2></div>
          <Link href="/ofertas">Abrir catálogo completo <ArrowUpRight /></Link>
        </div>
        <div className="vehicle-type-marquee">
          <div className="shell vehicle-type-grid">
            {vehicleTypes.map(([label, slug], index) => (
              <Link href={`/tipo/${slug}`} key={slug} className="vehicle-type-item">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{label}</strong>
                <ArrowUpRight />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ProfileRentingSwitch />

      <QuickMatchLab vehicles={vehicles} />

      <section className="renting-console">
        <div className="shell renting-console-grid">
          <div className="renting-console-title">
            <span>Servicios habituales en la cuota</span>
            <h2>El coste del coche deja de estar repartido en sorpresas.</h2>
          </div>
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

      <section className="prisma-proof shell" aria-labelledby="proof-title">
        <div className="prisma-proof-number"><strong>25+</strong><span>años en automoción</span></div>
        <div className="prisma-proof-copy">
          <span>Grupo PRISMA</span>
          <h2 id="proof-title">La plataforma tiene que transmitir el tamaño de la experiencia que ya existe detrás.</h2>
          <p>PRISMA Renting forma parte de Grupo PRISMA y trabaja desde una posición multioperador. El valor no es solo listar coches: es comparar alternativas, asesorar y acompañar la contratación.</p>
          <div className="prisma-proof-facts"><span>Multioperador</span><span>Particulares</span><span>Autónomos</span><span>Empresas</span><span>Asesor personal</span></div>
        </div>
      </section>

      <section className="renting-process" aria-labelledby="process-title">
        <div className="shell renting-process-head">
          <span>Contratación</span>
          <h2 id="process-title">Cinco pasos. Siempre visibles.</h2>
          <a href="tel:+34699242581">Hablar con un asesor <ArrowUpRight /></a>
        </div>
        <div className="shell renting-process-track">
          {process.map(([number, title, copy]) => (
            <div className="renting-process-step" key={number}>
              <span>{number}</span><strong>{title}</strong><p>{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="shell footer-top">
          <div className="footer-logo" aria-label="PRISMA Renting" />
          <div><span>Perfiles</span><p><Link href="/perfil/particulares">Particulares</Link><br /><Link href="/perfil/autonomos">Autónomos</Link><br /><Link href="/perfil/empresas">Empresas</Link></p></div>
          <div><span>Modalidades</span><p><Link href="/modalidades/entrega-inmediata">Entrega inmediata</Link><br /><Link href="/modalidades/flexible">Flexible</Link><br /><Link href="/alta-gama">Alta Gama</Link></p></div>
          <div><span>Contacto</span><p><a href="tel:+34699242581">699 24 25 81</a><br /><a href="mailto:hola@prismarenting.com">hola@prismarenting.com</a><br />Paseo Imperial 8, 1A · Madrid</p></div>
        </div>
        <div className="shell footer-bottom"><span>© 2026 Grupo PRISMA, Especialistas en Automoción, S.L.</span><div><Link href="/ofertas">Ofertas</Link><Link href="/favoritos">Favoritos</Link><Link href="/comparar">Comparar</Link><Link href="/control">PRISMA Control</Link></div></div>
      </footer>
    </main>
  );
}
