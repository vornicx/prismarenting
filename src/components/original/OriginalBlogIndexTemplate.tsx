import Link from "next/link";
import { OriginalFooter, OriginalHeader } from "@/components/original/OriginalChrome";
import { getOriginalPage, getOriginalPages } from "@/lib/original-source";

function imageFromHtml(html?: string) {
  if (!html) return undefined;
  const match = html.match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i);
  if (!match) return undefined;
  const src = match[1];
  if (src.startsWith("/wp-content/") || src.startsWith("/wp-includes/")) return `https://prismarenting.com${src}`;
  return src;
}

function excerpt(value?: string) {
  if (!value) return "";
  const compact = value.replace(/\s+/g, " ").trim();
  return compact.length > 190 ? `${compact.slice(0, 187).trim()}…` : compact;
}

export default function OriginalBlogIndexTemplate() {
  const page = getOriginalPage("/blog/");
  const posts = getOriginalPages().filter((item) => item.type === "blog-post").sort((a, b) => a.path.localeCompare(b.path, "es")).reverse();

  return (
    <main className="source-page source-blog-page">
      <OriginalHeader />
      <section className="source-page-hero source-blog-hero">
        <div className="source-shell source-page-hero-grid">
          <div><span className="source-eyebrow">PRISMA Renting · Actualidad</span><h1>{page?.title || "Blog"}</h1></div>
          <div className="source-page-intro"><p>{page?.meta_description || "Guías, rutas, actualidad y consejos sobre renting y automoción publicados por PRISMA."}</p><Link href="/ofertas-de-renting/">Ver ofertas de renting</Link></div>
        </div>
      </section>
      <section className="source-shell source-blog-index">
        <div className="source-section-heading"><span>Archivo completo</span><h2>{posts.length} artículos migrados.</h2><span /></div>
        <div className="source-blog-grid">
          {posts.map((post, index) => {
            const image = imageFromHtml(post.content_html);
            return (
              <article className={`source-blog-card ${index === 0 ? "source-blog-card-lead" : ""}`} key={post.path}>
                {image && <Link href={post.path} className="source-blog-media" style={{ backgroundImage: `url(${image})` }} aria-label={post.h1?.[0] || post.title} />}
                <div className="source-blog-copy"><span>PRISMA · {String(index + 1).padStart(2, "0")}</span><h2><Link href={post.path}>{post.h1?.[0] || post.title}</Link></h2><p>{excerpt(post.meta_description || post.body_text)}</p><Link href={post.path}>Leer artículo <span aria-hidden="true">↗</span></Link></div>
              </article>
            );
          })}
        </div>
      </section>
      <OriginalFooter />
    </main>
  );
}
