import { useMemo } from "react";
import ProductsOnSale from "../../components/productsOnSale/ProductsOnSale";
import BestSellers from "../../components/bestSellers/BestSellers";
import { getCoverImage } from "../../data/productMedia";
import { getProductDetails, getProductPricing } from "../../data/productDetails";
import { getProductPath } from "../../utils/productRoute";
import { useProducts } from "../../hooks/useProducts";
import type { Product as CatalogProduct } from "../../types/productMedia";
import type {
  BestSellersCategory,
  Product,
} from "../../types/productCategory";

function toBestSeller(product: CatalogProduct): Product {
  const details = getProductDetails(product);
  const pricing = getProductPricing(product, details.productKind);
  const originalPrice =
    pricing.originalPrice && pricing.originalPrice > pricing.finalPrice
      ? pricing.originalPrice
      : undefined;

  return {
    id: product.id,
    title: product.name,
    image: getCoverImage(product) || product.image,
    price: pricing.finalPrice,
    originalPrice,
    sold: details.soldText,
    installments: {
      count: details.installmentsCount,
      amount: Math.round(pricing.finalPrice / details.installmentsCount),
      provider: "Mercado Crédito",
    },
    shipping: product.stock > 0 ? "tomorrow" : undefined,
    href: getProductPath(product),
  };
}

function groupByCategory(products: CatalogProduct[]): BestSellersCategory[] {
  const grouped = new Map<string, Product[]>();

  for (const product of products) {
    const items = grouped.get(product.category) ?? [];
    items.push(toBestSeller(product));
    grouped.set(product.category, items);
  }

  return Array.from(grouped, ([name, items]) => ({
    id: name.toLowerCase().replace(/\s+/g, "-"),
    name,
    products: items,
  }));
}

function BestSellersPage() {
  const { products } = useProducts();

  const categories = useMemo(() => groupByCategory(products), [products]);

  return (
    <>
      <ProductsOnSale />

      {categories.map((category) => (
        <BestSellers
          key={category.id}
          className={category.name === "Tecnología" ? "bestSellersTechnology" : undefined}
          title={`Más vendidos de la semana en ${category.name}`}
          products={category.products}
        />
      ))}
    </>
  );
}

export default BestSellersPage;
