"use client";

import Link from "next/link";
import { useState } from "react";
import SelectionNav from "@/components/SelectionNav";
import { Close, Menu } from "@/components/Icons";

type HeaderProps = {
  theme?: "light" | "dark";
  variant?: "default" | "home";
};

export default function Header({ theme = "light", variant = "default" }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const dark = theme === "dark";
  const home = variant === "home";

  return (
    <header className={`site-header ${dark ? "site-header-dark" : ""} ${home ? "site-header-home" : ""}`}>
      <div className="shell site-nav">
        <div className="site-brand-lockup">
          <Link href="/" className="brand-logo" aria-label="PRISMA Renting" onClick={() => setOpen(false)}>
            <span className="brand-logo-image" aria-hidden="true" />
          </Link>
          {home && (
            <div className="site-brand-context" aria-hidden="true">
              <span>Grupo PRISMA</span>
              <strong>Especialistas en automoción</strong>
            </div>
          )}
        </div>

        <nav className="site-nav-links" aria-label="Navegación principal">
          <Link href="/ofertas">Ofertas</Link>
          <Link href="/perfil/particulares">Particulares</Link>
          <Link href="/perfil/autonomos">Autónomos</Link>
          <Link href="/perfil/empresas">Empresas</Link>
          <SelectionNav />
          <a href="tel:+34699242581" className="site-nav-phone">
            <span>{home ? "Hablar con un asesor" : "699 24 25 81"}</span>
            {home && <small>699 24 25 81</small>}
          </a>
        </nav>

        <button className="mobile-menu-button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? "Cerrar menú" : "Abrir menú"}>
          {open ? <Close /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="mobile-menu">
          <div className="shell mobile-menu-inner">
            <div className="mobile-menu-meta"><span>PRISMA Renting</span><strong>Encuentra la operación que encaja.</strong></div>
            <Link href="/ofertas" onClick={() => setOpen(false)}>Ofertas de renting</Link>
            <Link href="/perfil/particulares" onClick={() => setOpen(false)}>Particulares</Link>
            <Link href="/perfil/autonomos" onClick={() => setOpen(false)}>Autónomos</Link>
            <Link href="/perfil/empresas" onClick={() => setOpen(false)}>Empresas</Link>
            <Link href="/modalidades/entrega-inmediata" onClick={() => setOpen(false)}>Entrega inmediata</Link>
            <Link href="/modalidades/flexible" onClick={() => setOpen(false)}>Renting flexible</Link>
            <Link href="/alta-gama" onClick={() => setOpen(false)}>Alta Gama</Link>
            <Link href="/favoritos" onClick={() => setOpen(false)}>Favoritos</Link>
            <Link href="/comparar" onClick={() => setOpen(false)}>Comparar</Link>
            <a href="tel:+34699242581" className="mobile-menu-phone">Hablar con un asesor · 699 24 25 81</a>
          </div>
        </div>
      )}
    </header>
  );
}
