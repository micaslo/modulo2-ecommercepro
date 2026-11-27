import type { Product } from "../types/productMedia";

const imageModules = import.meta.glob<string>(
  "../assets/images/categoryProducts/*.webp",
  { eager: true, import: "default" },
);

export type CategorySlug =
  | "tecnologia"
  | "camaras-y-accesorios"
  | "vehiculos"
  | "gaming";

export interface CategoryConfig {
  slug: CategorySlug;
  label: string;
  eyebrow: string;
  description: string;
}

const categoryConfigs: CategoryConfig[] = [
  {
    slug: "tecnologia",
    label: "Tecnología",
    eyebrow: "TECNOLOGÍA",
    description:
      "Celulares, computadoras, televisores y dispositivos inteligentes para tu día a día.",
  },
  {
    slug: "camaras-y-accesorios",
    label: "Cámaras y Accesorios",
    eyebrow: "CÁMARAS Y ACCESORIOS",
    description:
      "Cámaras profesionales, lentes y accesorios para capturar cada momento.",
  },
  {
    slug: "vehiculos",
    label: "Vehículos",
    eyebrow: "VEHÍCULOS",
    description:
      "SUV y automóviles 0 km con la mejor relación entre equipamiento y precio.",
  },
  {
    slug: "gaming",
    label: "Gaming",
    eyebrow: "GAMING",
    description:
      "Consolas, controles y periféricos para llevar tus partidas al siguiente nivel.",
  },
];

export function getCategoryConfig(slug: string | undefined): CategoryConfig | undefined {
  return categoryConfigs.find((config) => config.slug === slug);
}

function imageFor(id: string): string {
  return imageModules[`../assets/images/categoryProducts/${id}.webp`] ?? "";
}

