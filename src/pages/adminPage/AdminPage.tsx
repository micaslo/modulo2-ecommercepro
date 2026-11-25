import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductFormModal from "../../components/admin/ProductFormModal";
import ProductsTable from "../../components/admin/ProductsTable";
import UsersTable from "../../components/admin/UsersTable";
import { useAdminProductForm } from "../../hooks/useAdminProductForm";
import { useAuth } from "../../hooks/useAuth";
import { useProducts } from "../../hooks/useProducts";
import type { SessionUser } from "../../types/auth";
import type { Product } from "../../types/productMedia";
import "./AdminPage.css";

type AdminTab = "products" | "users";

type DeleteTarget =
  | { type: "product"; item: Product }
  | { type: "user"; item: SessionUser }
  | null;

export default function AdminPage() {
  const { user, users, deleteUser } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  const [activeTab, setActiveTab] = useState<AdminTab>("products");
  const [banner, setBanner] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);

  const productForm = useAdminProductForm({
    products,
    onCreate: addProduct,
    onUpdate: updateProduct,
    onSuccess: (message) => setBanner({ type: "success", message }),
  });

  const stats = useMemo(() => {
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const lowStockCount = products.filter((p) => p.stock <= 3).length;
    const guestCount = users.filter((u) => u.role === "guest").length;
    return {
      totalProducts: products.length,
      totalStock,
      lowStockCount,
      totalUsers: users.length,
      guestCount,
    };
  }, [products, users]);

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === "product") {
      deleteProduct(deleteTarget.item.id);
      setBanner({
        type: "success",
        message: `Producto "${deleteTarget.item.name}" eliminado del inventario.`,
      });
    } else {
      const result = deleteUser(deleteTarget.item.id);
      if (!result.ok) {
        setBanner({
          type: "error",
          message: result.error ?? "No se pudo eliminar el usuario.",
        });
      } else {
        setBanner({
          type: "success",
          message: `Usuario "${deleteTarget.item.name}" eliminado correctamente.`,
        });
      }
    }

    setDeleteTarget(null);
  };

  if (!user) return null;

  return (
    <main className="admin-page">
      <div className="admin-container">
        <header className="admin-header">
          <div>
            <span className="admin-eyebrow">PERFIL ADMINISTRADOR</span>
            <h1>Panel de Administración</h1>
            <p>
              Gestioná el inventario completo de productos con código único y
              administrá los usuarios registrados en la plataforma.
            </p>
          </div>

          <div className="admin-header-actions">
            <Link to="/productos" className="btn-secondary admin-link-btn">
              Ver catálogo
            </Link>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setActiveTab("products");
                productForm.openCreate();
              }}
            >
              + Agregar producto
            </button>
          </div>
        </header>

        <section className="admin-kpis" aria-label="Indicadores generales">
          <article className="admin-kpi-card">
            <span className="admin-kpi-label">Total de productos</span>
            <strong className="admin-kpi-value">{stats.totalProducts}</strong>
            <small>En catálogo activo</small>
          </article>
          <article className="admin-kpi-card">
            <span className="admin-kpi-label">Stock acumulado</span>
            <strong className="admin-kpi-value">{stats.totalStock}</strong>
            <small>Unidades disponibles</small>
          </article>
          <article className="admin-kpi-card">
            <span className="admin-kpi-label">Stock crítico (≤ 3)</span>
            <strong
              className={`admin-kpi-value ${
                stats.lowStockCount > 0 ? "is-warning" : ""
              }`}
            >
              {stats.lowStockCount}
            </strong>
            <small>Artículos por reponer</small>
          </article>
          <article className="admin-kpi-card">
            <span className="admin-kpi-label">Usuarios registrados</span>
            <strong className="admin-kpi-value">{stats.totalUsers}</strong>
            <small>{stats.guestCount} invitados activos</small>
          </article>
        </section>

        {banner && (
          <div
            className={`admin-banner admin-banner--${banner.type}`}
            role="status"
          >
            <span>{banner.message}</span>
            <button
              type="button"
              className="admin-banner-close"
              onClick={() => setBanner(null)}
              aria-label="Cerrar notificación"
            >
              ✕
            </button>
          </div>
        )}

        <div className="admin-tabs" role="tablist" aria-label="Secciones del panel">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "products"}
            className={`admin-tab ${activeTab === "products" ? "is-active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            Inventario y Productos ({products.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "users"}
            className={`admin-tab ${activeTab === "users" ? "is-active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Gestión de Usuarios ({users.length})
          </button>
        </div>

        {activeTab === "products" ? (
          <ProductsTable
            products={products}
            onEdit={productForm.openEdit}
            onRequestDelete={(item) => setDeleteTarget({ type: "product", item })}
          />
        ) : (
          <UsersTable
            users={users}
            currentUserId={user.id}
            onRequestDelete={(item) => setDeleteTarget({ type: "user", item })}
          />
        )}
      </div>

      <ProductFormModal
        isOpen={productForm.isOpen}
        isEditing={productForm.isEditing}
        values={productForm.values}
        errors={productForm.errors}
        onChange={productForm.handleChange}
        onSubmit={productForm.handleSubmit}
        onClose={productForm.close}
      />

      {deleteTarget && (
        <div
          className="admin-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-delete-title"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="admin-confirm-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="confirm-delete-title">
              {deleteTarget.type === "product"
                ? "Eliminar producto"
                : "Eliminar usuario"}
            </h2>
            <p>
              {deleteTarget.type === "product" ? (
                <>
                  ¿Seguro que querés borrar{" "}
                  <strong>{deleteTarget.item.name}</strong> (código{" "}
                  <code>{deleteTarget.item.code ?? deleteTarget.item.id}</code>)?
                  Esta acción actualizará el catálogo de inmediato.
                </>
              ) : (
                <>
                  ¿Seguro que querés eliminar la cuenta de{" "}
                  <strong>{deleteTarget.item.name}</strong> (
                  {deleteTarget.item.email})? Esta acción no se puede deshacer.
                </>
              )}
            </p>
            <div className="admin-modal-actions">
              <button
                type="button"
                className="admin-btn-ghost"
                onClick={() => setDeleteTarget(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="admin-btn-danger"
                onClick={handleConfirmDelete}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
