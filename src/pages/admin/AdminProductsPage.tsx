import { useState } from "react";
import { useLocation } from "react-router-dom";
import { deleteProduct } from "../../services/products.services";
import { CATEGORY_INFO, CATEGORY_IDS } from "../../constants/categories";
import { ProductForm } from "../../components/admin/ProductForm";
import { PencilIcon, TrashIcon } from "../../components/ui/icons";
import { SearchInput } from "../../components/ui/SearchInput";
import { ProductImage } from "../../components/ui/ProductImage";
import { useProductsPagination } from "../../hooks/useProductsPagination";
import { useToast } from "../../hooks/useToast";
import { Pagination } from "../../components/ui/Pagination";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import type { CategoryId, Product } from "../../types/product.types";

const PAGE_SIZE = 10;

const LOW_STOCK_THRESHOLD = 5;

const StockBadge = ({ stock }: { stock: number }) => {
  const isLowStock = stock <= LOW_STOCK_THRESHOLD;
  return (
    <span
      className={`text-xs font-bold px-3 py-1 rounded-pill whitespace-nowrap ${
        isLowStock ? "bg-stock-low text-danger" : "bg-stock-ok text-verde-texto"
      }`}
    >
      {isLowStock ? "Stock bajo" : "En stock"} · {stock}
    </span>
  );
};

