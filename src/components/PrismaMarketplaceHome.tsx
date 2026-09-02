import Image from "next/image";
import Link from "next/link";
import PrismaHomeFinder, { type HomeVehicle } from "@/components/PrismaHomeFinder";
import { OriginalFooter, OriginalHeader } from "@/components/original/OriginalChrome";
import { getCurrentProducts, type OriginalProduct } from "@/lib/original-source";

function canonical(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function detail(product: OriginalProduct, pattern: RegExp) {
  for (const attribute of product.attributes) {
    if (pattern.test(attribute.name)) return attribute.terms[0];
    const term = attribute.terms.find((value) => pattern.test(value));
    if (term) return term;
  }
  return undefined;
}

function compact(product: OriginalProduct): HomeVehicle | null {
  if (product.price === null || !product.images[0]?.src) return null;
  const blob = canonical([product.name, ...product.categories, ...product.tags, ...product.attributes.flatMap((item) => [item.name, ...item.terms])].join(" "));
  const brand = detail(product, /marca/i) || product.name.split(/\s+/)[0] || "PRISMA";
  const fuel = detail(product, /combustible|gasolina|di[eé]sel|h[ií]brid|el[eé]ctric/i) || "Consultar";
  const body = detail(product, /carrocer[ií]a|segmento|tipo/i) || product.categories.find((value) => !/particular|aut[oó]nom|empresa|renting/i.test(value)) || "Renting";
  const transmission = detail(product, /transmisi[oó]n|cambio|manual|autom[aá]tic/i) || "Consultar";
  const doors = detail(product, /puertas?/i) || "Consultar";
  const seats = detail(product, /plazas?|asientos?/i) || "Consultar";
  const audiences: HomeVehicle["audiences"] = [];
  if (blob.includes("particular")) audiences.push("Particular");
  if (blob.includes("autonom")) audiences.push("Autónomo");
  if (blob.includes("empresa")) audiences.push("Empresa");
  if (!audiences.length) audiences.push("Particular", "Autónomo", "Empresa");

  return {
    slug: product.slug,
    path: product.path,
    name: product.name,
    brand,
    price: product.price,
    image: product.images[0].src,
    imageAlt: product.images[0].alt || product.name,
    fuel,
    body,
    transmission,
    doors,
    seats,
    immediate: /entrega inmediata|stock|disponible inmediatamente/.test(blob),
    audiences,
  };
}

function distinctBrands(vehicles: HomeVehicle[], count: number) {
  const seen = new Set<string>();
  const result: HomeVehicle[] = [];
  for (const vehicle of vehicles) {
    if (seen.has(vehicle.brand)) continue;
    seen.add(vehicle.brand);
    result.push(vehicle);
    if (result.length === count) break;
  }
  return result;
}

export default function PrismaMarketplaceHome() {
  const products = getCurrentProducts();
  const vehicles = products.map(compact).filter((vehicle): vehicle is HomeVehicle => Boolean(vehicle)).sort((a, b) => a.price - b.price);
  const hero = vehicles.find((vehicle) => /suv|crossover/i.test(canonical(`${vehicle.body} ${vehicle.name}`))) || vehicles[Math.min(4, Math.max(0, vehicles.length - 1))];
  const comparison = distinctBrands(vehicles, 3);

  return (
    <main className="prisma-page marketplace-home">
      <OriginalHeader />

      <section className="marketplace-hero">
        <div className="marketplace-shell marketplace-hero-grid">
          <div className="marketplace-hero-copy">
            <h1>Encuentra tu renting ideal,<br /><span>sin complicaciones</span></h1>
            <p>Compara ofertas reales del catálogo PRISMA para particulares, autónomos y empresas. Filtra por cuota, marca, combustible y tipo de coche.</p>
            <div className="marketplace-hero-links">
              <Link href="/ofertas-de-renting/">Ver todas las ofertas</Link>
              <Link href="/contacto/">Quiero una oferta a medida</Link>
            </div>
          </div>

          {hero ? (
            <div className="marketplace-hero-vehicle">
              <div className="marketplace-prism-light" aria-hidden="true" />
              <div className="marketplace-hero-image"><Image src={hero.image} alt={hero.imageAlt} fill priority sizes="(max-width: 900px) 100vw, 52vw" /></div>
              <div className="marketplace-hero-vehicle-meta"><span>{hero.brand}</span><strong>{hero.name}</strong><small>Desde {hero.price.toLocaleString("es-ES")} €/mes + IVA</small></div>
            </div>
          ) : null}
        </div>
      </section>

      <PrismaHomeFinder vehicles={vehicles} />

      {comparison.length === 3 ? (
        <section className="marketplace-compare">
          <div className="marketplace-shell marketplace-compare-grid">
            <div className="marketplace-compare-table">
              <div className="marketplace-compare-title"><span>Compara y elige mejor</span><strong>Tres coches, una lectura rápida.</strong></div>
              <div className="marketplace-compare-products">
                <div className="compare-labels"><span>Cuota/mes</span><span>Combustible</span><span>Cambio</span><span>Carrocería</span></div>
                {comparison.map((vehicle) => (
                  <article key={vehicle.slug}>
                    <Link href={vehicle.path} className="compare-product-head">
                      <div><Image src={vehicle.image} alt={vehicle.imageAlt} fill sizes="180px" /></div>
                      <span>{vehicle.brand}</span><strong>{vehicle.name}</strong>
                    </Link>
                    <span>{vehicle.price.toLocaleString("es-ES")} €</span>
                    <span>{vehicle.fuel}</span>
                    <span>{vehicle.transmission}</span>
                    <span>{vehicle.body}</span>
                  </article>
                ))}
              </div>
              <Link className="marketplace-compare-link" href="/ofertas-de-renting/">Abrir catálogo completo →</Link>
            </div>

            <aside className="marketplace-value-list">
              <div><span>01</span><p><strong>Catálogo real</strong>Los coches, precios e imágenes salen del inventario migrado de PRISMA.</p></div>
              <div><span>02</span><p><strong>Multioperador</strong>PRISMA compara alternativas entre distintas compañías de renting.</p></div>
              <div><span>03</span><p><strong>Asesoramiento experto</strong>Un especialista estudia la operación contigo antes de cerrar.</p></div>
              <div><span>04</span><p><strong>Búsqueda a medida</strong>Si el catálogo no encaja, PRISMA puede trabajar una propuesta personalizada.</p></div>
            </aside>
          </div>
        </section>
      ) : null}

      <section className="marketplace-process">
        <div className="marketplace-shell marketplace-process-row">
          <div className="marketplace-process-title"><span>Cómo funciona</span><Link href="/como-funciona-el-renting-de-prisma-renting/">Ver más detalles →</Link></div>
          {["Cuéntanos qué necesitas", "Comparamos alternativas", "Revisamos la operación", "Disfruta tu coche"].map((step, index) => (
            <div className="marketplace-process-step" key={step}><span>{index + 1}</span><strong>{step}</strong></div>
          ))}
        </div>
      </section>

      <section className="marketplace-custom-offer">
        <div className="marketplace-shell marketplace-custom-offer-inner">
          <div><strong>¿No encuentras lo que buscas?</strong><span>Te preparamos una oferta personalizada con tu uso, presupuesto y perfil.</span></div>
          <Link href="/contacto/">Quiero mi oferta personalizada →</Link>
        </div>
      </section>

      <OriginalFooter />
    </main>
  );
}
