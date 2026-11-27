import { formatARS, PROMO_COUPONS } from "../data/checkoutConfig";
import { getProductDetails } from "../data/productDetails";
import { getCoverImage, getProductMedia } from "../data/productMedia";
import type { Product, ProductDetails } from "../types/productMedia";
import type {
  TilliActionLink,
  TilliCartSnapshot,
  TilliComparison,
  TilliComparisonRow,
  TilliMessage,
  TilliProductCard,
} from "../types/tilli";

export const STORE_WHATSAPP_NUMBER = "5493813190987";

const STORE_INFO = {
  name: "Tienda Liebre",
  address: "Gral. José María Paz 576 (Entrepiso), San Miguel de Tucumán, Tucumán",
  hours: "Lunes a sábados de 09:00 a 21:00 hs",
  mapsUrl:
    "https://www.bing.com/maps/default.aspx?where1=Gral.+Jos%C3%A9+Mar%C3%ADa+Paz+576%2C+T4000+San+Miguel+de+Tucum%C3%A1n%2C+Tucum%C3%A1n%2C+Argentina",
};

export interface TilliEngineContext {
  products: Product[];
  currentProduct: Product | null;
  cart: TilliCartSnapshot;
  lastUserQuery?: string;
}

export interface TilliBotReply {
  text: string;
  products?: TilliProductCard[];
  comparison?: TilliComparison;
  actions?: TilliActionLink[];
  quickReplies?: string[];
}

