import Link from "next/link";
import OriginalVehicleCard from "@/components/original/OriginalVehicleCard";
import { OriginalFooter, OriginalHeader } from "@/components/original/OriginalChrome";
import { getProductsLinkedFromPage, type OriginalPage } from "@/lib/original-source";
import { prepareOriginalHtml } from "@/lib/source-html";

function cleanTitle(page: OriginalPage): string {
  return page.h1?.[0] || page.og_title || page.title.replace(/\s*[|–]\s*Prisma Renting.*$/i, "").trim();
}

export default function OriginalPageTemplate({ page }: { page: OriginalPage }) {
  const products = getProductsLinkedFromPage(page.path, { currentOnly: true });
  const html = prepareOriginalHtml(page.content_html || "");
  const title = cleanTitle(page);

  return (
    <main className="source-page">
      <OriginalHeader />
      <section className="source-page-hero">
        <div className="source-shell source-page-hero-grid">
          <div><span className="source-eyebrow">PRISMA Renting</span><h1>{title}</h1></div>
          <div className="source-page-intro">{page.meta_description && <p>{page.meta_description}</p>}<a href="tel:+34699242581">Hablar con un asesor · 699 24 25 81</a></div>
        </div>
      </section>

      {products.length > 0 && (
        <section className="source-shell source-linked-products" aria-labelledby="source-products-heading">
          <div className="source-section-heading"><span>Vehículos actuales relacionados</span><h2 id="source-products-heading">Ofertas asociadas a esta búsqueda.</h2><Link href="/ofertas-de-renting/">Ver todas las ofertas</Link></div>
          <div className="source-vehicle-grid">{products.map((product) => <OriginalVehicleCard product={product} key={product.path} />)}</div>
        </section>
      )}

      <section className="source-shell source-original-content">
        {html ? <div className="source-content-flow" dangerouslySetInnerHTML={{ __html: html }} /> : page.body_text ? <div className="source-content-fallback"><p>{page.body_text}</p></div> : <div className="source-content-empty"><h2>Contenido pendiente de importar</h2><p>Esta URL forma parte del inventario de migración, pero el contenido completo aún no ha llegado al snapshot local.</p></div>}
      </section>
      <OriginalFooter />
    </main>
  );
}
