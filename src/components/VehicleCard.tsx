import Link from "next/link";
import type { Vehicle } from "@/data/vehicles";
import { ArrowUpRight } from "@/components/Icons";

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link className="vehicle-card" href={`/ofertas/${vehicle.slug}`}>
      <div className="vehicle-image" style={{ backgroundImage: `url(${vehicle.image})` }}>
        <div className="vehicle-image-shade" />
        {vehicle.badge && <span className="badge">{vehicle.badge}</span>}
        <span className="vehicle-open">Ver oferta <ArrowUpRight /></span>
      </div>
      <div className="vehicle-meta">
        <div className="vehicle-title-line"><div><span>{vehicle.brand}</span><h3>{vehicle.name}</h3></div><strong>{vehicle.price} €<small>/mes + IVA</small></strong></div>
        <p>{vehicle.variant}</p>
        <div className="vehicle-spec-line"><span>{vehicle.fuel}</span><span>{vehicle.transmission}</span><span>{vehicle.km.toLocaleString("es-ES")} km/año</span></div>
      </div>
    </Link>
  );
}
