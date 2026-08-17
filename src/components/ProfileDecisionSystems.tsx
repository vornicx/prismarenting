import Link from "next/link";
import { ArrowUpRight, Check } from "@/components/Icons";

export function ParticularDecisionMap() {
  return (
    <section className="profile-particular-system shell" aria-labelledby="particular-system-title">
      <div className="profile-system-index"><span>Elegir como particular</span><strong>Empieza por tu uso, no por una lista infinita.</strong></div>
      <div className="particular-use-map">
        <div className="particular-use-main">
          <span>01 · Uso principal</span>
          <h2 id="particular-system-title">¿Dónde va a vivir el coche?</h2>
          <div className="particular-use-links">
            <Link href="/ofertas?cliente=particular&body=Urbano"><strong>Ciudad</strong><small>Compacto · fácil de mover · cuota contenida</small><ArrowUpRight /></Link>
            <Link href="/ofertas?cliente=particular&body=SUV"><strong>Mixto / familia</strong><small>Más espacio · posición alta · viaje</small><ArrowUpRight /></Link>
            <Link href="/alta-gama"><strong>Premium</strong><small>Prestaciones y producto como prioridad</small><ArrowUpRight /></Link>
          </div>
        </div>
        <div className="particular-use-facts">
          <div><span>02</span><strong>Kilómetros</strong><p>La operación tiene que partir de una estimación realista de uso anual.</p></div>
          <div><span>03</span><strong>Plazo</strong><p>La duración forma parte de la propuesta y debe confirmarse con el operador.</p></div>
          <div><span>04</span><strong>Servicios</strong><p>Revisa qué incluye exactamente la oferta antes de decidir solo por cuota.</p></div>
        </div>
      </div>
    </section>
  );
}

export function AutonomoOperatingDesk() {
  const modes = [
    ["Tradicional", "Operación estable a medio/largo plazo", "/modalidades/tradicional"],
    ["ECO", "Tecnología electrificada según uso", "/modalidades/eco"],
    ["Flexible", "Necesidad temporal o cambiante", "/modalidades/flexible"],
    ["Segunda mano", "Prioridad en acceso/precio", "/modalidades/segunda-mano"],
    ["A medida", "Modelo o equipamiento específico", "/modalidades/a-medida"],
  ] as const;

  return (
    <section className="autonomo-desk" aria-labelledby="autonomo-desk-title">
      <div className="shell autonomo-desk-grid">
        <div className="autonomo-desk-heading">
          <span>Autónomos</span>
          <h2 id="autonomo-desk-title">El coche es parte de la actividad.</h2>
          <p>Elige modalidad y vehículo teniendo en cuenta el uso profesional, los kilómetros previstos, la documentación y el estudio de la operación.</p>
        </div>

        <div className="autonomo-mode-table">
          {modes.map(([name, detail, href], index) => (
            <Link href={href} key={name}><span>{String(index + 1).padStart(2, "0")}</span><strong>{name}</strong><small>{detail}</small><ArrowUpRight /></Link>
          ))}
        </div>
      </div>

      <div className="shell autonomo-study-rail">
        <div><span>Actividad</span><strong>Cómo y para qué se usará</strong></div>
        <div><span>Operación</span><strong>Modelo · km · plazo</strong></div>
        <div><span>Documentación</span><strong>La requerida por el operador para estudio</strong></div>
        <div><span>Fiscalidad</span><strong>Validar según actividad y asesoría</strong></div>
        <div><span>Resultado</span><strong>Propuesta confirmada</strong></div>
      </div>
    </section>
  );
}

export function EmpresaFleetDesk() {
  return (
    <section className="empresa-fleet-desk" aria-labelledby="empresa-desk-title">
      <div className="shell empresa-fleet-head">
        <span>Movilidad de empresa</span>
        <h2 id="empresa-desk-title">De una unidad a una flota, la operación cambia.</h2>
      </div>

      <div className="shell empresa-fleet-grid">
        <div className="empresa-volume">
          <div><span>01</span><strong>Una unidad</strong><p>Necesidad concreta para dirección, comercial o actividad operativa.</p></div>
          <div><span>02</span><strong>Varias unidades</strong><p>Comparación coordinada de modelos, usos y plazos.</p></div>
          <div><span>03</span><strong>Flota</strong><p>Un interlocutor y una visión consolidada de solicitudes y renovaciones.</p></div>
        </div>

        <div className="empresa-control-brief">
          <span>Datos para preparar la propuesta</span>
          <div><Check /><strong>Número de vehículos</strong></div>
          <div><Check /><strong>Uso y perfiles de conductor</strong></div>
          <div><Check /><strong>Kilometraje y duración esperada</strong></div>
          <div><Check /><strong>Presupuesto / política de vehículo</strong></div>
          <div><Check /><strong>Calendario de incorporación</strong></div>
          <Link href="/#encuentra">Preparar solicitud <ArrowUpRight /></Link>
        </div>
      </div>
    </section>
  );
}
