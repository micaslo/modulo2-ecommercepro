import type { Product, ProductDetails } from "../types/productMedia";

const PRODUCT_DETAILS: Record<string, ProductDetails> = {
  "iphone-18-pro": {
    productKind: "phone",
    condition: "Nuevo",
    soldText: "+100 vendidos",
    originalPrice: 2099000,
    installmentsCount: 12,
    shippingTitle: "Envío gratis a todo el país",
    shippingSubtitle: "Llegando en 24 a 48 hs hábiles · Envío asegurado",
    warranty: "Garantía oficial Apple de 12 meses",
    highlights: [
      'Pantalla Super Retina XDR OLED de 6.9" con ProMotion 120 Hz.',
      "Chip A20 Pro de última generación con Neural Engine optimizado para IA.",
      "Sistema de cámaras Pro triple de 48 MP con teleobjetivo óptico 5x.",
      "Chasis de titanio aeroespacial con Ceramic Shield de nueva generación.",
      "Batería de larga duración con carga rápida MagSafe y puerto USB-C.",
    ],
    keySpecs: [
      { icon: "screen", label: "Tamaño de la pantalla", value: '6.9" Super Retina XDR' },
      { icon: "storage", label: "Memoria interna", value: "256 GB" },
      { icon: "camera", label: "Cámara trasera principal", value: "48 MP Triple Pro" },
      { icon: "cpu", label: "Procesador", value: "Apple A20 Pro" },
      { icon: "ram", label: "Memoria RAM", value: "12 GB" },
      { icon: "battery", label: "Autonomía", value: "Hasta 33 hs de video" },
      { icon: "signal", label: "Conectividad", value: "5G · Wi-Fi 7 · eSIM" },
      { icon: "shield", label: "Resistencia", value: "IP68 · Titanio" },
    ],
    specGroups: [
      {
        title: "Características generales",
        rows: [
          { label: "Marca", value: "Apple" },
          { label: "Línea", value: "iPhone 18 Pro Max" },
          { label: "Sistema operativo", value: "iOS 20" },
          { label: "Material del cuerpo", value: "Titanio grado 5 y vidrio mate texturizado" },
          { label: "Con NFC", value: "Sí (Apple Pay)" },
        ],
      },
      {
        title: "Pantalla",
        rows: [
          { label: "Tamaño", value: '6.9"' },
          { label: "Tecnología", value: "OLED Super Retina XDR" },
          { label: "Frecuencia de actualización", value: "ProMotion adaptativa 1 Hz – 120 Hz" },
          { label: "Protección", value: "Ceramic Shield" },
        ],
      },
      {
        title: "Cámara",
        rows: [
          { label: "Cámara trasera principal", value: "48 MP Fusion f/1.78" },
          { label: "Ultra gran angular", value: "48 MP con fotografía macro" },
          { label: "Teleobjetivo", value: "48 MP zoom óptico 5x" },
          { label: "Video", value: "4K Dolby Vision hasta 120 cps · ProRes" },
        ],
      },
      {
        title: "Batería y conectividad",
        rows: [
          { label: "Carga rápida", value: "50% en 30 min · MagSafe inalámbrico" },
          { label: "Puerto", value: "USB-C (USB 3 hasta 10 Gb/s)" },
          { label: "Red móvil", value: "5G / 4G LTE · Dual SIM (eSIM)" },
          { label: "Resistencia al agua y polvo", value: "Clasificación IP68" },
        ],
      },
    ],
    extendedDescription: [
      "El Apple iPhone 18 Pro Max combina diseño en titanio ultraliviano con potencia profesional en cada detalle. Su pantalla Super Retina XDR de 6.9 pulgadas con tecnología ProMotion ofrece desplazamientos fluidos, brillo sobresaliente en exteriores y colores fieles para editar fotos o mirar series.",
      "Gracias al chip A20 Pro, las tareas exigentes —desde juegos con trazado de rayos hasta grabación y edición en 4K Dolby Vision— se ejecutan con una fluidez excepcional y gran eficiencia energética.",
      "El sistema de triple cámara Pro incorpora controles avanzados de apertura, histograma en vivo y balance de blancos preciso para capturar retratos nítidos y tomas nocturnas con nivel de estudio.",
    ],
    includedItems: [
      "1x Apple iPhone 18 Pro Max 256 GB",
      "1x Cable trenzado USB-C a USB-C (1 m)",
      "Documentación y garantía oficial",
    ],
    featureRatings: [
      { label: "Calidad de la cámara", score: 4.9 },
      { label: "Diseño y materiales", score: 4.9 },
      { label: "Duración de la batería", score: 4.8 },
      { label: "Relación precio-calidad", score: 4.6 },
    ],
    reviews: [
      {
        id: "rev-ip-1",
        author: "Martina G.",
        rating: 5,
        date: "12 nov. 2026",
        comment:
          "El color borgoña en persona es increíble, súper elegante. La cámara con zoom 5x saca unas fotos nocturnas tremendas y la batería me dura casi dos días de uso normal.",
        helpful: 24,
        verified: true,
      },
      {
        id: "rev-ip-2",
        author: "Lucas F.",
        rating: 5,
        date: "04 nov. 2026",
        comment:
          "Vengo de un 15 Pro y el salto en pantalla y fluidez se nota muchísimo. Llegó sellado en 24 horas y súper bien embalado.",
        helpful: 15,
        verified: true,
      },
      {
        id: "rev-ip-3",
        author: "Camila R.",
        rating: 4,
        date: "27 oct. 2026",
        comment:
          "Excelente teléfono, vuela en todo. Le pongo 4 estrellas solo porque sigue sin traer el cargador en la caja, pero el equipo es un 10.",
        helpful: 9,
        verified: true,
      },
      {
        id: "rev-ip-4",
        author: "Federico M.",
        rating: 5,
        date: "18 oct. 2026",
        comment:
          "La grabación de video es otro nivel, lo uso para crear contenido y prácticamente reemplacé la cámara principal. Recomendadísimo.",
        helpful: 11,
        verified: true,
      },
    ],
  },

  "samsung-s26-ultra": {
    productKind: "phone",
    condition: "Nuevo",
    soldText: "+150 vendidos",
    originalPrice: 1949000,
    installmentsCount: 12,
    shippingTitle: "Envío gratis a todo el país",
    shippingSubtitle: "Llegando mañana · Despacho inmediato",
    warranty: "Garantía oficial Samsung Argentina de 12 meses",
    highlights: [
      'Pantalla Dynamic AMOLED 2X de 6.9" QHD+ con tasa de 120 Hz y antirreflejo.',
      "Cámara principal de 200 MP con ProVisual Engine y zoom óptico 5x / 10x.",
      "S Pen integrado en el cuerpo para tomar notas, dibujar y editar con precisión.",
      "Procesador personalizado para Galaxy con NPU 39% más rápida para Galaxy AI.",
      "Batería de 5000 mAh con carga ultrarrápida (75% en 30 minutos).",
    ],
    keySpecs: [
      { icon: "screen", label: "Tamaño de la pantalla", value: '6.9" Dynamic AMOLED 2X' },
      { icon: "storage", label: "Memoria interna", value: "512 GB" },
      { icon: "camera", label: "Cámara trasera principal", value: "200 MP + 50 MP + 50 MP + 10 MP" },
      { icon: "cpu", label: "Procesador", value: "Snapdragon Elite for Galaxy" },
      { icon: "ram", label: "Memoria RAM", value: "12 GB" },
      { icon: "battery", label: "Batería", value: "5000 mAh · Carga rápida" },
      { icon: "signal", label: "Red móvil", value: "5G Dual SIM + eSIM" },
      { icon: "shield", label: "Resistencia", value: "IP68 · Marco Titanio" },
    ],
    specGroups: [
      {
        title: "Características generales",
        rows: [
          { label: "Marca", value: "Samsung" },
          { label: "Modelo", value: "Galaxy S26 Ultra" },
          { label: "Sistema operativo", value: "Android 16 con One UI" },
          { label: "Lápiz óptico", value: "S Pen integrado de baja latencia" },
          { label: "Dual SIM", value: "Sí (Nano-SIM + eSIM)" },
        ],
      },
      {
        title: "Pantalla y memoria",
        rows: [
          { label: "Tamaño", value: '6.9" QHD+ (3120 x 1440 px)' },
          { label: "Frecuencia de actualización", value: "1 Hz – 120 Hz adaptativa" },
          { label: "Memoria RAM", value: "12 GB" },
          { label: "Almacenamiento", value: "512 GB UFS 4.0" },
        ],
      },
      {
        title: "Cámaras con ProVisual Engine",
        rows: [
          { label: "Gran angular principal", value: "200 MP f/1.4 con OIS" },
          { label: "Ultra gran angular", value: "50 MP f/1.9" },
          { label: "Teleobjetivos", value: "50 MP (zoom 5x) + 10 MP (zoom 3x)" },
          { label: "Cámara frontal", value: "12 MP f/2.2 con enfoque automático" },
        ],
      },
      {
        title: "Batería",
        rows: [
          { label: "Capacidad", value: "5000 mAh" },
          { label: "Reproducción de video", value: "Hasta 31 horas" },
          { label: "Carga rápida", value: "75% en aprox. 30 minutos" },
          { label: "Carga inalámbrica", value: "Sí + PowerShare reversible" },
        ],
      },
    ],
    extendedDescription: [
      "El Samsung Galaxy S26 Ultra lleva la productividad y la fotografía móvil a otro nivel. Su cámara de 200 MP potenciada por ProVisual Engine captura texturas ultra definidas incluso de noche, mientras que sus teleobjetivos ópticos acercan cada escena sin perder nitidez.",
      "Su procesador personalizado para Galaxy ofrece mejoras notables en CPU, GPU y NPU, acelerando las herramientas de Galaxy AI como traducción simultánea, edición generativa y resumen de notas con el S Pen integrado.",
      "Con 512 GB de almacenamiento, 12 GB de RAM y una batería de 5000 mAh con carga ultrarrápida, está listo para acompañarte durante toda la jornada laboral y creativa sin frenar.",
    ],
    includedItems: [
      "1x Samsung Galaxy S26 Ultra 512 GB",
      "1x S Pen integrado",
      "1x Cable USB-C a USB-C",
      "1x Herramienta extractora de SIM y guía rápida",
    ],
    featureRatings: [
      { label: "Calidad de la cámara", score: 5.0 },
      { label: "Duración de la batería", score: 4.9 },
      { label: "Pantalla y brillo", score: 4.9 },
      { label: "Relación precio-calidad", score: 4.7 },
    ],
    reviews: [
      {
        id: "rev-sam-1",
        author: "Sofía P.",
        rating: 5,
        date: "14 nov. 2026",
        comment:
          "Me compré el color celeste y es hermoso. La pantalla antirreflejo bajo el sol es una locura y el zoom de la cámara no tiene competencia.",
        helpful: 31,
        verified: true,
      },
      {
        id: "rev-sam-2",
        author: "Nicolás V.",
        rating: 5,
        date: "08 nov. 2026",
        comment:
          "El S Pen para firmar documentos y anotar rápido en reuniones me cambió la vida. Con 512 GB me olvido del espacio por años.",
        helpful: 19,
        verified: true,
      },
      {
        id: "rev-sam-3",
        author: "Julieta D.",
        rating: 5,
        date: "29 oct. 2026",
        comment:
          "La carga rápida funciona tal cual dice, en media hora ya salís con batería para todo el día. Muy conforme con la compra.",
        helpful: 12,
        verified: true,
      },
      {
        id: "rev-sam-4",
        author: "Diego A.",
        rating: 4,
        date: "20 oct. 2026",
        comment:
          "Equipo espectacular, súper rápido y elegante. Es un poco grande para usarlo con una sola mano pero vale totalmente la pena por la pantalla.",
        helpful: 8,
        verified: true,
      },
    ],
  },

  "chevrolet-captiva": {
    productKind: "car",
    condition: "0 km · Año 2026",
    soldText: "Concesionario oficial",
    originalPrice: 41200000,
    installmentsCount: 12,
    shippingTitle: "Entrega coordinada en concesionario",
    shippingSubtitle: "Disponible para test drive · Patentamiento asistido",
    warranty: "Garantía oficial Chevrolet 3 años o 100.000 km",
    highlights: [
      "SUV familiar de 7 plazas con tercera fila rebatible y gran versatilidad.",
      "Motor 1.5L Turbo naftero con transmisión automática CVT de marcha suave.",
      'Pantalla central táctil vertical de 10.4" con Apple CarPlay y Android Auto.',
      "Techo solar panorámico eléctrico y tapizado interior en ecocuero premium.",
      "Cámara 360°, sensores de estacionamiento, 6 airbags y control de estabilidad.",
    ],
    keySpecs: [
      { icon: "engine", label: "Motorización", value: "1.5L Turbo · 148 CV" },
      { icon: "transmission", label: "Transmisión", value: "Automática CVT" },
      { icon: "seats", label: "Capacidad", value: "7 plazas (3 filas)" },
      { icon: "screen", label: "Multimedia", value: 'Táctil 10.4" · CarPlay' },
      { icon: "safety", label: "Seguridad", value: "6 Airbags · ESP · 360°" },
      { icon: "sunroof", label: "Confort", value: "Techo solar panorámico" },
      { icon: "fuel", label: "Combustible", value: "Nafta · Modo Eco" },
      { icon: "trunk", label: "Baúl máximo", value: "Hasta 1.051 litros" },
    ],
    specGroups: [
      {
        title: "Motor y mecánica",
        rows: [
          { label: "Motor", value: "1.5L 4 cilindros Turbo DOHC" },
          { label: "Potencia máxima", value: "148 CV @ 5.200 rpm" },
          { label: "Torque máximo", value: "250 Nm" },
          { label: "Caja", value: "Automática CVT con 8 marchas simuladas" },
          { label: "Tracción", value: "Delantera (4x2)" },
        ],
      },
      {
        title: "Confort y tecnología",
        rows: [
          { label: "Pantalla multimedia", value: 'Vertical de 10.4" con Bluetooth, CarPlay y Android Auto' },
          { label: "Tablero", value: 'Panel de instrumentos digital de 7"' },
          { label: "Climatizador", value: "Automático digital con salidas traseras" },
          { label: "Asientos", value: "Tapizado en ecocuero · Ajuste eléctrico conductor" },
          { label: "Acceso", value: "Llave inteligente con encendido por botón" },
        ],
      },
      {
        title: "Seguridad",
        rows: [
          { label: "Airbags", value: "6 (frontales, laterales y de cortina)" },
          { label: "Asistencias", value: "Control de estabilidad (ESC), tracción (TCS) y arranque en pendiente" },
          { label: "Estacionamiento", value: "Cámara de visión 360° y sensores delanteros/traseros" },
          { label: "Frenos", value: "Discos en las 4 ruedas con ABS + EBD + freno eléctrico" },
        ],
      },
    ],
    extendedDescription: [
      "La Chevrolet Captiva Premier combina amplitud para toda la familia con un diseño moderno y equipamiento de segmento superior. Sus 3 filas de asientos permiten acomodar cómodamente hasta 7 pasajeros o rebatir las plazas traseras para ampliar la capacidad de carga en segundos.",
      "En el interior se destaca su tablero limpio con pantalla vertical de 10.4 pulgadas, conectividad smartphone, techo solar panorámico y terminaciones en ecocuero que elevan la experiencia en viajes urbanos y de ruta.",
      "Equipada con motor 1.5 Turbo eficiente, transmisión automática CVT y un completo paquete de seguridad con 6 airbags y cámara 360°, ofrece manejo ágil, silencioso y confiable todos los días.",
    ],
    includedItems: [
      "Unidad Chevrolet Captiva Premier 0 km",
      "2 juegos de llaves presenciales (Smart Key)",
      "Kit de seguridad reglamentario y rueda de auxilio",
      "Manual de propietario y libreta de garantía oficial",
    ],
    featureRatings: [
      { label: "Espacio interior", score: 4.9 },
      { label: "Confort de manejo", score: 4.8 },
      { label: "Equipamiento y pantalla", score: 4.8 },
      { label: "Relación precio-calidad", score: 4.7 },
    ],
    reviews: [
      {
        id: "rev-cap-1",
        author: "Alejandro T.",
        rating: 5,
        date: "10 nov. 2026",
        comment:
          "La retiramos hace un mes en rojo y estamos encantados. Para una familia de 5 personas sobra lugar y el techo panorámico le da muchísima luz al interior.",
        helpful: 18,
        verified: true,
      },
      {
        id: "rev-cap-2",
        author: "Valeria S.",
        rating: 5,
        date: "02 nov. 2026",
        comment:
          "La cámara 360 hace que estacionar una SUV grande sea facilísimo. Muy suave la caja automática en ciudad y súper cómoda en ruta.",
        helpful: 14,
        verified: true,
      },
      {
        id: "rev-cap-3",
        author: "Hernán C.",
        rating: 4,
        date: "21 oct. 2026",
        comment:
          "Muy buen equipamiento por el precio. La tercera fila es ideal para chicos o viajes cortos y con los asientos rebatidos el baúl es enorme.",
        helpful: 7,
        verified: true,
      },
    ],
  },

  "chevrolet-traverse": {
    productKind: "car",
    condition: "0 km · Año 2026",
    soldText: "Concesionario oficial",
    originalPrice: 65900000,
    installmentsCount: 12,
    shippingTitle: "Entrega coordinada en concesionario",
    shippingSubtitle: "Unidad en stock · Asesoramiento personalizado",
    warranty: "Garantía oficial Chevrolet 3 años o 100.000 km",
    highlights: [
      "SUV Full-Size de 3 filas con espacio líder en su categoría para hasta 8 ocupantes.",
      "Motor 2.5L Turbo de 328 CV con transmisión automática de 8 velocidades y tracción AWD.",
      'Pantalla multimedia panorámica de 17.7" + tablero digital configurable de 11".',
      "Paquete completo Chevy Safety Assist: frenado autónomo, alerta de carril y punto ciego.",
      "Portón trasero manos libres, asientos calefaccionados/ventilados y sonido Bose.",
    ],
    keySpecs: [
      { icon: "engine", label: "Motorización", value: "2.5L Turbo · 328 CV" },
      { icon: "transmission", label: "Transmisión", value: "Automática 8 vel · AWD" },
      { icon: "seats", label: "Capacidad", value: "7 / 8 plazas reales" },
      { icon: "screen", label: "Multimedia", value: '17.7" + Tablero 11"' },
      { icon: "safety", label: "Seguridad ADAS", value: "Chevy Safety Assist" },
      { icon: "sunroof", label: "Confort", value: "Cuero + Audio Bose" },
      { icon: "connect", label: "Conectividad", value: "Google Built-in · Wi-Fi" },
      { icon: "trunk", label: "Capacidad de carga", value: "Hasta 2.764 litros" },
    ],
    specGroups: [
      {
        title: "Motor y desempeño",
        rows: [
          { label: "Motor", value: "2.5L Turbo de inyección directa" },
          { label: "Potencia", value: "328 CV" },
          { label: "Torque", value: "442 Nm" },
          { label: "Transmisión", value: "Automática de 8 velocidades" },
          { label: "Tracción", value: "Integral AWD con selector de modos de manejo" },
        ],
      },
      {
        title: "Interior y tecnología",
        rows: [
          { label: "Pantalla central", value: '17.7" táctil HD con Google Built-in' },
          { label: "Instrumental", value: 'Digital de 11" personalizable' },
          { label: "Audio", value: "Sistema premium Bose de 10 parlantes" },
          { label: "Climatización", value: "Tri-zona automática + butacas calefaccionadas y ventiladas" },
          { label: "Portón trasero", value: "Eléctrico AutoSense manos libres" },
        ],
      },
      {
        title: "Seguridad y asistencias",
        rows: [
          { label: "Airbags", value: "7 airbags (incluye airbag central delantero)" },
          { label: "Asistencias activas", value: "Frenado autónomo con detección de peatones y ciclistas" },
          { label: "Conducción en ruta", value: "Control crucero adaptativo y mantenimiento de carril" },
          { label: "Visión", value: "HD Surround Vision 360° + espejo retrovisor digital" },
        ],
      },
    ],
    extendedDescription: [
      "La Chevrolet Traverse High Country redefine el confort familiar en formato Full-Size. Su estética imponente, parrilla cromada y llantas de diseño exclusivo se combinan con una cabina amplia donde incluso la tercera fila resulta cómoda para adultos.",
      "En el puesto de conducción sorprende su gigantesca pantalla de 17.7 pulgadas integrada con un panel digital de 11 pulgadas, audio Bose, cargador inalámbrico y conectividad total sin cables.",
      "Impulsada por un motor 2.5L Turbo de 328 CV asociado a una caja automática de 8 marchas y tracción integral AWD, entrega potencia de sobra para viajar cargado en ruta o afrontar caminos exigentes con total serenidad.",
    ],
    includedItems: [
      "Unidad Chevrolet Traverse High Country 0 km",
      "2 llaves inteligentes con encendido remoto",
      "Alfombras premium de goma y tela + red de carga",
      "Documentación oficial y cobertura OnStar",
    ],
    featureRatings: [
      { label: "Espacio y habitabilidad", score: 5.0 },
      { label: "Potencia y andar", score: 4.9 },
      { label: "Tecnología y pantalla", score: 4.9 },
      { label: "Seguridad y asistencias", score: 5.0 },
    ],
    reviews: [
      {
        id: "rev-trav-1",
        author: "Sebastián L.",
        rating: 5,
        date: "11 nov. 2026",
        comment:
          "Impresionante el nivel de insonorización y la pantalla de 17 pulgadas. Viajamos 6 adultos con valijas y fuimos en primera clase todo el trayecto.",
        helpful: 22,
        verified: true,
      },
      {
        id: "rev-trav-2",
        author: "Carolina B.",
        rating: 5,
        date: "03 nov. 2026",
        comment:
          "El motor responde increíble y las asistencias de conducción en autopista dan muchísima tranquilidad. La elegimos en negro y roba miradas donde frena.",
        helpful: 16,
        verified: true,
      },
      {
        id: "rev-trav-3",
        author: "Gustavo E.",
        rating: 5,
        date: "25 oct. 2026",
        comment:
          "El espacio de baúl con los asientos plegados es gigante y el sonido Bose se escucha espectacular. Excelente atención del concesionario.",
        helpful: 9,
        verified: true,
      },
    ],
  },
};

