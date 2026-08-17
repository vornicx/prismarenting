import Image from "next/image";
import Link from "next/link";
import { getOriginalPages } from "@/lib/original-source";

const primary = [
  ["Ofertas de renting", "/ofertas-de-renting/"],
  ["Particulares", "/renting-coches-particulares/"],
  ["Autónomos", "/renting-coches-autonomos/"],
  ["Empresas", "/renting-coches-empresas/"],
] as const;

const fixedFooter = [
  ["Nosotros", "/nosotros/"],
  ["Preguntas frecuentes", "/faqs/"],
  ["Contacto", "/contacto/"],
  ["Blog", "/blog/"],
] as const;

export function OriginalHeader() {
  return (
    <header className="source-header">
      <div className="source-shell source-header-inner">
        <Link href="/" className="source-logo" aria-label="PRISMA Renting">
          <Image
            src="https://prismarenting.com/wp-content/uploads/2021/12/nuevo-logo-prisma-renting.webp"
            alt="PRISMA Renting"
            width={190}
            height={42}
            priority
          />
        </Link>
        <nav className="source-primary-nav" aria-label="Navegación principal">
          {primary.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
        </nav>
        <a className="source-phone" href="tel:+34699242581"><span>Asesoramiento</span><strong>699 24 25 81</strong></a>
        <details className="source-mobile-menu">
          <summary>Menú</summary>
          <div>
            {primary.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
            {fixedFooter.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
            <a href="tel:+34699242581">699 24 25 81</a>
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
    <footer className="source-footer">
      <div className="source-shell source-footer-main">
        <div className="source-footer-brand">
          <Image
            src="https://prismarenting.com/wp-content/uploads/2021/12/nuevo-logo-prisma-renting.webp"
            alt="PRISMA Renting"
            width={220}
            height={50}
          />
          <p>Grupo PRISMA · Especialistas en automoción</p>
          <p>Paseo Imperial 8, 1A · 28005 Madrid<br />699 24 25 81 · hola@prismarenting.com</p>
        </div>
        <div className="source-footer-column">
          <span>Renting</span>
          {primary.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
          {fixedFooter.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
        </div>
        <div className="source-footer-column source-footer-discovered">
          <span>Todo el renting de PRISMA</span>
          <div className="source-footer-link-grid">
            {discovered.map((page) => (
              <Link href={page.path} key={page.path}>{page.h1?.[0] || page.title.replace(/\s*[|–-].*$/, "")}</Link>
            ))}
          </div>
        </div>
      </div>
      <div className="source-shell source-footer-bottom">
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
