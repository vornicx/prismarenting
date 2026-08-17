import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import VehicleCard from "@/components/VehicleCard";
import { ArrowUpRight, Check } from "@/components/Icons";
import { vehicles } from "@/data/vehicles";

const profiles = {
  particulares: {
    eyebrow: "Renting para particulares",
    title: "Tu coche sin convertir cada gasto en una decisión nueva.",
    summary: "Empieza por la cuota y el uso real. Después se ajustan plazo, kilometraje y condiciones de la oferta.",
    benefits: ["Cuota mensual definida", "Servicios asociados según oferta", "Cambio de coche al finalizar según contrato"],
    slugs: ["opel-corsa", "fiat-500", "nissan-juke"],
  },
  autonomos: {
    eyebrow: "Renting para autónomos",
    title: "Movilidad profesional ajustada a cómo trabajas.",
    summary: "La web actual de PRISMA da mucho peso a autónomos. Aquí esa información se organiza alrededor de uso, kilómetros, documentación y operación, no de bloques de texto.",
    benefits: ["Uso profesional", "Operación adaptada a kilometraje", "Documentación y estudio comercial acompañados"],
    slugs: ["fiat-fiorino", "hyundai-i20", "bmw-x5"],
  },
  empresas: {
    eyebrow: "Renting para empresas",
    title: "De una unidad a una necesidad de flota.",
    summary: "Un punto único para centralizar vehículos, solicitudes y seguimiento comercial entre diferentes operadores.",
    benefits: ["Una o varias unidades", "Interlocución centralizada", "Comparación multioperador"],
    slugs: ["fiat-fiorino", "bmw-x5", "nissan-juke"],
  },
} as const;

type ProfileSlug = keyof typeof profiles;

export function generateStaticParams() {
  return Object.keys(profiles).map((slug) => ({ slug }));
}

export default async function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(slug in profiles)) notFound();
  const profile = profiles[slug as ProfileSlug];
  const related = profile.slugs.map((vehicleSlug) => vehicles.find((vehicle) => vehicle.slug === vehicleSlug)).filter(Boolean);

  return (
    <main className="intent-page profile-intent-page">
      <section className="intent-hero profile-intent-hero">
        <Header />
        <div className="shell intent-hero-grid">
          <div><span>{profile.eyebrow}</span><h1>{profile.title}</h1></div>
          <div className="intent-hero-summary"><p>{profile.summary}</p><Link href={`/ofertas?cliente=${slug}`} className="button button-light">Ver ofertas <ArrowUpRight /></Link></div>
        </div>
      </section>

      <section className="shell intent-facts profile-benefits">
        {profile.benefits.map((benefit) => <div key={benefit}><Check /><span>{benefit}</span></div>)}
      </section>

      <section className="shell intent-vehicles">
        <div className="intent-section-line"><span>Una selección para empezar</span><small>Ejemplos del catálogo del concepto. La propuesta final depende de perfil, operador y disponibilidad.</small></div>
        <div className="catalog-grid">{related.map((vehicle) => vehicle && <VehicleCard key={vehicle.slug} vehicle={vehicle} />)}</div>
      </section>

      <section className="profile-operation shell">
        <div className="profile-operation-label">Así debería funcionar la conversación</div>
        <div className="profile-operation-flow">
          <span>Uso</span><span>Presupuesto</span><span>Kilómetros</span><span>Plazo</span><span>Documentación</span><span>Propuesta</span>
        </div>
      </section>

      <section className="intent-contact">
        <div className="shell intent-contact-grid"><div><span>Asesoramiento PRISMA</span><h2>Una solicitud útil vale más que un formulario largo.</h2></div><div><p>La experiencia debe recoger lo suficiente para que el asesor pueda responder con contexto: qué necesitas, para qué, cuánto conduces y cuándo quieres el vehículo.</p><Link href="/#encuentra" className="button button-light">Preparar mi búsqueda <ArrowUpRight /></Link></div></div>
      </section>
    </main>
  );
}
