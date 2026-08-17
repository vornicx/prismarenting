import Image from "next/image";
import Link from "next/link";
import OriginalVehicleCard from "@/components/original/OriginalVehicleCard";
import { OriginalFooter, OriginalHeader } from "@/components/original/OriginalChrome";
import { getCurrentProducts, type OriginalPage, type OriginalProduct } from "@/lib/original-source";
import { getProductSourceHtml } from "@/lib/product-source-html";
import { prepareOriginalHtml } from "@/lib/source-html";

function relatedProducts(product: OriginalProduct) {
  const categories = new Set(product.categories);
  return getCurrentProducts()
    .filter((candidate) => candidate.path !== product.path)
    .map((candidate) => ({ candidate, score: candidate.categories.filter((category) => categories.has(category)).length }))
    .sort((a, b) => b.score - a.score || (a.candidate.price ?? Number.POSITIVE_INFINITY) - (b.candidate.price ?? Number.POSITIVE_INFINITY))
    .slice(0, 4)
    .map((entry) => entry.candidate);
}

export default function OriginalVehicleTemplate({ product, page }: { product: OriginalProduct; page?: OriginalPage }) {
  const hero = product.images[0] || page?.images?.[0];
  const gallery = product.images.length ? product.images : page?.images || [];
  const productSource = product.active ? getProductSourceHtml(product.path) : { description: "", shortDescription: "" };
  const html = prepareOriginalHtml(page?.content_html || "") || prepareOriginalHtml(productSource.description || "");
  const related = product.active ? relatedProducts(product) : getCurrentProducts().slice(0, 4);
  const primaryFacts = product.attributes.slice(0, 6);
  const extraFacts = product.attributes.slice(6);

  return (
    <main className={`prisma-page prisma-product-page ${product.active ? "prisma-product-active" : "prisma-product-legacy"}`}>
      <OriginalHeader />

      <section className="prisma-product-hero">
        <div className="prisma-shell prisma-product-hero-grid">
          <div className="prisma-product-visual-column">
            <div className="prisma-product-status"><span>{product.active ? "Oferta actual" : "Ficha histórica"}</span><Link href="/ofertas-de-renting/">Volver al catálogo ↗</Link></div>
            <div className="prisma-product-main-image">
              {hero ? <Image src={hero.src} alt={hero.alt || product.name} fill priority sizes="(max-width: 920px) 100vw, 60vw" /> : <div className="prisma-car-placeholder">PRISMA</div>}
            </div>
            {gallery.length > 1 && <div className="prisma-product-thumbnail-grid">{gallery.slice(1, 5).map((image, index) => <div key={`${image.src}-${index}`}><Image src={image.src} alt={image.alt || `${product.name} ${index + 2}`} fill sizes="(max-width: 720px) 50vw, 15vw" /></div>)}</div>}
          </div>

          <aside className="prisma-product-summary">
            <span className="prisma-kicker">{product.categories[0] || "PRISMA Renting"}</span>
            <h1>{product.name}</h1>

            {!product.active && <div className="prisma-product-legacy-note"><strong>Esta oferta ya no forma parte del catálogo activo.</strong><p>Conservamos la ficha por continuidad de contenido y SEO. PRISMA puede ayudarte a localizar una alternativa actual equivalente.</p></div>}

            {productSource.shortDescription ? <div className="prisma-product-short" dangerouslySetInnerHTML={{ __html: productSource.shortDescription }} /> : product.shortDescription && <p className="prisma-product-short-text">{product.shortDescription}</p>}

            <div className="prisma-product-price-block">
              <span>{product.active ? "Desde" : "Precio publicado originalmente"}</span>
              <div><strong>{product.price !== null ? `${product.price.toLocaleString("es-ES")} €` : "Consultar"}</strong>{product.active && product.price !== null && <small>/mes + IVA</small>}</div>
            </div>

            {primaryFacts.length > 0 && <dl className="prisma-product-facts">{primaryFacts.map((attribute) => <div key={`${attribute.name}-${attribute.terms.join("-")}`}><dt>{attribute.name}</dt><dd>{attribute.terms.join(" · ")}</dd></div>)}</dl>}

            <div className="prisma-product-actions">
              <Link href="/contacto/" className="prisma-button prisma-button-dark">{product.active ? "Consultar esta oferta" : "Buscar alternativa actual"}</Link>
              <a href="tel:+34699242581" className="prisma-button prisma-button-ghost">699 24 25 81</a>
            </div>
            <p className="prisma-product-condition-note">Disponibilidad, operador, servicios, kilometraje, plazo y condiciones finales se confirman con PRISMA para cada operación.</p>
          </aside>
        </div>
      </section>

      {extraFacts.length > 0 && (
        <section className="prisma-product-spec-section">
          <div className="prisma-shell prisma-product-spec-grid">
            <div><span>Ficha técnica comercial</span><h2>Más contexto antes de solicitar la operación.</h2></div>
            <dl>{extraFacts.map((attribute) => <div key={`${attribute.name}-${attribute.terms.join("-")}`}><dt>{attribute.name}</dt><dd>{attribute.terms.join(" · ")}</dd></div>)}</dl>
          </div>
        </section>
      )}

      {html ? (
        <section className="prisma-product-information">
          <div className="prisma-shell prisma-product-information-grid">
            <aside><span>Información completa</span><h2>Equipamiento, descripción y condiciones publicadas.</h2><p>Mantenemos el contenido de la ficha original dentro del nuevo sistema visual para no perder detalle comercial ni SEO.</p></aside>
            <div className="prisma-rich-content"><div dangerouslySetInnerHTML={{ __html: html }} /></div>
          </div>
        </section>
      ) : product.description ? (
        <section className="prisma-product-information"><div className="prisma-shell prisma-product-information-grid"><aside><span>Información del vehículo</span><h2>Descripción de la oferta.</h2></aside><div className="prisma-rich-content"><p>{product.description}</p></div></div></section>
      ) : null}

      {related.length > 0 && (
        <section className="prisma-related prisma-section">
          <div className="prisma-shell">
            <div className="prisma-section-heading prisma-section-heading-split"><div><span>Si este no es exactamente el tuyo</span><h2>Compara alternativas actuales.</h2></div><Link href="/ofertas-de-renting/">Ver los {getCurrentProducts().length} vehículos ↗</Link></div>
            <div className="prisma-related-grid">{related.map((candidate) => <OriginalVehicleCard product={candidate} key={candidate.path} />)}</div>
          </div>
        </section>
      )}

      <OriginalFooter />
    </main>
  );
}
