import { ArrowUpRight } from "@/components/Icons";

const articles = [
  {
    date: "12.06.26",
    title: "Rutas by PRISMA Renting: Alicante",
    kind: "Ruta · Automoción",
    href: "https://prismarenting.com/rutas-by-prisma-renting-alicante/",
    feature: true,
  },
  {
    date: "19.04.22",
    title: "¿Cómo funciona el renting de PRISMA Renting?",
    kind: "Guía de renting",
    href: "https://prismarenting.com/como-funciona-el-renting-de-prisma-renting/",
    feature: false,
  },
  {
    date: "01.03.22",
    title: "Rutas by PRISMA Renting: Galicia",
    kind: "Ruta · Automoción",
    href: "https://prismarenting.com/rutas-by-prisma-renting-galicia/",
    feature: false,
  },
] as const;

export default function PrismaJournal() {
  const [feature, ...secondary] = articles;

  return (
    <section className="prisma-journal" aria-labelledby="journal-title">
      <div className="shell prisma-journal-head">
        <span>Conoce las últimas novedades</span>
        <h2 id="journal-title">Guías, rutas y actualidad para elegir y disfrutar mejor el coche.</h2>
        <a href="https://prismarenting.com/blog/" target="_blank" rel="noreferrer">Ver todas las novedades <ArrowUpRight /></a>
      </div>

      <div className="shell prisma-journal-layout">
        <a href={feature.href} target="_blank" rel="noreferrer" className="journal-feature">
          <div className="journal-feature-date"><strong>2026</strong><span>{feature.date}</span></div>
          <div className="journal-feature-copy"><span>{feature.kind}</span><h3>{feature.title}</h3><div>Leer artículo <ArrowUpRight /></div></div>
          <div className="journal-roadline" aria-hidden="true"><span>PRISMA / ROUTES / ALICANTE / 2026</span></div>
        </a>

        <div className="journal-index">
          {secondary.map((article, index) => (
            <a href={article.href} target="_blank" rel="noreferrer" key={article.href} className="journal-index-row">
              <span>0{index + 2}</span>
              <div><small>{article.date} · {article.kind}</small><strong>{article.title}</strong></div>
              <ArrowUpRight />
            </a>
          ))}
          <a href="https://prismarenting.com/blog/" target="_blank" rel="noreferrer" className="journal-all">Ver archivo completo <ArrowUpRight /></a>
        </div>
      </div>
    </section>
  );
}
