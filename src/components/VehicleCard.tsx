import Image from "next/image";
import Link from "next/link";
import VehicleActions from "@/components/VehicleActions";
import { ArrowUpRight } from "@/components/Icons";
import type { Vehicle } from "@/data/vehicles";

export default function VehicleCard({ vehicle, mode = "catalog" }: { vehicle: Vehicle; mode?: "catalog" | "rail" }) {
  return (
    <article className={`vehicle-card vehicle-card-${mode}`}>
      <div className="vehicle-visual">
        <Link href={`/ofertas/${vehicle.slug}`} aria-label={`Ver ${vehicle.name}`} className="vehicle-visual-link">
          <Image src={vehicle.image} alt={vehicle.name} fill sizes={mode === "rail" ? "(max-width: 900px) 86vw, 32vw" : "(max-width: 900px) 100vw, 42vw"} className="vehicle-card-image" />
        </Link>
        <div className="vehicle-card-topline">
          <span>{vehicle.badge || vehicle.body}</span>
          <VehicleActions slug={vehicle.slug} compact />
        </div>
      </div>

      <div className="vehicle-card-body">
        <div className="vehicle-card-heading">
          <div>
            <span>{vehicle.brand}</span>
            <Link href={`/ofertas/${vehicle.slug}`}><h3>{vehicle.name}</h3></Link>
          </div>
          <div className="vehicle-card-price">
            <strong>{vehicle.price.toLocaleString("es-ES")} €</strong>
            <small>/mes + IVA</small>
          </div>
        </div>

        <div className="vehicle-card-facts">
          <span>{vehicle.fuel}</span>
          <span>{vehicle.transmission}</span>
          <span>{vehicle.km.toLocaleString("es-ES")} km/año</span>
        </div>

        <Link href={`/ofertas/${vehicle.slug}`} className="vehicle-card-open">
          Configurar solicitud <ArrowUpRight />
        </Link>
      </div>
    </article>
  );
}
