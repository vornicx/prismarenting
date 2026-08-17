import Image from "next/image";
import Link from "next/link";
import { OriginalFooter, OriginalHeader } from "@/components/original/OriginalChrome";
import type { OriginalPage, OriginalProduct } from "@/lib/original-source";
import { getProductSourceHtml } from "@/lib/product-source-html";
import { prepareOriginalHtml } from "@/lib/source-html";

export default function OriginalVehicleTemplate({ product, page }: { product: OriginalProduct; page?: OriginalPage }) {
  const hero = product.images[0] || page?.images?.[0];
  const gallery = product.images.length ? product.images : page?.images || [];
  const productSource = product.active ? getProductSourceHtml(product.path) : { description: "", shortDescription: "" };
  const html = prepareOriginalHtml(page?.content_html || "") || productSource.description;

  return (
    <main className={`source-page source-product-page ${product.active ? "source-product-active" : "source-product-legacy"}`}>
      <OriginalHeader />
      <section className="source-product-hero">
        <div className="source-shell source-product-hero-grid">
          <div className="source-product-visual">
            {hero ? <Image src={hero.src} alt={hero.alt || product.name} fill priority sizes="(max-width: 900px) 100vw, 58vw" /> : <div className="source-product-placeholder">PRISMA</div>}
          </div>
          <div className="source-product-summary">
            <span className="source-eyebrow">{product.active ? "Oferta actual de renting" : "Ficha histórica de PRISMA"}</span>
            <h1>{product.name}</h1>
            {!product.active && <div className="source-product-legacy-note"><strong>Esta URL forma parte del catálogo histórico de PRISMA.</strong><span>La ficha se conserva por continuidad de contenido y SEO. Consulta con PRISMA si existe una oferta vigente equivalente.</span></div>}
            {productSource.shortDescription ? <div className="source-product-short" dangerouslySetInnerHTML={{ __html: productSource.shortDescription }} /> : product.shortDescription && <p>{product.shortDescription}</p>}
            <div className="source-product-price">
              <span>{product.active ? "Desde" : "Precio publicado en la ficha original"}</span>
              <strong>{product.price !== null ? `${product.price.toLocaleString("es-ES")} €` : "Consultar vigencia"}</strong>
              {product.active && product.price !== null && <small>/mes + IVA</small>}
            </div>
            {product.attributes.length > 0 && (
              <dl className="source-product-facts">
                {product.attributes.map((attribute) => <div key={`${attribute.name}-${attribute.terms.join("-")}`}><dt>{attribute.name}</dt><dd>{attribute.terms.join(" · ")}</dd></div>)}
              </dl>
            )}
            <div className="source-product-actions"><a href="tel:+34699242581" className="source-dark-button">{product.active ? "Consultar esta oferta" : "Consultar oferta actual equivalente"}</a><Link href="/ofertas-de-renting/">Ver catálogo actual</Link></div>
          </div>
        </div>
      </section>

      {gallery.length > 1 && <section className="source-shell source-product-gallery" aria-label={`Galería de ${product.name}`}>{gallery.slice(1).map((image, index) => <div className="source-product-gallery-item" key={`${image.src}-${index}`}><Image src={image.src} alt={image.alt || `${product.name} ${index + 2}`} fill sizes="(max-width: 700px) 100vw, 33vw" /></div>)}</section>}

      {html ? <section className="source-shell source-original-content source-product-original-content"><div className="source-content-flow" dangerouslySetInnerHTML={{ __html: html }} /></section> : product.description ? <section className="source-shell source-product-description"><h2>Información del vehículo</h2><p>{product.description}</p></section> : null}

      <section className="source-product-cta"><div className="source-shell source-product-cta-grid"><div><span>PRISMA Renting</span><h2>{product.active ? "¿Te interesa este coche?" : "¿Buscas este modelo o una alternativa actual?"}</h2></div><div><p>Consulta disponibilidad, operador, kilometraje, plazo y condiciones finales con un asesor.</p><a href="tel:+34699242581">699 24 25 81</a></div></div></section>
      <OriginalFooter />
    </main>
  );
}
