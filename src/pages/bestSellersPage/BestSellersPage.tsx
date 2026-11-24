import { useMemo, useState } from "react";
import ProductsOnSale from "../../components/navbar/ProductsOnSale/ProductsOnSale";
import BestSellers from "../../components/navbar/BestSellers/BestSellers";
import SortSelect from "../../components/SortSelect/SortSelect";
import { bestSellersCategories } from "../../services/bestSellersData";
import { sortProducts, type SortOption } from "../../utils/sortProducts";

function BestSellersPage() {
  const [sortBy, setSortBy] = useState<SortOption>("none");

  const globalProducts = useMemo(
    () =>
      sortProducts(
        bestSellersCategories.flatMap((category) => category.products),
        sortBy,
      ),
    [sortBy],
  );

  return (
    <>
      <ProductsOnSale />
      <SortSelect value={sortBy} onChange={setSortBy} />

      {sortBy === "none" ? (
        bestSellersCategories.map((category) => (
          <BestSellers
            key={category.id}
            title={`Más vendidos de la semana en ${category.name}`}
            products={category.products}
          />
        ))
      ) : (
        <BestSellers
          key={sortBy}
          title="Todos los más vendidos"
          products={globalProducts}
        />
      )}
    </>
  );
}

export default BestSellersPage;