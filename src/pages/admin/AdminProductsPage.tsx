import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { getProducts, deleteProduct } from "../../services/products.services";
import { CATEGORY_INFO, CATEGORY_IDS } from "../../constants/categories";
import { ProductForm } from "../../components/admin/ProductForm";
import { PencilIcon, TrashIcon } from "../../components/ui/icons";
import { SearchInput } from "../../components/ui/SearchInput";
import { ProductImage } from "../../components/ui/ProductImage";
import type { CategoryId, Product } from "../../types/product.types";

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryId | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  // Si llegamos acá desde el botón "+ Nuevo producto" del Dashboard, el
  // form de alta se abre directo (ver Link con state en AdminDashboardPage).
  const [isCreating, setIsCreating] = useState(
    (location.state as { openCreate?: boolean } | null)?.openCreate ?? false
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Vive en estado local (no en ProductsContext) porque ese context está
  // pensado para el catálogo filtrado del cliente, no para administrar
  // el listado completo.
  const fetchProducts = async () => {
    setLoading(true);
    const result = await getProducts();
    setProducts(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = !categoryFilter || product.categoryId === categoryFilter;
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, categoryFilter, search]);

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(`¿Borrar "${product.name}"? No se puede deshacer.`);
    if (!confirmed) return;

    setDeletingId(product.id);
    await deleteProduct(product.id);
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
    setDeletingId(null);
  };

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-extrabold text-2xl text-azul-noche">Productos</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="text-sm font-extrabold text-azul-noche bg-mostaza px-5 py-2.5 rounded-pill shadow-cta"
        >
          + Nuevo
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="w-full sm:w-64">
          <SearchInput onSearch={setSearch} placeholder="Buscar producto..." minLength={1} debounceMs={200} />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setCategoryFilter(null)}
            className={`text-sm font-bold px-4 py-2 rounded-pill shrink-0 ${
              categoryFilter === null ? "bg-azul-cobalto text-white" : "bg-card-surface text-azul-noche/70"
            }`}
          >
            Todos
          </button>
          {CATEGORY_IDS.map((id) => (
            <button
              key={id}
              onClick={() => setCategoryFilter(id)}
              className={`text-sm font-bold px-4 py-2 rounded-pill shrink-0 ${
                categoryFilter === id ? `${CATEGORY_INFO[id].color} text-white` : "bg-card-surface text-azul-noche/70"
              }`}
            >
              {CATEGORY_INFO[id].label}
            </button>
          ))}
        </div>

        <span className="text-xs text-azul-noche/50 ml-auto shrink-0">
          {filteredProducts.length} de {products.length} productos
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
              {filteredProducts.map((product) => (
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
                        onClick={() => handleDelete(product)}
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

          {/* Mobile: como el mockup — imagen, nombre, "categoría · precio" en
              gris, badge de stock debajo, y los botones centrados a la
              derecha de toda la tarjeta (no pegados arriba). */}
          <div className="md:hidden flex flex-col gap-3">
            {filteredProducts.map((product) => (
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
                    onClick={() => handleDelete(product)}
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

          {filteredProducts.length === 0 && (
            <p className="text-sm text-azul-noche/50 text-center py-8">No hay productos que coincidan.</p>
          )}
        </>
      )}

      {(isCreating || editingProduct) && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setIsCreating(false);
            setEditingProduct(null);
          }}
          onSaved={fetchProducts}
        />
      )}
    </section>
  );
};
