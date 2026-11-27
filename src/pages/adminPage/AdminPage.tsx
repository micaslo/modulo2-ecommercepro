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
    <main className="adminPage">
      <div className="adminContainer">
        <header className="adminHeader">
          <div>
            <span className="adminEyebrow">PERFIL ADMINISTRADOR</span>
            <h1>Panel de Administración</h1>
            <p>
              Gestioná el inventario completo de productos con código único y
              administrá los usuarios registrados en la plataforma.
            </p>
          </div>

          <div className="adminHeaderActions">
            <Link to="/perfil" className="btnSecondary adminLinkBtn">
              Mi perfil
            </Link>
            <Link to="/productos" className="btnSecondary adminLinkBtn">
              Ver catálogo
            </Link>
            <button
              type="button"
              className="btnPrimary"
              onClick={() => {
                setActiveTab("products");
                productForm.openCreate();
              }}
            >
              + Agregar producto
            </button>
          </div>
        </header>

        <section className="adminKpis" aria-label="Indicadores generales">
          <article className="adminKpiCard">
            <span className="adminKpiLabel">Total de productos</span>
            <strong className="adminKpiValue">{stats.totalProducts}</strong>
            <small>En catálogo activo</small>
          </article>
          <article className="adminKpiCard">
            <span className="adminKpiLabel">Stock acumulado</span>
            <strong className="adminKpiValue">{stats.totalStock}</strong>
            <small>Unidades disponibles</small>
          </article>
          <article className="adminKpiCard">
            <span className="adminKpiLabel">Stock crítico (≤ 3)</span>
            <strong
              className={`adminKpiValue ${
                stats.lowStockCount > 0 ? "isWarning" : ""
              }`}
            >
              {stats.lowStockCount}
            </strong>
            <small>Artículos por reponer</small>
          </article>
          <article className="adminKpiCard">
            <span className="adminKpiLabel">Usuarios registrados</span>
            <strong className="adminKpiValue">{stats.totalUsers}</strong>
            <small>{stats.guestCount} invitados activos</small>
          </article>
        </section>

        {banner && (
          <div
            className={`adminBanner ${banner.type === "success" ? "adminBannerSuccess" : "adminBannerError"}`}
            role="status"
          >
            <span>{banner.message}</span>
            <button
              type="button"
              className="adminBannerClose"
              onClick={() => setBanner(null)}
              aria-label="Cerrar notificación"
            >
              ✕
            </button>
          </div>
        )}

        <div className="adminTabs" role="tablist" aria-label="Secciones del panel">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "products"}
            className={`adminTab ${activeTab === "products" ? "isActive" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            Inventario y Productos ({products.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "users"}
            className={`adminTab ${activeTab === "users" ? "isActive" : ""}`}
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
        galleryImages={productForm.galleryImages}
        hasExistingImages={productForm.hasExistingImages}
        hasRemovedBundledImages={productForm.hasRemovedBundledImages}
        imageMode={productForm.imageMode}
        isProcessingImage={productForm.isProcessingImage}
        model3DMode={productForm.model3DMode}
        model3DLabel={productForm.model3DLabel}
        model3DUrlInput={productForm.model3DUrlInput}
        model3DError={productForm.model3DError}
        hasActiveModel3D={productForm.hasActiveModel3D}
        isProcessingModel3D={productForm.isProcessingModel3D}
        highlights={productForm.highlights}
        highlightDraft={productForm.highlightDraft}
        includedItems={productForm.includedItems}
        includedItemDraft={productForm.includedItemDraft}
        includedItemDraftIncluded={productForm.includedItemDraftIncluded}
        discountEnabled={productForm.discountEnabled}
        discountPercentInput={productForm.discountPercentInput}
        discountError={productForm.discountError}
        register={productForm.register}
        control={productForm.control}
        errors={productForm.errors}
        onCategoryChange={productForm.handleCategoryChange}
        onCodeChange={productForm.handleCodeManualChange}
        onRegenerateSku={productForm.regenerateSku}
        onToggleDiscount={productForm.toggleDiscount}
        onDiscountPercentChange={productForm.handleDiscountPercentChange}
        onImageModeChange={productForm.setImageMode}
        onAddImageFromUrl={productForm.addImageFromUrl}
        onImageFilesSelect={productForm.handleImageFiles}
        onRemoveGalleryImage={productForm.removeGalleryImage}
        onRestoreBundledImages={productForm.restoreBundledImages}
        onModel3DModeChange={productForm.setModel3DMode}
        onGlbFileSelect={productForm.handleGlbFileSelect}
        onGltfFolderSelect={productForm.handleGltfFolderSelect}
        onModel3DUrlChange={productForm.handleModel3DUrlChange}
        onClearModel3D={productForm.clearModel3D}
        onHighlightDraftChange={productForm.setHighlightDraft}
        onAddHighlight={productForm.addHighlight}
        onUpdateHighlight={productForm.updateHighlight}
        onRemoveHighlight={productForm.removeHighlight}
        onIncludedItemDraftChange={productForm.setIncludedItemDraft}
        onIncludedItemDraftIncludedChange={
          productForm.setIncludedItemDraftIncluded
        }
        onAddIncludedItem={productForm.addIncludedItem}
        onUpdateIncludedItemLabel={productForm.updateIncludedItemLabel}
        onToggleIncludedItem={productForm.toggleIncludedItem}
        onRemoveIncludedItem={productForm.removeIncludedItem}
        onSubmit={productForm.handleSubmit}
        onClose={productForm.close}
      />

      {deleteTarget && (
        <div
          className="adminModalBackdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-delete-title"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="adminConfirmModal"
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
            <div className="adminModalActions">
              <button
                type="button"
                className="adminBtnGhost"
                onClick={() => setDeleteTarget(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="adminBtnDanger"
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
