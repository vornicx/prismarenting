import Link from "next/link";

export default function Header({ theme = "light" }: { theme?: "light" | "dark" }) {
  return (
    <header className={`site-header ${theme === "dark" ? "site-header-dark" : ""}`}>
      <div className="shell site-nav">
        <Link href="/" className="brand-logo" aria-label="PRISMA Renting">
          <span className="brand-logo-image" aria-hidden="true" />
        </Link>
        <nav className="site-nav-links" aria-label="Navegación principal">
          <Link href="/ofertas">Ofertas</Link>
          <Link href="/#experiencia">Cómo funciona</Link>
          <Link href="/#perfiles">Empresas</Link>
          <a href="tel:+34699242581" className="site-nav-phone">699 24 25 81</a>
          <Link href="/#asesor" className="site-nav-cta">Encuentra tu coche</Link>
        </nav>
      </div>
    </header>
  );
}
