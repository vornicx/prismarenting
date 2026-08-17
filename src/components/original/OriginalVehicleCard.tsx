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

function category(product: OriginalProduct) {
  return detail(product, /tipo|carrocer[ií]a|segmento/i) || product.categories.find((value) => !/particular|aut[oó]nom|empresa|disponible/i.test(value)) || "Renting";
}

export default function OriginalVehicleCard({ product, variant = "standard" }: { product: OriginalProduct; variant?: "standard" | "feature" | "compact" }) {
  const image = product.images[0];
  const fuel = detail(product, /gasolina|di[eé]sel|h[ií]brid|el[eé]ctric|combustible/i);
  const transmission = detail(product, /manual|autom[aá]tic|cambio|transmisi[oó]n/i);
  const km = detail(product, /kil[oó]metr/i);
  const term = detail(product, /meses|plazo|duraci[oó]n/i);

  return (
    <article className={`prisma-car-card prisma-car-card-${variant}`}>
      <Link href={product.path} className="prisma-car-media" aria-label={`Ver ${product.name}`}>
        <div className="prisma-car-card-topline">
          <span>{product.active ? "Oferta actual" : "Ficha histórica"}</span>
          <span>{category(product)}</span>
        </div>
        {image ? (
          <Image src={image.src} alt={image.alt || product.name} fill sizes={variant === "feature" ? "(max-width: 900px) 100vw, 58vw" : "(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"} />
        ) : (
          <div className="prisma-car-placeholder">PRISMA</div>
        )}
      </Link>

      <div className="prisma-car-body">
        <div className="prisma-car-heading">
          <div>
            <span>{product.categories[0] || "PRISMA Renting"}</span>
            <h3><Link href={product.path}>{product.name}</Link></h3>
          </div>
          <div className="prisma-car-price">
            <span>{product.active ? "Desde" : "Publicado"}</span>
            <strong>{product.price !== null ? `${product.price.toLocaleString("es-ES")} €` : "Consultar"}</strong>
            {product.active && product.price !== null && <small>/mes + IVA</small>}
          </div>
        </div>

        <div className="prisma-car-specs">
          {fuel && <span>{fuel}</span>}
          {transmission && <span>{transmission}</span>}
          {term && <span>{term}</span>}
          {km && <span>{km}</span>}
        </div>

        <Link href={product.path} className="prisma-car-link">
          <span>Ver oferta y condiciones</span>
          <i aria-hidden="true">↗</i>
        </Link>
      </div>
    </article>
  );
}