export const AdminProductsPage = () => {
  const location = useLocation();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilterState] = useState<CategoryId | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  // Si llegamos acá desde el botón "+ Nuevo producto" del Dashboard, el
  // form de alta se abre directo (ver Link con state en AdminDashboardPage).
  const [isCreating, setIsCreating] = useState(
    (location.state as { openCreate?: boolean } | null)?.openCreate ?? false
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [productPendingDelete, setProductPendingDelete] = useState<Product | null>(null);

  const searchPrefix = search.toLowerCase();

  // Misma prioridad que el catálogo de cliente: si hay búsqueda, esa
  // manda (se busca en todo el catálogo, sin importar la categoría
  // seleccionada) -- es el comportamiento esperado en cualquier
  // e-commerce, y mantiene un solo criterio en todo el proyecto.
  const effectiveCategoryId = searchPrefix ? null : categoryFilter;

  const {
    products,
    loading,
    currentPage,
    totalPages,
    totalCount,
    goToNextPage,
    goToPreviousPage,
    refetch,
  } = useProductsPagination({
    categoryId: effectiveCategoryId,
    searchPrefix,
    pageSize: PAGE_SIZE,
  });

  // No hace falta resetear la página a mano: `useCursorPagination` vuelve
  // sola a la página 1 en cuanto cambia la categoría o la búsqueda.
  const handleCategoryFilter = (category: CategoryId | null) => {
    setCategoryFilterState(category);
  };

  const handleSearch = (term: string) => {
    setSearch(term);
  };

  // El trash icon solo pide confirmación (abre el modal); el borrado real
  // pasa acá, disparado desde el botón "Eliminar" del ConfirmDialog.
  const confirmDelete = async () => {
    const product = productPendingDelete;
    if (!product) return;

    setProductPendingDelete(null);
    setDeletingId(product.id);
    await deleteProduct(product.id);
    refetch();
    setDeletingId(null);
    showToast(`"${product.name}" eliminado`, "danger");
  };

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-extrabold text-2xl text-azul-noche">Productos</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="text-sm font-extrabold text-azul-noche bg-mostaza px-5 py-2.5 rounded-pill shadow-cta"
        >
          + Nuevo Producto
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="w-full sm:w-64">
          <SearchInput onSearch={handleSearch} placeholder="Buscar producto..." minLength={1} debounceMs={200} />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => handleCategoryFilter(null)}
            className={`text-sm font-bold px-4 py-2 rounded-pill shrink-0 ${
              categoryFilter === null ? "bg-azul-cobalto text-white" : "bg-card-surface text-azul-noche/70"
            }`}
          >
            Todos
          </button>
          {CATEGORY_IDS.map((id) => (
            <button
              key={id}
              onClick={() => handleCategoryFilter(id)}
              className={`text-sm font-bold px-4 py-2 rounded-pill shrink-0 ${
                categoryFilter === id ? `${CATEGORY_INFO[id].color} text-white` : "bg-card-surface text-azul-noche/70"
              }`}
            >
              {CATEGORY_INFO[id].label}
            </button>
          ))}
        </div>

        <span className="text-xs text-azul-noche/50 ml-auto shrink-0">
          {totalCount} producto(s)
        </span>
      </div>

      {loading ? (
        <p className="text-sm text-azul-noche/60">Cargando productos...</p>
      ) : (
        <>
          {/* Desktop: tabla real, como en el mockup */}
          <table className="hidden md:table w-full">
            <thead>
              <tr className="text-left text-xs font-bold text-azul-noche/40 uppercase">
                <th className="pb-3 font-bold">Producto</th>
                <th className="pb-3 font-bold">Categoría</th>
                <th className="pb-3 font-bold">Precio</th>
                <th className="pb-3 font-bold">Stock</th>
                <th className="pb-3 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-gris-claro">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <ProductImage
                        imageUrl={product.imageUrl}
                        categoryId={product.categoryId}
                        alt={product.name}
                        className="w-12 h-12 rounded-card shrink-0"
                      />
                      <span className="font-bold text-azul-noche">{product.name}</span>
                    </div>
                  </td>
                  <td className={`py-3 text-sm font-bold ${CATEGORY_INFO[product.categoryId].textColor}`}>
                    {CATEGORY_INFO[product.categoryId].label}
                  </td>
                  <td className="py-3 text-sm font-bold text-azul-noche">
                    ${product.price.toLocaleString("es-AR")}
                  </td>
                  <td className="py-3">
                    <StockBadge stock={product.stock} />
                  </td>
                  <td className="py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="w-8 h-8 rounded-full bg-card-surface flex items-center justify-center text-azul-noche"
                        aria-label="Editar producto"
                      >
                        <PencilIcon size={14} />
                      </button>
                      <button
                        onClick={() => setProductPendingDelete(product)}
                        disabled={deletingId === product.id}
                        className="w-8 h-8 rounded-full bg-stock-low flex items-center justify-center text-danger disabled:opacity-40"
                        aria-label="Borrar producto"
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile */}
          <div className="md:hidden flex flex-col gap-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-4 rounded-card bg-white shadow-card"
              >
                <ProductImage
                  imageUrl={product.imageUrl}
                  categoryId={product.categoryId}
                  alt={product.name}
                  className="w-16 h-16 rounded-card shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-azul-noche truncate">{product.name}</p>
                  <p className="text-sm font-semibold truncate">
                    <span className={CATEGORY_INFO[product.categoryId].textColor}>
                      {CATEGORY_INFO[product.categoryId].label}
                    </span>
                    <span className="text-azul-noche/50"> · ${product.price.toLocaleString("es-AR")}</span>
                  </p>
                  <div className="mt-1.5">
                    <StockBadge stock={product.stock} />
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="w-9 h-9 rounded-full bg-card-surface flex items-center justify-center text-azul-noche"
                    aria-label="Editar producto"
                  >
                    <PencilIcon size={15} />
                  </button>
                  <button
                    onClick={() => setProductPendingDelete(product)}
                    disabled={deletingId === product.id}
                    className="w-9 h-9 rounded-full bg-stock-low flex items-center justify-center text-danger disabled:opacity-40"
                    aria-label="Borrar producto"
                  >
                    <TrashIcon size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <p className="text-sm text-azul-noche/50 text-center py-8">No hay productos que coincidan.</p>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => (page > currentPage ? goToNextPage() : goToPreviousPage())}
          />
        </>
      )}

      {(isCreating || editingProduct) && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setIsCreating(false);
            setEditingProduct(null);
          }}
          onSaved={refetch}
        />
      )}

      {productPendingDelete && (
        <ConfirmDialog
          title="¿Borrar producto?"
          message={`"${productPendingDelete.name}" se va a eliminar. No se puede deshacer.`}
          confirmLabel="Eliminar"
          onCancel={() => setProductPendingDelete(null)}
          onConfirm={confirmDelete}
        />
      )}
    </section>
  );
};
