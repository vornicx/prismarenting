import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import VehicleCard from "@/components/VehicleCard";
import { ArrowUpRight } from "@/components/Icons";
import { vehicles } from "@/data/vehicles";

const types = {
  suv: { label: "SUV", body: "SUV", use: "Más altura, espacio y versatilidad para uso mixto." },
  furgonetas: { label: "Furgonetas", body: "Furgoneta", use: "Herramienta de trabajo, reparto y actividad profesional." },
  descapotables: { label: "Descapotables", body: null, use: "Una búsqueda más emocional donde modelo y disponibilidad pesan más que el volumen." },
  todoterreno: { label: "Todoterreno", body: null, use: "Capacidad y robustez para necesidades fuera del uso urbano convencional." },
  "alta-gama": { label: "Alta Gama", body: null, use: "Prestaciones, lujo y una experiencia comercial específica." },
  van: { label: "Van", body: "Furgoneta", use: "Espacio para pasajeros o carga con una operación pensada alrededor del uso." },
  deportivos: { label: "Deportivos", body: null, use: "Prestaciones y carácter como criterio principal de selección." },
  monovolumen: { label: "Monovolumen", body: null, use: "Habitabilidad y flexibilidad para familias o transporte de pasajeros." },
  "7-plazas": { label: "7 plazas", body: null, use: "Más plazas sin saltar necesariamente a un vehículo comercial." },
  "9-plazas": { label: "9 plazas", body: null, use: "Movilidad para grupos, equipos y necesidades profesionales." },
  familiar: { label: "Familiar", body: null, use: "Maletero, comodidad y espacio para viajar con más carga." },
  "pick-up": { label: "Pick Up", body: null, use: "Capacidad de carga y uso profesional en un formato específico." },
} as const;

type TypeSlug = keyof typeof types;

export function generateStaticParams() {
  return Object.keys(types).map((slug) => ({ slug }));
}

export default async function VehicleTypePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(slug in types)) notFound();
  const type = types[slug as TypeSlug];
  const matches = type.body ? vehicles.filter((vehicle) => vehicle.body === type.body) : [];

  return (
    <main className="intent-page type-intent-page">
      <section className="intent-hero type-intent-hero">
        <Header />
        <div className="shell type-hero-layout"><span>Renting por tipo de vehículo</span><h1>{type.label}</h1><p>{type.use}</p><Link href={type.body ? `/ofertas?body=${encodeURIComponent(type.body)}` : "/ofertas"} className="button button-light">Buscar en catálogo <ArrowUpRight /></Link></div>
      </section>

      {matches.length > 0 ? (
        <section className="shell intent-vehicles">
          <div className="intent-section-line"><span>Coincidencias del concepto</span><small>Filtrado sobre los vehículos cargados en esta demostración.</small></div>
          <div className="catalog-grid">{matches.map((vehicle) => <VehicleCard key={vehicle.slug} vehicle={vehicle} />)}</div>
        </section>
      ) : (
        <section className="shell type-empty-state"><strong>El catálogo real de PRISMA cubre esta categoría.</strong><p>En el concepto no vamos a inventar vehículos para llenar una cuadrícula. La implementación final se alimentaría del CMS o feed real y mantendría esta ruta para producto, navegación y SEO.</p><Link href="/ofertas">Ver vehículos cargados <ArrowUpRight /></Link></section>
      )}
    </main>
  );
}
