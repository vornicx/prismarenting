import Link from "next/link";
import OriginalVehicleCard from "@/components/original/OriginalVehicleCard";
import { OriginalFooter, OriginalHeader } from "@/components/original/OriginalChrome";
import { getCurrentProducts, getOriginalPage } from "@/lib/original-source";
import { prepareOriginalHtml } from "@/lib/source-html";

export default function OriginalHomeTemplate() {
  const page = getOriginalPage("/");
  const products = getCurrentProducts();
  const html = prepareOriginalHtml(page?.content_html || "");
  const featured = [...products].sort((a, b) => (a.price ?? Number.POSITIVE_INFINITY) - (b.price ?? Number.POSITIVE_INFINITY)).slice(0, 6);

  return (
    <main className="source-page source-home-page">
      <OriginalHeader />
      <section className="source-home-hero">
        <div className="source-shell source-home-hero-grid">
          <div>
            <span className="source-eyebrow">Grupo PRISMA · Especialistas en automoción</span>
            <h1>{page?.h1?.[0] || "Renting de coches al mejor precio"}</h1>
          </div>
          <div className="source-home-hero-side">
            <p>{page?.meta_description || "Renting para particulares, autónomos y empresas con asesoramiento especializado y distintas modalidades."}</p>
            <div><Link href="/ofertas-de-renting/" className="source-dark-button">Ver ofertas de renting</Link><a href="tel:+34699242581">699 24 25 81</a></div>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="source-shell source-home-featured">
          <div className="source-section-heading"><span>Catálogo actual</span><h2>Ofertas reales de PRISMA.</h2><Link href="/ofertas-de-renting/">Ver los {products.length} vehículos activos</Link></div>
          <div className="source-vehicle-grid">{featured.map((product) => <OriginalVehicleCard product={product} key={product.path} />)}</div>
        </section>
      )}

      {html ? (
        <section className="source-shell source-original-content source-home-original-content"><div className="source-content-flow" dangerouslySetInnerHTML={{ __html: html }} /></section>
      ) : page?.body_text ? (
        <section className="source-shell source-original-content"><div className="source-content-fallback"><p>{page.body_text}</p></div></section>
      ) : null}
      <OriginalFooter />
    </main>
  );
}
