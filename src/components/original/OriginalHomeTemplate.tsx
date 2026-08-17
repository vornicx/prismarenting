import Image from "next/image";
import Link from "next/link";
import OriginalVehicleCard from "@/components/original/OriginalVehicleCard";
import { OriginalFooter, OriginalHeader } from "@/components/original/OriginalChrome";
import { getCurrentProducts, getOriginalPage, getProductsForProfile } from "@/lib/original-source";

function byPrice<T extends { price: number | null }>(items: T[]) {
  return [...items].sort((a, b) => (a.price ?? Number.POSITIVE_INFINITY) - (b.price ?? Number.POSITIVE_INFINITY));
}

export default function OriginalHomeTemplate() {
  const products = getCurrentProducts();
  const sorted = byPrice(products);
  const hero = products.find((product) => /seat\s+ibiza/i.test(product.name)) || sorted[0];
  const featured = sorted.filter((product) => product.path !== hero?.path).slice(0, 5);
  const premium = [...products].filter((product) => product.images[0]).sort((a, b) => (b.price ?? 0) - (a.price ?? 0))[0];
  const flexibleVisual = sorted.find((product) => product.images[0] && (product.price ?? 0) >= 300) || sorted[2];
  const immediateVisual = sorted.find((product) => product.images[0] && product.path !== hero?.path) || sorted[1];

  const profileCounts = {
    particulares: getProductsForProfile("particulares").length,
    autonomos: getProductsForProfile("autonomos").length,
    empresas: getProductsForProfile("empresas").length,
  };

  const guides = [
    getOriginalPage("/como-funciona-el-renting-de-prisma-renting/"),
    getOriginalPage("/coche-de-renting-mas-barato/"),
    getOriginalPage("/el-renting-de-coches-y-sus-ventajas/"),
  ].filter((page): page is NonNullable<typeof page> => Boolean(page));

  return (
    <main className="prisma-page prisma-home">
      <OriginalHeader />

      <section className="prisma-home-hero">
        <div className="prisma-shell prisma-home-hero-grid">
          <div className="prisma-home-hero-copy">
            <span className="prisma-kicker">Grupo PRISMA · Especialistas en automoción</span>
            <h1>Tu próximo coche, con más opciones sobre la mesa.</h1>
            <p>Renting para particulares, autónomos y empresas. Comparamos alternativas entre distintas compañías y te acompañamos hasta encontrar una operación que encaje contigo.</p>
            <div className="prisma-hero-actions">
              <Link className="prisma-button prisma-button-dark" href="/ofertas-de-renting/">Explorar {products.length} ofertas</Link>
              <Link className="prisma-text-link" href="/contacto/">Hablar con un especialista <span>↗</span></Link>
            </div>
          </div>

          {hero && (
            <div className="prisma-hero-product">
              <div className="prisma-hero-product-head">
                <span>Oferta destacada</span>
                <Link href={hero.path}>Ver ficha completa ↗</Link>
              </div>
              <Link href={hero.path} className="prisma-hero-car">
                {hero.images[0] ? <Image src={hero.images[0].src} alt={hero.images[0].alt || hero.name} fill priority sizes="(max-width: 900px) 100vw, 52vw" /> : <div className="prisma-car-placeholder">PRISMA</div>}
              </Link>
              <div className="prisma-hero-product-foot">
                <div><span>{hero.categories[0] || "Renting"}</span><strong>{hero.name}</strong></div>
                <div className="prisma-hero-price"><span>Desde</span><strong>{hero.price !== null ? `${hero.price.toLocaleString("es-ES")} €` : "Consultar"}</strong>{hero.price !== null && <small>/mes + IVA</small>}</div>
              </div>
            </div>
          )}
        </div>

        <div className="prisma-shell prisma-hero-finder">
          <div className="prisma-hero-finder-label"><span>Empieza por lo que ya sabes</span><strong>¿Qué necesitas?</strong></div>
          <div className="prisma-hero-finder-links">
            <Link href="/renting-coches-particulares/"><small>Perfil</small><span>Particular</span></Link>
            <Link href="/renting-coches-autonomos/"><small>Perfil</small><span>Autónomo</span></Link>
            <Link href="/renting-coches-empresas/"><small>Perfil</small><span>Empresa</span></Link>
            <Link href="/ofertas-de-renting/?max=300"><small>Cuota</small><span>Hasta 300 €</span></Link>
            <Link href="/ofertas-de-renting/?q=SUV"><small>Formato</small><span>SUV</span></Link>
            <Link className="prisma-hero-finder-all" href="/ofertas-de-renting/"><span>Ver catálogo</span><i>→</i></Link>
          </div>
        </div>
      </section>

      <section className="prisma-home-proof">
        <div className="prisma-shell prisma-proof-grid">
          <div><strong>25+</strong><span>años en automoción</span></div>
          <div><strong>Multioperador</strong><span>alternativas entre compañías de renting</span></div>
          <div><strong>{products.length}</strong><span>ofertas activas importadas del catálogo actual</span></div>
          <div><strong>3 perfiles</strong><span>particulares, autónomos y empresas</span></div>
        </div>
      </section>

      <section className="prisma-home-offers prisma-section">
        <div className="prisma-shell">
          <div className="prisma-section-heading prisma-section-heading-split">
            <div><span>Selección PRISMA</span><h2>El coche primero. La letra pequeña, visible.</h2></div>
            <div><p>Cuota, tipo de vehículo y características esenciales antes de entrar en la ficha. Menos fricción para comparar, más contexto para decidir.</p><Link href="/ofertas-de-renting/">Ver todo el catálogo ↗</Link></div>
          </div>

          {hero && (
            <div className="prisma-offer-layout">
              <OriginalVehicleCard product={hero} variant="feature" />
              <div className="prisma-offer-stack">
                {featured.slice(0, 4).map((product) => <OriginalVehicleCard product={product} variant="compact" key={product.path} />)}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="prisma-home-modalities prisma-section">
        <div className="prisma-shell">
          <div className="prisma-section-heading">
            <span>No todos buscan el mismo renting</span>
            <h2>Tres necesidades. Tres caminos distintos.</h2>
          </div>
          <div className="prisma-modality-grid">
            <Link href="/renting-entrega-inmediata/" className="prisma-modality-card prisma-modality-primary">
              <div className="prisma-modality-copy"><span>01 · Entrega inmediata</span><h3>Cuando el tiempo pesa tanto como la cuota.</h3><p>Consulta las operaciones orientadas a disponibilidad y entrega rápida.</p><i>Explorar →</i></div>
              {immediateVisual?.images[0] && <div className="prisma-modality-image"><Image src={immediateVisual.images[0].src} alt={immediateVisual.images[0].alt || immediateVisual.name} fill sizes="(max-width: 800px) 100vw, 55vw" /></div>}
            </Link>
            <Link href="/renting-flexible/" className="prisma-modality-card">
              <div className="prisma-modality-copy"><span>02 · Flexible</span><h3>Menos permanencia. Más capacidad de adaptación.</h3><p>Para necesidades que no encajan bien en un contrato largo.</p><i>Ver flexible →</i></div>
              {flexibleVisual?.images[0] && <div className="prisma-modality-image"><Image src={flexibleVisual.images[0].src} alt={flexibleVisual.images[0].alt || flexibleVisual.name} fill sizes="(max-width: 800px) 100vw, 40vw" /></div>}
            </Link>
            <Link href="/alta-gama/" className="prisma-modality-card prisma-modality-dark">
              <div className="prisma-modality-copy"><span>03 · Alta gama</span><h3>Una búsqueda distinta para un coche distinto.</h3><p>Vehículos premium con asesoramiento y operación personalizada.</p><i>Entrar en Alta Gama →</i></div>
              {premium?.images[0] && <div className="prisma-modality-image"><Image src={premium.images[0].src} alt={premium.images[0].alt || premium.name} fill sizes="(max-width: 800px) 100vw, 40vw" /></div>}
            </Link>
          </div>
        </div>
      </section>

      <section className="prisma-home-types">
        <div className="prisma-shell prisma-types-grid">
          <div><span className="prisma-kicker">Busca por uso, no por menú</span><h2>¿Qué forma tiene tu próximo coche?</h2></div>
          <div className="prisma-type-links">
            {["SUV", "Urbano", "Familiar", "Furgoneta", "Automático", "Híbrido", "Eléctrico", "Premium"].map((label) => <Link href={`/ofertas-de-renting/?q=${encodeURIComponent(label)}`} key={label}><span>{label}</span><i>↗</i></Link>)}
          </div>
        </div>
      </section>

      <section className="prisma-home-profiles prisma-section">
        <div className="prisma-shell">
          <div className="prisma-section-heading prisma-section-heading-split">
            <div><span>El mismo mercado, tres contextos</span><h2>El perfil cambia la conversación.</h2></div>
            <p>PRISMA separa la búsqueda para particulares, autónomos y empresas, manteniendo el inventario real asociado a cada perfil.</p>
          </div>
          <div className="prisma-profile-rows">
            <Link href="/renting-coches-particulares/"><span>01</span><div><small>Particulares</small><strong>Quiero encontrar mi próximo coche.</strong></div><em>{profileCounts.particulares} vehículos</em><i>→</i></Link>
            <Link href="/renting-coches-autonomos/"><span>02</span><div><small>Autónomos</small><strong>Necesito movilidad que siga mi actividad.</strong></div><em>{profileCounts.autonomos} vehículos</em><i>→</i></Link>
            <Link href="/renting-coches-empresas/"><span>03</span><div><small>Empresas</small><strong>Busco una solución para negocio o flota.</strong></div><em>{profileCounts.empresas} vehículos</em><i>→</i></Link>
          </div>
        </div>
      </section>

      <section className="prisma-home-authority">
        <div className="prisma-shell prisma-authority-grid">
          <div className="prisma-authority-statement"><span>Grupo PRISMA</span><h2>No somos una única operadora. Esa es precisamente la idea.</h2></div>
          <div className="prisma-authority-copy"><p>PRISMA actúa como intermediario entre operadoras de renting y clientes finales. El valor no está solo en enseñar coches: está en estudiar la necesidad y orientar la operación.</p><Link href="/nosotros/">Conocer Grupo PRISMA ↗</Link></div>
          <div className="prisma-authority-process">
            {["Selecciona el coche", "Contacta con PRISMA", "Envía documentación", "Firma la operación", "Recoge y disfruta"].map((step, index) => <div key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></div>)}
          </div>
        </div>
      </section>

      {guides.length > 0 && (
        <section className="prisma-home-guides prisma-section">
          <div className="prisma-shell">
            <div className="prisma-section-heading prisma-section-heading-split"><div><span>Antes de firmar</span><h2>Entender el renting también forma parte del servicio.</h2></div><Link href="/blog/">Ver todas las guías ↗</Link></div>
            <div className="prisma-guide-grid">
              {guides.map((guide, index) => <Link href={guide.path} key={guide.path}><span>0{index + 1}</span><h3>{guide.h1?.[0] || guide.title.replace(/\s*[|–].*$/, "")}</h3><p>{guide.meta_description || guide.body_text?.slice(0, 150)}</p><i>Leer guía ↗</i></Link>)}
            </div>
          </div>
        </section>
      )}

      <OriginalFooter />
    </main>
  );
}
