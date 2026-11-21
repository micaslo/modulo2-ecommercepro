import captivaScenicImg from "../assets/images/product-page/images/chevrolet-captiva/captiva-display-red.webp";
import traverseScenicImg from "../assets/images/product-page/images/chevrolet-traverse/traverse-display-grey.webp";
import jeepAvengerImg from "../assets/images/product-page/images/related-products/related-products-jeep-avenger.webp";
import cheryArrizo8Img from "../assets/images/product-page/images/related-products/related-products-chery-arrizo-8.webp";
import cheryTiggo8Img from "../assets/images/product-page/images/related-products/related-product-chery-tiggo-8.webp";
import iphone17Img from "../assets/images/product-page/images/related-products/related-products -iphone17.webp";
import huaweiPura80Img from "../assets/images/product-page/images/related-products/related-products-huawei.webp";
import s25UltraImg from "../assets/images/product-page/images/related-products/related-products-s25-ultra.webp";
import fujifilmXm5Img from "../assets/images/product-page/images/related-products/related-products-camara-fujifilm.webp";
import sonyZve10Img from "../assets/images/product-page/images/related-products/related-products-camara-sony.webp";
import seppiaS1Img from "../assets/images/product-page/images/related-products/related-products-seppia.webp";
import dynacomImg from "../assets/images/product-page/images/related-products/related-products-joystick-dynacom.webp";
import joystickAzulImg from "../assets/images/product-page/images/related-products/related-products-joystick-azul.webp";
import dehukaImg from "../assets/images/product-page/images/related-products/related-products-joystick-dehuka.webp";
import dualshock3Img from "../assets/images/product-page/images/related-products/related-products-sony-dualshock.webp";

export interface StaticRelatedProduct {
  key: string;
  to: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  imageFit?: "contain" | "cover";
  imagePosition?: string;
  shippingLabel: string;
  installmentsCount: number;
  badge?: string;
}

export type RelatedProductEntry =
  | {
      type: "product";
      productId: string;
      imageOverride?: string;
      imageFit?: "contain" | "cover";
      imagePosition?: string;
    }
  | { type: "static"; item: StaticRelatedProduct };

const CAR_EXTRAS: RelatedProductEntry[] = [
  {
    type: "static",
    item: {
      key: "jeep-avenger",
      to: "/error-404",
      title: "Jeep Avenger Longitude T200 MHEV 0 km",
      price: 44660000,
      originalPrice: 47610000,
      image: jeepAvengerImg,
      imageFit: "cover",
      imagePosition: "28% center",
      shippingLabel: "0 km · Entrega oficial",
      installmentsCount: 12,
    },
  },
  {
    type: "static",
    item: {
      key: "chery-arrizo-8",
      to: "/error-404",
      title: "Chery Arrizo 8 CSH Luxury 0 km",
      price: 48500000,
      originalPrice: 51900000,
      image: cheryArrizo8Img,
      imageFit: "cover",
      imagePosition: "35% center",
      shippingLabel: "0 km · Entrega oficial",
      installmentsCount: 12,
    },
  },
  {
    type: "static",
    item: {
      key: "chery-tiggo-8-pro",
      to: "/error-404",
      title: "Chery Tiggo 8 Pro Luxury 0 km",
      price: 66900000,
      originalPrice: 70112000,
      image: cheryTiggo8Img,
      imageFit: "cover",
      imagePosition: "50% center",
      shippingLabel: "0 km · Entrega oficial",
      installmentsCount: 12,
    },
  },
];

const PHONE_EXTRAS: RelatedProductEntry[] = [
  {
    type: "static",
    item: {
      key: "iphone-17-naranja",
      to: "/error-404",
      title: "Apple iPhone 17 Pro 256 GB Naranja Cósmico",
      price: 2899000,
      originalPrice: 3250000,
      image: iphone17Img,
      imageFit: "contain",
      shippingLabel: "Envío gratis",
      installmentsCount: 12,
    },
  },
  {
    type: "static",
    item: {
      key: "huawei-pura-80-pro",
      to: "/error-404",
      title: "Huawei Pura 80 Pro de 512 GB y 12 GB RAM, Negro",
      price: 1999000,
      originalPrice: 2199000,
      image: huaweiPura80Img,
      imageFit: "contain",
      shippingLabel: "Envío gratis",
      installmentsCount: 12,
    },
  },
  {
    type: "static",
    item: {
      key: "samsung-s25-ultra",
      to: "/error-404",
      title: "Samsung Galaxy S25 Ultra 512 GB",
      price: 2049000,
      originalPrice: 2350000,
      image: s25UltraImg,
      imageFit: "contain",
      shippingLabel: "Envío gratis",
      installmentsCount: 12,
    },
  },
];

