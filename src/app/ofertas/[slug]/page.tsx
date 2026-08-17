import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { Check } from "@/components/Icons";
import { vehicles } from "@/data/vehicles";

export function generateStaticParams() {
  return vehicles.map((vehicle) => ({ slug: vehicle.slug }));
}

export default async function Detail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = vehicles.find((item) => item.slug === slug);
  if (!vehicle) notFound();

  return (
    <main>
      <Header />
      <section className="shell detail">
        <div className="breadcrumb">
          <Link href="/ofertas">Ofertas</Link> / {vehicle.brand} / {vehicle.name}
        </div>
        <div className="detail-grid">
          <div className="detail-image" style={{ backgroundImage: `url(${vehicle.image})` }} />
          <div className="detail-copy">
            <span className="eyebrow">{vehicle.brand} · Renting</span>
            <h1>{vehicle.name}</h1>
            <p className="model-line">{vehicle.variant}</p>
            <div className="detail-price">{vehicle.price} €<small>/mes + IVA</small></div>
            <div className="specs">
              <div><span>Duración</span><strong>{vehicle.term} meses</strong></div>
              <div><span>Kilometraje</span><strong>{vehicle.km.toLocaleString("es-ES")} km/año</strong></div>
              <div><span>Combustible</span><strong>{vehicle.fuel}</strong></div>
              <div><span>Cambio</span><strong>{vehicle.transmission}</strong></div>
              <div><span>Carrocería</span><strong>{vehicle.body}</strong></div>
              <div><span>Disponibilidad</span><strong>{vehicle.delivery}</strong></div>
            </div>
            <div className="detail-includes">
              <h3>Tu cuota incluye</h3>
              <div className="include-row">
                <span><Check />Seguro a todo riesgo</span>
                <span><Check />Mantenimiento</span>
                <span><Check />Impuestos</span>
                <span><Check />Asistencia</span>
              </div>
            </div>
            <div className="detail-actions">
              <Link href="/#asesor" className="button dark">Solicitar esta oferta</Link>
              <Link href="/#asesor" className="button outline">Hablar con un asesor</Link>
            </div>
            <p className="detail-note">Oferta orientativa sujeta a disponibilidad, aprobación y condiciones del operador. PRISMA te confirmará la propuesta final y alternativas disponibles.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
