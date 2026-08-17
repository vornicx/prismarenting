import Image from "next/image";
import Link from "next/link";
import { getOriginalPages } from "@/lib/original-source";

const primary = [
  ["Ofertas", "/ofertas-de-renting/"],
  ["Particulares", "/renting-coches-particulares/"],
  ["Autónomos", "/renting-coches-autonomos/"],
  ["Empresas", "/renting-coches-empresas/"],
] as const;

const modalities = [
  ["Entrega inmediata", "/renting-entrega-inmediata/"],
  ["Renting flexible", "/renting-flexible/"],
  ["Alta gama", "/alta-gama/"],
] as const;

const company = [
  ["Nosotros", "/nosotros/"],
  ["Preguntas frecuentes", "/faqs/"],
  ["Contacto", "/contacto/"],
  ["Blog", "/blog/"],
] as const;

export function OriginalHeader() {
  return (
    <header className="prisma-header">
      <div className="prisma-shell prisma-header-inner">
        <Link href="/" className="prisma-logo" aria-label="PRISMA Renting, inicio">
          <Image
            src="https://prismarenting.com/wp-content/uploads/2021/12/nuevo-logo-prisma-renting.webp"
            alt="PRISMA Renting"
            width={190}
            height={42}
            priority
          />
        </Link>

        <nav className="prisma-primary-nav" aria-label="Navegación principal">
          {primary.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
        </nav>

        <div className="prisma-header-actions">
          <a className="prisma-header-phone" href="tel:+34699242581">
            <span>Asesoramiento</span>
            <strong>699 24 25 81</strong>
          </a>
          <Link className="prisma-header-cta" href="/contacto/">Hablar con PRISMA</Link>
        </div>

        <details className="prisma-mobile-menu">
          <summary aria-label="Abrir menú"><span>Menú</span><i aria-hidden="true" /></summary>
          <div className="prisma-mobile-panel">
            <nav aria-label="Navegación móvil">
              {primary.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
              {modalities.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
              {company.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
            </nav>
            <a className="prisma-mobile-phone" href="tel:+34699242581">699 24 25 81</a>
          </div>
        </details>
      </div>
    </header>
  );
}

export function OriginalFooter() {
  const discovered = getOriginalPages()
    .filter((page) => page.type === "seo-landing" && page.path !== "/")
    .filter((page, index, list) => list.findIndex((candidate) => candidate.path === page.path) === index)
    .sort((a, b) => (a.h1?.[0] || a.title).localeCompare(b.h1?.[0] || b.title, "es"));

  return (
    <footer className="prisma-footer">
      <section className="prisma-footer-cta">
        <div className="prisma-shell prisma-footer-cta-grid">
          <div>
            <span>¿No encuentras la operación que buscas?</span>
            <h2>PRISMA también trabaja el renting a medida.</h2>
          </div>
          <div>
            <p>Cuéntanos vehículo, uso, presupuesto y perfil. Un especialista puede ayudarte a comparar alternativas entre distintas compañías de renting.</p>
            <div className="prisma-footer-cta-actions">
              <Link href="/contacto/">Pedir asesoramiento</Link>
              <a href="tel:+34699242581">699 24 25 81</a>
            </div>
          </div>
        </div>
      </section>

      <div className="prisma-shell prisma-footer-main">
        <div className="prisma-footer-brand">
          <Image
            src="https://prismarenting.com/wp-content/uploads/2021/12/nuevo-logo-prisma-renting.webp"
            alt="PRISMA Renting"
            width={220}
            height={50}
          />
          <p>Grupo PRISMA · Especialistas en automoción.</p>
          <p>Paseo Imperial 8, 1A · 28005 Madrid<br />699 24 25 81 · hola@prismarenting.com</p>
        </div>

        <div className="prisma-footer-column">
          <span>Renting</span>
          {primary.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
        </div>
        <div className="prisma-footer-column">
          <span>Modalidades</span>
          {modalities.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
        </div>
        <div className="prisma-footer-column">
          <span>PRISMA</span>
          {company.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
        </div>
      </div>

      <div className="prisma-shell prisma-footer-directory">
        <details>
          <summary>Explorar todas las categorías, marcas y modalidades <span>{discovered.length} rutas</span></summary>
          <div className="prisma-footer-link-grid">
            {discovered.map((page) => (
              <Link href={page.path} key={page.path}>{page.h1?.[0] || page.title.replace(/\s*[|–-].*$/, "")}</Link>
            ))}
          </div>
        </details>
      </div>

      <div className="prisma-shell prisma-footer-bottom">
        <span>© 2026 Grupo PRISMA, Especialistas en Automoción, S.L.</span>
        <div>
          <Link href="/aviso-legal/">Aviso legal</Link>
          <Link href="/politica-de-privacidad/">Privacidad</Link>
          <Link href="/politica-de-cookies/">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
