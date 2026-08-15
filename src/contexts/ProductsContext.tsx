import { createContext, useEffect, useMemo, useState, useCallback } from "react";
import type { Product, CategoryId } from "../types/product.types";
import {
  getProducts,
  getProductsByCategory,
  getProductsByNamePrefix,
} from "../services/products.services";

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  categoryFilter: CategoryId | null;
  setCategoryFilter: (category: CategoryId | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined,
);

export const ProductsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilterState] = useState<CategoryId | null>(
    null,
  );
  const [searchTerm, setSearchTermState] = useState("");

  // Prioridad: si hay texto de búsqueda, ese manda (ignora la categoría);
  // si no hay búsqueda pero sí categoría, filtra por categoría; si no hay
  // ninguna de las dos, trae todo.
  useEffect(() => {
    setLoading(true);

    const fetchProducts = searchTerm
      ? getProductsByNamePrefix(searchTerm)
      : categoryFilter
      ? getProductsByCategory(categoryFilter)
      : getProducts();

    fetchProducts.then(setProducts).finally(() => setLoading(false));
  }, [categoryFilter, searchTerm]);

  const setCategoryFilter = useCallback((category: CategoryId | null) => {
    setCategoryFilterState(category);
  }, []);

  const setSearchTerm = useCallback((term: string) => {
    setSearchTermState(term);
  }, []);

  const value = useMemo(
    () => ({
      products,
      loading,
      categoryFilter,
      setCategoryFilter,
      searchTerm,
      setSearchTerm,
    }),
    [products, loading, categoryFilter, setCategoryFilter, searchTerm, setSearchTerm],
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};
