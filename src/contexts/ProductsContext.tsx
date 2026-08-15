import { createContext, useEffect, useMemo, useState, useCallback } from "react";
import type { Product, CategoryId } from "../types/product.types";
import { getProducts, getProductsByCategory } from "../services/products.services";

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  categoryFilter: CategoryId | null;
  setCategoryFilter: (category: CategoryId | null) => void;
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

  // Cada vez que cambia categoryFilter mostramos loading
  // de nuevo y volvemos a pedir a Firestore con la query que corresponda.
  useEffect(() => {
    setLoading(true);

    const fetchProducts = categoryFilter
      ? getProductsByCategory(categoryFilter)
      : getProducts();

    fetchProducts.then(setProducts).finally(() => setLoading(false));
  }, [categoryFilter]);

  // useCallback para que esta función mantenga su referencia entre renders
  // y no rompa la memoización del value de abajo.
  const setCategoryFilter = useCallback((category: CategoryId | null) => {
    setCategoryFilterState(category);
  }, []);

  const value = useMemo(
    () => ({ products, loading, categoryFilter, setCategoryFilter }),
    [products, loading, categoryFilter, setCategoryFilter],
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};
