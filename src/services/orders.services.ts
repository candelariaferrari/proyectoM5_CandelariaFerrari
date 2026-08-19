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
//guarda un pedido nuevo, estado "pending", snapshot de carrito (nombre y precio)
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
//pedidos de usuario puntual
export const listUserOrders = async (userId: string): Promise<Order[]> => {
  const q = query(collection(db, "orders"), where("userId", "==", userId), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToOrder);
};
//pedidos de todos 
export const listAllOrders = async (): Promise<Order[]> => {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToOrder);
};
// cambio de estado de pedidos (admin)
export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
  await updateDoc(doc(db, "orders", orderId), { status, updatedAt: serverTimestamp() });
};
