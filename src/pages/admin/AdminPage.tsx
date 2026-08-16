import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../../services/products.services";
import { CATEGORY_INFO } from "../../constants/categories";
import { ProductForm } from "../../components/admin/ProductForm";
import type { Product } from "../../types/product.types";

export const AdminPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null); // producto a editar
  const [isCreating, setIsCreating] = useState(false); // form de alta
  const [deletingId, setDeletingId] = useState<string | null>(null); // evita doble click mientras borra

  // Se pisa el estado local con lo que hay en Firestore, no vive en
  // ProductsContext porque ese context está pensado para el catálogo
  // filtrado del cliente, no para administrar el listado completo.
  const fetchProducts = async () => {
    setLoading(true);
    const result = await getProducts();
    setProducts(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
        <h1 className="font-heading font-extrabold text-2xl text-azul-noche">Panel de administración</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="text-sm font-extrabold text-azul-noche bg-mostaza px-5 py-2.5 rounded-pill shadow-cta"
        >
          + Nuevo producto
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-azul-noche/60">Cargando productos...</p>
      ) : (
        <div className="flex flex-col gap-2">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 p-3 rounded-card bg-white border border-gris-claro"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-12 h-12 rounded-card object-cover bg-card-surface shrink-0"
              />

              <div className="flex-1 min-w-0">
                <p className="font-bold text-azul-noche truncate">{product.name}</p>
                <p className="text-xs text-azul-noche/50">{CATEGORY_INFO[product.categoryId].label}</p>
              </div>

              <p className="text-sm font-bold text-azul-noche w-20 text-right shrink-0">
                ${product.price.toLocaleString("es-AR")}
              </p>
              <p className="text-sm text-azul-noche/60 w-24 text-right shrink-0">Stock: {product.stock}</p>

              <button
                onClick={() => setEditingProduct(product)}
                className="text-sm font-bold text-azul-cobalto shrink-0"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(product)}
                disabled={deletingId === product.id}
                className="text-sm font-bold text-danger shrink-0 disabled:opacity-40"
              >
                Borrar
              </button>
            </div>
          ))}
        </div>
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
