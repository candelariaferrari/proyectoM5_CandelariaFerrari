import {
  collection,
  getDocs,
  getDoc,
  getCountFromServer,
  doc,
  query,
  where,
  orderBy,
  startAt,
  endAt,
  startAfter,
  limit,
  addDoc,
  updateDoc,
  deleteDoc,
  type QueryConstraint,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "../config/firebase";
import type { Product, CategoryId } from "../types/product.types";

const DEFAULT_PAGE_SIZE = 12;

// Convierte un documento de Firestore a Product: Firestore no guarda el id
// adentro del documento (viaja aparte, en `docSnap.id`), así que hay que
// agregarlo a mano en cada mapeo. Una sola función para no repetir este
// `{ id: docSnap.id, ...docSnap.data() }` en cada lugar que lee productos.
const docToProduct = (docSnap: QueryDocumentSnapshot<DocumentData>): Product => ({
  id: docSnap.id,
  ...docSnap.data(),
} as Product);

// Obtener todos los productos (sin paginar). La usa el admin, que necesita
// el listado completo para poder buscar/filtrar sobre todo el catálogo a
// la vez, a diferencia del catálogo de cliente que sí pagina.
export const getProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(collection(db, "products"));
  return snapshot.docs.map(docToProduct);
};

// Obtener un producto por id:
export const getProductsById = async (id: string): Promise<Product | null> => {
  const ref = doc(db, "products", id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Product;
};

export interface ListProductsParams {
  categoryId?: CategoryId | null;
  searchPrefix?: string; // ya en minúsculas
  pageSize?: number;
  cursor?: QueryDocumentSnapshot<DocumentData> | null; // último doc de la página anterior; null/undefined = primera página
}

export interface ListProductsResult {
  products: Product[];
  nextCursor: QueryDocumentSnapshot<DocumentData> | null; // null = no hay más páginas
}

// Arma las restricciones de FILTRADO Y ORDEN (sin paginar todavía) según
// el caso. La comparten `listProducts` (trae una página) y `countProducts`
// (cuenta el total) para no repetir esta lógica en dos lugares.
//
// El orderBy elegido en cada caso no es arbitrario: tiene que coincidir
// con un índice que ya existe en Firestore, si no la consulta tira error.
// - Con búsqueda: ordenar por `nameLower` es lo que permite el rango de
//   prefijo, y es un índice de un solo campo (Firestore lo crea solo).
// - Con categoría: ordenamos por precio para reusar el mismo índice
//   compuesto (categoryId + price) que ya usaba el código anterior.
// - Sin filtros: ordenamos por nombre para que la paginación con cursor
//   tenga un orden estable (si no ordenamos siempre igual, "el último doc
//   de la página anterior" deja de significar algo consistente entre
//   una página y la siguiente).
const buildFilterConstraints = ({
  categoryId,
  searchPrefix,
}: Pick<ListProductsParams, "categoryId" | "searchPrefix">): QueryConstraint[] => {
  if (searchPrefix && categoryId) {
    // Búsqueda + categoría combinadas (las usa el admin, que a diferencia
    // del catálogo de cliente no descarta la categoría al buscar). Pide
    // un índice compuesto (categoryId + nameLower) -- Firestore tira el
    // link para crearlo con un clic la primera vez que corre.
    return [
      where("categoryId", "==", categoryId),
      orderBy("nameLower"),
      startAt(searchPrefix),
      endAt(searchPrefix + ""),
    ];
  }

  if (searchPrefix) {
    return [
      orderBy("nameLower"),
      startAt(searchPrefix),
      endAt(searchPrefix + ""), // último caracter unicode posible: incluye todo lo que empiece con el prefijo
    ];
  }

  if (categoryId) {
    return [where("categoryId", "==", categoryId), orderBy("price", "asc")];
  }

  return [orderBy("nameLower")];
};

// Trae UNA PÁGINA de productos desde Firestore usando un cursor real (el
// último documento de la página anterior) en vez de traer todo el
// catálogo y cortarlo en el cliente. Así la paginación funciona igual de
// bien con 60 productos que con 6000: siempre se lee de a `pageSize`.
export const listProducts = async ({
  categoryId = null,
  searchPrefix = "",
  pageSize = DEFAULT_PAGE_SIZE,
  cursor = null,
}: ListProductsParams): Promise<ListProductsResult> => {
  const constraints = buildFilterConstraints({ categoryId, searchPrefix });

  if (cursor) {
    constraints.push(startAfter(cursor));
  }
  constraints.push(limit(pageSize));

  const q = query(collection(db, "products"), ...constraints);
  const snapshot = await getDocs(q);

  const products = snapshot.docs.map(docToProduct);
  const lastDoc = snapshot.docs[snapshot.docs.length - 1] ?? null;
  // Si trajo menos de lo pedido, ya sabemos que no hay más páginas
  // después de esta (nos ahorra un pedido extra "vacío" para averiguarlo).
  const nextCursor = snapshot.docs.length === pageSize ? lastDoc : null;

  return { products, nextCursor };
};

// Cuenta cuántos productos matchean el filtro, SIN traer los documentos
// (agregación del lado del servidor) -- lo necesitamos para saber cuántas
// páginas hay en total y poder mostrar "Página X de Y".
export const countProducts = async (
  params: Pick<ListProductsParams, "categoryId" | "searchPrefix"> = {}
): Promise<number> => {
  const constraints = buildFilterConstraints(params);
  const q = query(collection(db, "products"), ...constraints);
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
};

// Crea un producto nuevo. `nameLower` se calcula acá (no lo manda el form)
// porque lo necesita `listProducts` para poder buscar por prefijo.
export const createProduct = async (
  data: Omit<Product, "id">
): Promise<void> => {
  await addDoc(collection(db, "products"), {
    ...data,
    nameLower: data.name.toLowerCase(),
  });
};

// Edita un producto existente. Si viene `name`, recalculamos `nameLower`
// para que la búsqueda no quede desincronizada del nombre nuevo.
export const updateProduct = async (
  id: string,
  data: Partial<Omit<Product, "id">>
): Promise<void> => {
  const ref = doc(db, "products", id);
  await updateDoc(ref, {
    ...data,
    ...(data.name ? { nameLower: data.name.toLowerCase() } : {}),
  });
};

export const deleteProduct = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "products", id));
};
