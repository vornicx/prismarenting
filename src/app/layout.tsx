import type { Metadata } from "next";
import CompareTray from "@/components/CompareTray";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://prismarenting.com"),
  applicationName: "PRISMA Renting",
  title: {
    default: "PRISMA Renting | Tu renting, bien elegido",
    template: "%s | PRISMA Renting",
  },
  description: "Ofertas de renting para particulares, autónomos y empresas. Compara vehículos, guarda favoritos y prepara una solicitud de renting a tu medida.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://prismarenting.com/",
    siteName: "PRISMA Renting",
    title: "PRISMA Renting | Tu renting, bien elegido",
    description: "Ofertas de renting para particulares, autónomos y empresas con asesoramiento multioperador de Grupo PRISMA.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PRISMA Renting | Tu renting, bien elegido",
    description: "Ofertas de renting para particulares, autónomos y empresas con asesoramiento multioperador de Grupo PRISMA.",
  },
};

const businessSchema = {
  "@context": "https://schema.org",
  "@type": "AutoRental",
  name: "PRISMA Renting",
  url: "https://prismarenting.com/",
  telephone: "+34 699 24 25 81",
  email: "hola@prismarenting.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Paseo Imperial 8, 1A",
    postalCode: "28005",
    addressLocality: "Madrid",
    addressCountry: "ES",
  },
  parentOrganization: {
    "@type": "Organization",
    name: "Grupo PRISMA, Especialistas en Automoción, S.L.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }} />
        {children}
        <CompareTray />
      </body>
    </html>
  );
}
