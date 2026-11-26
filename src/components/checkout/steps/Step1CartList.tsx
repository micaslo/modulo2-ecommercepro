import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCarSide,
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaTrashAlt,
} from "react-icons/fa";
import { formatARS } from "../../../data/checkoutConfig";
import { getCoverImage } from "../../../data/productMedia";
import { getProductDetails } from "../../../data/productDetails";
import { getProductPath } from "../../../utils/productRoute";
import type { CartActionResult, CartItem } from "../../../types/cart";
import type { Product } from "../../../types/productMedia";

interface Step1CartListProps {
  items: CartItem[];
  catalogProducts: Product[];
  onIncrement: (key: string) => CartActionResult;
  onDecrement: (key: string) => void;
  onRemove: (key: string) => void;
  onClearCart: () => void;
  onQuickAddProduct: (product: Product) => void;
  onStockLimit: (productName: string, maxStock: number) => void;
  onCarLimit: (productName: string) => void;
  onContinue: () => void;
}

export default function Step1CartList({
  items,
  catalogProducts,
  onIncrement,
  onDecrement,
  onRemove,
  onClearCart,
  onQuickAddProduct,
  onStockLimit,
  onCarLimit,
  onContinue,
}: Step1CartListProps) {
  const handlePlusClick = (item: CartItem) => {
    const result = onIncrement(item.key);
    if (!result.ok) {
      if (result.reason === "car_limit") {
        onCarLimit(item.name);
      } else if (result.reason === "stock_limit") {
        onStockLimit(item.name, item.stock);
      }
      return;
    }

    if (result.reachedStockLimit) {
      onStockLimit(item.name, item.stock);
    }
  };

  return (
    <section className="checkoutCard" aria-labelledby="step1-heading">
      <div className="checkoutCardHeader">
        <div>
          <h2 id="step1-heading" className="checkoutCardTitle">
            Tu lista de compras
          </h2>
          <p className="checkoutCardSubtitle">
            Revisá tus productos, ajustá cantidades y avanzá con tus datos.
          </p>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            className="checkoutTextDangerBtn"
            onClick={onClearCart}
          >
            Vaciar carrito
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="cartEmptyState">
          <div className="cartEmptyIcon">
            <FaShoppingCart size={28} />
          </div>
          <h3>Tu carrito está vacío</h3>
          <p>
            Agregá cualquiera de nuestros productos para comenzar tu compra. Tus
            productos quedarán guardados automáticamente.
          </p>

          <div className="quickCatalogGrid">
            {catalogProducts.slice(0, 7).map((product) => {
              const details = getProductDetails(product);
              const cover = getCoverImage(product);
              return (
                <article key={product.id} className="quickCatalogCard">
                  <Link
                    to={getProductPath(product)}
                    className="quickCatalogMedia"
                  >
                    <img src={cover} alt={product.name} loading="lazy" />
                  </Link>
                  <div className="quickCatalogBody">
                    <span className="quickCatalogCategory">
                      {product.category}
                    </span>
                    <Link
                      to={getProductPath(product)}
                      className="quickCatalogTitle"
                    >
                      {product.name}
                    </Link>
                    <strong className="quickCatalogPrice">
                      {formatARS(product.price)}
                    </strong>
                    <div className="quickCatalogActions">
                      <button
                        type="button"
                        className="btnPrimary quickCatalogAddBtn"
                        onClick={() => onQuickAddProduct(product)}
                      >
                        {details.productKind === "car"
                          ? "Reservar"
                          : "Agregar"}
                      </button>
                      <Link
                        to={getProductPath(product)}
                        className="quickCatalogLink"
                      >
                        Ver detalle
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <ul className="cartItemsList">
            {items.map((item) => {
              const atStockLimit = !item.isCar && item.quantity >= item.stock;

              const itemPath = getProductPath(
                {
                  id: item.productId,
                  category: item.category,
                  name: item.name,
                },
                item.colorId,
              );

              return (
                <li key={item.key} className="cartItemRow">
                  <Link to={itemPath} className="cartItemThumb">
                    <img src={item.image} alt={item.name} />
                  </Link>

                  <div className="cartItemDetails">
                    <div className="cartItemTopRow">
                      <div>
                        <span className="cartItemCategory">{item.category}</span>
                        <Link to={itemPath} className="cartItemTitle">
                          {item.name}
                        </Link>
                      </div>

                      <button
                        type="button"
                        className="cartItemRemoveBtn"
                        onClick={() => onRemove(item.key)}
                        aria-label={`Quitar ${item.name} del carrito`}
                        title="Eliminar producto"
                      >
                        <FaTrashAlt size={14} />
                      </button>
                    </div>

                    <div className="cartItemMeta">
                      {item.colorLabel && (
                        <span className="cartItemPill">
                          Color: <strong>{item.colorLabel}</strong>
                        </span>
                      )}
                      {item.isCar ? (
                        <span className="cartItemPill cartItemPillCar">
                          <FaCarSide size={12} />
                          <span>Máx. 1 unidad online</span>
                        </span>
                      ) : (
                        <span
                          className={`cartItemPill ${
                            atStockLimit ? "cartItemPillLimit" : ""
                          }`}
                        >
                          Stock: {item.stock}{" "}
                          {item.stock === 1 ? "unidad" : "unidades"}
                        </span>
                      )}
                    </div>

                    <div className="cartItemBottomRow">
                      <div
                        className="cartQtyControl"
                        aria-label={`Cantidad de ${item.name}`}
                      >
                        <button
                          type="button"
                          className="cartQtyBtn"
                          onClick={() => onDecrement(item.key)}
                          aria-label="Restar una unidad"
                        >
                          <FaMinus size={11} />
                        </button>
                        <span className="cartQtyValue">{item.quantity}</span>
                        <button
                          type="button"
                          className={`cartQtyBtn ${
                            item.isCar || atStockLimit ? "isAtLimit" : ""
                          }`}
                          onClick={() => handlePlusClick(item)}
                          aria-label="Sumar una unidad"
                          title={
                            item.isCar
                              ? "Compras mayores a 1 vehículo requieren un agente"
                              : atStockLimit
                                ? "Llegaste al límite de stock"
                                : "Sumar una unidad"
                          }
                        >
                          <FaPlus size={11} />
                        </button>
                      </div>

                      <div className="cartItemPriceBlock">
                        {item.quantity > 1 && (
                          <span className="cartItemUnitPrice">
                            {formatARS(item.price)} c/u
                          </span>
                        )}
                        <strong className="cartItemLineTotal">
                          {formatARS(item.price * item.quantity)}
                        </strong>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="checkoutStepFooter">
            <Link to="/productos" className="checkoutBackLink">
              ← Seguir viendo productos
            </Link>

            <button
              type="button"
              className="btnPrimary checkoutNextBtn"
              onClick={onContinue}
            >
              <span>Continuar con tus datos</span>
              <FaArrowRight size={13} />
            </button>
          </div>
        </>
      )}
    </section>
  );
}
