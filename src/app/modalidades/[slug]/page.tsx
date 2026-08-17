import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import VehicleCard from "@/components/VehicleCard";
import { ArrowUpRight, Check } from "@/components/Icons";
import { vehicles } from "@/data/vehicles";

const modes = {
  "entrega-inmediata": {
    eyebrow: "Renting con entrega inmediata",
    title: "Cuando el coche no puede esperar.",
    summary: "Un acceso pensado para quien prioriza disponibilidad. PRISMA confirma stock, plazo y condiciones antes de formalizar la operación.",
    facts: ["Disponibilidad prioritaria", "Operación sujeta a stock", "Asesoramiento hasta la entrega"],
    slugs: ["hyundai-i20", "fiat-500", "nissan-juke"],
  },
  flexible: {
    eyebrow: "Renting flexible",
    title: "Movilidad por meses, no por años.",
    summary: "Para necesidades temporales o cambiantes. La duración, disponibilidad y servicios se confirman según la solución flexible disponible.",
    facts: ["Duración adaptable", "Cuota con servicios asociados", "Sin compromiso de largo plazo"],
    slugs: ["fiat-500", "hyundai-i20"],
  },
  eco: {
    eyebrow: "Renting ECO",
    title: "Híbrido y electrificado, sin complicar la búsqueda.",
    summary: "PRISMA agrupa alternativas de menor impacto para que combustible, etiqueta, uso y cuota puedan compararse en una misma decisión.",
    facts: ["Híbridos y electrificados", "Filtro por tecnología", "Asesoramiento multioperador"],
    slugs: ["fiat-500", "bmw-x5"],
  },
  tradicional: {
    eyebrow: "Renting tradicional",
    title: "Una cuota. Un coche. Una operación clara.",
    summary: "El renting a largo plazo sigue siendo el núcleo del catálogo: seleccionas vehículo y PRISMA contrasta la propuesta según plazo, kilometraje y perfil.",
    facts: ["Plazo definido", "Kilometraje acordado", "Servicios asociados según oferta"],
    slugs: ["opel-corsa", "nissan-juke", "hyundai-i20"],
  },
  "segunda-mano": {
    eyebrow: "Renting de segunda mano",
    title: "Más acceso, manteniendo la lógica del renting.",
    summary: "Una vía para quien prioriza precio y rapidez. La disponibilidad de unidades de segunda mano debe confirmarse con PRISMA.",
    facts: ["Disponibilidad variable", "Vehículos revisados según operador", "Consulta personalizada"],
    slugs: [],
  },
  "a-medida": {
    eyebrow: "Renting a medida",
    title: "Si el catálogo no encaja, la búsqueda no termina ahí.",
    summary: "Modelo, color, equipamiento, plazo o kilometraje pueden requerir una propuesta específica. Esta ruta convierte esa necesidad en un briefing útil para el asesor.",
    facts: ["Modelo específico", "Equipamiento y color", "Propuesta personalizada"],
    slugs: [],
  },
  motos: {
    eyebrow: "Renting de motos",
    title: "Otra forma de movilidad dentro del mismo ecosistema.",
    summary: "PRISMA también trabaja renting de motos. La oferta concreta y sus servicios se confirman con el equipo comercial.",
    facts: ["Particulares", "Autónomos", "Empresas"],
    slugs: [],
  },
} as const;

type ModeSlug = keyof typeof modes;

export function generateStaticParams() {
  return Object.keys(modes).map((slug) => ({ slug }));
}

export default async function ModalityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(slug in modes)) notFound();
  const mode = modes[slug as ModeSlug];
  const related = mode.slugs.map((vehicleSlug) => vehicles.find((vehicle) => vehicle.slug === vehicleSlug)).filter(Boolean);

  return (
    <main className="intent-page">
      <section className="intent-hero">
        <Header />
        <div className="shell intent-hero-grid">
          <div><span>{mode.eyebrow}</span><h1>{mode.title}</h1></div>
          <div className="intent-hero-summary"><p>{mode.summary}</p><Link href="/ofertas" className="button button-light">Ver catálogo <ArrowUpRight /></Link></div>
        </div>
      </section>

      <section className="shell intent-facts">
        {mode.facts.map((fact) => <div key={fact}><Check /><span>{fact}</span></div>)}
      </section>

      {related.length > 0 && (
        <section className="shell intent-vehicles">
          <div className="intent-section-line"><span>Vehículos para empezar a comparar</span><small>La modalidad y disponibilidad final deben confirmarse con PRISMA.</small></div>
          <div className="catalog-grid">{related.map((vehicle) => vehicle && <VehicleCard key={vehicle.slug} vehicle={vehicle} />)}</div>
        </section>
      )}

      <section className="intent-contact">
        <div className="shell intent-contact-grid"><div><span>No encuentras exactamente lo que buscas</span><h2>Haz que PRISMA busque la operación.</h2></div><div><p>Cuéntales modelo, uso, presupuesto y cuándo lo necesitas. El valor multioperador está precisamente en poder contrastar alternativas fuera de una única marca.</p><a href="https://wa.me/34699242581?text=Hola%20PRISMA%2C%20quiero%20consultar%20una%20opci%C3%B3n%20de%20renting" className="button button-light">Consultar por WhatsApp <ArrowUpRight /></a></div></div>
      </section>
    </main>
  );
}
