import Link from "next/link";
import OriginalCatalogClient from "@/components/original/OriginalCatalogClient";
import { OriginalFooter, OriginalHeader } from "@/components/original/OriginalChrome";
import { getOriginalPage, getProductsForProfile } from "@/lib/original-source";
import { prepareOriginalHtml } from "@/lib/source-html";

export type OriginalProfileKey = "particulares" | "autonomos" | "empresas";

const config = {
  particulares: { sourcePath: "/renting-coches-particulares/", eyebrow: "Renting para particulares", fallbackTitle: "Renting de coches para particulares" },
  autonomos: { sourcePath: "/renting-coches-autonomos/", eyebrow: "Renting para autónomos", fallbackTitle: "Renting de coches para autónomos" },
  empresas: { sourcePath: "/renting-coches-empresas/", eyebrow: "Renting para empresas", fallbackTitle: "Renting de coches y vehículos para empresas" },
} as const;

export default function OriginalProfileTemplate({ profile }: { profile: OriginalProfileKey }) {
  const details = config[profile];
  const page = getOriginalPage(details.sourcePath);
  const products = getProductsForProfile(profile);
  const title = page?.h1?.[0] || details.fallbackTitle;
  const content = prepareOriginalHtml(page?.content_html || "");

  return (
    <main className={`source-page source-profile-page source-profile-${profile}`}>
      <OriginalHeader />
      <section className="source-profile-hero">
        <div className="source-shell source-profile-hero-grid">
          <div><span className="source-eyebrow">{details.eyebrow}</span><h1>{title}</h1></div>
          <div>{page?.meta_description && <p>{page.meta_description}</p>}<div className="source-profile-actions"><a href="tel:+34699242581" className="source-dark-button">Hablar con PRISMA</a><Link href="/ofertas-de-renting/">Ver todas las ofertas</Link></div></div>
        </div>
      </section>

      <section className="source-profile-catalog">
        <div className="source-shell">
          <div className="source-section-heading">
            <span>Catálogo para {profile}</span>
            <h2>{products.length} vehículos asociados a este perfil.</h2>
            <p>Esta selección se deriva de las taxonomías y asociaciones del catálogo original. Cada perfil conserva su inventario real.</p>
          </div>
          <OriginalCatalogClient products={products} />
        </div>
      </section>

      {content && <section className="source-shell source-profile-original-content"><div className="source-content-flow" dangerouslySetInnerHTML={{ __html: content }} /></section>}
      {!content && page?.body_text && <section className="source-shell source-profile-original-content"><div className="source-content-fallback"><p>{page.body_text}</p></div></section>}
      <OriginalFooter />
    </main>
  );
}