export function buildWhatsappUrl(message: string): string {
  return `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function formatTimeNow(): string {
  return new Date().toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function createMessageId(prefix: "bot" | "user"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s$.]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toProductCard(product: Product): TilliProductCard {
  const details = getProductDetails(product);
  const media = getProductMedia(product);
  const defaultColor = media.colors[0];
  const discount =
    details.originalPrice && details.originalPrice > product.price
      ? Math.round((1 - product.price / details.originalPrice) * 100)
      : 0;

  return {
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: details.originalPrice,
    category: product.category,
    image: getCoverImage(product, defaultColor?.id),
    stock: product.stock,
    isCar: details.productKind === "car",
    defaultColorId: defaultColor?.id,
    defaultColorLabel: defaultColor?.label,
    badge: discount > 0 ? `${discount}% OFF` : details.condition,
  };
}

function parseNumberToken(rawValue: string, unit?: string): number | null {
  const cleaned = rawValue.replace(/\./g, "").replace(",", ".");
  const base = Number(cleaned);
  if (!Number.isFinite(base) || base <= 0) return null;

  const u = unit?.toLowerCase() ?? "";
  if (u.startsWith("mill")) return Math.round(base * 1_000_000);
  if (u === "m") return Math.round(base * 1_000_000);
  if (u === "k" || u === "mil") return Math.round(base * 1_000);

  return Math.round(base);
}

interface PriceFilter {
  min?: number;
  max?: number;
  sort?: "asc" | "desc";
}

function extractPriceFilter(normalized: string): PriceFilter | null {
  const rangeMatch = normalized.match(
    /entre\s+\$?\s*(\d[\d.]*)\s*(k|mil|millones|millon|m)?\s*y\s+\$?\s*(\d[\d.]*)\s*(k|mil|millones|millon|m)?/,
  );
  if (rangeMatch) {
    const a = parseNumberToken(rangeMatch[1], rangeMatch[2]);
    const b = parseNumberToken(rangeMatch[3], rangeMatch[4]);
    if (a && b) {
      return { min: Math.min(a, b), max: Math.max(a, b), sort: "asc" };
    }
  }

  const maxMatch = normalized.match(
    /(?:menos de|menor a|menores a|hasta|maximo|max|por debajo de|como mucho)\s+\$?\s*(\d[\d.]*)\s*(k|mil|millones|millon|m)?/,
  );
  if (maxMatch) {
    const max = parseNumberToken(maxMatch[1], maxMatch[2]);
    if (max) return { max, sort: "asc" };
  }

  const minMatch = normalized.match(
    /(?:mas de|mayor a|mayores a|desde|minimo|min|arriba de)\s+\$?\s*(\d[\d.]*)\s*(k|mil|millones|millon|m)?/,
  );
  if (minMatch) {
    const min = parseNumberToken(minMatch[1], minMatch[2]);
    if (min) return { min, sort: "asc" };
  }

  if (/\b(mas barato|economico|economicos|barato|baratos|accesible)\b/.test(normalized)) {
    return { sort: "asc" };
  }

  if (/\b(mas caro|tope de gama|premium|lujo|mas caros)\b/.test(normalized)) {
    return { sort: "desc" };
  }

  return null;
}

const KIND_SYNONYMS: Record<ProductDetails["productKind"], string[]> = {
  phone: [
    "celular",
    "celulares",
    "celu",
    "celus",
    "telefono",
    "telefonos",
    "smartphone",
    "smartphones",
    "movil",
    "iphone",
    "apple",
    "samsung",
    "galaxy",
    "s26",
    "18 pro",
  ],
  car: [
    "auto",
    "autos",
    "vehiculo",
    "vehiculos",
    "camioneta",
    "camionetas",
    "suv",
    "coche",
    "0km",
    "0 km",
    "chevrolet",
    "captiva",
    "traverse",
    "plazas",
    "familiar",
  ],
  camera: [
    "camara",
    "camaras",
    "foto",
    "fotos",
    "fotografia",
    "reflex",
    "dslr",
    "mirrorless",
    "lente",
    "canon",
    "nikon",
    "5d",
    "z9",
    "z 9",
    "8k",
  ],
  gaming: [
    "gaming",
    "gamer",
    "joystick",
    "control",
    "mando",
    "ps5",
    "playstation",
    "play",
    "dualsense",
    "sony",
    "jugar",
    "juegos",
  ],
  general: [],
};

const STOP_WORDS = new Set([
  "el",
  "la",
  "los",
  "las",
  "un",
  "una",
  "unos",
  "unas",
  "de",
  "del",
  "al",
  "a",
  "en",
  "y",
  "o",
  "con",
  "sin",
  "por",
  "para",
  "que",
  "quien",
  "como",
  "cual",
  "cuales",
  "cuanto",
  "cuantos",
  "donde",
  "busco",
  "quiero",
  "necesito",
  "tenes",
  "tienen",
  "hay",
  "disponible",
  "disponibles",
  "ver",
  "mostrar",
  "mostrame",
  "dame",
  "algo",
  "me",
  "mi",
  "mis",
  "tu",
  "tus",
  "su",
  "este",
  "esta",
  "ese",
  "esa",
  "producto",
  "productos",
  "precio",
  "sale",
  "cuesta",
  "vale",
  "sobre",
  "info",
  "informacion",
  "detalles",
  "mas",
  "menos",
  "muy",
  "buen",
  "bueno",
  "mejor",
  "mejores",
  "comparar",
  "compara",
  "vs",
  "contra",
  "entre",
  "diferencia",
  "diferencias",
  "tilli",
]);

function getMeaningfulTokens(normalized: string): string[] {
  return normalized
    .split(" ")
    .filter((token) => token.length >= 2 && !STOP_WORDS.has(token) && !/^\$?\d[\d.]*$/.test(token));
}

const KIND_CATEGORY_META: Record<
  Exclude<ProductDetails["productKind"], "general">,
  {
    categoryParam: string;
    actionLabel: string;
    introText: string;
    primaryIds: [string, string];
    quickReplies: string[];
  }
> = {
  phone: {
    categoryParam: "Tecnología",
    actionLabel: "Explorar categoría Tecnología",
    introText:
      "Estos son los **2 modelos de celulares** que tenemos en la tienda (disponibles en distintos colores y capacidades):",
    primaryIds: ["iphone-18-pro", "samsung-s26-ultra"],
    quickReplies: [
      "Comparar iPhone vs Samsung",
      "Cupones y ofertas",
      "Medios de pago y cuotas",
    ],
  },
  car: {
    categoryParam: "Vehículos",
    actionLabel: "Explorar categoría Vehículos",
    introText:
      "Estos son los **2 modelos de vehículos 0 km** destacados que tenemos disponibles:",
    primaryIds: ["chevrolet-captiva", "chevrolet-traverse"],
    quickReplies: [
      "Comparar Captiva vs Traverse",
      "Envíos a todo el país",
      "Hablar por WhatsApp",
    ],
  },
  camera: {
    categoryParam: "Cámaras y Accesorios",
    actionLabel: "Explorar categoría Cámaras y Accesorios",
    introText:
      "Estas son las **2 cámaras profesionales** destacadas que tenemos disponibles:",
    primaryIds: ["canon-eos-5d-mark-iv", "nikon-z9"],
    quickReplies: [
      "Comparar Canon vs Nikon",
      "Medios de pago y cuotas",
      "Cupones y ofertas",
    ],
  },
  gaming: {
    categoryParam: "Gaming",
    actionLabel: "Explorar categoría Gaming",
    introText:
      "Estos son nuestros destacados de **Gaming** (disponibles en varios colores):",
    primaryIds: ["ps5-dualsense", "ps5-dualsense-blue"],
    quickReplies: [
      "Cupones y ofertas",
      "Medios de pago y cuotas",
      "Ver catálogo",
    ],
  },
};

function buildCategoryAction(
  kind: ProductDetails["productKind"] | null,
): TilliActionLink[] | undefined {
  if (!kind || kind === "general") return undefined;
  const meta = KIND_CATEGORY_META[kind];
  return [
    {
      label: meta.actionLabel,
      kind: "route",
      to: `/productos?categoria=${encodeURIComponent(meta.categoryParam)}`,
    },
  ];
}

function matchesProductKind(
  product: Product,
  kind: ProductDetails["productKind"],
): boolean {
  return getProductDetails(product).productKind === kind;
}

function pickPrimaryForKind(
  products: Product[],
  kind: Exclude<ProductDetails["productKind"], "general">,
): Product[] {
  const inKind = products.filter((p) => matchesProductKind(p, kind));
  const [firstId, secondId] = KIND_CATEGORY_META[kind].primaryIds;
  const first = inKind.find((p) => p.id === firstId);
  const second = inKind.find((p) => p.id === secondId && p.id !== first?.id);

  const picked: Product[] = [];
  if (first) picked.push(first);
  if (second) picked.push(second);

  for (const item of inKind) {
    if (picked.length >= 2) break;
    if (!picked.some((p) => p.id === item.id)) {
      picked.push(item);
    }
  }

  return picked;
}

const GENERIC_KIND_WORDS: Record<
  Exclude<ProductDetails["productKind"], "general">,
  Set<string>
> = {
  phone: new Set([
    "celular",
    "celulares",
    "celu",
    "celus",
    "telefono",
    "telefonos",
    "smartphone",
    "smartphones",
    "movil",
    "moviles",
    "modelos",
    "modelo",
  ]),
  car: new Set([
    "auto",
    "autos",
    "vehiculo",
    "vehiculos",
    "camioneta",
    "camionetas",
    "suv",
    "coche",
    "0km",
    "km",
    "modelos",
    "modelo",
  ]),
  camera: new Set([
    "camara",
    "camaras",
    "foto",
    "fotos",
    "fotografia",
    "profesional",
    "profesionales",
    "reflex",
    "mirrorless",
    "modelos",
    "modelo",
  ]),
  gaming: new Set([
    "gaming",
    "gamer",
    "joystick",
    "joysticks",
    "control",
    "controles",
    "mando",
    "mandos",
    "ps5",
    "playstation",
    "play",
    "jugar",
    "juegos",
  ]),
};

function isGenericKindQuery(
  normalized: string,
  kind: Exclude<ProductDetails["productKind"], "general">,
): boolean {
  const tokens = getMeaningfulTokens(normalized);
  if (tokens.length === 0) return false;
  const words = GENERIC_KIND_WORDS[kind];
  return tokens.every((token) => words.has(token));
}

function detectKindFromQuery(normalized: string): ProductDetails["productKind"] | null {
  for (const [kind, synonyms] of Object.entries(KIND_SYNONYMS) as Array<
    [ProductDetails["productKind"], string[]]
  >) {
    if (synonyms.some((word) => normalized.includes(word))) {
      return kind;
    }
  }
  return null;
}

function scoreProduct(product: Product, normalizedQuery: string, tokens: string[]): number {
  const details = getProductDetails(product);
  const nameNorm = normalizeText(product.name);
  const categoryNorm = normalizeText(product.category);
  const descNorm = normalizeText(product.description);
  const idNorm = normalizeText(product.id.replace(/-/g, " "));
  const specsNorm = normalizeText(
    details.keySpecs.map((s) => `${s.label} ${s.value}`).join(" "),
  );

  let score = 0;

  if (normalizedQuery.includes(idNorm) || normalizedQuery.includes(nameNorm)) {
    score += 40;
  }

  for (const token of tokens) {
    if (nameNorm.includes(token)) score += 12;
    else if (idNorm.includes(token)) score += 10;
    else if (categoryNorm.includes(token)) score += 8;
    else if (specsNorm.includes(token)) score += 5;
    else if (descNorm.includes(token)) score += 3;
  }

  const kindSynonyms = KIND_SYNONYMS[details.productKind] ?? [];
  for (const syn of kindSynonyms) {
    if (normalizedQuery.includes(syn)) {
      score += 9;
    }
  }

  return score;
}

function findMatchingProducts(
  products: Product[],
  normalizedQuery: string,
): Product[] {
  const tokens = getMeaningfulTokens(normalizedQuery);
  const scored = products
    .map((product) => ({
      product,
      score: scoreProduct(product, normalizedQuery, tokens),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map((item) => item.product);
}

function buildComparison(productA: Product, productB: Product): TilliComparison {
  const detailsA = getProductDetails(productA);
  const detailsB = getProductDetails(productB);

  const avgRating = (details: ProductDetails) => {
    if (!details.reviews.length) return "Sin reseñas";
    const avg =
      details.reviews.reduce((sum, r) => sum + r.rating, 0) /
      details.reviews.length;
    return `${avg.toFixed(1)} ★ (${details.reviews.length})`;
  };

  const rows: TilliComparisonRow[] = [
    {
      label: "Precio",
      valueA: formatARS(productA.price),
      valueB: formatARS(productB.price),
    },
    {
      label: "Cuotas",
      valueA: `Hasta ${detailsA.installmentsCount} cuotas`,
      valueB: `Hasta ${detailsB.installmentsCount} cuotas`,
    },
    {
      label: "Stock",
      valueA: productA.stock > 0 ? `${productA.stock} disponibles` : "Sin stock",
      valueB: productB.stock > 0 ? `${productB.stock} disponibles` : "Sin stock",
    },
    {
      label: "Calificación",
      valueA: avgRating(detailsA),
      valueB: avgRating(detailsB),
    },
    {
      label: "Garantía",
      valueA: detailsA.warranty,
      valueB: detailsB.warranty,
    },
  ];

  const maxExtraSpecs = 3;
  for (let i = 0; i < maxExtraSpecs; i++) {
    const specA = detailsA.keySpecs[i];
    const specB = detailsB.keySpecs[i];
    if (specA || specB) {
      rows.push({
        label: specA?.label ?? specB?.label ?? "Especificación",
        valueA: specA?.value ?? "—",
        valueB: specB?.value ?? "—",
      });
    }
  }

  return {
    productA: toProductCard(productA),
    productB: toProductCard(productB),
    rows,
  };
}

function buildProductSpecificAnswer(
  product: Product,
  normalized: string,
): TilliBotReply | null {
  const details = getProductDetails(product);
  const media = getProductMedia(product);

  if (/\b(incluye|caja|trae|viene|accesorios|contenido)\b/.test(normalized)) {
    const itemsList = details.includedItems.map((item) => `• ${item}`).join("\n");
    return {
      text: `Esto es lo que incluye **${product.name}**:\n${itemsList}`,
      quickReplies: ["¿Tiene garantía?", "¿Cuántas cuotas tiene?", "Envío y entrega"],
    };
  }

  if (/\b(garantia|oficial|respaldo)\b/.test(normalized)) {
    return {
      text: `**${product.name}** cuenta con **${details.warranty}** (${details.condition}).`,
      quickReplies: ["¿Qué incluye?", "Ver reseñas", "¿Cuántas cuotas tiene?"],
    };
  }

  if (/\b(envio|envios|llega|entrega|retiro|despacho|concesionario)\b/.test(normalized)) {
    return {
      text: `Para **${product.name}**:\n• ${details.shippingTitle}\n• ${details.shippingSubtitle}`,
      actions: [
        { label: "Ver ubicación de sucursal", kind: "prompt", to: "¿Dónde están ubicados?" },
      ],
      quickReplies: ["¿Tiene garantía?", "Ver mi carrito", "Cupones disponibles"],
    };
  }

  if (/\b(resena|resenas|opinion|opiniones|estrellas|puntaje|bueno|recomendas)\b/.test(normalized)) {
    const count = details.reviews.length;
    const avg = count
      ? (details.reviews.reduce((s, r) => s + r.rating, 0) / count).toFixed(1)
      : "5.0";
    const topReview = details.reviews[0];
    const topSnippet = topReview
      ? `\n\nÚltima opinión destacada (${topReview.author} · ${topReview.rating}★):\n"${topReview.comment}"`
      : "";

    return {
      text: `**${product.name}** tiene una calificación promedio de **${avg} ★** basada en ${count} reseñas verificadas.${topSnippet}`,
      quickReplies: ["Especificaciones clave", "¿Qué incluye?", "Comparar con otro"],
    };
  }

  if (/\b(color|colores|variante|variantes)\b/.test(normalized)) {
    if (media.colors.length > 0) {
      const colorNames = media.colors.map((c) => c.label).join(", ");
      return {
        text: `**${product.name}** está disponible en los siguientes colores: **${colorNames}**. Podés elegir tu favorito desde la página del producto.`,
        products: [toProductCard(product)],
        quickReplies: ["¿Hay stock?", "¿Qué incluye?", "Ver reseñas"],
      };
    }
    return {
      text: `**${product.name}** se ofrece en su presentación estándar oficial (stock actual: ${product.stock} unidades).`,
      products: [toProductCard(product)],
    };
  }

  if (/\b(stock|disponible|disponibilidad|quedan|unidades)\b/.test(normalized)) {
    return {
      text:
        product.stock > 0
          ? `¡Sí! Tenemos **${product.stock} unidades** en stock de **${product.name}** a **${formatARS(product.price)}**.`
          : `Por el momento **${product.name}** está sin stock. Podés consultar reposición por WhatsApp.`,
      products: [toProductCard(product)],
      actions:
        product.stock <= 0
          ? [
              {
                label: "Consultar reposición por WhatsApp",
                kind: "whatsapp",
                to: buildWhatsappUrl(
                  `Hola! Quería consultar cuándo vuelve el stock de ${product.name}.`,
                ),
              },
            ]
          : undefined,
    };
  }

  if (/\b(especificacion|especificaciones|caracteristica|caracteristicas|ficha|specs|camara|bateria|motor|pantalla|procesador|ram|memoria)\b/.test(normalized)) {
    const specsList = details.keySpecs
      .slice(0, 6)
      .map((s) => `• ${s.label}: ${s.value}`)
      .join("\n");
    return {
      text: `Principales características de **${product.name}**:\n${specsList}`,
      quickReplies: ["¿Qué incluye?", "Ver reseñas", "Comparar con otro"],
    };
  }

  if (/\b(cuota|cuotas|precio|sale|cuesta|vale|pagar|financiacion)\b/.test(normalized)) {
    const installmentAmount = formatARS(product.price / details.installmentsCount);
    const originalLine =
      details.originalPrice && details.originalPrice > product.price
        ? ` (antes ${formatARS(details.originalPrice)})`
        : "";
    return {
      text: `**${product.name}** está **${formatARS(product.price)}**${originalLine}.\nPodés pagarlo en hasta **${details.installmentsCount} cuotas sin interés de ${installmentAmount}** con Visa, hasta **18 cuotas sin interés** con Mastercard, o hasta 6 cuotas sin interés con Amex.\nTip: usá el cupón **LIEBRE25** en el carrito para un **25% OFF**.`,
      products: [toProductCard(product)],
      quickReplies: ["¿Qué incluye?", "¿Tiene garantía?", "Ver mi carrito"],
    };
  }

  return null;
}

export function getContextualQuickReplies(currentProduct: Product | null): string[] {
  if (currentProduct) {
    return [
      "¿Qué incluye?",
      "¿Cuántas cuotas tiene?",
      "Ver reseñas",
      "Comparar con otro",
    ];
  }
  return [
    "Ver catálogo",
    "Cupones y ofertas",
    "Celulares disponibles",
    "Comparar iPhone vs Samsung",
  ];
}

export function createWelcomeMessage(currentProduct: Product | null): TilliMessage {
  const text = currentProduct
    ? `¡Hola! Soy **Tilli**, tu asistente de ${STORE_INFO.name}. Veo que estás mirando **${currentProduct.name}**. Preguntame sobre cuotas, garantía, reseñas, qué incluye o comparalo con otro producto.`
    : `¡Hola! Soy **Tilli**, tu asistente de compras de ${STORE_INFO.name}. Puedo buscarte productos por categoría o presupuesto, comparar modelos, contarte sobre cupones y cuotas o ayudarte con tu carrito.`;

  return {
    id: createMessageId("bot"),
    sender: "bot",
    text,
    timestamp: formatTimeNow(),
    quickReplies: getContextualQuickReplies(currentProduct),
  };
}

export function generateTilliReply(
  rawInput: string,
  context: TilliEngineContext,
): TilliBotReply {
  const normalized = normalizeText(rawInput);
  const { products, currentProduct, cart } = context;

  if (!normalized) {
    return {
      text: "Escribime qué producto buscás o en qué te puedo ayudar.",
      quickReplies: getContextualQuickReplies(currentProduct),
    };
  }

  if (
    /^(hola|buenas|buen dia|buenas tardes|buenas noches|hey|hi|que tal|como estas|saludos)\b/.test(
      normalized,
    ) ||
    /\b(quien sos|como te llamas|ayuda|menu|que podes hacer|que haces)\b/.test(
      normalized,
    )
  ) {
    return {
      text: currentProduct
        ? `¡Hola! Soy **Tilli**. Estoy viendo que mirás **${currentProduct.name}**. Puedo contarte sus características, cuotas, garantía, compararlo con otro modelo o buscar cualquier otro producto de la tienda.`
        : `¡Hola! Soy **Tilli**, el asistente virtual de **${STORE_INFO.name}**. Puedo ayudarte a:\n• Buscar productos por nombre, categoría o presupuesto\n• Comparar dos modelos lado a lado\n• Consultar cuotas, cupones de descuento y envíos\n• Revisar tu carrito o derivarte a WhatsApp`,
      quickReplies: getContextualQuickReplies(currentProduct),
    };
  }

  if (/^(gracias|muchas gracias|genial|perfecto|excelente|barbaro|joya|chau|adios|hasta luego|nos vemos)\b/.test(normalized)) {
    return {
      text: "¡De nada! Si necesitás buscar otro producto, comparar modelos o consultar por tu carrito, acá estoy.",
      quickReplies: ["Ver catálogo", "Cupones y ofertas", "Ver mi carrito"],
    };
  }

  if (/\b(comparar|compara|comparame|comparacion|vs|versus|contra|diferencia|diferencias)\b/.test(normalized)) {
    let pair: [Product, Product] | null = null;

    const splitVs =
      normalized.match(/^(.+?)\s+(?:vs|versus|contra)\s+(.+)$/) ??
      normalized.match(/\bentre\s+(.+?)\s+y\s+(.+)$/);

    if (splitVs) {
      const leftMatches = findMatchingProducts(products, splitVs[1]);
      const leftProduct = leftMatches[0];
      if (leftProduct) {
        const rightMatches = findMatchingProducts(
          products.filter((p) => p.id !== leftProduct.id),
          splitVs[2],
        );
        if (rightMatches[0]) {
          pair = [leftProduct, rightMatches[0]];
        }
      }
    }

    const matched = pair ? [] : findMatchingProducts(products, normalized);

    if (!pair && matched.length >= 2) {
      pair = [matched[0], matched[1]];
    } else if (!pair && currentProduct) {
      const currentKind = getProductDetails(currentProduct).productKind;
      const explicitOther = matched.find((p) => p.id !== currentProduct.id);
      const sameKindOther = products.find(
        (p) =>
          p.id !== currentProduct.id &&
          getProductDetails(p).productKind === currentKind,
      );
      const fallbackOther = products.find((p) => p.id !== currentProduct.id);
      const targetOther = explicitOther ?? sameKindOther ?? fallbackOther;
      if (targetOther) {
        pair = [currentProduct, targetOther];
      }
    } else if (!pair && matched.length === 1) {
      const targetKind = getProductDetails(matched[0]).productKind;
      const peer = products.find(
        (p) =>
          p.id !== matched[0].id &&
          getProductDetails(p).productKind === targetKind,
      );
      if (peer) pair = [matched[0], peer];
    } else if (!pair && products.length >= 2) {
      const phoneA = products.find((p) => p.id === "iphone-18-pro");
      const phoneB = products.find((p) => p.id === "samsung-s26-ultra");
      pair = phoneA && phoneB ? [phoneA, phoneB] : [products[0], products[1]];
    }

    if (pair) {
      const comparison = buildComparison(pair[0], pair[1]);
      return {
        text: `Acá tenés la comparativa entre **${pair[0].name}** y **${pair[1].name}**:`,
        comparison,
        quickReplies: [
          "Comparar Canon vs Nikon",
          "Comparar Captiva vs Traverse",
          "Ver catálogo",
        ],
      };
    }
  }

  if (/\b(carrito|mi compra|mis compras|cuanto llevo|checkout|finalizar compra|mi pedido)\b/.test(normalized)) {
    if (cart.totalItems === 0) {
      return {
        text: "Tu carrito está vacío por ahora. Si querés te recomiendo algún producto y lo agregás con un clic desde acá.",
        actions: [{ label: "Ir al carrito", kind: "route", to: "/cart" }],
        quickReplies: ["Ver catálogo", "Productos más baratos", "Cupones y ofertas"],
      };
    }

    const summaryLines = cart.itemNames
      .slice(0, 4)
      .map((item) => `• ${item.quantity}x ${item.name} (${formatARS(item.price * item.quantity)})`)
      .join("\n");
    const extraLine =
      cart.itemNames.length > 4
        ? `\n• ...y ${cart.itemNames.length - 4} ítem(s) más`
        : "";

    return {
      text: `Tenés **${cart.totalItems} ${cart.totalItems === 1 ? "producto" : "productos"}** en tu carrito por un subtotal de **${formatARS(cart.subtotal)}**:\n${summaryLines}${extraLine}\n\nRecordá que podés aplicar el cupón **LIEBRE25** en el checkout para tener **25% OFF**.`,
      actions: [{ label: "Ir al carrito y pagar", kind: "route", to: "/cart" }],
      quickReplies: ["Medios de pago y cuotas", "Seguir buscando"],
    };
  }

  if (/\b(cupon|cupones|codigo|descuento|promo|promocion|promociones|oferta|ofertas)\b/.test(normalized)) {
    const couponList = Object.entries(PROMO_COUPONS)
      .map(([code, data]) => `• **${code}**: ${data.discountPercent}% de descuento en tu carrito`)
      .join("\n");

    const discountedProducts = products
      .filter((p) => {
        const d = getProductDetails(p);
        return Boolean(d.originalPrice && d.originalPrice > p.price);
      })
      .slice(0, 3)
      .map(toProductCard);

    return {
      text: `¡Tenemos promos activas!\n${couponList}\n\nAdemás, estos productos ya tienen precio rebajado:`,
      products: discountedProducts,
      actions: [{ label: "Aplicar en mi carrito", kind: "route", to: "/cart" }],
      quickReplies: ["Medios de pago y cuotas", "Programa de revendedores"],
    };
  }

  if (/\b(donde estan|ubicacion|direccion|como llegar|horario|horarios|sucursal|local|tucuman|abierto|abren)\b/.test(normalized)) {
    return {
      text: `Nos encontrás en **${STORE_INFO.name}**:\n• Dirección: ${STORE_INFO.address}\n• Horario: ${STORE_INFO.hours}`,
      actions: [
        { label: "Abrir en Bing Maps", kind: "external", to: STORE_INFO.mapsUrl },
        { label: "Ver sección Cómo llegar", kind: "route", to: "/como-llegar" },
      ],
      quickReplies: ["Envíos a todo el país", "Hablar por WhatsApp"],
    };
  }

  if (/\b(revendedor|revendedores|mayorista|mayoristas|por mayor|revender)\b/.test(normalized)) {
    return {
      text: `En nuestro **Programa de Revendedores** de ${STORE_INFO.name} accedés a:\n• **10% de descuento** comprando 3 productos o más\n• **+5% adicional** pagando en efectivo\n• **30 días** de vigencia para renovar tu cuenta mayorista`,
      actions: [
        { label: "Ir a Revendedores", kind: "route", to: "/resellers" },
      ],
      quickReplies: ["Ver catálogo", "Hablar por WhatsApp"],
    };
  }

  if (/\b(whatsapp|wsp|humano|asesor|persona|contacto|llamar|soporte|reclamo)\b/.test(normalized)) {
    const contextDetail = currentProduct
      ? `Hola! Estaba hablando con Tilli sobre ${currentProduct.name} y necesito ayuda de un asesor.`
      : context.lastUserQuery
        ? `Hola! Estaba hablando con Tilli sobre "${context.lastUserQuery}" y quiero hablar con un asesor.`
        : "Hola! Vengo desde el chat con Tilli y quiero hablar con un asesor.";

    return {
      text: "Te conecto directo con nuestro equipo por WhatsApp con el resumen de tu consulta listo para enviar.",
      actions: [
        {
          label: "Abrir WhatsApp con asesor",
          kind: "whatsapp",
          to: buildWhatsappUrl(contextDetail),
        },
      ],
      quickReplies: ["¿Dónde están ubicados?", "Ver catálogo"],
    };
  }

  const matchedProducts = findMatchingProducts(products, normalized);
  const priceFilter = extractPriceFilter(normalized);
  const detectedKind = detectKindFromQuery(normalized);

  if (
    currentProduct &&
    !priceFilter &&
    matchedProducts.length === 0 &&
    !detectedKind
  ) {
    const contextualAnswer = buildProductSpecificAnswer(currentProduct, normalized);
    if (contextualAnswer) {
      return contextualAnswer;
    }
  }

  if (matchedProducts.length === 1 && !priceFilter) {
    const specificAnswer = buildProductSpecificAnswer(matchedProducts[0], normalized);
    if (specificAnswer) {
      return specificAnswer;
    }
  }

  if (/\b(pago|pagos|pagar|tarjeta|tarjetas|visa|mastercard|amex|cuota|cuotas|financiacion|interes)\b/.test(normalized) && matchedProducts.length === 0) {
    return {
      text: `Aceptamos tarjetas de crédito y débito en el checkout:\n• **Visa:** 1, 3, 6, 9 y hasta **12 cuotas sin interés**\n• **American Express:** hasta **6 cuotas sin interés** (y 9 o 12 con financiación)\n• **Mastercard:** 1, 3, 6, 9, 12 y hasta **18 cuotas sin interés**\n\nAdemás podés usar el cupón **LIEBRE25** para un **25% OFF**.`,
      actions: [{ label: "Ver mi carrito", kind: "route", to: "/cart" }],
      quickReplies: ["Cupones y ofertas", "Envíos a todo el país"],
    };
  }

  if (/\b(envio|envios|entrega|despacho|correo|pais|cuanto tarda)\b/.test(normalized) && matchedProducts.length === 0) {
    return {
      text: "Ofrecemos **envíos a todo el país con envío gratis en compras superiores a $300.000** (entrega estimada en 24 a 48 hs hábiles en tecnología, cámaras y gaming). Para **vehículos 0 km**, la entrega se coordina en concesionario oficial con test drive y patentamiento asistido.",
      quickReplies: ["¿Dónde están ubicados?", "Ver catálogo", "Medios de pago y cuotas"],
    };
  }

  if (/\b(catalogo|todos los productos|que venden|que hay|ver todo|mostrar todo|categorias|seguir buscando)\b/.test(normalized)) {
    const categories = Array.from(new Set(products.map((p) => p.category)));
    return {
      text: `Actualmente tenemos **${products.length} productos** en las categorías: **${categories.join(", ")}**. Acá tenés una selección destacada:`,
      products: products.slice(0, 4).map(toProductCard),
      actions: [
        { label: "Ir al catálogo completo", kind: "route", to: "/productos" },
      ],
      quickReplies: [
        "Celulares disponibles",
        "Vehículos 0 km",
        "Cámaras profesionales",
        "Productos más baratos",
      ],
    };
  }

  if (
    detectedKind &&
    detectedKind !== "general" &&
    !priceFilter &&
    isGenericKindQuery(normalized, detectedKind)
  ) {
    const primaryItems = pickPrimaryForKind(products, detectedKind);
    if (primaryItems.length > 0) {
      const meta = KIND_CATEGORY_META[detectedKind];
      return {
        text: meta.introText,
        products: primaryItems.map(toProductCard),
        actions: buildCategoryAction(detectedKind),
        quickReplies: meta.quickReplies,
      };
    }
  }

  if (priceFilter || matchedProducts.length > 0 || detectedKind) {
    let candidates = matchedProducts.length > 0 ? matchedProducts : [...products];

    if (detectedKind && detectedKind !== "general") {
      const kindCandidates = candidates.filter((p) =>
        matchesProductKind(p, detectedKind),
      );
      candidates =
        kindCandidates.length > 0
          ? kindCandidates
          : products.filter((p) => matchesProductKind(p, detectedKind));
    }

    if (priceFilter) {
      candidates = candidates.filter((p) => {
        if (priceFilter.min !== undefined && p.price < priceFilter.min) return false;
        if (priceFilter.max !== undefined && p.price > priceFilter.max) return false;
        return true;
      });

      if (priceFilter.sort === "asc") {
        candidates.sort((a, b) => a.price - b.price);
      } else if (priceFilter.sort === "desc") {
        candidates.sort((a, b) => b.price - a.price);
      }
    }

    if (candidates.length > 0) {
      const maxCards = detectedKind && detectedKind !== "general" ? 2 : 3;
      const topCards = candidates.slice(0, maxCards).map(toProductCard);
      let intro = `Encontré **${candidates.length} ${candidates.length === 1 ? "opción" : "opciones"}** que coinciden con tu búsqueda:`;

      if (priceFilter?.max !== undefined && priceFilter.min === undefined) {
        intro = `Estos son los productos hasta **${formatARS(priceFilter.max)}** que tenemos disponibles:`;
      } else if (priceFilter?.min !== undefined && priceFilter.max !== undefined) {
        intro = `Encontré estas opciones entre **${formatARS(priceFilter.min)}** y **${formatARS(priceFilter.max)}**:`;
      } else if (priceFilter?.sort === "asc" && priceFilter.max === undefined && priceFilter.min === undefined) {
        intro = "Acá tenés las opciones más accesibles de la tienda:";
      } else if (priceFilter?.sort === "desc") {
        intro = "Acá tenés nuestros productos tope de gama:";
      }

      const nextReplies: string[] = [];
      if (candidates.length >= 2) {
        nextReplies.push(`Comparar ${candidates[0].name.split(" ").slice(0, 2).join(" ")} vs ${candidates[1].name.split(" ").slice(0, 2).join(" ")}`);
      }
      nextReplies.push("Cupones y ofertas", "Ver mi carrito");

      const categoryActions = buildCategoryAction(detectedKind);

      return {
        text: intro,
        products: topCards,
        actions: categoryActions,
        quickReplies: nextReplies,
      };
    }

    const cheapest = [...products].sort((a, b) => a.price - b.price)[0];
    return {
      text: cheapest
        ? `No encontré productos dentro de ese presupuesto exacto. Nuestra opción más accesible hoy es **${cheapest.name}** a **${formatARS(cheapest.price)}** (y con el cupón **LIEBRE25** te queda con 25% OFF).`
        : "No encontré productos con ese criterio de precio.",
      products: cheapest ? [toProductCard(cheapest)] : undefined,
      quickReplies: ["Ver catálogo", "Cupones y ofertas", "Hablar por WhatsApp"],
    };
  }

  return {
    text: `No llegué a entender del todo "${rawInput.trim()}". Puedo buscarte productos (celulares, cámaras, vehículos, gaming), filtrar por precio, comparar modelos o pasarte directo con un asesor por WhatsApp.`,
    actions: [
      {
        label: "Consultar esto por WhatsApp",
        kind: "whatsapp",
        to: buildWhatsappUrl(
          `Hola! Le consulté a Tilli: "${rawInput.trim()}" y quería más información.`,
        ),
      },
    ],
    quickReplies: getContextualQuickReplies(currentProduct),
  };
}
