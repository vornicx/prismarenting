import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";
import { vehicles } from "@/data/vehicles";

const heroOffer = {
  brand: "SEAT",
  name: "Ibiza",
  price: 219,
  image: "https://prismarenting.com/wp-content/uploads/2022/04/renting-seat-ibiza-gasolina.webp",
  facts: ["Manual", "Gasolina", "Urbano", "95 CV"],
};

const routes = [
  {
    number: "01",
    eyebrow: "Cuando el tiempo manda",
    title: "Entrega inmediata",
    copy: "Empieza por vehículos con disponibilidad prioritaria y confirma con PRISMA el plazo real de entrega.",
    href: "/modalidades/entrega-inmediata",
  },
  {
    number: "02",
    eyebrow: "Cuando no quieres atarte",
    title: "Renting flexible",
    copy: "Soluciones para necesidades temporales o cambiantes, con duración y condiciones a confirmar en cada operación.",
    href: "/modalidades/flexible",
  },
  {
    number: "03",
    eyebrow: "Cuando buscas otra categoría",
    title: "Alta Gama",
    copy: "Una búsqueda específica para marcas, configuraciones y operaciones premium con asesoramiento personal.",
    href: "/alta-gama",
  },
  {
    number: "04",
    eyebrow: "Cuando ya sabes qué quieres",
    title: "A medida",
    copy: "Modelo, color, equipamiento, kilometraje y uso: PRISMA contrasta alternativas para preparar una propuesta.",
    href: "/modalidades/a-medida",
  },
] as const;

const profiles = [
  {
    number: "01",
    title: "Particulares",
    copy: "Una cuota clara, un coche que encaje con tu día a día y un asesor que te ayude a comparar la operación.",
    href: "/perfil/particulares",
  },
  {
    number: "02",
    title: "Autónomos",
    copy: "Movilidad adaptada al uso profesional, kilometraje y documentación necesaria para estudiar la operación.",
    href: "/perfil/autonomos",
  },
  {
    number: "03",
    title: "Empresas",
    copy: "Desde una unidad hasta necesidades de flota, con un interlocutor que centraliza alternativas y seguimiento.",
    href: "/perfil/empresas",
  },
] as const;

const included = [
  ["Seguro", "Según oferta"],
  ["Mantenimiento", "Según oferta"],
  ["Impuestos e ITV", "Gestionados"],
  ["Asistencia", "Según operador"],
  ["Neumáticos", "Según condiciones"],
] as const;

