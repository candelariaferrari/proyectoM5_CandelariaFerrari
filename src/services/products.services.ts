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
import { LOW_STOCK_THRESHOLD } from "../constants/stock";

const DEFAULT_PAGE_SIZE = 12;

// Convierte un documento de Firestore a Product
const docToProduct = (docSnap: QueryDocumentSnapshot<DocumentData>): Product => ({
  id: docSnap.id,
  ...docSnap.data(),
} as Product);

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
// Una pag de productos por vez
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

// El orderBy tiene que coincidir con un índice que ya existe en Firestore, si no la consulta tira error.
// - Con búsqueda: ordenar por `nameLower` 
// - Con categoría: ordenamos por precio para reusar el mismo índice
//   compuesto (categoryId + price) que ya usaba el código anterior.
// - Sin filtros: ordenamos por nombre para que la paginación con cursor tenga un orden estable 
const buildFilterConstraints = ({
  categoryId,
  searchPrefix,
}: Pick<ListProductsParams, "categoryId" | "searchPrefix">): QueryConstraint[] => {
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

// Trae UNA PÁGINA de productos desde Firestore usando cursor 
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
  // Si trajo menos de lo pedido, ya sabemos que no hay más páginas después de esta 
  const nextCursor = snapshot.docs.length === pageSize ? lastDoc : null;

  return { products, nextCursor };
};

// Cuenta cuántos productos matchean el filtro, SIN traer los documentos
// para saber cuántas páginas hay en total y poder mostrar "Página X de Y".
export const countProducts = async (
  params: Pick<ListProductsParams, "categoryId" | "searchPrefix"> = {}
): Promise<number> => {
  const constraints = buildFilterConstraints(params);
  const q = query(collection(db, "products"), ...constraints);
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
};

//productos con poco stock
export const listLowStockProducts = async (
  maxResults = 5,
  threshold: number = LOW_STOCK_THRESHOLD
): Promise<Product[]> => {
  const q = query(
    collection(db, "products"),
    where("stock", "<", threshold),
    orderBy("stock", "asc"),
    limit(maxResults)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToProduct);
};

// CRUD
export const createProduct = async (
  data: Omit<Product, "id">
): Promise<void> => {
  await addDoc(collection(db, "products"), {
    ...data,
    nameLower: data.name.toLowerCase(),
  });
};

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
