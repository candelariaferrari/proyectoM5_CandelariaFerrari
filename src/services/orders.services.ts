import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "../config/firebase";
import type { Order, OrderItemSnapshot, OrderStatus } from "../types/order.types";

// Firestore guarda las fechas como Timestamp, no como Date de JS — hay que
// convertirlas a mano con `.toDate()` (mismo motivo por el que `docToProduct`
// arma el objeto a mano en products.services.ts).
const docToOrder = (docSnap: QueryDocumentSnapshot<DocumentData>): Order => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    userId: data.userId,
    items: data.items,
    total: data.total,
    status: data.status,
    createdAt: data.createdAt?.toDate() ?? new Date(),
    ...(data.updatedAt ? { updatedAt: data.updatedAt.toDate() } : {}),
  };
};

// Crea la orden a partir del carrito en el momento de la compra: los items
// se guardan como "snapshot" (nombre y precio en ESE momento), no como
// referencia viva al producto — así, si después el admin cambia el precio
// o el nombre de un producto, los pedidos viejos no cambian con él.
export const createOrder = async (userId: string, items: OrderItemSnapshot[], total: number): Promise<string> => {
  const docRef = await addDoc(collection(db, "orders"), {
    userId,
    items,
    total,
    status: "pending" as OrderStatus,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

// Pedidos de un usuario puntual (para "Mis pedidos" del lado cliente).
// Nota: esta query (where + orderBy en campos distintos) puede pedir crear
// un índice compuesto la primera vez que corre — mismo caso que ya vimos
// con categoría+precio en el catálogo.
export const listUserOrders = async (userId: string): Promise<Order[]> => {
  const q = query(collection(db, "orders"), where("userId", "==", userId), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToOrder);
};

// Todas las órdenes (para el admin). Un solo orderBy no necesita índice
// compuesto, así que esta no debería pedir nada especial en Firestore.
export const listAllOrders = async (): Promise<Order[]> => {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToOrder);
};

// Solo el admin puede llamar esto (lo hace cumplir firestore.rules: el
// update de una orden solo puede tocar status/updatedAt).
export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
  await updateDoc(doc(db, "orders", orderId), { status, updatedAt: serverTimestamp() });
};