export default function Home() {
  const leadVehicle = vehicles.find((vehicle) => vehicle.slug === "hyundai-i20") ?? vehicles[0];
  const supportingVehicles = vehicles.filter((vehicle) => vehicle.slug !== leadVehicle.slug).slice(0, 4);

  return (
    <main className="pr-home">
      <section className="pr-home-hero">
        <header className="pr-home-header">
          <div className="pr-home-shell pr-home-nav">
            <Link href="/" className="pr-home-logo" aria-label="PRISMA Renting">
              <span aria-hidden="true" />
            </Link>

            <nav className="pr-home-desktop-nav" aria-label="Navegación principal">
              <Link href="/ofertas">Ofertas</Link>
              <Link href="/perfil/particulares">Particulares</Link>
              <Link href="/perfil/autonomos">Autónomos</Link>
              <Link href="/perfil/empresas">Empresas</Link>
              <Link href="/alta-gama">Alta Gama</Link>
            </nav>

            <a className="pr-home-advisor" href="tel:+34699242581">
              <span>Asesor PRISMA</span>
              <strong>699 24 25 81</strong>
            </a>

            <details className="pr-home-mobile-nav">
              <summary aria-label="Abrir navegación">Menú</summary>
              <div>
                <Link href="/ofertas">Ofertas</Link>
                <Link href="/perfil/particulares">Particulares</Link>
                <Link href="/perfil/autonomos">Autónomos</Link>
                <Link href="/perfil/empresas">Empresas</Link>
                <Link href="/modalidades/entrega-inmediata">Entrega inmediata</Link>
                <Link href="/modalidades/flexible">Flexible</Link>
                <Link href="/alta-gama">Alta Gama</Link>
                <a href="tel:+34699242581">699 24 25 81</a>
              </div>
            </details>
          </div>
        </header>

        <div className="pr-home-shell pr-home-hero-grid">
          <div className="pr-home-hero-copy">
            <div className="pr-home-kicker">
              <span>Renting multioperador</span>
              <i />
              <span>Madrid · España</span>
            </div>
            <h1>
              Elige coche.
              <span>PRISMA compara la operación.</span>
            </h1>
            <p>
              Ofertas de distintas compañías de renting para particulares, autónomos y empresas, con asesoramiento personal antes de formalizar la operación.
            </p>
            <div className="pr-home-hero-actions">
              <Link href="/ofertas" className="pr-home-button pr-home-button-dark">Ver ofertas <ArrowUpRight /></Link>
              <a href="tel:+34699242581" className="pr-home-text-link">Hablar con un asesor <ArrowUpRight /></a>
            </div>
            <div className="pr-home-hero-proof" aria-label="Datos de PRISMA Renting">
              <div><strong>25+</strong><span>años en automoción</span></div>
              <div><strong>Multioperador</strong><span>alternativas entre compañías</span></div>
              <div><strong>3 perfiles</strong><span>particulares · autónomos · empresas</span></div>
            </div>
          </div>

          <div className="pr-home-hero-product">
            <div className="pr-home-hero-product-top">
              <span>Oferta destacada</span>
              <strong>Unidades limitadas · consulta disponibilidad</strong>
            </div>
            <div className="pr-home-hero-watermark" aria-hidden="true">IBIZA</div>
            <div className="pr-home-hero-car">
              <Image src={heroOffer.image} alt="SEAT Ibiza de renting en PRISMA" fill priority sizes="(max-width: 900px) 100vw, 54vw" />
            </div>
            <div className="pr-home-hero-product-bottom">
              <div>
                <span>{heroOffer.brand}</span>
                <h2>{heroOffer.name}</h2>
              </div>
              <div className="pr-home-hero-price">
                <span>Desde</span>
                <strong>{heroOffer.price} €</strong>
                <small>/mes + IVA</small>
              </div>
              <div className="pr-home-hero-facts">
                {heroOffer.facts.map((fact) => <span key={fact}>{fact}</span>)}
              </div>
              <Link href="/ofertas" className="pr-home-product-link">Explorar catálogo <ArrowUpRight /></Link>
            </div>
          </div>
        </div>

        <div className="pr-home-shell pr-home-search-wrap">
          <form className="pr-home-search" action="/ofertas" method="get">
            <div className="pr-home-search-title">
              <span>Encuentra tu punto de partida</span>
              <strong>Filtra. PRISMA contrasta después la operación.</strong>
            </div>
            <label>
              <span>Perfil</span>
              <select name="cliente" defaultValue="Particular">
                <option>Particular</option>
                <option>Autónomo</option>
                <option>Empresa</option>
              </select>
            </label>
            <label>
              <span>Tipo</span>
              <select name="body" defaultValue="Todos">
                <option>Todos</option>
                <option>Urbano</option>
                <option>SUV</option>
              </select>
            </label>
            <label>
              <span>Cuota</span>
              <select name="budget" defaultValue="Todos">
                <option value="Todos">Cualquiera</option>
                <option value="300">Hasta 300 €</option>
                <option value="450">300–450 €</option>
                <option value="451">Más de 450 €</option>
              </select>
            </label>
            <label>
              <span>Combustible</span>
              <select name="fuel" defaultValue="Todos">
                <option>Todos</option>
                <option>Gasolina</option>
                <option>Híbrido</option>
              </select>
            </label>
            <button type="submit">Ver coches <ArrowUpRight /></button>
          </form>
        </div>
      </section>

      <section className="pr-home-offers" aria-labelledby="pr-home-offers-title">
        <div className="pr-home-shell">
          <div className="pr-home-section-heading">
            <span>Ofertas de renting</span>
            <h2 id="pr-home-offers-title">Menos escaparate. Más información para decidir.</h2>
            <p>Precio, formato y disponibilidad visibles antes de entrar en la ficha. Las condiciones finales se confirman con PRISMA.</p>
          </div>

          <article className="pr-home-lead-offer">
            <div className="pr-home-lead-visual">
              <span className="pr-home-offer-number">01</span>
              <div aria-hidden="true" className="pr-home-offer-ghost">i20</div>
              <Image src={leadVehicle.image} alt={leadVehicle.name} fill sizes="(max-width: 900px) 100vw, 60vw" />
            </div>
            <div className="pr-home-lead-copy">
              <div>
                <span>{leadVehicle.brand} · {leadVehicle.body}</span>
                <h3>{leadVehicle.name}</h3>
                <p>{leadVehicle.highlight}</p>
              </div>
              <div className="pr-home-lead-price">
                <span>Desde</span>
                <strong>{leadVehicle.price.toLocaleString("es-ES")} €</strong>
                <small>/mes + IVA</small>
              </div>
              <div className="pr-home-lead-facts">
                <span>{leadVehicle.fuel}</span>
                <span>{leadVehicle.transmission}</span>
                <span>{leadVehicle.term} meses</span>
                <span>{leadVehicle.km.toLocaleString("es-ES")} km/año</span>
              </div>
              <div className="pr-home-lead-status"><i />{leadVehicle.availabilityNote}</div>
              <Link href={`/ofertas/${leadVehicle.slug}`} className="pr-home-button pr-home-button-dark">Ver oferta <ArrowUpRight /></Link>
            </div>
          </article>

          <div className="pr-home-offer-list">
            {supportingVehicles.map((vehicle, index) => (
              <Link href={`/ofertas/${vehicle.slug}`} className="pr-home-offer-row" key={vehicle.slug}>
                <span className="pr-home-offer-row-number">0{index + 2}</span>
                <div className="pr-home-offer-row-car">
                  <Image src={vehicle.image} alt="" fill sizes="150px" />
                </div>
                <div className="pr-home-offer-row-name">
                  <small>{vehicle.brand}</small>
                  <strong>{vehicle.name}</strong>
                </div>
                <div className="pr-home-offer-row-meta"><span>{vehicle.body}</span><span>{vehicle.fuel}</span><span>{vehicle.transmission}</span></div>
                <div className="pr-home-offer-row-price"><small>Desde</small><strong>{vehicle.price.toLocaleString("es-ES")} €</strong><span>/mes + IVA</span></div>
                <ArrowUpRight />
              </Link>
            ))}
          </div>

          <div className="pr-home-offers-end"><Link href="/ofertas">Abrir todas las ofertas <ArrowUpRight /></Link></div>
        </div>
      </section>

      <section className="pr-home-authority" aria-labelledby="pr-home-authority-title">
        <div className="pr-home-shell pr-home-authority-grid">
          <div className="pr-home-authority-number"><strong>25+</strong><span>años en automoción</span></div>
          <div className="pr-home-authority-copy">
            <span>Grupo PRISMA · Especialistas en automoción</span>
            <h2 id="pr-home-authority-title">La ventaja no es tener más coches. Es saber comparar mejor.</h2>
            <p>PRISMA Renting unifica ofertas de distintas compañías y acompaña al cliente para encontrar una operación adecuada a sus necesidades, gustos y uso del vehículo.</p>
            <div className="pr-home-authority-lines">
              <div><span>01</span><strong>Multioperador</strong><small>Alternativas entre compañías de renting.</small></div>
              <div><span>02</span><strong>Asesor personal</strong><small>Una persona acompaña la operación.</small></div>
              <div><span>03</span><strong>A medida</strong><small>Si no está en catálogo, se puede solicitar otra propuesta.</small></div>
            </div>
          </div>
        </div>
      </section>

      <section className="pr-home-routes" aria-labelledby="pr-home-routes-title">
        <div className="pr-home-shell">
          <div className="pr-home-section-heading pr-home-section-heading-compact">
            <span>Modalidades</span>
            <h2 id="pr-home-routes-title">Empieza por la necesidad, no por una etiqueta.</h2>
          </div>
          <div className="pr-home-route-list">
            {routes.map((route) => (
              <Link href={route.href} key={route.number} className="pr-home-route-row">
                <span>{route.number}</span>
                <div><small>{route.eyebrow}</small><strong>{route.title}</strong></div>
                <p>{route.copy}</p>
                <ArrowUpRight />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pr-home-profiles" aria-labelledby="pr-home-profiles-title">
        <div className="pr-home-shell">
          <div className="pr-home-section-heading pr-home-section-heading-compact">
            <span>Para quién</span>
            <h2 id="pr-home-profiles-title">El mismo coche no significa la misma operación.</h2>
          </div>
          <div className="pr-home-profile-list">
            {profiles.map((profile) => (
              <Link href={profile.href} className="pr-home-profile-row" key={profile.number}>
                <span>{profile.number}</span>
                <strong>{profile.title}</strong>
                <p>{profile.copy}</p>
                <div>Ver solución <ArrowUpRight /></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pr-home-included" aria-labelledby="pr-home-included-title">
        <div className="pr-home-shell">
          <div className="pr-home-included-head">
            <span>La cuota</span>
            <h2 id="pr-home-included-title">El coche es una parte. Los servicios completan la operación.</h2>
          </div>
          <div className="pr-home-included-grid">
            {included.map(([label, value], index) => (
              <div key={label}><span>0{index + 1}</span><strong>{label}</strong><small>{value}</small></div>
            ))}
          </div>
          <p className="pr-home-disclaimer">Servicios concretos sujetos al operador y a la oferta final confirmada por PRISMA.</p>
        </div>
      </section>

      <section className="pr-home-closing">
        <div className="pr-home-shell pr-home-closing-grid">
          <div className="pr-home-closing-copy">
            <span>Renting a medida</span>
            <h2>Dinos el coche. PRISMA busca la operación.</h2>
            <p>Si el modelo, color o equipamiento que quieres no aparece en catálogo, puedes solicitar una propuesta personalizada.</p>
            <div>
              <Link href="/modalidades/a-medida" className="pr-home-button pr-home-button-light">Preparar solicitud <ArrowUpRight /></Link>
              <a href="tel:+34699242581">699 24 25 81</a>
            </div>
          </div>
          <div className="pr-home-closing-car" aria-hidden="true">
            <span>PRISMA</span>
            <Image src="https://prismarenting.com/wp-content/uploads/2021/11/renting-bmw-x5-1.webp" alt="" fill sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      <footer className="pr-home-footer">
        <div className="pr-home-shell pr-home-footer-grid">
          <div className="pr-home-footer-brand"><span className="pr-home-footer-logo" aria-label="PRISMA Renting" /><p>Grupo PRISMA · Especialistas en automoción.</p></div>
          <div><span>Renting</span><Link href="/ofertas">Ofertas</Link><Link href="/modalidades/entrega-inmediata">Entrega inmediata</Link><Link href="/modalidades/flexible">Flexible</Link><Link href="/alta-gama">Alta Gama</Link></div>
          <div><span>Perfiles</span><Link href="/perfil/particulares">Particulares</Link><Link href="/perfil/autonomos">Autónomos</Link><Link href="/perfil/empresas">Empresas</Link></div>
          <div><span>Contacto</span><a href="tel:+34699242581">699 24 25 81</a><a href="mailto:hola@prismarenting.com">hola@prismarenting.com</a><p>Paseo Imperial 8, 1A · Madrid</p></div>
        </div>
        <div className="pr-home-shell pr-home-footer-bottom"><span>© 2026 Grupo PRISMA, Especialistas en Automoción, S.L.</span><div><a href="https://prismarenting.com/politica-de-privacidad/">Privacidad</a><a href="https://prismarenting.com/aviso-legal/">Aviso legal</a><a href="https://prismarenting.com/politica-de-cookies/">Cookies</a></div></div>
      </footer>
    </main>
  );
}
