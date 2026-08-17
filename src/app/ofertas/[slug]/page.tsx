import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import RequestConfigurator from "@/components/RequestConfigurator";
import VehicleActions from "@/components/VehicleActions";
import VehicleCard from "@/components/VehicleCard";
import { ArrowUpRight, Check, WhatsAppMark } from "@/components/Icons";
import { getVehicle, vehicles } from "@/data/vehicles";

export function generateStaticParams() {
  return vehicles.map((vehicle) => ({ slug: vehicle.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) return {};
  return {
    title: `${vehicle.name} de renting | PRISMA Renting`,
    description: `${vehicle.name} desde ${vehicle.price} €/mes + IVA. Configura perfil, duración y kilometraje y solicita una propuesta personalizada a PRISMA Renting.`,
  };
}

export default async function Detail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) notFound();

  const alternatives = vehicles.filter((item) => item.slug !== vehicle.slug).slice(0, 3);
  const whatsapp = `https://wa.me/34699242581?text=${encodeURIComponent(`Hola, estoy viendo el ${vehicle.name} desde ${vehicle.price} €/mes + IVA en el concepto de PRISMA Renting. ¿Podéis confirmarme disponibilidad y condiciones?`)}`;

  return (
    <main className="detail-page">
      <section className="detail-stage">
        <Header theme="dark" />
        <div className="shell detail-stage-grid">
          <div className="detail-stage-copy">
            <div className="breadcrumb"><Link href="/ofertas">Coches</Link><span>/</span><span>{vehicle.brand}</span></div>
            <span className="detail-kicker">{vehicle.badge || "Oferta PRISMA"}</span>
            <p className="detail-brand">{vehicle.brand}</p>
            <h1>{vehicle.name.replace(`${vehicle.brand} `, "") || vehicle.name}</h1>
            <div className="detail-reference-price">
              <span>Referencia actual</span>
              <strong>{vehicle.price.toLocaleString("es-ES")} €</strong>
              <small>/mes + IVA</small>
            </div>
            <div className="detail-primary-actions">
              <a href="#configurar" className="button button-dark">Configurar solicitud <ArrowUpRight /></a>
              <VehicleActions slug={vehicle.slug} />
            </div>
          </div>

          <div className="detail-car-stage">
            <div className="detail-ghost-brand" aria-hidden="true">{vehicle.brand}</div>
            <Image src={vehicle.image} alt={vehicle.name} fill priority sizes="(max-width: 900px) 96vw, 64vw" className="detail-car-image" />
          </div>

          <div className="detail-stage-specs">
            <div><span>Motor</span><strong>{vehicle.fuel}</strong></div>
            <div><span>Cambio</span><strong>{vehicle.transmission}</strong></div>
            <div><span>Km/año ref.</span><strong>{vehicle.km.toLocaleString("es-ES")}</strong></div>
            <div><span>Plazo ref.</span><strong>{vehicle.term} meses</strong></div>
            <div><span>Disponibilidad</span><strong>{vehicle.delivery}</strong></div>
          </div>
        </div>
      </section>

      <section className="shell detail-decision-grid" id="configurar">
        <div className="detail-decision-intro">
          <span>Tu operación</span>
          <h2>Configura lo que necesitas antes de hablar con nadie.</h2>
          <p>La cuota mostrada es una referencia de la oferta cargada. Cambiar plazo o kilometraje requiere una propuesta real del operador; por eso la configuración prepara la solicitud en lugar de inventar un precio.</p>
        </div>
        <RequestConfigurator vehicle={vehicle} />
      </section>

      <section className="detail-inclusion-console">
        <div className="shell detail-inclusion-inner">
          <div className="detail-inclusion-heading">
            <span>Dentro de la cuota</span>
            <strong>Menos variables.<br />Más control.</strong>
          </div>
          <div className="detail-inclusion-grid">
            <div><Check /><span>Seguro</span></div>
            <div><Check /><span>Mantenimiento</span></div>
            <div><Check /><span>Impuestos e ITV</span></div>
            <div><Check /><span>Asistencia</span></div>
            <div><Check /><span>Sin entrada*</span></div>
          </div>
          <a href={whatsapp} target="_blank" rel="noreferrer" className="button button-whatsapp"><WhatsAppMark /> Preguntar por este coche</a>
        </div>
      </section>

      <section className="shell alternative-offers">
        <div className="alternative-offers-heading">
          <span>Antes de decidir</span>
          <strong>Mira también estas tres.</strong>
        </div>
        <div className="vehicle-grid">
          {alternatives.map((item) => <VehicleCard vehicle={item} key={item.slug} />)}
        </div>
      </section>

      <div className="detail-bottom-note shell">
        <span>*Condiciones sujetas a operador, estudio y disponibilidad.</span>
        {vehicle.sourceUrl && <a href={vehicle.sourceUrl} target="_blank" rel="noreferrer">Referencia pública actual <ArrowUpRight /></a>}
      </div>
    </main>
  );
}
