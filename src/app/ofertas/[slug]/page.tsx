import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { Check } from "@/components/Icons";
import { vehicles } from "@/data/vehicles";

export function generateStaticParams(){return vehicles.map(v=>({slug:v.slug}))}
export default async function Detail({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params; const v=vehicles.find(x=>x.slug===slug); if(!v)notFound();
 return <main><Header/><section className="shell detail"><div className="breadcrumb"><Link href="/ofertas">Ofertas</Link> / {v.brand} / {v.name}</div><div className="detail-grid"><div className="detail-image" style={{backgroundImage:`url(${v.image})`}}/><div className="detail-copy"><span className="eyebrow">{v.brand} · Renting</span><h1>{v.name}</h1><p className="model-line">{v.variant}</p><div className="detail-price">{v.price} €<small>/mes + IVA</small></div><div className="specs"><div><span>Duración</span><strong>{v.term} meses</strong></div><div><span>Kilometraje</span><strong>{v.km.toLocaleString("es-ES")} km/año</strong></div><div><span>Combustible</span><strong>{v.fuel}</strong></div><div><span>Cambio</span><strong>{v.transmission}</strong></div><div><span>Carrocería</span><strong>{v.body}</strong></div><div><span>Disponibilidad</span><strong>{v.delivery}</strong></div></div><div className="detail-includes"><h3>Tu cuota incluye</h3><div className="include-row"><span><Check/>Seguro a todo riesgo</span><span><Check/>Mantenimiento</span><span><Check/>Impuestos</span><span><Check/>Asistencia</span></div></div><div className="detail-actions"><a href="/#asesor" className="button dark">Solicitar esta oferta</a><a href="/#asesor" className="button outline">Hablar con un asesor</a></div><p className="detail-note">Oferta orientativa sujeta a disponibilidad, aprobación y condiciones del operador. PRISMA te confirmará la propuesta final y alternativas disponibles.</p></div></div></section></main>
}
