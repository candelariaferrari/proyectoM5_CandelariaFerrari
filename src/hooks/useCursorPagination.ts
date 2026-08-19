import { useEffect, useRef, useState } from "react";

//100% genereico, no sabe de productos, ni orders, cursores de firestore
interface PageResult<T, C> {
  items: T[];
  nextCursor: C | null; // null = no hay más páginas después de esta
}

interface UseCursorPaginationParams<T, C> {
  fetchPage: (cursor: C | null) => Promise<PageResult<T, C>>;
  fetchCount: () => Promise<number>;
  pageSize: number;
  filterKey: string;
}
export function useCursorPagination<T, C>({
  fetchPage, //pide paginas
  fetchCount, //cuenta el total
  pageSize,
  filterKey,
}: UseCursorPaginationParams<T, C>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  // Se incrementa para forzar un refetch de la página actual sin cambiar filtros ni posición.
  const [reloadToken, setReloadToken] = useState(0);

  // Cursores de páginas ya visitadas
  const cursorsRef = useRef<Array<C | null>>([]);
  const lastFilterKeyRef = useRef(filterKey);

  // fetchPage/fetchCount son funciones nuevas en cada render
  const fetchPageRef = useRef(fetchPage);
  // eslint-disable-next-line react-hooks/refs
  fetchPageRef.current = fetchPage;
  const fetchCountRef = useRef(fetchCount);
  // eslint-disable-next-line react-hooks/refs
  fetchCountRef.current = fetchCount;

  /* eslint-disable react-hooks/refs -- lectura/escritura de ref durante el render, patrón intencional */
  if (lastFilterKeyRef.current !== filterKey) {
    lastFilterKeyRef.current = filterKey;
    cursorsRef.current = [];
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }
  /* eslint-enable react-hooks/refs */

  useEffect(() => {
    // Falso positivo conocido de esta regla (nueva en eslint-plugin-react-hooks
    // v7) con el patrón estándar de fetch: mostrar loading mientras se pide
    // el dato de nuevo cada vez que cambia una dependencia.
    // https://github.com/react/react/issues/34743
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    const cursor = currentPage === 1 ? null : cursorsRef.current[currentPage - 2] ?? null;

    Promise.all([fetchPageRef.current(cursor), fetchCountRef.current()])
      .then(([{ items: page, nextCursor }, total]) => {
        setItems(page);
        cursorsRef.current[currentPage - 1] = nextCursor;
        setTotalPages(Math.max(1, Math.ceil(total / pageSize)));
        setTotalCount(total);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetchPage/fetchCount se leen vía ref a propósito, no van en las deps
  }, [filterKey, currentPage, pageSize, reloadToken]);

  const goToNextPage = () => setCurrentPage((page) => Math.min(page + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((page) => Math.max(page - 1, 1));
  const refetch = () => setReloadToken((token) => token + 1);

  return { items, loading, currentPage, totalPages, totalCount, goToNextPage, goToPreviousPage, refetch };
}
