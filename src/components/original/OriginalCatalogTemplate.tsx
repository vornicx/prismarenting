import OriginalCatalogClient from "@/components/original/OriginalCatalogClient";
import OriginalVehicleCard from "@/components/original/OriginalVehicleCard";
import { OriginalFooter, OriginalHeader } from "@/components/original/OriginalChrome";
import { getCurrentProducts } from "@/lib/original-source";

export default function OriginalCatalogTemplate() {
  const products = getCurrentProducts();
  const sorted = [...products].sort((a, b) => (a.price ?? Number.POSITIVE_INFINITY) - (b.price ?? Number.POSITIVE_INFINITY));
  const spotlight = sorted.slice(0, 3);

  return (
    <main className="prisma-page prisma-catalog-page">
      <OriginalHeader />

      <section className="prisma-catalog-hero">
        <div className="prisma-shell prisma-catalog-hero-grid">
          <div>
            <span className="prisma-kicker">Catálogo actual · {products.length} ofertas activas</span>
            <h1>Compara primero. Pregunta después.</h1>
          </div>
          <div>
            <p>Vehículos, cuotas y características del catálogo actual de PRISMA. Filtra por lo que importa y entra en cada ficha con el contexto necesario para decidir.</p>
            <a href="tel:+34699242581">¿No encuentras tu coche? 699 24 25 81 ↗</a>
          </div>
        </div>
      </section>

      {spotlight.length > 0 && (
        <section className="prisma-shell prisma-catalog-spotlight">
          <div className="prisma-catalog-spotlight-head"><span>Cuotas de entrada</span><p>Tres de las ofertas más económicas del catálogo actual.</p></div>
          <div className="prisma-catalog-spotlight-grid">{spotlight.map((product) => <OriginalVehicleCard product={product} variant="compact" key={product.path} />)}</div>
        </section>
      )}

      <section className="prisma-shell prisma-full-catalog">
        <OriginalCatalogClient products={products} />
      </section>

      <OriginalFooter />
    </main>
  );
}
