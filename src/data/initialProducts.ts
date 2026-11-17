import type { Product } from "../types/productMedia";

export const initialProducts: Product[] = [
  {
    id: "iphone-18-pro",
    name: "Apple iPhone 18 Pro Max 256 GB",
    price: 1899000,
    category: "Tecnología",
    image: "",
    description:
      "Pantalla Super Retina XDR, chip de última generación, sistema de triple cámara y batería para todo el día. Disponible en varios colores.",
    stock: 12,
  },
  {
    id: "samsung-s26-ultra",
    name: "Samsung Galaxy S26 Ultra 512 GB",
    price: 1749000,
    category: "Tecnología",
    image: "",
    description:
      "Pantalla Dynamic AMOLED 2X, cámara principal de alta resolución y S Pen integrado. Rendimiento de punta para trabajo y entretenimiento.",
    stock: 8,
  },
  {
    id: "chevrolet-captiva",
    name: "Chevrolet Captiva Premier 0 km",
    price: 38900000,
    category: "Vehículos",
    image: "",
    description:
      "SUV de 7 plazas con interior premium, pantalla central táctil y asistencias a la conducción. Varios colores disponibles.",
    stock: 3,
  },
  {
    id: "chevrolet-traverse",
    name: "Chevrolet Traverse High Country 0 km",
    price: 62500000,
    category: "Vehículos",
    image: "",
    description:
      "SUV grande para toda la familia, con gran espacio interior, motor potente y tecnología de seguridad avanzada.",
    stock: 2,
  },
];