import Link from "next/link";
import type { Vehicle } from "@/data/vehicles";

export default function VehicleCard({vehicle}:{vehicle:Vehicle}){
 return <Link className="vehicle-card" href={`/ofertas/${vehicle.slug}`}>
  <div className="vehicle-image" style={{backgroundImage:`url(${vehicle.image})`}}>{vehicle.badge&&<span className="badge">{vehicle.badge}</span>}</div>
  <div className="vehicle-meta"><span>{vehicle.brand} · {vehicle.fuel}</span><h3>{vehicle.name}</h3><div className="price-line"><div><span>{vehicle.term} meses</span><span>{vehicle.km.toLocaleString("es-ES")} km/año</span></div><strong>{vehicle.price} €<small>/mes + IVA</small></strong></div></div>
 </Link>
}
