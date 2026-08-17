import Link from "next/link";

export default function Header(){return <header className="header"><div className="shell nav"><Link href="/" className="brand">PRISMA<span>RENTING</span></Link><nav className="nav-links"><Link href="/ofertas">Ofertas</Link><a href="/#asesor">Cómo funciona</a><a href="/#asesor">Empresas</a><a href="/#asesor">Contacto</a><a href="/#asesor" className="nav-cta">Encuentra tu coche</a></nav></div></header>}
