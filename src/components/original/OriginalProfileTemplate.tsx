import Image from "next/image";
import Link from "next/link";
import OriginalCatalogClient from "@/components/original/OriginalCatalogClient";
import { OriginalFooter, OriginalHeader } from "@/components/original/OriginalChrome";
import { getOriginalPage, getProductsForProfile } from "@/lib/original-source";
import { prepareOriginalHtml } from "@/lib/source-html";

export type OriginalProfileKey = "particulares" | "autonomos" | "empresas";

const config = {
  particulares: {
    sourcePath: "/renting-coches-particulares/",
    eyebrow: "Renting para particulares",
    title: "Tu próximo coche no debería empezar por una única operadora.",
    intro: "Compara alternativas, entiende la cuota y deja que PRISMA te acompañe en la operación que mejor encaje con tu uso y presupuesto.",
    cues: ["Comparación entre compañías", "Cuota y condiciones visibles", "Asesoramiento durante la operación"],
  },
  autonomos: {
    sourcePath: "/renting-coches-autonomos/",
    eyebrow: "Renting para autónomos",
    title: "Movilidad que sigue el ritmo de tu actividad.",
    intro: "Turismos, SUV, comerciales y distintas modalidades para una necesidad que puede cambiar con tu negocio. PRISMA estudia el contexto antes de orientar la operación.",
    cues: ["Distintos tipos de vehículo", "Plazos y kilometraje según necesidad", "Acompañamiento especializado"],
  },
  empresas: {
    sourcePath: "/renting-coches-empresas/",
    eyebrow: "Renting para empresas",
    title: "Más criterio para decidir coche, operación y flota.",
    intro: "Una entrada clara al catálogo de empresa, con distintas compañías de renting y apoyo para ordenar la búsqueda antes de pasar la operación a estudio.",
    cues: ["Catálogo multioperador", "Búsqueda por uso y presupuesto", "Soporte durante estudio y contratación"],
  },
} as const;

export default function OriginalProfileTemplate({ profile }: { profile: OriginalProfileKey }) {
  const details = config[profile];
  const page = getOriginalPage(details.sourcePath);
  const products = getProductsForProfile(profile);
  const content = prepareOriginalHtml(page?.content_html || "");
  const heroProduct = [...products].filter((product) => product.images[0]).sort((a, b) => (a.price ?? Number.POSITIVE_INFINITY) - (b.price ?? Number.POSITIVE_INFINITY))[0];

  return (
    <main className={`prisma-page prisma-profile-page prisma-profile-${profile}`}>
      <OriginalHeader />

      <section className="prisma-profile-hero">
        <div className="prisma-shell prisma-profile-hero-grid">
          <div className="prisma-profile-copy">
            <span className="prisma-kicker">{details.eyebrow}</span>
            <h1>{details.title}</h1>
            <p>{details.intro}</p>
            <div className="prisma-profile-actions">
              <a className="prisma-button prisma-button-dark" href="tel:+34699242581">Hablar con PRISMA</a>
              <a className="prisma-text-link" href="#catalogo-perfil">Ver {products.length} vehículos <span>↓</span></a>
            </div>
            <div className="prisma-profile-cues">{details.cues.map((cue, index) => <div key={cue}><span>0{index + 1}</span><strong>{cue}</strong></div>)}</div>
          </div>

          {heroProduct && (
            <Link href={heroProduct.path} className="prisma-profile-featured-car">
              <div className="prisma-profile-featured-meta"><span>Una oferta de este perfil</span><i>Ver ficha ↗</i></div>
              <div className="prisma-profile-featured-image">{heroProduct.images[0] && <Image src={heroProduct.images[0].src} alt={heroProduct.images[0].alt || heroProduct.name} fill priority sizes="(max-width: 900px) 100vw, 48vw" />}</div>
              <div className="prisma-profile-featured-foot"><div><small>{heroProduct.categories[0] || "Renting"}</small><strong>{heroProduct.name}</strong></div><div><small>Desde</small><strong>{heroProduct.price !== null ? `${heroProduct.price.toLocaleString("es-ES")} €` : "Consultar"}</strong>{heroProduct.price !== null && <em>/mes + IVA</em>}</div></div>
            </Link>
          )}
        </div>
      </section>

      <section className="prisma-profile-context">
        <div className="prisma-shell prisma-profile-context-grid">
          <div><span>{products.length}</span><strong>vehículos activos asociados a {profile}</strong></div>
          <p>La selección no es una demo ni una lista común para los tres perfiles: proviene de las asociaciones y taxonomías migradas del catálogo original.</p>
          <Link href="/contacto/">Pedir una búsqueda a medida ↗</Link>
        </div>
      </section>

      <section className="prisma-profile-catalog" id="catalogo-perfil">
        <div className="prisma-shell">
          <div className="prisma-section-heading prisma-section-heading-split">
            <div><span>Catálogo para {profile}</span><h2>Filtra sin salir de tu contexto.</h2></div>
            <p>Busca por marca, tipo de coche, cuota, combustible, cambio, kilometraje y los atributos disponibles en el inventario real.</p>
          </div>
          <OriginalCatalogClient products={products} />
        </div>
      </section>

      {(content || page?.body_text) && (
        <section className="prisma-profile-guide">
          <div className="prisma-shell prisma-profile-guide-grid">
            <aside><span>Guía completa</span><h2>Todo lo que PRISMA explica sobre renting para {profile}.</h2><p>Conservamos el contenido informativo de la web original, pero lo separamos del catálogo para que la decisión de coche siga siendo lo primero.</p></aside>
            <div className="prisma-rich-content">{content ? <div dangerouslySetInnerHTML={{ __html: content }} /> : <p>{page?.body_text}</p>}</div>
          </div>
        </section>
      )}

      <OriginalFooter />
    </main>
  );
}
