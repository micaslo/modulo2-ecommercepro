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

  "canon-eos-5d-mark-iv": {
    productKind: "camera",
    condition: "Nuevo",
    soldText: "+25 vendidos",
    originalPrice: 5490000,
    installmentsCount: 12,
    shippingTitle: "Envío gratis a todo el país",
    shippingSubtitle: "Llegando en 24 a 48 hs hábiles · Envío asegurado",
    warranty: "Garantía oficial Canon de 12 meses",
    highlights: [
      "Sensor CMOS Full Frame de 30.4 MP con procesador DIGIC 6+ para detalle profesional.",
      "Incluye lente Canon EF 24-105mm f/4L IS II USM Serie L con estabilizador óptico.",
      "Grabación de video 4K DCI (4096 × 2160) hasta 30 fps y Full HD hasta 60 fps.",
      "Sistema AF de 61 puntos (41 en cruz) y tecnología Dual Pixel CMOS AF en Live View y video.",
      "Cuerpo sellado en aleación de magnesio con pantalla táctil LCD de 3.2\", Wi-Fi, NFC y GPS.",
    ],
    keySpecs: [
      { icon: "camera", label: "Resolución del sensor", value: "30.4 MP Full Frame" },
      { icon: "lens", label: "Lente incluido", value: "EF 24-105mm f/4L IS II" },
      { icon: "video", label: "Resolución de video", value: "4K DCI 30 fps · FHD 60" },
      { icon: "cpu", label: "Procesador", value: "Canon DIGIC 6+" },
      { icon: "screen", label: "Pantalla", value: 'LCD táctil 3.2" (1.62M)' },
      { icon: "storage", label: "Ranuras de memoria", value: "Doble CF + SD UHS-I" },
      { icon: "connect", label: "Conectividad", value: "Wi-Fi · NFC · GPS" },
      { icon: "shield", label: "Construcción", value: "Magnesio sellado" },
    ],
    specGroups: [
      {
        title: "Características generales",
        rows: [
          { label: "Marca", value: "Canon" },
          { label: "Modelo", value: "EOS 5D Mark IV" },
          { label: "Tipo de cámara", value: "DSLR (Réflex digital) Full Frame" },
          { label: "Montura", value: "Canon EF" },
          { label: "Construcción", value: "Aleación de magnesio sellada contra polvo y humedad" },
          { label: "Peso del cuerpo", value: "890 g (con batería y tarjeta)" },
        ],
      },
      {
        title: "Sensor y enfoque",
        rows: [
          { label: "Sensor", value: "CMOS Full Frame (36 × 24 mm) de 30.4 MP efectivos" },
          { label: "Procesador de imagen", value: "DIGIC 6+" },
          { label: "Rango ISO", value: "100 – 32.000 (expandible de 50 a 102.400)" },
          { label: "Sistema AF", value: "61 puntos de enfoque (41 en cruz) + Dual Pixel CMOS AF" },
          { label: "Disparo continuo", value: "Hasta 7 fotos por segundo (fps)" },
          { label: "Velocidad de obturación", value: "1/8000 s a 30 s + modo Bulb" },
        ],
      },
      {
        title: "Lente incluido (Kit Serie L)",
        rows: [
          { label: "Modelo de lente", value: "Canon EF 24-105mm f/4L IS II USM" },
          { label: "Apertura máxima", value: "f/4 constante en todo el rango focal" },
          { label: "Estabilizador óptico", value: "Sí, Image Stabilizer (IS) hasta 4 pasos" },
          { label: "Motor de enfoque", value: "USM ultrasónico silencioso y rápido" },
          { label: "Diámetro de filtro", value: "77 mm" },
        ],
      },
      {
        title: "Video, pantalla y conectividad",
        rows: [
          { label: "Video 4K", value: "4K DCI (4096 × 2160) a 30/25/24 fps (Motion JPEG)" },
          { label: "Video Full HD", value: "1080p hasta 60 fps · HD 720p hasta 120 fps" },
          { label: "Pantalla trasera", value: 'LCD táctil Clear View II de 3.2" (1.62M puntos)' },
          { label: "Visor óptico", value: "Pentaprisma con cobertura del 100%" },
          { label: "Almacenamiento", value: "1x CompactFlash (UDMA 7) + 1x SD / SDHC / SDXC" },
          { label: "Puertos e inalámbrico", value: "USB 3.0, Mini HDMI, Mic/Auriculares 3.5 mm, Wi-Fi, NFC y GPS" },
        ],
      },
    ],
    extendedDescription: [
      "La Canon EOS 5D Mark IV es un estándar indiscutido en la fotografía profesional de eventos, retratos, moda, arquitectura y fotoperiodismo. Su sensor Full Frame de 30.4 megapíxeles combinado con el procesador DIGIC 6+ ofrece colores fieles, amplio rango dinámico y un excelente desempeño en condiciones de poca luz.",
      "Este kit incluye el objetivo profesional Canon EF 24-105mm f/4L IS II USM de la reconocida Serie L, un zoom todoterreno con apertura constante f/4, estabilización óptica de imagen y sellado climático que te permite resolver desde planos amplios hasta retratos sin cambiar de lente.",
      "Con grabación en 4K DCI, enfoque Dual Pixel CMOS AF súper suave en video y Live View, doble ranura para tarjetas CF/SD y conectividad Wi-Fi, NFC y GPS integrados, está lista para responder en sesiones exigentes tanto en estudio como en exteriores.",
    ],
    includedItems: [
      "1x Cuerpo Canon EOS 5D Mark IV",
      "1x Lente Canon EF 24-105mm f/4L IS II USM con parasol EW-83M y tapas",
      "1x Batería recargable Canon LP-E6N y cargador LC-E6",
      "1x Correa ancha Canon EOS, cable USB IFC-150U II y manuales oficiales",
    ],
    featureRatings: [
      { label: "Calidad de imagen", score: 5.0 },
      { label: "Construcción y ergonomía", score: 4.9 },
      { label: "Versatilidad del lente kit", score: 4.9 },
      { label: "Relación precio-calidad", score: 4.7 },
    ],
    reviews: [
      {
        id: "rev-can-1",
        author: "Matías R.",
        rating: 5,
        date: "13 nov. 2026",
        comment:
          "Un tanque de guerra para sociales y estudio. El 24-105 f/4L II es súper nítido y la ergonomía del cuerpo es insuperable cuando trabajás muchas horas seguidas.",
        helpful: 19,
        verified: true,
      },
      {
        id: "rev-can-2",
        author: "Luciana V.",
        rating: 5,
        date: "05 nov. 2026",
        comment:
          "La calidad de color de Canon y el rango dinámico del sensor de 30 MP son espectaculares. Llegó sellada de fábrica y con envío asegurado.",
        helpful: 14,
        verified: true,
      },
      {
        id: "rev-can-3",
        author: "Emiliano S.",
        rating: 5,
        date: "26 oct. 2026",
        comment:
          "El Dual Pixel AF en pantalla táctil es rapidísimo para grabar entrevistas y el sellado climático me salvó trabajando bajo llovizna. Súper recomendable.",
        helpful: 11,
        verified: true,
      },
    ],
  },

  "nikon-z9": {
    productKind: "camera",
    condition: "Nuevo",
    soldText: "+10 vendidos",
    originalPrice: 11590000,
    installmentsCount: 12,
    shippingTitle: "Envío gratis a todo el país",
    shippingSubtitle: "Llegando en 24 a 48 hs hábiles · Envío asegurado",
    warranty: "Garantía oficial Nikon de 12 meses",
    highlights: [
      "Sensor CMOS BSI apilado Full Frame de 45.7 MP sin obturador mecánico (100% electrónico).",
      "Procesador EXPEED 7 con enfoque automático por IA que detecta personas, animales, aves y vehículos.",
      "Grabación interna de video profesional en 8K UHD hasta 60p (N-RAW 12 bits) y 4K hasta 120p.",
      "Ráfaga de hasta 20 fps en RAW sin blackout y hasta 120 fps en JPEG para deportes y fauna.",
      "Cuerpo de aleación de magnesio con empuñadura vertical integrada y pantalla inclinable en 4 ejes.",
    ],
    keySpecs: [
      { icon: "camera", label: "Sensor Full Frame", value: "45.7 MP CMOS Apilado" },
      { icon: "video", label: "Video profesional", value: "8K UHD · 4K 120p N-RAW" },
      { icon: "cpu", label: "Procesador", value: "Nikon EXPEED 7" },
      { icon: "lens", label: "Montura y VR", value: "Montura Z · VR 5 ejes" },
      { icon: "screen", label: "Pantalla y visor", value: 'LCD 3.2" 4 ejes · Real-Live' },
      { icon: "storage", label: "Memoria", value: "Doble CFexpress Tipo B" },
      { icon: "connect", label: "Conectividad", value: "Wi-Fi · BT · LAN · GPS" },
      { icon: "shield", label: "Construcción", value: "Magnesio sellado · Grip" },
    ],
    specGroups: [
      {
        title: "Características generales",
        rows: [
          { label: "Marca", value: "Nikon" },
          { label: "Modelo", value: "Z 9 (Cuerpo profesional insignia)" },
          { label: "Tipo de cámara", value: "Mirrorless (Sin espejo) Full Frame" },
          { label: "Montura", value: "Nikon Z" },
          { label: "Diseño", value: "Aleación de magnesio sellada con grip vertical integrado" },
          { label: "Peso", value: "1.340 g (con batería y tarjetas)" },
        ],
      },
      {
        title: "Sensor, obturador y enfoque AF",
        rows: [
          { label: "Sensor", value: "CMOS BSI apilado Full Frame de 45.7 MP efectivos" },
          { label: "Procesador", value: "EXPEED 7 de lectura ultrarrápida" },
          { label: "Obturador", value: "100% electrónico silencioso hasta 1/32.000 s" },
          { label: "Estabilización", value: "VR integrada en el cuerpo de 5 ejes (hasta 6 pasos Synchro VR)" },
          { label: "Enfoque automático", value: "493 puntos con seguimiento 3D e IA (9 tipos de sujetos)" },
          { label: "Ráfaga máxima", value: "20 fps RAW · 30 fps JPEG 45 MP · 120 fps JPEG 11 MP" },
        ],
      },
      {
        title: "Video profesional 8K",
        rows: [
          { label: "Resolución máxima", value: "8K UHD (7680 × 4320) interno hasta 60p (N-RAW)" },
          { label: "Video 4K", value: "4K UHD sobremuestreado hasta 120p sin recorte" },
          { label: "Codecs internos", value: "N-RAW 12 bits, ProRes RAW HQ, ProRes 422 HQ, H.265 10 bits" },
          { label: "Duración continua", value: "Hasta 125 minutos en 8K 30p sin sobrecalentamiento" },
        ],
      },
      {
        title: "Pantalla, memoria y conectividad",
        rows: [
          { label: "Visor electrónico", value: "Real-Live Viewfinder OLED sin apagón (3.000 nits)" },
          { label: "Pantalla trasera", value: 'LCD táctil de 3.2" abatible en 4 ejes (vertical y horizontal)' },
          { label: "Almacenamiento", value: "Doble ranura CFexpress Tipo B / XQD" },
          { label: "Batería", value: "EN-EL18d recargable de alta capacidad con carga USB-C PD" },
          { label: "Puertos y redes", value: "HDMI Tipo A completo, Ethernet RJ-45, USB-C, Wi-Fi, Bluetooth y GPS" },
        ],
      },
    ],
    extendedDescription: [
      "La Nikon Z 9 representa la cúspide de la ingeniería mirrorless Full Frame. Gracias a su sensor CMOS apilado de 45.7 megapíxeles y al procesador EXPEED 7, elimina por completo el obturador mecánico ofreciendo una velocidad de lectura líder, ráfagas silenciosas de hasta 120 fps y un visor Real-Live completamente libre de blackout.",
      "Su sistema de enfoque automático impulsado por inteligencia artificial reconoce y sigue con precisión milimétrica ojos de personas, animales, aves y todo tipo de vehículos, convirtiéndola en la herramienta definitiva para deportes, naturaleza, prensa y comerciales.",
      "En producción audiovisual, la Z 9 graba internamente en 8K UHD y 4K hasta 120p en formatos profesionales como N-RAW de 12 bits y ProRes 422 HQ, todo dentro de un cuerpo sellado de aleación de magnesio con grip vertical integrado y pantalla táctil inclinable en 4 ejes.",
    ],
    includedItems: [
      "1x Cuerpo Nikon Z 9 con empuñadura vertical integrada",
      "1x Batería recargable de ion de litio EN-EL18d y cargador MH-33",
      "1x Correa AN-DC24, tapa de cuerpo BF-N1 y protector de zapata BS-1",
      "1x Cable USB UC-E24, clip para cables y garantía oficial",
    ],
    featureRatings: [
      { label: "Calidad de foto y video 8K", score: 5.0 },
      { label: "Velocidad y enfoque AF", score: 5.0 },
      { label: "Construcción y sellado", score: 4.9 },
      { label: "Autonomía y ergonomía", score: 4.8 },
    ],
    reviews: [
      {
        id: "rev-nik-1",
        author: "Esteban K.",
        rating: 5,
        date: "15 nov. 2026",
        comment:
          "Vengo de DSLR pro de Nikon y el visor sin blackout junto con el seguimiento 3D de aves y deportes es de otro planeta. No pierde foco nunca.",
        helpful: 16,
        verified: true,
      },
      {
        id: "rev-nik-2",
        author: "Paula M.",
        rating: 5,
        date: "06 nov. 2026",
        comment:
          "La usamos para publicidad en 8K N-RAW y 4K 120p y rinde como cámara de cine con la agilidad de una mirrorless. La pantalla de 4 ejes es comodísima.",
        helpful: 12,
        verified: true,
      },
      {
        id: "rev-nik-3",
        author: "Ramiro D.",
        rating: 5,
        date: "23 oct. 2026",
        comment:
          "Cuerpo impecable, súper sólido y la batería EN-EL18d te permite cubrir jornadas completas sin preocuparte. Excelente atención y envío impecable.",
        helpful: 8,
        verified: true,
      },
    ],
  },

  "ps5-dualsense": {
    productKind: "gaming",
    condition: "Nuevo",
    soldText: "+500 vendidos",
    originalPrice: 184999,
    installmentsCount: 6,
    shippingTitle: "Envío gratis a todo el país",
    shippingSubtitle: "Llegando mañana · Despacho inmediato",
    warranty: "Garantía oficial Sony Argentina de 12 meses",
    highlights: [
      "Respuesta háptica con activadores dobles que simulan texturas, impactos y retroceso en cada juego.",
      "Gatillos adaptativos L2 y R2 con niveles dinámicos de fuerza y tensión según la acción.",
      "Micrófono integrado con botón de silenciado dedicado, altavoz incorporado y jack de 3.5 mm.",
      "Botón Crear para capturar, editar y transmitir tus mejores momentos de juego al instante.",
      "Conectividad inalámbrica Bluetooth 5.1, batería recargable de 1560 mAh y puerto USB-C · Compatible con PS5, PC, Mac, iOS y Android.",
    ],
    keySpecs: [
      { icon: "haptics", label: "Vibración", value: "Respuesta háptica doble" },
      { icon: "gamepad", label: "Gatillos", value: "Adaptativos L2 / R2" },
      { icon: "connect", label: "Conectividad", value: "Bluetooth 5.1 · USB-C" },
      { icon: "battery", label: "Batería integrada", value: "1560 mAh recargable" },
      { icon: "mic", label: "Audio y chat", value: "Mic integrado + Jack 3.5 mm" },
      { icon: "cpu", label: "Sensores", value: "Movimiento 6 ejes + Touchpad" },
      { icon: "screen", label: "Compatibilidad", value: "PS5 · PC · Mac · Móviles" },
      { icon: "shield", label: "Peso y medidas", value: "280 g · 160×106×66 mm" },
    ],
    specGroups: [
      {
        title: "Características generales",
        rows: [
          { label: "Marca", value: "Sony" },
          { label: "Línea", value: "PlayStation 5" },
          { label: "Modelo", value: "DualSense Wireless Controller (CFI-ZCT1W)" },
          { label: "Tipo", value: "Joystick inalámbrico con vibración háptica" },
          { label: "Colores disponibles", value: "Blanco, Negro, Azul, Plata y Camuflado" },
        ],
      },
      {
        title: "Inmersión y controles",
        rows: [
          { label: "Respuesta háptica", value: "Activadores dobles de vibración dinámica" },
          { label: "Gatillos adaptativos", value: "Resistencia variable en L2 y R2" },
          { label: "Panel táctil", value: "Touchpad capacitivo de 2 puntos con clic y barra LED" },
          { label: "Sensor de movimiento", value: "Sistema de 6 ejes (giroscopio + acelerómetro)" },
          { label: "Botón Crear", value: "Captura de pantalla, video y transmisión rápida" },
        ],
      },
      {
        title: "Conectividad, audio y compatibilidad",
        rows: [
          { label: "Conexión inalámbrica", value: "Bluetooth 5.1 de baja latencia" },
          { label: "Puertos", value: "USB Type-C (carga y datos) + conector auriculares 3.5 mm" },
          { label: "Audio integrado", value: "Micrófono con botón Mute + parlante integrado" },
          { label: "Plataformas compatibles", value: "PlayStation 5, Windows PC, macOS, iOS y Android" },
        ],
      },
      {
        title: "Batería y dimensiones",
        rows: [
          { label: "Batería", value: "Ion de litio recargable integrada de 1560 mAh" },
          { label: "Dimensiones", value: "160 mm (ancho) × 106 mm (alto) × 66 mm (espesor)" },
          { label: "Peso aproximado", value: "280 g" },
        ],
      },
    ],
    extendedDescription: [
      "El Joystick Inalámbrico Sony DualSense para PlayStation 5 redefine la sensación de juego gracias a su tecnología de respuesta háptica con activadores dobles y gatillos adaptativos que transmiten físicamente cada superficie, aceleración o tensión del arco directamente en tus manos.",
      "Su diseño ergonómico en dos tonos incorpora un panel táctil con barra luminosa, sensor de movimiento de 6 ejes, altavoz integrado y micrófono con botón de silenciado rápido, además de conector de 3.5 mm para sumar tus auriculares favoritos.",
      "Equipado con Bluetooth 5.1, batería recargable de 1560 mAh y puerto USB Type-C, funciona de forma nativa en PlayStation 5 y también se conecta sin esfuerzo a PC con Windows, Mac, iOS y Android. Elegí tu variante favorita entre Blanco, Negro, Azul, Plata y Camuflado.",
    ],
    includedItems: [
      "1x Joystick inalámbrico Sony DualSense para PS5 (color seleccionado)",
      "1x Manual de usuario y garantía oficial Sony",
    ],
    featureRatings: [
      { label: "Comodidad y ergonomía", score: 4.9 },
      { label: "Respuesta háptica y gatillos", score: 5.0 },
      { label: "Calidad de materiales", score: 4.9 },
      { label: "Relación precio-calidad", score: 4.8 },
    ],
    reviews: [
      {
        id: "rev-ps5-1",
        author: "Tomás B.",
        rating: 5,
        date: "16 nov. 2026",
        comment:
          "Me pedí el camuflado y el acabado está buenísimo. Los gatillos adaptativos en shooters y juegos de carreras te cambian completamente la inmersión.",
        helpful: 27,
        verified: true,
      },
      {
        id: "rev-ps5-2",
        author: "Agustina L.",
        rating: 5,
        date: "09 nov. 2026",
        comment:
          "100% original en caja sellada. Lo uso tanto en la PS5 como en la PC por Bluetooth y anda perfecto. El azul es súper fachero en persona.",
        helpful: 18,
        verified: true,
      },
      {
        id: "rev-ps5-3",
        author: "Joaquín P.",
        rating: 5,
        date: "01 nov. 2026",
        comment:
          "Muy cómodo para sesiones largas y el botón de silenciar el micrófono directo en el joystick es súper práctico. Llegó al día siguiente.",
        helpful: 13,
        verified: true,
      },
      {
        id: "rev-ps5-4",
        author: "Valentina C.",
        rating: 4,
        date: "22 oct. 2026",
        comment:
          "Excelente control, el color plata se ve muy elegante. Solo tener en cuenta que no incluye el cable USB-C en la caja, pero anda espectacular.",
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

  const normalizedCat = product.category
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const normalizedName = `${product.id} ${product.name}`.toLowerCase();

  const isCar =
    normalizedCat.includes("veh") || normalizedName.includes("chevrolet");
  const isPhone =
    normalizedName.includes("iphone") ||
    normalizedName.includes("samsung") ||
    normalizedName.includes("galaxy");
  const isCamera =
    normalizedCat.includes("camar") ||
    normalizedName.includes("canon") ||
    normalizedName.includes("nikon");
  const isGaming =
    normalizedCat.includes("gaming") ||
    normalizedName.includes("dualsense") ||
    normalizedName.includes("ps5") ||
    normalizedName.includes("joystick");

  const productKind: ProductDetails["productKind"] = isCar
    ? "car"
    : isPhone
      ? "phone"
      : isCamera
        ? "camera"
        : isGaming
          ? "gaming"
          : "general";

  const hasFreeShipping = !isCar && product.price >= 300000;

  return {
    productKind,
    condition: isCar ? "0 km" : "Nuevo",
    soldText: "+25 vendidos",
    installmentsCount: 12,
    shippingTitle: isCar
      ? "Entrega coordinada en concesionario"
      : hasFreeShipping
        ? "Envío gratis a todo el país"
        : "Envío a todo el país",
    shippingSubtitle: isCar
      ? "Consultá disponibilidad y formas de entrega"
      : hasFreeShipping
        ? "Envío rápido y asegurado"
        : "Envío gratis en compras superiores a $300.000",
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
