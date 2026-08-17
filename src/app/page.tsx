import Link from "next/link";
import Header from "@/components/Header";
import Finder from "@/components/Finder";
import HeroVehicleStage from "@/components/HeroVehicleStage";
import QuickMatchLab from "@/components/QuickMatchLab";
import VehicleCard from "@/components/VehicleCard";
import { ArrowUpRight, Check } from "@/components/Icons";
import { vehicles } from "@/data/vehicles";

export default function Home() {
  return (
    <main>
      <section className="hero-stage">
        <Header />
        <div className="shell hero-stage-shell">
          <HeroVehicleStage vehicles={vehicles} />
        </div>
      </section>

      <div className="finder-dock shell">
        <Finder />
      </div>

      <section className="offer-deck shell">
        <div className="offer-deck-topline">
          <div>
            <span>Ofertas cargadas en el concepto</span>
            <strong>Empieza por el coche.</strong>
          </div>
          <Link href="/ofertas">Ver catálogo completo <ArrowUpRight /></Link>
        </div>
        <div className="offer-rail">
          {vehicles.slice(0, 4).map((vehicle) => (
            <VehicleCard key={vehicle.slug} vehicle={vehicle} mode="rail" />
          ))}
        </div>
      </section>

      <QuickMatchLab vehicles={vehicles} />

      <section className="renting-console">
        <div className="shell renting-console-grid">
          <div className="renting-console-title">
            <span>Una cuota mensual</span>
            <h2>Lo que deja de ser una sorpresa.</h2>
          </div>
          <div className="renting-inclusions">
            <div><Check /><span>Seguro</span><strong>Incluido</strong></div>
            <div><Check /><span>Mantenimiento</span><strong>Incluido</strong></div>
            <div><Check /><span>Impuestos e ITV</span><strong>Incluido</strong></div>
            <div><Check /><span>Asistencia</span><strong>Incluida</strong></div>
            <div><Check /><span>Entrada</span><strong>0 €*</strong></div>
          </div>
          <small>*Según la oferta y condiciones del operador. PRISMA confirma la propuesta final.</small>
        </div>
      </section>

      <section className="alta-gama-home">
        <div className="alta-gama-home-image" aria-hidden="true" />
        <div className="alta-gama-home-overlay" />
        <div className="shell alta-gama-home-content">
          <span>Otro lenguaje. El mismo sistema.</span>
          <div className="alta-gama-wordmark">ALTA GAMA</div>
          <div className="alta-gama-home-bottom">
            <p>Porsche, Aston Martin, Bentley, Ferrari, Lamborghini, Rolls-Royce y más marcas premium dentro de una experiencia independiente.</p>
            <Link href="/alta-gama" className="luxury-link">Entrar en Alta Gama <ArrowUpRight /></Link>
          </div>
        </div>
      </section>

      <section className="trust-system shell">
        <div className="trust-major">
          <strong>25+</strong>
          <span>años en automoción</span>
        </div>
        <div className="trust-cell"><span>Modelo</span><strong>Multioperador</strong></div>
        <div className="trust-cell"><span>Perfiles</span><strong>Particular · Autónomo · Empresa</strong></div>
        <div className="trust-cell"><span>Atención</span><strong>Asesor personal</strong></div>
        <div className="trust-cell"><span>Sede</span><strong>Madrid</strong></div>
      </section>

      <footer className="footer">
        <div className="shell footer-top">
          <div className="footer-logo" aria-label="PRISMA Renting" />
          <div><span>Madrid</span><p>Paseo Imperial 8, 1A<br />28005 Madrid</p></div>
          <div><span>Contacto</span><p><a href="tel:+34699242581">699 24 25 81</a><br /><a href="mailto:hola@prismarenting.com">hola@prismarenting.com</a></p></div>
          <div><span>Explorar</span><p><Link href="/ofertas">Coches</Link><br /><Link href="/alta-gama">Alta Gama</Link><br /><Link href="/favoritos">Favoritos</Link></p></div>
        </div>
        <div className="shell footer-bottom">
          <span>© 2026 Grupo PRISMA, Especialistas en Automoción, S.L.</span>
          <Link href="/control">PRISMA Control</Link>
        </div>
      </footer>
    </main>
  );
}
