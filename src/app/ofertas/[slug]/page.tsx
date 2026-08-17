import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import RequestConfigurator from "@/components/RequestConfigurator";
import VehicleActions from "@/components/VehicleActions";
import VehicleCard from "@/components/VehicleCard";
import VehicleGallery from "@/components/VehicleGallery";
import { ArrowUpRight, Check, WhatsAppMark } from "@/components/Icons";
import { getVehicle, vehicles } from "@/data/vehicles";

const process = [
  ["01", "Selecciona", "Elige el coche o guarda varias alternativas."],
  ["02", "Contacta", "PRISMA revisa contigo perfil, plazo, kilómetros y disponibilidad."],
  ["03", "Documentación", "Se envía la documentación necesaria para el estudio."],
  ["04", "Firma", "Con la operación aprobada, se formaliza el contrato."],
  ["05", "Recoge", "Recibes el vehículo y empieza el renting."],
] as const;

export function generateStaticParams() {
  return vehicles.map((vehicle) => ({ slug: vehicle.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) return {};
  return {
    title: `${vehicle.name} de renting`,
    description: `${vehicle.name} desde ${vehicle.price} €/mes + IVA. Consulta disponibilidad, servicios y configura una solicitud de renting con PRISMA.`,
  };
}

export default async function Detail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) notFound();

  const gallery = vehicle.gallery?.length ? vehicle.gallery : [vehicle.image];
  const alternatives = vehicles
    .filter((item) => item.slug !== vehicle.slug)
    .sort((a, b) => (a.body === vehicle.body ? -1 : 0) - (b.body === vehicle.body ? -1 : 0))
    .slice(0, 3);
  const whatsapp = `https://wa.me/34699242581?text=${encodeURIComponent(`Hola, estoy viendo el ${vehicle.name} desde ${vehicle.price} €/mes + IVA en PRISMA Renting. ¿Podéis confirmarme disponibilidad, versión y condiciones?`)}`;

  return (
    <main className="detail-page detail-depth-page">
      <section className="detail-product-stage">
        <Header theme="dark" />
        <div className="shell detail-breadcrumb"><Link href="/ofertas">Ofertas de renting</Link><span>/</span><span>{vehicle.brand}</span><span>/</span><strong>{vehicle.name}</strong></div>

        <div className="shell detail-product-grid">
          <div className="detail-gallery-column">
            <VehicleGallery name={vehicle.name} images={gallery} />
            <div className="detail-gallery-note">
              <span>Imágenes de referencia</span>
              <p>La versión, el color y el equipamiento visual pueden variar respecto a la unidad finalmente ofertada.</p>
            </div>
          </div>

          <aside className="detail-offer-panel">
            <div className="detail-offer-top">
              <span>{vehicle.badge || "Oferta PRISMA"}</span>
              <VehicleActions slug={vehicle.slug} />
            </div>
            <p className="detail-offer-brand">{vehicle.brand}</p>
            <h1>{vehicle.name.replace(`${vehicle.brand} `, "") || vehicle.name}</h1>
            <p className="detail-offer-variant">{vehicle.variant}</p>

            <div className="detail-availability">
              <span className="detail-availability-dot" />
              <div><strong>{vehicle.availabilityNote || "Consulta disponibilidad"}</strong><small>{vehicle.audiences.join(" · ")}</small></div>
            </div>

            <div className="detail-price-stack">
              <span>Desde</span>
              <div><strong>{vehicle.price.toLocaleString("es-ES")} €</strong><small>/mes + IVA</small></div>
              <p>Cuota de referencia. PRISMA confirma la propuesta final según perfil, operador, plazo, kilometraje y disponibilidad.</p>
            </div>

            <div className="detail-offer-actions">
              <a href="#configurar" className="button button-dark">Configurar esta oferta <ArrowUpRight /></a>
              <a href={whatsapp} target="_blank" rel="noreferrer" className="detail-whatsapp-link"><WhatsAppMark /> Preguntar por este coche</a>
            </div>

            <div className="detail-color-note"><span>Color</span><strong>{vehicle.colorNote || "Consultar opciones"}</strong></div>
          </aside>
        </div>
      </section>

      <section className="detail-fact-bar">
        <div className="shell detail-fact-grid">
          <div><span>Transmisión</span><strong>{vehicle.transmission}</strong></div>
          <div><span>Etiqueta</span><strong>{vehicle.emissionsLabel || "Consultar"}</strong></div>
          <div><span>Combustible</span><strong>{vehicle.fuel}</strong></div>
          <div><span>Tipo</span><strong>{vehicle.body}</strong></div>
          <div><span>Potencia</span><strong>{vehicle.power || "Consultar"}</strong></div>
          <div><span>Referencia</span><strong>{vehicle.term} meses · {vehicle.km.toLocaleString("es-ES")} km/año</strong></div>
        </div>
      </section>

      <section className="detail-services shell" aria-labelledby="detail-services-title">
        <div className="detail-services-head">
          <span>Servicios incluidos</span>
          <h2 id="detail-services-title">La cuota también es todo lo que deja de preocuparte.</h2>
        </div>
        <div className="detail-services-grid">
          {(vehicle.services || []).map((service, index) => (
            <div key={service}><span>{String(index + 1).padStart(2, "0")}</span><Check /><strong>{service}</strong></div>
          ))}
        </div>
        <small>Los servicios concretos y sus condiciones dependen de la oferta y del operador. PRISMA confirma la propuesta final.</small>
      </section>

      <section className="detail-decision-grid shell" id="configurar">
        <div className="detail-decision-intro">
          <span>Tu operación</span>
          <h2>El coche puede encajar. La operación también tiene que hacerlo.</h2>
          <p>Plazo, kilometraje y perfil cambian las condiciones reales. Indica tus preferencias y PRISMA preparará una propuesta con las condiciones confirmadas por el operador.</p>
        </div>
        <RequestConfigurator vehicle={vehicle} />
      </section>

      {(vehicle.description || vehicle.fit || vehicle.equipment?.length) && (
        <section className="detail-product-knowledge">
          <div className="shell detail-product-knowledge-grid">
            <div className="detail-knowledge-index">
              <span>Conocer el coche</span>
              <strong>{vehicle.name}</strong>
            </div>

            <div className="detail-knowledge-content">
              {vehicle.description && (
                <div className="detail-knowledge-story">
                  <span>Descripción</span>
                  <h2>{vehicle.highlight || vehicle.name}</h2>
                  <p>{vehicle.description}</p>
                </div>
              )}

              {vehicle.fit && (
                <div className="detail-fit-check">
                  <span>¿Te encaja?</span>
                  <p>{vehicle.fit}</p>
                  <Link href={`/comparar?cars=${vehicle.slug}`}>Compáralo antes de decidir <ArrowUpRight /></Link>
                </div>
              )}

              {vehicle.equipment?.length ? (
                <div className="detail-equipment">
                  <div className="detail-equipment-head"><span>Equipamiento destacado publicado por PRISMA</span><small>La versión final debe confirmarse.</small></div>
                  <div className="detail-equipment-grid">
                    {vehicle.equipment.map((item) => <div key={item}><Check /><span>{item}</span></div>)}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      )}

      <section className="detail-process">
        <div className="shell detail-process-head"><span>Cómo se contrata</span><h2>Cinco pasos entre elegir y conducir.</h2><a href="tel:+34699242581">699 24 25 81 <ArrowUpRight /></a></div>
        <div className="shell detail-process-track">
          {process.map(([number, title, copy]) => <div key={number}><span>{number}</span><strong>{title}</strong><p>{copy}</p></div>)}
        </div>
      </section>

      <section className="shell alternative-offers">
        <div className="alternative-offers-heading"><div><span>Antes de decidir</span><strong>Alternativas para comparar.</strong></div><Link href="/ofertas">Ver catálogo completo <ArrowUpRight /></Link></div>
        <div className="vehicle-grid">{alternatives.map((item) => <VehicleCard vehicle={item} key={item.slug} />)}</div>
      </section>

      <div className="detail-bottom-note shell">
        <span>Condiciones, versión, equipamiento y disponibilidad sujetos a confirmación por PRISMA y el operador.</span>
        {vehicle.sourceUrl && <a href={vehicle.sourceUrl} target="_blank" rel="noreferrer">Ver referencia pública actual <ArrowUpRight /></a>}
      </div>
    </main>
  );
}
