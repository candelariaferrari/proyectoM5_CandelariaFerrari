import { useCallback } from "react";
import { listProducts, countProducts } from "../services/products.services";
import type { CategoryId } from "../types/product.types";
import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { useCursorPagination } from "./useCursorPagination";

type ProductCursor = QueryDocumentSnapshot<DocumentData> | null;

interface UseProductsPaginationParams {
  categoryId: CategoryId | null;
  searchPrefix: string; // ya en minúsculas
  pageSize: number;
}

// Capa fina sobre `useCursorPagination`, específica de productos: solo se
// encarga de traducir (categoryId, searchPrefix) en llamadas a
// `listProducts` / `countProducts`. La comparten el catálogo de cliente
// (ProductsContext) y la tabla de productos del admin.
export function useProductsPagination({ categoryId, searchPrefix, pageSize }: UseProductsPaginationParams) {
  const fetchPage = useCallback(
    (cursor: ProductCursor) =>
      listProducts({ categoryId, searchPrefix, pageSize, cursor }).then(({ products, nextCursor }) => ({
        items: products,
        nextCursor,
      })),
    [categoryId, searchPrefix, pageSize],
  );

  const fetchCount = useCallback(
    () => countProducts({ categoryId, searchPrefix }),
    [categoryId, searchPrefix],
  );

  const { items, loading, currentPage, totalPages, totalCount, goToNextPage, goToPreviousPage, refetch } =
    useCursorPagination({
      fetchPage,
      fetchCount,
      pageSize,
      filterKey: `${categoryId ?? ""}|${searchPrefix}`,
    });

  return {
    products: items,
    loading,
    currentPage,
    totalPages,
    totalCount,
    goToNextPage,
    goToPreviousPage,
    refetch,
  };
}
