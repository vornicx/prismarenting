"use client";

import { FormEvent, useState } from "react";

function encode(data: FormData) {
  const params = new URLSearchParams();
  data.forEach((value, key) => {
    if (typeof value === "string") params.append(key, value);
  });
  return params.toString();
}

export default function MigratedContactForm({ sourcePath, title = "Cuéntanos qué necesitas" }: { sourcePath: string; title?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("form-name", "prisma-contact");
    data.set("sourcePath", sourcePath);
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
    <section className="source-migrated-form" aria-labelledby={`form-${sourcePath.replace(/[^a-z0-9]/gi, "-")}`}>
      <div className="source-migrated-form-head">
        <span>Contacto PRISMA</span>
        <h2 id={`form-${sourcePath.replace(/[^a-z0-9]/gi, "-")}`}>{title}</h2>
        <p>Déjanos tus datos y un asesor podrá continuar la conversación con el contexto de esta página.</p>
      </div>
      <form name="prisma-contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={submit}>
        <input type="hidden" name="form-name" value="prisma-contact" />
        <input type="hidden" name="sourcePath" value={sourcePath} />
        <p className="source-honeypot" aria-hidden="true"><label>No rellenar <input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
        <div className="source-form-grid">
          <label><span>Nombre *</span><input type="text" name="name" autoComplete="name" required /></label>
          <label><span>Email *</span><input type="email" name="email" autoComplete="email" required /></label>
          <label><span>Teléfono</span><input type="tel" name="phone" autoComplete="tel" /></label>
          <label><span>Perfil</span><select name="profile" defaultValue="Particular"><option>Particular</option><option>Autónomo</option><option>Empresa</option></select></label>
          <label className="source-form-wide"><span>Vehículo o necesidad</span><input type="text" name="vehicle" placeholder="Modelo, tipo de coche o necesidad" /></label>
          <label className="source-form-wide"><span>Mensaje *</span><textarea name="message" rows={5} required /></label>
        </div>
        <label className="source-form-consent"><input type="checkbox" name="privacy" value="accepted" required /><span>He leído y acepto la política de privacidad.</span></label>
        <div className="source-form-submit"><button type="submit" disabled={status === "sending"}>{status === "sending" ? "Enviando…" : "Enviar consulta"}</button><a href="tel:+34699242581">O llama al 699 24 25 81</a></div>
        <div className="source-form-status" aria-live="polite">
          {status === "success" && <p>Consulta enviada correctamente. Gracias.</p>}
          {status === "error" && <p>No se ha podido enviar ahora mismo. Puedes escribir a hola@prismarenting.com o llamar al 699 24 25 81.</p>}
        </div>
      </form>
    </section>
  );
}
