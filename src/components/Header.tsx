"use client";

import Link from "next/link";
import { useState } from "react";
import SelectionNav from "@/components/SelectionNav";
import { Close, Menu } from "@/components/Icons";

export default function Header({ theme = "light" }: { theme?: "light" | "dark" }) {
  const [open, setOpen] = useState(false);
  const dark = theme === "dark";

  return (
    <header className={`site-header ${dark ? "site-header-dark" : ""}`}>
      <div className="shell site-nav">
        <Link href="/" className="brand-logo" aria-label="PRISMA Renting" onClick={() => setOpen(false)}>
          <span className="brand-logo-image" aria-hidden="true" />
        </Link>

        <nav className="site-nav-links" aria-label="Navegación principal">
          <Link href="/ofertas">Coches</Link>
          <Link href="/alta-gama">Alta Gama</Link>
          <Link href="/#encuentra">Encuentra el tuyo</Link>
          <SelectionNav />
          <a href="tel:+34699242581" className="site-nav-phone">699 24 25 81</a>
        </nav>

        <button className="mobile-menu-button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? "Cerrar menú" : "Abrir menú"}>
          {open ? <Close /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="mobile-menu">
          <div className="shell mobile-menu-inner">
            <Link href="/ofertas" onClick={() => setOpen(false)}>Coches</Link>
            <Link href="/alta-gama" onClick={() => setOpen(false)}>Alta Gama</Link>
            <Link href="/#encuentra" onClick={() => setOpen(false)}>Encuentra el tuyo</Link>
            <Link href="/favoritos" onClick={() => setOpen(false)}>Favoritos</Link>
            <Link href="/comparar" onClick={() => setOpen(false)}>Comparar</Link>
            <a href="tel:+34699242581">699 24 25 81</a>
          </div>
        </div>
      )}
    </header>
  );
}
