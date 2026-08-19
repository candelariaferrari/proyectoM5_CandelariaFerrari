import { createContext, useCallback, useMemo, useState } from "react";
import type { Product, CategoryId } from "../types/product.types";
import { useProductsPagination } from "../hooks/useProductsPagination";

const PAGE_SIZE = 12;

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  categoryFilter: CategoryId | null;
  setCategoryFilter: (category: CategoryId | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
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
  const [categoryFilter, setCategoryFilterState] = useState<CategoryId | null>(
    null,
  );
  const [searchTerm, setSearchTermState] = useState("");
  const searchPrefix = searchTerm.toLowerCase();

  // Prioridad: si hay texto de búsqueda, ese manda
  const effectiveCategoryId = searchPrefix ? null : categoryFilter;

  const {
    products,
    loading,
    currentPage,
    totalPages,
    totalCount,
    goToNextPage,
    goToPreviousPage,
  } = useProductsPagination({
    categoryId: effectiveCategoryId,
    searchPrefix,
    pageSize: PAGE_SIZE,
  });

  // `useCursorPagination` vuelve a la página 1 con cambio de filtro o busqueda
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
      currentPage,
      totalPages,
      totalCount,
      goToNextPage,
      goToPreviousPage,
    }),
    [
      products,
      loading,
      categoryFilter,
      setCategoryFilter,
      searchTerm,
      setSearchTerm,
      currentPage,
      totalPages,
      totalCount,
      goToNextPage,
      goToPreviousPage,
    ],
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};
