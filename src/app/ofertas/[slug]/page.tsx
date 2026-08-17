import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { ArrowUpRight, Check } from "@/components/Icons";
import { vehicles } from "@/data/vehicles";

export function generateStaticParams() {
  return vehicles.map((vehicle) => ({ slug: vehicle.slug }));
}

export default async function Detail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = vehicles.find((item) => item.slug === slug);
  if (!vehicle) notFound();

  return (
    <main className="detail-page">
      <section className="detail-hero">
        <Header theme="dark" />
        <div className="shell detail-hero-grid">
          <div className="detail-hero-copy">
            <div className="breadcrumb"><Link href="/ofertas">Ofertas</Link><span>/</span><span>{vehicle.brand}</span></div>
            <span className="eyebrow">{vehicle.badge || "Oferta PRISMA"}</span>
            <h1>{vehicle.name}</h1>
            <p>{vehicle.variant}</p>
            <div className="detail-price"><span>Desde</span><strong>{vehicle.price} €</strong><small>/mes + IVA</small></div>
            <div className="detail-actions"><Link href="/#asesor" className="button button-dark">Solicitar oferta <ArrowUpRight /></Link><a href="tel:+34699242581" className="button button-ghost">Llamar a un asesor</a></div>
            <p className="detail-note">Oferta orientativa sujeta a disponibilidad, aprobación y condiciones del operador.</p>
          </div>
          <div className="detail-product" style={{ backgroundImage: `url(${vehicle.image})` }} aria-label={vehicle.name} />
        </div>
      </section>

      <section className="shell detail-specs-section">
        <div className="detail-specs-head"><span className="eyebrow">La operación</span><h2>Lo importante, de un vistazo.</h2></div>
        <div className="detail-specs">
          <div><span>Duración</span><strong>{vehicle.term} meses</strong></div>
          <div><span>Kilometraje</span><strong>{vehicle.km.toLocaleString("es-ES")} km/año</strong></div>
          <div><span>Combustible</span><strong>{vehicle.fuel}</strong></div>
          <div><span>Transmisión</span><strong>{vehicle.transmission}</strong></div>
          <div><span>Carrocería</span><strong>{vehicle.body}</strong></div>
          <div><span>Disponibilidad</span><strong>{vehicle.delivery}</strong></div>
        </div>
      </section>

      <section className="included-band">
        <div className="shell included-grid"><div><span className="eyebrow eyebrow-light">Renting todo incluido</span><h2>El coche es la parte divertida.<br/>Del resto nos ocupamos.</h2></div><div className="included-list"><span><Check />Seguro</span><span><Check />Mantenimiento y averías</span><span><Check />Impuestos e ITV</span><span><Check />Asistencia en carretera</span><span><Check />Sin entrada</span><span><Check />Neumáticos según condiciones</span></div></div>
      </section>

      <section className="shell detail-advisor"><div><span className="eyebrow">¿Te encaja?</span><h2>Antes de decidir, compáralo bien.</h2><p>Un asesor de PRISMA puede contrastar esta oferta con alternativas de otros operadores y ajustar kilómetros, plazo o servicios.</p></div><Link href="/#asesor" className="button button-dark">Quiero que me asesoren <ArrowUpRight /></Link></section>
    </main>
  );
}
