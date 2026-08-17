import OriginalCatalogClient from "@/components/original/OriginalCatalogClient";
import { OriginalFooter, OriginalHeader } from "@/components/original/OriginalChrome";
import { getCurrentProducts, getOriginalPage } from "@/lib/original-source";

export default function OriginalCatalogTemplate() {
  const products = getCurrentProducts();
  const page = getOriginalPage("/ofertas-de-renting/");

  return (
    <main className="source-page source-catalog-page">
      <OriginalHeader />
      <section className="source-page-hero source-catalog-hero">
        <div className="source-shell source-page-hero-grid">
          <div><span className="source-eyebrow">Catálogo actual de PRISMA</span><h1>{page?.h1?.[0] || "Ofertas de renting"}</h1></div>
          <div className="source-page-intro"><p>{page?.meta_description || "Consulta el catálogo actual de vehículos de PRISMA Renting y filtra las ofertas por las características importadas de la web original."}</p><a href="tel:+34699242581">¿No encuentras tu coche? Habla con PRISMA</a></div>
        </div>
      </section>
      <section className="source-shell source-full-catalog">
        <OriginalCatalogClient products={products} />
      </section>
      <OriginalFooter />
    </main>
  );
}
