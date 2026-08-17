"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { Check, WhatsAppMark } from "@/components/Icons";
import { COMPARE_KEY, writeVehicleSelection } from "@/hooks/useVehicleSelection";
import type { Vehicle } from "@/data/vehicles";

export default function ComparisonExperience({ selected }: { selected: Vehicle[] }) {
  const router = useRouter();

  const remove = (slug: string) => {
    const remaining = selected.filter((vehicle) => vehicle.slug !== slug);
    writeVehicleSelection(COMPARE_KEY, remaining.map((vehicle) => vehicle.slug));
    const query = remaining.map((vehicle) => vehicle.slug).join(",");
    router.replace(query ? `/comparar?cars=${query}` : "/comparar");
  };

  const whatsapp = selected.length
    ? `https://wa.me/34699242581?text=${encodeURIComponent(`Hola, estoy comparando en PRISMA Renting: ${selected.map((vehicle) => `${vehicle.name} (${vehicle.price} €/mes + IVA)`).join(", ")}. ¿Podéis ayudarme a valorar cuál encaja mejor y confirmar condiciones?`)}`
    : "https://wa.me/34699242581";

  if (!selected.length) {
    return (
      <section className="comparison-empty shell">
        <span className="comparison-index">00</span>
        <h1>El comparador empieza<br/>con dos coches.</h1>
        <p>Añade hasta tres ofertas desde el catálogo. Aquí verás cuota, kilometraje, transmisión y condiciones de referencia sin saltar entre pestañas.</p>
        <Link href="/ofertas" className="button button-dark">Elegir coches</Link>
      </section>
    );
  }

  return (
    <>
      <section className="shell comparison-intro">
        <span>Comparador PRISMA</span>
        <h1>{selected.length === 1 ? "Añade otro coche." : `${selected.length} coches. Una decisión.`}</h1>
      </section>

      <section className="shell comparison-table" style={{ "--compare-count": selected.length } as CSSProperties}>
        <div className="comparison-label-column" aria-hidden="true">
          <div className="comparison-label-spacer" />
          <span>Cuota</span>
          <span>Km/año</span>
          <span>Duración</span>
          <span>Motor</span>
          <span>Cambio</span>
          <span>Carrocería</span>
          <span>Disponibilidad</span>
        </div>

        {selected.map((vehicle) => (
          <article className="comparison-column" key={vehicle.slug}>
            <div className="comparison-product">
              <button type="button" onClick={() => remove(vehicle.slug)}>Quitar</button>
              <div className="comparison-image">
                <Image src={vehicle.image} alt={vehicle.name} fill sizes="(max-width: 900px) 90vw, 30vw" className="comparison-image-object" />
              </div>
              <span>{vehicle.brand}</span>
              <h2>{vehicle.name}</h2>
            </div>
            <strong className="comparison-value comparison-price">{vehicle.price.toLocaleString("es-ES")} €<small>/mes + IVA</small></strong>
            <strong className="comparison-value">{vehicle.km.toLocaleString("es-ES")}</strong>
            <strong className="comparison-value">{vehicle.term} meses</strong>
            <strong className="comparison-value">{vehicle.fuel}</strong>
            <strong className="comparison-value">{vehicle.transmission}</strong>
            <strong className="comparison-value">{vehicle.body}</strong>
            <strong className="comparison-value">{vehicle.delivery}</strong>
            <Link href={`/ofertas/${vehicle.slug}`} className="comparison-open">Abrir oferta</Link>
          </article>
        ))}
      </section>

      <section className="comparison-included">
        <div className="shell comparison-included-inner">
          <div>
            <span>En las propuestas PRISMA</span>
            <h2>Compara el coche.<br/>No olvides lo que incluye.</h2>
          </div>
          <div className="comparison-checks">
            <span><Check /> Seguro</span>
            <span><Check /> Mantenimiento</span>
            <span><Check /> Impuestos e ITV</span>
            <span><Check /> Asistencia</span>
          </div>
          <a href={whatsapp} target="_blank" rel="noreferrer" className="button button-whatsapp"><WhatsAppMark /> Preguntar por estos coches</a>
        </div>
      </section>
    </>
  );
}
