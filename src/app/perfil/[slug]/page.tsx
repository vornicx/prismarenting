import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { AutonomoOperatingDesk, EmpresaFleetDesk, ParticularDecisionMap } from "@/components/ProfileDecisionSystems";
import VehicleCard from "@/components/VehicleCard";
import { ArrowUpRight, Check } from "@/components/Icons";
import { vehicles } from "@/data/vehicles";

const profiles = {
  particulares: {
    eyebrow: "Renting para particulares",
    title: "Tu coche sin convertir cada gasto en una decisión nueva.",
    summary: "Empieza por uso, cuota y kilometraje. Después PRISMA contrasta plazo, disponibilidad y condiciones reales de la operación.",
    benefits: ["Cuota mensual definida", "Servicios asociados según oferta", "Sin compra inicial del vehículo", "Asesoramiento multioperador"],
    slugs: ["opel-corsa", "fiat-500", "nissan-juke"],
    faq: [
      ["¿Qué debo mirar además de la cuota?", "Kilometraje, duración, servicios incluidos, disponibilidad y condiciones de devolución o modificación del contrato."],
      ["¿Puedo pedir un coche que no aparece en el catálogo?", "Sí. La ruta de renting a medida prepara una solicitud para que PRISMA consulte alternativas y configuración."],
      ["¿Qué pasa al terminar?", "Las opciones dependen del contrato y del operador. Deben revisarse las condiciones concretas de renovación, devolución o posible cambio de vehículo."],
    ],
  },
  autonomos: {
    eyebrow: "Renting para autónomos",
    title: "Movilidad profesional ajustada a cómo trabajas.",
    summary: "El coche forma parte de la actividad. La operación debe considerar uso, kilómetros, modalidad, documentación y estudio, no solo el modelo que aparece en portada.",
    benefits: ["Cuota mensual definida", "Mantenimiento y averías según oferta", "Seguro según condiciones del operador", "Acompañamiento en el estudio de la operación"],
    slugs: ["hyundai-i20", "bmw-x5", "nissan-juke"],
    faq: [
      ["¿Qué documentación me pueden pedir?", "Depende del operador y del estudio. PRISMA coordina la documentación económica y de actividad necesaria para valorar la operación."],
      ["¿Puedo elegir renting flexible?", "Sí, PRISMA contempla distintas modalidades. La disponibilidad, duración y condiciones de una solución flexible deben confirmarse para cada caso."],
      ["¿Cómo trato la fiscalidad del renting?", "La fiscalidad depende de la actividad, el uso del vehículo y la normativa aplicable. Debe validarse con la asesoría fiscal del autónomo."],
    ],
  },
  empresas: {
    eyebrow: "Renting para empresas",
    title: "De una unidad a una necesidad de flota.",
    summary: "Centraliza vehículos, solicitudes, operadores y seguimiento comercial con un único equipo, desde una necesidad concreta hasta una flota con distintos perfiles de uso.",
    benefits: ["Una o varias unidades", "Comparación multioperador", "Interlocución comercial centralizada", "Operación adaptada a uso y calendario"],
    slugs: ["bmw-x5", "nissan-juke", "hyundai-i20"],
    faq: [
      ["¿Puedo solicitar varios vehículos?", "Sí. El briefing de empresa debe recoger número de unidades, uso, kilometraje, calendario y necesidades de los conductores para estructurar la consulta."],
      ["¿Todos los vehículos tienen que ser iguales?", "No necesariamente. Una necesidad de empresa puede agrupar distintos perfiles de vehículo y PRISMA puede contrastar alternativas por uso."],
      ["¿Cómo se coordina el estudio?", "PRISMA centraliza la interlocución comercial, mientras cada operador aplica sus requisitos y proceso de aprobación."],
    ],
  },
} as const;

type ProfileSlug = keyof typeof profiles;

const process = [
  ["01", "Necesidad", "Uso, vehículo y presupuesto."],
  ["02", "Alternativas", "PRISMA contrasta operadores y oferta."],
  ["03", "Estudio", "Se aporta la documentación necesaria."],
  ["04", "Aprobación", "Se confirman las condiciones de la operación."],
  ["05", "Entrega", "Firma, coordinación y recepción del vehículo."],
] as const;

export function generateStaticParams() {
  return Object.keys(profiles).map((slug) => ({ slug }));
}

export default async function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(slug in profiles)) notFound();
  const profileKey = slug as ProfileSlug;
  const profile = profiles[profileKey];
  const related = profile.slugs.map((vehicleSlug) => vehicles.find((vehicle) => vehicle.slug === vehicleSlug)).filter((vehicle): vehicle is (typeof vehicles)[number] => Boolean(vehicle));

  return (
    <main className={`intent-page profile-intent-page profile-${profileKey}`}>
      <section className="intent-hero profile-intent-hero">
        <Header />
        <div className="shell intent-hero-grid">
          <div><span>{profile.eyebrow}</span><h1>{profile.title}</h1></div>
          <div className="intent-hero-summary"><p>{profile.summary}</p><Link href={`/ofertas?cliente=${profileKey === "autonomos" ? "autónomo" : profileKey === "particulares" ? "particular" : "empresa"}`} className="button button-light">Ver ofertas <ArrowUpRight /></Link></div>
        </div>
      </section>

      <section className="shell profile-value-strip" aria-label={`Ventajas para ${profileKey}`}>
        {profile.benefits.map((benefit, index) => <div key={benefit}><span>{String(index + 1).padStart(2, "0")}</span><Check /><strong>{benefit}</strong></div>)}
      </section>

      <section className="shell intent-vehicles profile-offers">
        <div className="intent-section-line"><span>Empieza por vehículos reales</span><small>Selección orientativa para este perfil. PRISMA confirma disponibilidad y condiciones de cada operación.</small></div>
        <div className="catalog-grid">{related.map((vehicle) => <VehicleCard key={vehicle.slug} vehicle={vehicle} />)}</div>
      </section>

      {profileKey === "particulares" && <ParticularDecisionMap />}
      {profileKey === "autonomos" && <AutonomoOperatingDesk />}
      {profileKey === "empresas" && <EmpresaFleetDesk />}

      <section className="profile-process-system">
        <div className="shell profile-process-head"><span>Proceso</span><h2>Del brief a la entrega.</h2><a href="tel:+34699242581">Hablar con PRISMA <ArrowUpRight /></a></div>
        <div className="shell profile-process-track">{process.map(([number, title, copy]) => <div key={number}><span>{number}</span><strong>{title}</strong><p>{copy}</p></div>)}</div>
      </section>

      <section className="shell profile-faq" aria-labelledby="profile-faq-title">
        <div className="profile-faq-intro"><span>Preguntas frecuentes</span><h2 id="profile-faq-title">Lo que condiciona la operación.</h2></div>
        <div className="profile-faq-list">
          {profile.faq.map(([question, answer], index) => (
            <details key={question} open={index === 0}>
              <summary><span>{String(index + 1).padStart(2, "0")}</span><strong>{question}</strong><i>+</i></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="intent-contact profile-contact">
        <div className="shell intent-contact-grid"><div><span>Asesoramiento PRISMA</span><h2>Llega al asesor con la operación bien definida.</h2></div><div><p>Indica modelo o tipo de vehículo, uso, presupuesto, kilometraje y calendario. PRISMA contrasta alternativas y confirma las condiciones de la operación.</p><Link href="/#encuentra" className="button button-light">Preparar mi búsqueda <ArrowUpRight /></Link></div></div>
      </section>
    </main>
  );
}
