import Link from "next/link";
import OriginalVehicleCard from "@/components/original/OriginalVehicleCard";
import { OriginalFooter, OriginalHeader } from "@/components/original/OriginalChrome";
import { getOriginalPage, getProductsForProfile, type OriginalPage } from "@/lib/original-source";

export type OriginalProfileKey = "particulares" | "autonomos" | "empresas";

const config = {
  particulares: {
    sourcePath: "/renting-coches-particulares/",
    eyebrow: "Renting para particulares",
    fallbackTitle: "Renting de coches para particulares",
  },
  autonomos: {
    sourcePath: "/renting-coches-autonomos/",
    eyebrow: "Renting para autónomos",
    fallbackTitle: "Renting de coches para autónomos",
  },
  empresas: {
    sourcePath: "/renting-coches-empresas/",
    eyebrow: "Renting para empresas",
    fallbackTitle: "Renting de coches y vehículos para empresas",
  },
} as const;

function html(page?: OriginalPage) {
  return page ? (page as OriginalPage & { content_html?: string }).content_html || "" : "";
}

export default function OriginalProfileTemplate({ profile }: { profile: OriginalProfileKey }) {
  const details = config[profile];
  const page = getOriginalPage(details.sourcePath);
  const products = getProductsForProfile(profile);
  const title = page?.h1?.[0] || details.fallbackTitle;
  const content = html(page);

  return (
    <main className={`source-page source-profile-page source-profile-${profile}`}>
      <OriginalHeader />
      <section className="source-profile-hero">
        <div className="source-shell source-profile-hero-grid">
          <div><span className="source-eyebrow">{details.eyebrow}</span><h1>{title}</h1></div>
          <div>
            {page?.meta_description && <p>{page.meta_description}</p>}
            <div className="source-profile-actions"><a href="tel:+34699242581" className="source-dark-button">Hablar con PRISMA</a><Link href="/ofertas-de-renting/">Ver todas las ofertas</Link></div>
          </div>
        </div>
      </section>

      <section className="source-profile-catalog">
        <div className="source-shell">
          <div className="source-section-heading">
            <span>Ofertas del perfil original</span>
            <h2>{products.length ? `${products.length} vehículos asociados a ${profile}.` : `Vehículos para ${profile}.`}</h2>
            <p>La selección se obtiene de las relaciones y taxonomías de la web original, no de una lista manual compartida entre perfiles.</p>
          </div>
          {products.length ? (
            <div className="source-vehicle-grid source-profile-vehicle-grid">{products.map((product) => <OriginalVehicleCard product={product} key={product.path} />)}</div>
          ) : (
            <div className="source-migration-pending"><strong>Inventario de vehículos en proceso de importación.</strong><span>La ruta y el contenido editorial ya están preparados para recibir la asociación completa desde PRISMA.</span></div>
          )}
        </div>
      </section>

      <section className="source-shell source-profile-original-content">
        {content ? <div className="source-content-flow" dangerouslySetInnerHTML={{ __html: content }} /> : page?.body_text ? <div className="source-content-fallback"><p>{page.body_text}</p></div> : null}
      </section>
      <OriginalFooter />
    </main>
  );
}
