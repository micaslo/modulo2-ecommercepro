import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getCoverImage } from "../../data/productMedia";
import type { Product } from "../../types/productMedia";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onRequestDelete: (product: Product) => void;
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

export default function ProductsTable({
  products,
  onEdit,
  onRequestDelete,
}: ProductsTableProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category))).sort(
      (a, b) => a.localeCompare(b, "es"),
    );
    return ["Todas", ...unique];
  }, [products]);

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      if (categoryFilter !== "Todas" && product.category !== categoryFilter) {
        return false;
      }
      if (!query) return true;
      return (
        product.name.toLowerCase().includes(query) ||
        (product.code ?? "").toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    });
  }, [products, search, categoryFilter]);

  return (
    <section className="adminSection" aria-label="Tabla de productos">
      <div className="adminToolbar">
        <label className="adminSearch">
          <span className="adminSrOnly">Buscar producto</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nombre, código o categoría..."
          />
        </label>

        <label className="adminSelect">
          <span className="adminSrOnly">Filtrar categoría</span>
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "Todas" ? "Todas las categorías" : cat}
              </option>
            ))}
          </select>
        </label>

        <span className="adminToolbarCount">
          {visibleProducts.length} de {products.length} productos
        </span>
      </div>

      {visibleProducts.length === 0 ? (
        <div className="adminEmpty">
          No hay productos que coincidan con tu búsqueda.
        </div>
      ) : (
        <div className="adminTableWrap">
          <table className="adminTable">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Código único</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibleProducts.map((product) => {
                const thumb = getCoverImage(product);
                const stockStatus =
                  product.stock <= 0
                    ? "is-out"
                    : product.stock <= 3
                      ? "is-low"
                      : "is-ok";

                return (
                  <tr key={product.id}>
                    <td>
                      <div className="adminProductCell">
                        <div className="adminProductThumb">
                          {thumb ? (
                            <img src={thumb} alt={product.name} loading="lazy" />
                          ) : (
                            <span aria-hidden="true">📦</span>
                          )}
                        </div>
                        <div className="adminProductInfo">
                          <strong>{product.name}</strong>
                          <small>{product.description}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <code className="adminCodePill">
                        {product.code ?? "—"}
                      </code>
                    </td>
                    <td>
                      <span className="adminCategoryPill">
                        {product.category}
                      </span>
                    </td>
                    <td className="adminPriceCell">
                      {formatPrice(product.price)}
                    </td>
                    <td>
                      <span className={`adminStockPill ${stockStatus}`}>
                        {product.stock <= 0
                          ? "Sin stock"
                          : `${product.stock} u.`}
                      </span>
                    </td>
                    <td>
                      <div className="adminRowActions">
                        <Link
                          to={`/product/${product.id}`}
                          className="adminActionBtn adminActionBtnView"
                        >
                          Ver
                        </Link>
                        <button
                          type="button"
                          className="adminActionBtn adminActionBtnEdit"
                          onClick={() => onEdit(product)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="adminActionBtn adminActionBtnDelete"
                          onClick={() => onRequestDelete(product)}
                        >
                          Borrar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