const upcomingCategoryProducts: Product[] = [
  {
    id: "galaxy-watch-8",
    code: "DT-TEC-P01",
    name: "Smartwatch Galaxy Watch 8 44 mm",
    price: 749999,
    category: "Tecnología",
    image: imageFor("galaxy-watch-8"),
    description:
      "Reloj inteligente con pantalla AMOLED, seguimiento de actividad física y batería de larga duración.",
    stock: 9,
  },
  {
    id: "sony-wh-1000xm7",
    code: "DT-TEC-P02",
    name: "Auriculares Sony WH-1000XM7",
    price: 899999,
    category: "Tecnología",
    image: imageFor("sony-wh-1000xm7"),
    description:
      "Auriculares over-ear con cancelación de ruido líder en el mercado y hasta 30 horas de reproducción.",
    stock: 6,
  },
  {
    id: "ipad-pro-13-m5",
    code: "DT-TEC-P03",
    name: "Tablet iPad Pro 13 M5 256 GB",
    price: 2499000,
    category: "Tecnología",
    image: imageFor("ipad-pro-13-m5"),
    description:
      "Pantalla Ultra Retina XDR, chip M5 y compatibilidad con Apple Pencil para trabajar desde cualquier lugar.",
    stock: 4,
  },
  {
    id: "macbook-air-m5",
    code: "DT-TEC-P04",
    name: "Notebook MacBook Air M5 16 GB",
    price: 2199000,
    category: "Tecnología",
    image: imageFor("macbook-air-m5"),
    description:
      "Ultradelgada, liviana y potente, con 16 GB de memoria unificada y batería para todo el día.",
    stock: 5,
  },
  {
    id: "lg-oled-55-c4",
    code: "DT-TEC-P05",
    name: 'Smart TV LG OLED 55" 4K C4',
    price: 1299000,
    category: "Tecnología",
    image: imageFor("lg-oled-55-c4"),
    description:
      "Panel OLED evo 4K con procesador inteligente, contraste perfecto y modos de juego dedicados.",
    stock: 7,
  },
  {
    id: "jbl-charge-6",
    code: "DT-TEC-P06",
    name: "Altavoz Bluetooth JBL Charge 6",
    price: 249999,
    category: "Tecnología",
    image: imageFor("jbl-charge-6"),
    description:
      "Sonido JBL Original Pro, resistencia al agua y batería que también sirve para cargar tus dispositivos.",
    stock: 14,
  },
  {
    id: "sony-alpha-a7-v",
    code: "DT-CAM-P01",
    name: "Cámara Sony Alpha A7 V Mirrorless",
    price: 4200000,
    category: "Cámaras y Accesorios",
    image: imageFor("sony-alpha-a7-v"),
    description:
      "Mirrorless Full Frame con sensor apilado, enfoque automático inteligente y grabación en 4K 120p.",
    stock: 3,
  },
  {
    id: "fujifilm-x-t6",
    code: "DT-CAM-P02",
    name: "Cámara Fujifilm X-T6 + Lente 18-55 mm",
    price: 2950000,
    category: "Cámaras y Accesorios",
    image: imageFor("fujifilm-x-t6"),
    description:
      "Diseño clásico, sensor X-Trans y simulaciones de película para fotografía con carácter propio.",
    stock: 5,
  },
  {
    id: "sony-fe-70-200-gm",
    code: "DT-CAM-P03",
    name: "Lente Sony FE 70-200mm f/2.8 GM II",
    price: 3900000,
    category: "Cámaras y Accesorios",
    image: imageFor("sony-fe-70-200-gm"),
    description:
      "Zoom teleobjetivo profesional de gran luminosidad, enfoque rápido y estabilización integrada.",
    stock: 2,
  },
  {
    id: "manfrotto-befree-tripod",
    code: "DT-CAM-P04",
    name: "Trípode Manfrotto Befree Advanced",
    price: 480000,
    category: "Cámaras y Accesorios",
    image: imageFor("manfrotto-befree-tripod"),
    description:
      "Trípode portable de aluminio con rótula de bola y patas plegables para viajar liviano.",
    stock: 11,
  },
  {
    id: "godox-v1-pro-flash",
    code: "DT-CAM-P05",
    name: "Flash Godox V1 Pro para Canon",
    price: 620000,
    category: "Cámaras y Accesorios",
    image: imageFor("godox-v1-pro-flash"),
    description:
      "Flash de cabeza redonda con batería recargable, control inalámbrico y luz suave y uniforme.",
    stock: 8,
  },
  {
    id: "lowepro-protactic-backpack",
    code: "DT-CAM-P06",
    name: "Mochila Lowepro ProTactic BP 450 AW",
    price: 390000,
    category: "Cámaras y Accesorios",
    image: imageFor("lowepro-protactic-backpack"),
    description:
      "Mochila técnica con compartimentos modularizables, funda impermeable y soporte para trípode.",
    stock: 10,
  },
  {
    id: "toyota-corolla-cross",
    code: "DT-VEH-P01",
    name: "Toyota Corolla Cross XEi 0 km",
    price: 31800000,
    category: "Vehículos",
    image: imageFor("toyota-corolla-cross"),
    description:
      "SUV compacta con motor 2.0, transmisión automática CVT y completo paquete de seguridad.",
    stock: 4,
  },
  {
    id: "vw-t-cross",
    code: "DT-VEH-P02",
    name: "Volkswagen T-Cross Comfortline 0 km",
    price: 29500000,
    category: "Vehículos",
    image: imageFor("vw-t-cross"),
    description:
      "SUV urbana con pantalla táctil, sensores de estacionamiento y conectividad Apple CarPlay y Android Auto.",
    stock: 6,
  },
  {
    id: "ford-ecosport",
    code: "DT-VEH-P03",
    name: "Ford EcoSport Titanium 0 km",
    price: 27900000,
    category: "Vehículos",
    image: imageFor("ford-ecosport"),
    description:
      "SUV versátil con motor turbo, interior espacioso y sistema de infoentretenimiento SYNC.",
    stock: 3,
  },
  {
    id: "renault-duster",
    code: "DT-VEH-P04",
    name: "Renault Duster Iconic 0 km",
    price: 26400000,
    category: "Vehículos",
    image: imageFor("renault-duster"),
    description:
      "SUV resistente con tracción 4x4 opcional, amplio despeje al suelo y bajo consumo de combustible.",
    stock: 5,
  },
  {
    id: "honda-hr-v",
    code: "DT-VEH-P05",
    name: "Honda HR-V EX 0 km",
    price: 35200000,
    category: "Vehículos",
    image: imageFor("honda-hr-v"),
    description:
      "SUV con diseño moderno, Honda Sensing de serie y una cabina amplia y luminosa.",
    stock: 2,
  },
  {
    id: "peugeot-2008",
    code: "DT-VEH-P06",
    name: "Peugeot 2008 Allure 0 km",
    price: 30900000,
    category: "Vehículos",
    image: imageFor("peugeot-2008"),
    description:
      "SUV con i-Cockpit, cámara de reversa, techo panorámico opcional y motor naftero eficiente.",
    stock: 4,
  },
  {
    id: "playstation-5-slim",
    code: "DT-GAM-P01",
    name: "Consola PlayStation 5 Slim 1 TB",
    price: 1099999,
    category: "Gaming",
    image: imageFor("playstation-5-slim"),
    description:
      "Nueva generación de juegos con carga ultrarrápida, gráficos 4K y control DualSense incluido.",
    stock: 8,
  },
  {
    id: "xbox-series-x",
    code: "DT-GAM-P02",
    name: "Consola Xbox Series X 1 TB",
    price: 1199999,
    category: "Gaming",
    image: imageFor("xbox-series-x"),
    description:
      "La consola más potente de Xbox con 12 TFLOPS, SSD ultrarrápido y juegos en 4K a 120 fps.",
    stock: 6,
  },
  {
    id: "nintendo-switch-oled",
    code: "DT-GAM-P03",
    name: "Consola Nintendo Switch OLED",
    price: 649999,
    category: "Gaming",
    image: imageFor("nintendo-switch-oled"),
    description:
      "Pantalla OLED de 7 pulgadas, 64 GB de almacenamiento y base con puerto LAN para jugar en casa.",
    stock: 12,
  },
  {
    id: "hyperx-cloud-iii",
    code: "DT-GAM-P04",
    name: "Auriculares Gaming HyperX Cloud III",
    price: 189999,
    category: "Gaming",
    image: imageFor("hyperx-cloud-iii"),
    description:
      "Sonido envolvente, micrófono removible y almohadillas de memory foam para largas sesiones.",
    stock: 15,
  },
  {
    id: "logitech-g-pro-x-keyboard",
    code: "DT-GAM-P05",
    name: "Teclado Mecánico Logitech G Pro X",
    price: 249999,
    category: "Gaming",
    image: imageFor("logitech-g-pro-x-keyboard"),
    description:
      "Switches mecánicos intercambiables, iluminación RGB personalizable y diseño tenkeyless.",
    stock: 9,
  },
  {
    id: "razer-deathadder-v4",
    code: "DT-GAM-P06",
    name: "Mouse Gaming Razer DeathAdder V4",
    price: 159999,
    category: "Gaming",
    image: imageFor("razer-deathadder-v4"),
    description:
      "Sensor óptico de alta precisión, switches duraderos y diseño ergonómico reconocido mundialmente.",
    stock: 18,
  },
];

export function getUpcomingProducts(slug: CategorySlug): Product[] {
  const label = categoryConfigs.find((config) => config.slug === slug)?.label;
  return upcomingCategoryProducts.filter((product) => product.category === label);
}
