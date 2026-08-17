import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRISMA Renting | Tu renting, bien elegido",
  description: "Ofertas de renting para particulares, autónomos y empresas. Comparamos para encontrar la opción que encaja contigo.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
