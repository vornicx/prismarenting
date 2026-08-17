import Image from "next/image";
import Link from "next/link";
import type { OriginalProduct } from "@/lib/original-source";

function detail(product: OriginalProduct, pattern: RegExp): string | undefined {
  for (const attribute of product.attributes) {
    if (pattern.test(attribute.name)) return attribute.terms[0];
    const term = attribute.terms.find((value) => pattern.test(value));
    if (term) return term;
  }
  return undefined;
}

export default function OriginalVehicleCard({ product }: { product: OriginalProduct }) {
  const image = product.images[0];
  const fuel = detail(product, /gasolina|di[eé]sel|h[ií]brid|el[eé]ctric|combustible/i);
  const transmission = detail(product, /manual|autom[aá]tic|cambio|transmisi[oó]n/i);

  return (
    <article className="source-vehicle-card">
      <Link href={product.path} className="source-vehicle-media" aria-label={`Ver ${product.name}`}>
        {image ? (
          <Image src={image.src} alt={image.alt || product.name} fill sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw" />
        ) : (
          <div className="source-vehicle-placeholder">PRISMA</div>
        )}
      </Link>
      <div className="source-vehicle-copy">
        <div>
          <span>{product.categories[0] || "Oferta de renting"}</span>
          <h3><Link href={product.path}>{product.name}</Link></h3>
        </div>
        <div className="source-vehicle-price">
          <span>Desde</span>
          <strong>{product.price !== null ? `${product.price.toLocaleString("es-ES")} €` : "Consultar"}</strong>
          {product.price !== null && <small>/mes + IVA</small>}
        </div>
      </div>
      {(fuel || transmission) && (
        <div className="source-vehicle-specs">
          {fuel && <span>{fuel}</span>}
          {transmission && <span>{transmission}</span>}
        </div>
      )}
      <Link href={product.path} className="source-vehicle-link">Ver vehículo y condiciones <span aria-hidden="true">↗</span></Link>
    </article>
  );
}
