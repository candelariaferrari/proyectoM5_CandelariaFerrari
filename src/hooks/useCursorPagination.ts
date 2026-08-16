import { useEffect, useRef, useState } from "react";

interface PageResult<T, C> {
  items: T[];
  nextCursor: C | null; // null = no hay más páginas después de esta
}

interface UseCursorPaginationParams<T, C> {
  fetchPage: (cursor: C | null) => Promise<PageResult<T, C>>;
  fetchCount: () => Promise<number>;
  pageSize: number;
  // Identifica el filtro activo (categoría + búsqueda para productos,
  // estado para órdenes, lo que sea). Cuando cambia, los cursores
  // guardados quedan obsoletos -- pensado como un string armado por quien
  // usa el hook, por ejemplo `${categoryId}|${searchPrefix}`.
  filterKey: string;
}

// Pagina cualquier colección de Firestore con cursores reales (nunca trae
// todo y corta en el cliente). Genérico a propósito: no sabe nada de
// productos ni de ningún dominio en particular -- solo necesita que le
// pasen cómo pedir una página (`fetchPage`) y cómo contar el total
// (`fetchCount`). Así se puede reusar para productos, órdenes, usuarios,
// etc., cada uno con su propia capa fina arriba (ver `useProductsPagination`).
export function useCursorPagination<T, C>({
  fetchPage,
  fetchCount,
  pageSize,
  filterKey,
}: UseCursorPaginationParams<T, C>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  // Se incrementa para forzar un refetch de la página actual sin cambiar
  // filtros ni posición (por ejemplo, después de crear/editar/borrar un item).
  const [reloadToken, setReloadToken] = useState(0);

  // Cursores de páginas ya visitadas: cursorsRef.current[i] guarda el
  // cursor que hay que mandar para pedir la página i+2 (el "próximo
  // cursor" que devolvió la página i+1).
  const cursorsRef = useRef<Array<C | null>>([]);
  const lastFilterKeyRef = useRef(filterKey);

  // fetchPage/fetchCount son funciones nuevas en cada render (las arma
  // quien usa el hook, con sus propios filtros adentro). Las guardamos en
  // refs para poder leer siempre la versión más actualizada dentro del
  // efecto sin declararlas como dependencia -- si no, el efecto correría
  // en cada render, sin importar si algo relevante cambió de verdad.
  const fetchPageRef = useRef(fetchPage);
  fetchPageRef.current = fetchPage;
  const fetchCountRef = useRef(fetchCount);
  fetchCountRef.current = fetchCount;

  // Si cambió el filtro, los cursores guardados son de otra consulta:
  // los descartamos y volvemos a la página 1. Esto corre durante el
  // render (no en un efecto) siguiendo el patrón que recomienda React
  // para "ajustar estado cuando cambia algo": comparamos contra el valor
  // anterior guardado en un ref, y si cambió, actualizamos el estado ya
  // mismo. Evita una vuelta extra pidiendo la página vieja con un cursor
  // que ya no corresponde a la consulta nueva.
  if (lastFilterKeyRef.current !== filterKey) {
    lastFilterKeyRef.current = filterKey;
    cursorsRef.current = [];
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }

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