export function getProductDetails(product: Product): ProductDetails {
  if (PRODUCT_DETAILS[product.id]) {
    return PRODUCT_DETAILS[product.id];
  }

  const isCar = product.category.toLowerCase().includes("veh");

  return {
    productKind: isCar ? "car" : "general",
    condition: isCar ? "0 km" : "Nuevo",
    soldText: "+25 vendidos",
    installmentsCount: 12,
    shippingTitle: isCar
      ? "Entrega coordinada en concesionario"
      : "Envío gratis a todo el país",
    shippingSubtitle: isCar
      ? "Consultá disponibilidad y formas de entrega"
      : "Envío rápido y asegurado",
    warranty: "Garantía oficial de 12 meses",
    highlights: [
      `Producto original de categoría ${product.category}.`,
      "Calidad garantizada con respaldo oficial.",
      "Atención personalizada ante cualquier consulta.",
    ],
    keySpecs: [
      { icon: "shield", label: "Garantía", value: "Oficial 12 meses" },
      { icon: "connect", label: "Categoría", value: product.category },
    ],
    specGroups: [
      {
        title: "Información general",
        rows: [
          { label: "Producto", value: product.name },
          { label: "Categoría", value: product.category },
          { label: "Stock disponible", value: `${product.stock} unidades` },
        ],
      },
    ],
    extendedDescription: [product.description],
    includedItems: [product.name, "Documentación y garantía"],
    featureRatings: [
      { label: "Calidad general", score: 4.8 },
      { label: "Relación precio-calidad", score: 4.7 },
    ],
    reviews: [
      {
        id: `rev-default-${product.id}`,
        author: "Usuario verificado",
        rating: 5,
        date: "Reciente",
        comment: "Excelente producto, cumplió con todo lo esperado.",
        helpful: 4,
        verified: true,
      },
    ],
  };
}
