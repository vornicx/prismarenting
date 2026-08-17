"use client";

import { useMemo, useState } from "react";
import { WhatsAppMark } from "@/components/Icons";
import type { Vehicle } from "@/data/vehicles";

const terms = [36, 48, 60];
const kilometreOptions = [10000, 15000, 20000, 25000];

export default function RequestConfigurator({ vehicle }: { vehicle: Vehicle }) {
  const [profile, setProfile] = useState<"Particular" | "Autónomo" | "Empresa">("Particular");
  const [term, setTerm] = useState(vehicle.term);
  const [km, setKm] = useState(vehicle.km);
  const [timing, setTiming] = useState("Lo antes posible");

  const whatsapp = useMemo(() => {
    const message = [
      `Hola, estoy viendo el ${vehicle.name} en PRISMA Renting.`,
      `Quiero una propuesta para: ${profile}.`,
      `Configuración: ${term} meses · ${km.toLocaleString("es-ES")} km/año.`,
      `Lo necesito: ${timing}.`,
      `Referencia web: ${vehicle.price.toLocaleString("es-ES")} €/mes + IVA.`,
      "¿Podéis confirmarme disponibilidad y la mejor alternativa?",
    ].join("\n");
    return `https://wa.me/34699242581?text=${encodeURIComponent(message)}`;
  }, [km, profile, term, timing, vehicle.name, vehicle.price]);

  return (
    <div className="request-configurator">
      <div className="configurator-heading">
        <span>Configura la solicitud</span>
        <strong>No recalculamos una cuota ficticia. PRISMA confirma la propuesta real.</strong>
      </div>

      <div className="configurator-grid">
        <fieldset>
          <legend>Perfil</legend>
          <div className="configurator-options">
            {(["Particular", "Autónomo", "Empresa"] as const).map((item) => (
              <button type="button" key={item} className={profile === item ? "active" : ""} onClick={() => setProfile(item)}>{item}</button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Duración</legend>
          <div className="configurator-options">
            {terms.map((item) => (
              <button type="button" key={item} className={term === item ? "active" : ""} onClick={() => setTerm(item)}>{item} meses</button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Kilometraje anual</legend>
          <div className="configurator-options configurator-options-grid">
            {kilometreOptions.map((item) => (
              <button type="button" key={item} className={km === item ? "active" : ""} onClick={() => setKm(item)}>{item.toLocaleString("es-ES")} km</button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Cuándo lo necesitas</legend>
          <select value={timing} onChange={(event) => setTiming(event.target.value)}>
            <option>Lo antes posible</option>
            <option>En 1–2 meses</option>
            <option>En 3–6 meses</option>
            <option>Estoy comparando</option>
          </select>
        </fieldset>
      </div>

      <div className="configurator-summary">
        <div>
          <span>Solicitud preparada</span>
          <strong>{vehicle.name}</strong>
          <small>{profile} · {term} meses · {km.toLocaleString("es-ES")} km/año</small>
        </div>
        <a className="button button-whatsapp" href={whatsapp} target="_blank" rel="noreferrer">
          <WhatsAppMark /> Enviar por WhatsApp
        </a>
      </div>
    </div>
  );
}
