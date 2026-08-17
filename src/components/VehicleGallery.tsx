"use client";

import Image from "next/image";
import { useState } from "react";

export default function VehicleGallery({ name, images }: { name: string; images: string[] }) {
  const safeImages = images.length ? images : [];
  const [active, setActive] = useState(0);
  const current = safeImages[Math.min(active, Math.max(0, safeImages.length - 1))];

  if (!current) return null;

  return (
    <div className="vehicle-gallery">
      <div className="vehicle-gallery-main">
        <div className="vehicle-gallery-counter"><span>{String(active + 1).padStart(2, "0")}</span><span>/</span><span>{String(safeImages.length).padStart(2, "0")}</span></div>
        <Image src={current} alt={`${name} · vista ${active + 1}`} fill priority sizes="(max-width: 900px) 100vw, 65vw" className="vehicle-gallery-main-image" />
      </div>

      {safeImages.length > 1 && (
        <div className="vehicle-gallery-thumbs" role="tablist" aria-label={`Vistas de ${name}`}>
          {safeImages.map((image, index) => (
            <button
              type="button"
              key={`${image}-${index}`}
              className={active === index ? "active" : ""}
              onClick={() => setActive(index)}
              aria-label={`Mostrar vista ${index + 1} de ${name}`}
              aria-selected={active === index}
              role="tab"
            >
              <Image src={image} alt="" fill sizes="120px" className="vehicle-gallery-thumb-image" />
              <span>{String(index + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