const CAMERA_EXTRAS: RelatedProductEntry[] = [
  {
    type: "static",
    item: {
      key: "fujifilm-x-m5",
      to: "/error-404",
      title: "Cámara Mirrorless Fujifilm X-M5 Lente 15-45mm Negra",
      price: 3490000,
      originalPrice: 3890000,
      image: fujifilmXm5Img,
      imageFit: "contain",
      shippingLabel: "Envío gratis",
      installmentsCount: 12,
    },
  },
  {
    type: "static",
    item: {
      key: "sony-zv-e10-ii",
      to: "/error-404",
      title:
        "Cámara Digital Mirrorless Vlogger Sony APS-C ZV-E10 + Lente Kit 16-50mm II",
      price: 2590000,
      originalPrice: 2890000,
      image: sonyZve10Img,
      imageFit: "contain",
      shippingLabel: "Envío gratis",
      installmentsCount: 12,
    },
  },
  {
    type: "static",
    item: {
      key: "seppia-s1",
      to: "/error-404",
      title: "Cámara Digital Retro Sin Pantalla Seppia S1 Negra Cuero",
      price: 203975,
      originalPrice: 229900,
      image: seppiaS1Img,
      imageFit: "contain",
      shippingLabel: "Envío gratis",
      installmentsCount: 6,
    },
  },
];

const JOYSTICK_EXTRAS: RelatedProductEntry[] = [
  {
    type: "static",
    item: {
      key: "joystick-dynacom-dy-054346",
      to: "/error-404",
      title: "Joystick Inalámbrico Dynacom DY-054346 Negro Bluetooth PS",
      price: 94999,
      originalPrice: 109999,
      image: dynacomImg,
      imageFit: "contain",
      shippingLabel: "Envío gratis",
      installmentsCount: 6,
    },
  },
  {
    type: "static",
    item: {
      key: "joystick-ps4-azul",
      to: "/error-404",
      title: "Mando Para Play 4 Joystick Inalámbrico Ps4 + Cable Usb Azul",
      price: 34999,
      originalPrice: 41999,
      image: joystickAzulImg,
      imageFit: "contain",
      shippingLabel: "Envío gratis",
      installmentsCount: 6,
    },
  },
  {
    type: "static",
    item: {
      key: "joystick-dehuka",
      to: "/error-404",
      title:
        "Joystick Play Inalámbrico Gamer Compatible con PS4 Bluetooth y PS3 por Cable + Control USB PC Dehuka",
      price: 42999,
      originalPrice: 49999,
      image: dehukaImg,
      imageFit: "contain",
      shippingLabel: "Envío gratis",
      installmentsCount: 6,
    },
  },
  {
    type: "static",
    item: {
      key: "joystick-sony-dualshock-3",
      to: "/error-404",
      title: "Joystick Inalámbrico Playstation Dualshock 3 Negro",
      price: 74999,
      originalPrice: 86999,
      image: dualshock3Img,
      imageFit: "contain",
      shippingLabel: "Envío gratis",
      installmentsCount: 6,
    },
  },
];

export const CURATED_RELATED_PRODUCTS: Record<string, RelatedProductEntry[]> = {
  "chevrolet-traverse": [
    {
      type: "product",
      productId: "chevrolet-captiva",
      imageOverride: captivaScenicImg,
      imageFit: "cover",
      imagePosition: "60% center",
    },
    ...CAR_EXTRAS,
  ],
  "chevrolet-captiva": [
    {
      type: "product",
      productId: "chevrolet-traverse",
      imageOverride: traverseScenicImg,
      imageFit: "cover",
      imagePosition: "50% center",
    },
    ...CAR_EXTRAS,
  ],
  "iphone-18-pro": [
    { type: "product", productId: "samsung-s26-ultra" },
    ...PHONE_EXTRAS,
  ],
  "samsung-s26-ultra": [
    { type: "product", productId: "iphone-18-pro" },
    ...PHONE_EXTRAS,
  ],
  "canon-eos-5d-mark-iv": [
    { type: "product", productId: "nikon-z9" },
    ...CAMERA_EXTRAS,
  ],
  "nikon-z9": [
    { type: "product", productId: "canon-eos-5d-mark-iv" },
    ...CAMERA_EXTRAS,
  ],
  "ps5-dualsense": JOYSTICK_EXTRAS,
};
