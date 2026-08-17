"use client";

import Link from "next/link";
import { FormEvent, useId, useState } from "react";

function encode(data: FormData) {
  const params = new URLSearchParams();
  data.forEach((value, key) => {
    if (typeof value === "string") params.append(key, value);
  });
  return params.toString();
}

type Props = {
  sourcePath: string;
  variant: string;
  title: string;
  buttonLabel: string;
  showMessage?: boolean;
  showPromoCode?: boolean;
  messageAsSingleLine?: boolean;
};

export default function MigratedContactForm({
  sourcePath,
  variant,
  title,
  buttonLabel,
  showMessage = true,
  showPromoCode = false,
  messageAsSingleLine = false,
}: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const id = useId().replace(/:/g, "");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("form-name", "prisma-contact");
    data.set("sourcePath", sourcePath);
    data.set("formVariant", variant);
    if (String(data.get("bot-field") || "").trim()) return;
    setStatus("sending");
    try {
      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(data),
      });
      if (!response.ok) throw new Error(`Form submission failed: ${response.status}`);
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="source-migrated-form" aria-labelledby={`source-form-${id}`}>
      <div className="source-migrated-form-head">
        <span>Contacto PRISMA</span>
        <h2 id={`source-form-${id}`}>{title}</h2>
        <p>Déjanos tus datos y un asesor de PRISMA podrá ponerse en contacto contigo.</p>
      </div>
      <form name="prisma-contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={submit}>
        <input type="hidden" name="form-name" value="prisma-contact" />
        <input type="hidden" name="sourcePath" value={sourcePath} />
        <input type="hidden" name="formVariant" value={variant} />
        <p className="source-honeypot" aria-hidden="true"><label>No rellenar <input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
        <div className="source-form-grid">
          <label><span>Nombre y apellidos *</span><input type="text" name="name" autoComplete="name" required /></label>
          <label><span>Teléfono *</span><input type="tel" name="phone" autoComplete="tel" required /></label>
          <label className={showPromoCode ? "" : "source-form-wide-mobile"}><span>Email *</span><input type="email" name="email" autoComplete="email" required /></label>
          {showPromoCode && <label><span>Código promocional</span><input type="text" name="promoCode" placeholder="¿Código promocional?" /></label>}
          {showMessage && (
            <label className="source-form-wide"><span>Mensaje</span>{messageAsSingleLine ? <input type="text" name="message" /> : <textarea name="message" rows={4} />}</label>
          )}
        </div>
        <label className="source-form-consent"><input type="checkbox" name="privacy" value="accepted" required /><span>He leído y acepto la <Link href="/politica-de-privacidad/">política de privacidad</Link> y autorizo el tratamiento de mis datos para responder a esta consulta.</span></label>
        <div className="source-form-submit"><button type="submit" disabled={status === "sending"}>{status === "sending" ? "Enviando…" : buttonLabel}</button><a href="tel:+34699242581">O llama al 699 24 25 81</a></div>
        <div className="source-form-status" aria-live="polite">
          {status === "success" && <p>Consulta enviada correctamente. Gracias.</p>}
          {status === "error" && <p>No se ha podido enviar ahora mismo. Puedes escribir a hola@prismarenting.com o llamar al 699 24 25 81.</p>}
        </div>
      </form>
    </section>
  );
}
