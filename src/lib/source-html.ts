const SOURCE_ORIGIN = "https://prismarenting.com";

function rewriteSrcset(value: string) {
  return value.split(",").map((part) => {
    const bits = part.trim().split(/\s+/);
    const source = bits[0] || "";
    if (source.startsWith("/wp-content/") || source.startsWith("/wp-includes/")) bits[0] = `${SOURCE_ORIGIN}${source}`;
    if (source.startsWith("http://prismarenting.com/")) bits[0] = source.replace("http://prismarenting.com", SOURCE_ORIGIN);
    if (source.startsWith("https://www.prismarenting.com/")) bits[0] = source.replace("https://www.prismarenting.com", SOURCE_ORIGIN);
    return bits.join(" ");
  }).join(", ");
}

export function prepareOriginalHtml(input: string) {
  if (!input) return "";
  let html = input;
  html = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<template\b[^>]*>[\s\S]*?<\/template>/gi, "")
    .replace(/\son(?:click|load|error|submit|change|input|focus|blur)=(?:"[^"]*"|'[^']*')/gi, "")
    .replace(/\sstyle=(?:"[^"]*"|'[^']*')/gi, "")
    .replace(/href=(['"])https?:\/\/(?:www\.)?prismarenting\.com([^'"]*)\1/gi, (_full, quote: string, path: string) => `href=${quote}${path || "/"}${quote}`)
    .replace(/href=(['"])\/\/prismarenting\.com([^'"]*)\1/gi, (_full, quote: string, path: string) => `href=${quote}${path || "/"}${quote}`)
    .replace(/(src|poster)=(['"])(\/(?:wp-content|wp-includes)\/[^'"]*)\2/gi, (_full, attr: string, quote: string, source: string) => `${attr}=${quote}${SOURCE_ORIGIN}${source}${quote}`)
    .replace(/(src|poster)=(['"])http:\/\/prismarenting\.com([^'"]*)\2/gi, (_full, attr: string, quote: string, source: string) => `${attr}=${quote}${SOURCE_ORIGIN}${source}${quote}`)
    .replace(/(src|poster)=(['"])https:\/\/www\.prismarenting\.com([^'"]*)\2/gi, (_full, attr: string, quote: string, source: string) => `${attr}=${quote}${SOURCE_ORIGIN}${source}${quote}`)
    .replace(/srcset=(['"])([^'"]*)\1/gi, (_full, quote: string, srcset: string) => `srcset=${quote}${rewriteSrcset(srcset)}${quote}`);

  // Prevent WordPress form endpoints from posting to the legacy site. Inputs remain visible
  // while the migrated project supplies its own operational forms later in the migration.
  html = html.replace(/<form\b([^>]*)\baction=(['"])https?:\/\/(?:www\.)?prismarenting\.com[^'"]*\2([^>]*)>/gi, "<form$1$3>");
  return html;
}
