import Link from "next/link";

export default function Header() {
  return (
    <header className="header">
      <div className="shell nav">
        <Link href="/" className="brand">PRISMA<span>RENTING</span></Link>
        <nav className="nav-links">
          <Link href="/ofertas">Ofertas</Link>
          <Link href="/#asesor">Cómo funciona</Link>
          <Link href="/#asesor">Empresas</Link>
          <Link href="/#asesor">Contacto</Link>
          <Link href="/#asesor" className="nav-cta">Encuentra tu coche</Link>
        </nav>
      </div>
    </header>
  );
}
