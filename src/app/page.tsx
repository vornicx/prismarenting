import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Finder from "@/components/Finder";
import HeroVehicleStage from "@/components/HeroVehicleStage";
import ProfileRentingSwitch from "@/components/ProfileRentingSwitch";
import { ArrowUpRight, Check } from "@/components/Icons";
import { vehicles } from "@/data/vehicles";

const paths = [
  {
    eyebrow: "Necesito coche pronto",
    title: "Entrega inmediata",
    copy: "Empieza por las unidades con disponibilidad prioritaria y confirma con PRISMA el plazo real de entrega.",
    href: "/modalidades/entrega-inmediata",
    image: "https://prismarenting.com/wp-content/uploads/2022/02/renting-hyundai-i20.webp",
  },
  {
    eyebrow: "Necesito flexibilidad",
    title: "Renting flexible",
    copy: "Soluciones por meses para necesidades temporales o cambiantes, con condiciones y disponibilidad a confirmar.",
    href: "/modalidades/flexible",
    image: "https://prismarenting.com/wp-content/uploads/2021/09/renting-fiat-500-sport-1-1.webp",
  },
  {
    eyebrow: "Busco algo especial",
    title: "Alta Gama",
    copy: "Marcas, configuraciones y operaciones premium con un tratamiento más personal y una búsqueda específica.",
    href: "/alta-gama",
    image: "https://prismarenting.com/wp-content/uploads/2021/11/renting-bmw-x5-1.webp",
  },
] as const;

const brands = ["Audi", "BMW", "Mercedes-Benz", "Porsche", "Toyota", "Peugeot", "Hyundai", "Nissan", "Kia", "Volkswagen", "Lexus", "Land Rover"] as const;

const services = [
  ["Seguro", "Incluido según oferta"],
  ["Mantenimiento", "Incluido según oferta"],
  ["Impuestos e ITV", "Gestionados dentro de la operación"],
  ["Asistencia", "Según condiciones del operador"],
  ["Entrada", "Depende de la oferta final"],
] as const;

const process = [
  ["01", "Elige", "Cuéntanos qué coche, uso y presupuesto tienes en mente."],
  ["02", "Comparamos", "PRISMA contrasta alternativas, operador y disponibilidad."],
  ["03", "Estudio", "Se prepara la documentación necesaria para la operación."],
  ["04", "Firma", "Con la operación aprobada, se formaliza el contrato."],
  ["05", "Entrega", "Coordinamos la entrega para que empieces a disfrutarlo."],
] as const;

const featuredOffers = [vehicles[1], vehicles[0], vehicles[2]].filter(Boolean);

