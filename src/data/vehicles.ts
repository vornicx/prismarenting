export type Vehicle = {
  slug: string;
  brand: string;
  name: string;
  variant: string;
  price: number;
  fuel: string;
  transmission: string;
  km: number;
  term: number;
  badge?: string;
  image: string;
  body: string;
  delivery: string;
  audiences: Array<"Particular" | "Autónomo" | "Empresa">;
  sourceUrl?: string;
  highlight?: string;
};

export const vehicles: Vehicle[] = [
  {
    slug: "hyundai-i20",
    brand: "Hyundai",
    name: "Hyundai i20",
    variant: "Oferta vigente · versión y equipamiento sujetos a disponibilidad",
    price: 310,
    fuel: "Gasolina",
    transmission: "Manual",
    km: 10000,
    term: 48,
    badge: "Selección PRISMA",
    body: "Urbano",
    delivery: "Consultar",
    audiences: ["Particular", "Autónomo", "Empresa"],
    highlight: "Equilibrio urbano",
    image: "https://prismarenting.com/wp-content/uploads/2022/02/renting-hyundai-i20.webp",
    sourceUrl: "https://prismarenting.com/ofertas-de-renting/hyundai/i20/",
  },
  {
    slug: "fiat-500",
    brand: "Fiat",
    name: "Fiat 500",
    variant: "Oferta vigente · versión y equipamiento sujetos a disponibilidad",
    price: 253,
    fuel: "Híbrido",
    transmission: "Manual",
    km: 10000,
    term: 48,
    badge: "Cuota destacada",
    body: "Urbano",
    delivery: "Consultar",
    audiences: ["Particular", "Autónomo", "Empresa"],
    highlight: "Ciudad y eficiencia",
    image: "https://prismarenting.com/wp-content/uploads/2021/09/renting-fiat-500-sport-1-1.webp",
    sourceUrl: "https://prismarenting.com/ofertas-de-renting/fiat/500-2/",
  },
  {
    slug: "bmw-x5",
    brand: "BMW",
    name: "BMW X5",
    variant: "Oferta vigente · versión y equipamiento sujetos a disponibilidad",
    price: 1040,
    fuel: "Híbrido",
    transmission: "Automático",
    km: 15000,
    term: 48,
    badge: "Alta gama",
    body: "SUV",
    delivery: "Consultar",
    audiences: ["Particular", "Autónomo", "Empresa"],
    highlight: "Prestaciones y presencia",
    image: "https://prismarenting.com/wp-content/uploads/2021/11/renting-bmw-x5-1.webp",
    sourceUrl: "https://prismarenting.com/ofertas-de-renting/bmw/x5/",
  },
  {
    slug: "opel-corsa",
    brand: "Opel",
    name: "Opel Corsa",
    variant: "Oferta vigente · versión y equipamiento sujetos a disponibilidad",
    price: 244,
    fuel: "Gasolina",
    transmission: "Manual",
    km: 10000,
    term: 48,
    badge: "Acceso",
    body: "Urbano",
    delivery: "Consultar",
    audiences: ["Particular", "Autónomo", "Empresa"],
    highlight: "Cuota contenida",
    image: "https://prismarenting.com/wp-content/uploads/2021/06/renting-opel-corsa-1-2-.webp",
    sourceUrl: "https://prismarenting.com/ofertas-de-renting/opel/corsa/",
  },
  {
    slug: "nissan-juke",
    brand: "Nissan",
    name: "Nissan Juke",
    variant: "Oferta vigente · versión y equipamiento sujetos a disponibilidad",
    price: 268,
    fuel: "Gasolina",
    transmission: "Manual",
    km: 10000,
    term: 48,
    badge: "SUV urbano",
    body: "SUV",
    delivery: "Consultar",
    audiences: ["Particular", "Autónomo", "Empresa"],
    highlight: "Formato SUV compacto",
    image: "https://prismarenting.com/wp-content/uploads/2021/09/Nissan-Juke.png.webp",
    sourceUrl: "https://prismarenting.com/ofertas-de-renting/nissan/juke/",
  },
];

export const getVehicle = (slug: string) => vehicles.find((vehicle) => vehicle.slug === slug);
