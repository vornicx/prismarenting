import type { Metadata } from "next";
import CompareTray from "@/components/CompareTray";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PRISMA Renting | Tu renting, bien elegido",
    template: "%s | PRISMA Renting",
  },
  description: "Ofertas de renting para particulares, autónomos y empresas. Compara vehículos, guarda favoritos y prepara una solicitud de renting a tu medida.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        {children}
        <CompareTray />
      </body>
    </html>
  );
}