export default function Home() {
  return (
    <main className="home-focus">
      <section className="home-hero">
        <Header theme="dark" />
        <div className="shell home-hero-shell">
          <HeroVehicleStage vehicles={vehicles} />
        </div>
      </section>

      <section className="shell home-search" aria-label="Buscar ofertas de renting">
        <Finder />
      </section>

      <section className="home-offer-showcase" aria-labelledby="home-offers-title">
        <div className="shell home-section-head home-section-head-wide">
          <div>
            <span>Ofertas de renting</span>
            <h2 id="home-offers-title">Empieza por un coche que ya puedes valorar.</h2>
          </div>
          <div className="home-section-sidecopy">
            <p>Cuota, kilometraje y plazo visibles desde el principio. PRISMA confirma después disponibilidad, operador y condiciones finales.</p>
            <Link href="/ofertas">Ver catálogo completo <ArrowUpRight /></Link>
          </div>
        </div>

        <div className="shell home-offer-grid">
          {featuredOffers.map((vehicle, index) => (
            <article className={`home-offer-card ${index === 0 ? "home-offer-card-featured" : ""}`} key={vehicle.slug}>
              <Link href={`/ofertas/${vehicle.slug}`} className="home-offer-visual" aria-label={`Ver ${vehicle.name}`}>
                <div className="home-offer-index">0{index + 1}</div>
                <Image src={vehicle.image} alt={vehicle.name} fill sizes={index === 0 ? "(max-width: 900px) 100vw, 58vw" : "(max-width: 900px) 100vw, 30vw"} />
                <div className="home-offer-badge">{vehicle.badge || vehicle.body}</div>
              </Link>
              <div className="home-offer-meta">
                <div>
                  <span>{vehicle.brand}</span>
                  <h3>{vehicle.name}</h3>
                  <p>{vehicle.highlight || `${vehicle.body} · ${vehicle.fuel}`}</p>
                </div>
                <div className="home-offer-price">
                  <span>Desde</span>
                  <strong>{vehicle.price.toLocaleString("es-ES")} €</strong>
                  <small>/mes + IVA</small>
                </div>
              </div>
              <div className="home-offer-conditions">
                <span>{vehicle.term} meses</span>
                <span>{vehicle.km.toLocaleString("es-ES")} km/año</span>
                <span>{vehicle.transmission}</span>
                <Link href={`/ofertas/${vehicle.slug}`}>Ver oferta <ArrowUpRight /></Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-paths" aria-labelledby="home-paths-title">
        <div className="shell home-section-head home-paths-head">
          <div>
            <span>Una necesidad, una ruta</span>
            <h2 id="home-paths-title">El renting cambia según lo que necesitas ahora.</h2>
          </div>
        </div>
        <div className="shell home-path-grid">
          {paths.map((path, index) => (
            <Link href={path.href} className="home-path-card" key={path.title}>
              <div className="home-path-number">0{index + 1}</div>
              <div className="home-path-copy">
                <span>{path.eyebrow}</span>
                <h3>{path.title}</h3>
                <p>{path.copy}</p>
                <strong>Explorar <ArrowUpRight /></strong>
              </div>
              <div className="home-path-car">
                <Image src={path.image} alt="" fill sizes="(max-width: 900px) 100vw, 31vw" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-authority" aria-labelledby="authority-title">
        <div className="shell home-authority-grid">
          <div className="home-authority-statement">
            <span>Grupo PRISMA · Especialistas en automoción</span>
            <h2 id="authority-title"><strong>25+</strong> años entendiendo coches, personas y operaciones.</h2>
          </div>
          <div className="home-authority-copy">
            <p>PRISMA Renting trabaja para particulares, autónomos y empresas y compara alternativas entre distintos operadores. El objetivo no es enseñarte más coches: es ayudarte a llegar a una operación que tenga sentido para tu uso.</p>
            <div className="home-authority-facts">
              <div><Check /><span>Comparación multioperador</span></div>
              <div><Check /><span>Asesoramiento personal</span></div>
              <div><Check /><span>Tradicional, flexible, ECO, alta gama y a medida</span></div>
            </div>
            <a href="tel:+34699242581" className="home-authority-call">Hablar con un asesor · 699 24 25 81 <ArrowUpRight /></a>
          </div>
        </div>
        <div className="shell home-brand-universe">
          <span>Marcas que forman parte del universo de búsqueda de PRISMA</span>
          <div>{brands.map((brand) => <strong key={brand}>{brand}</strong>)}</div>
        </div>
      </section>

      <ProfileRentingSwitch />

      <section className="home-services" aria-labelledby="home-services-title">
        <div className="shell home-services-head">
          <span>Qué suele formar parte de la cuota</span>
          <h2 id="home-services-title">El coche es la parte visible. La operación es todo lo demás.</h2>
        </div>
        <div className="shell home-services-grid">
          {services.map(([label, value], index) => (
            <div key={label}>
              <span>0{index + 1}</span>
              <strong>{label}</strong>
              <p>{value}</p>
            </div>
          ))}
        </div>
        <div className="shell home-services-note">Servicios y condiciones sujetos a la oferta y operador finalmente confirmados por PRISMA.</div>
      </section>

      <section className="home-process" aria-labelledby="home-process-title">
        <div className="shell home-section-head home-process-head">
          <div>
            <span>Cómo se contrata</span>
            <h2 id="home-process-title">Del primer filtro a las llaves, sin perder el contexto.</h2>
          </div>
        </div>
        <div className="shell home-process-grid">
          {process.map(([number, title, copy]) => (
            <div className="home-process-step" key={number}>
              <span>{number}</span>
              <strong>{title}</strong>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-closing" aria-labelledby="home-closing-title">
        <div className="shell home-closing-inner">
          <div className="home-closing-copy">
            <span>Renting a medida</span>
            <h2 id="home-closing-title">Dinos el coche. Nosotros buscamos la operación.</h2>
            <p>Modelo, uso, presupuesto, kilometraje y plazo. Con eso PRISMA puede contrastar alternativas y ayudarte a encontrar una propuesta que encaje.</p>
            <div>
              <Link href="/modalidades/a-medida" className="button button-light">Preparar solicitud <ArrowUpRight /></Link>
              <a href="tel:+34699242581">699 24 25 81</a>
            </div>
          </div>
          <div className="home-closing-visual" aria-hidden="true">
            <div className="home-closing-word">PRISMA</div>
            <Image src="https://prismarenting.com/wp-content/uploads/2021/11/renting-bmw-x5-1.webp" alt="" fill sizes="(max-width: 900px) 100vw, 48vw" />
          </div>
        </div>
      </section>

      <footer className="footer home-footer">
        <div className="shell footer-top">
          <div className="footer-logo" aria-label="PRISMA Renting" />
          <div><span>Perfiles</span><p><Link href="/perfil/particulares">Particulares</Link><br /><Link href="/perfil/autonomos">Autónomos</Link><br /><Link href="/perfil/empresas">Empresas</Link></p></div>
          <div><span>Modalidades</span><p><Link href="/modalidades/entrega-inmediata">Entrega inmediata</Link><br /><Link href="/modalidades/flexible">Flexible</Link><br /><Link href="/alta-gama">Alta Gama</Link></p></div>
          <div><span>Contacto</span><p><a href="tel:+34699242581">699 24 25 81</a><br /><a href="mailto:hola@prismarenting.com">hola@prismarenting.com</a><br />Paseo Imperial 8, 1A · Madrid</p></div>
        </div>
        <div className="shell footer-bottom"><span>© 2026 Grupo PRISMA, Especialistas en Automoción, S.L.</span><div><Link href="/ofertas">Ofertas</Link><Link href="/favoritos">Favoritos</Link><Link href="/comparar">Comparar</Link><a href="https://prismarenting.com/blog/" target="_blank" rel="noreferrer">Blog</a></div></div>
      </footer>
    </main>
  );
}
