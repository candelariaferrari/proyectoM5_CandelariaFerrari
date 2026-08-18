import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  createOrder as createOrderService,
  listAllOrders,
  listUserOrders,
  updateOrderStatus as updateOrderStatusService,
} from "../services/orders.services";
import type { Order, OrderItemSnapshot, OrderStatus } from "../types/order.types";

interface OrdersContextType {
  orders: Order[];
  loading: boolean;
  error: boolean;
  refetch: () => Promise<void>;
  createOrder: (items: OrderItemSnapshot[], total: number) => Promise<string>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Qué pedidos ve cada quien admin o custumer
  const fetchOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      return;
    }

    setLoading(true);
    setError(false);
    try {
      const result = user.role === "admin" ? await listAllOrders() : await listUserOrders(user.uid);
      setOrders(result);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Se vuelve a pedir cada vez que cambia el usuario , siempre refleja a quien le pertenece
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
  }, [fetchOrders]);

  const createOrder = useCallback(
    async (items: OrderItemSnapshot[], total: number) => {
      if (!user) throw new Error("No hay usuario logueado");
      const orderId = await createOrderService(user.uid, items, total);
      // La orden recién creada se vuelve a pedir a Firestore
      await fetchOrders();
      return orderId;
    },
    [user, fetchOrders]
  );

  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    await updateOrderStatusService(orderId, status);
    // Acá sí actualizamos local y optimista (sin esperar un refetch),
    // porque es una acción frecuente del admin 
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)));
  }, []);

  const value = useMemo(
    () => ({ orders, loading, error, refetch: fetchOrders, createOrder, updateOrderStatus }),
    [orders, loading, error, fetchOrders, createOrder, updateOrderStatus]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
};
