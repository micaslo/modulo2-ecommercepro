import BestSellers from "../../components/navbar/BestSellers/BestSellers";
import { bestSellersCategories } from "../../services/bestSellersData";

function BestSellersPage() {
  return (
    <>
      {bestSellersCategories.map((category) => (
        <BestSellers
          key={category.id}
          title={`Más vendidos de la semana en ${category.name}`}
          products={category.products}
        />
      ))}
    </>
  );
}

export default BestSellersPage;