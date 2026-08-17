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
  gallery?: string[];
  power?: string;
  emissionsLabel?: string;
  availabilityNote?: string;
  colorNote?: string;
  fit?: string;
  description?: string;
  equipment?: string[];
  services?: string[];
};

const standardServices = [
  "Seguro incluido",
  "Gestión, impuestos e ITV",
  "Mantenimiento y averías",
  "Sin entrada",
  "Asistencia en carretera",
  "Cambio de neumáticos según condiciones",
];

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
    gallery: [
      "https://prismarenting.com/wp-content/uploads/2022/02/renting-hyundai-i20.webp",
      "https://prismarenting.com/wp-content/uploads/2022/02/renting-hyundai-i20-de-frente.webp",
      "https://prismarenting.com/wp-content/uploads/2022/02/renting-hyundai-i20-lateral.webp",
      "https://prismarenting.com/wp-content/uploads/2022/02/renting-hyundai-i20-parte-trasera.webp",
    ],
    power: "100 CV",
    emissionsLabel: "Etiqueta C",
    availabilityNote: "Unidades limitadas · consulta disponibilidad",
    colorNote: "Colores disponibles a consultar con PRISMA.",
    fit: "Una opción especialmente lógica para quien busca un utilitario cómodo, manejable y orientado a ciudad con una cuota contenida.",
    description: "PRISMA presenta el Hyundai i20 como un utilitario práctico, bien equipado y pensado para combinar facilidad de uso urbano con buen espacio interior y maletero.",
    equipment: [
      "Cuadro de instrumentos digital de hasta 10,25 pulgadas",
      "Sistema multimedia táctil de hasta 10,25 pulgadas",
      "Navegador",
      "Acceso y arranque sin llave",
      "Climatizador",
      "Conectividad para dispositivos móviles",
      "Cargador por inducción",
      "Ayudas a la conducción y seguridad",
    ],
    services: standardServices,
    sourceUrl: "https://prismarenting.com/ofertas-de-renting/hyundai/i20/hyundai-i20/",
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
    gallery: ["https://prismarenting.com/wp-content/uploads/2021/09/renting-fiat-500-sport-1-1.webp"],
    availabilityNote: "Consulta disponibilidad y versión con PRISMA",
    colorNote: "Color y equipamiento sujetos a la unidad ofertada.",
    services: standardServices,
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
    gallery: [
      "https://prismarenting.com/wp-content/uploads/2021/11/renting-bmw-x5-1.webp",
      "https://prismarenting.com/wp-content/uploads/2021/11/renting-bmw-x5-2.webp",
      "https://prismarenting.com/wp-content/uploads/2021/11/renting-bmw-x5-4.webp",
    ],
    availabilityNote: "Consulta disponibilidad y configuración con PRISMA",
    colorNote: "Color y equipamiento sujetos a la unidad ofertada.",
    services: standardServices,
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
    gallery: ["https://prismarenting.com/wp-content/uploads/2021/06/renting-opel-corsa-1-2-.webp"],
    availabilityNote: "Consulta disponibilidad y versión con PRISMA",
    colorNote: "Color y equipamiento sujetos a la unidad ofertada.",
    services: standardServices,
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
    gallery: ["https://prismarenting.com/wp-content/uploads/2021/09/Nissan-Juke.png.webp"],
    availabilityNote: "Consulta disponibilidad y versión con PRISMA",
    colorNote: "Color y equipamiento sujetos a la unidad ofertada.",
    services: standardServices,
    sourceUrl: "https://prismarenting.com/ofertas-de-renting/nissan/juke/",
  },
];

export const getVehicle = (slug: string) => vehicles.find((vehicle) => vehicle.slug === slug);
