import type { OrderStatus } from "../types/order.types";

// Fuente única de info de estados de orden (label, colores)
export const ORDER_STATUS_INFO: Record<
  OrderStatus,
  { label: string; badgeClassName: string }
> = {
  pending: {
    label: "Pendiente",
    badgeClassName: "bg-mostaza/20 text-mostaza-texto",
  },
  processing: {
    label: "En proceso",
    badgeClassName: "bg-azul-cobalto/10 text-azul-cobalto",
  },
  completed: {
    label: "Completado",
    badgeClassName: "bg-stock-ok text-verde-texto",
  },
  cancelled: {
    label: "Cancelado",
    badgeClassName: "bg-stock-low text-danger",
  },
};

export const ORDER_STATUS_IDS: OrderStatus[] = [
  "pending",
  "processing",
  "completed",
  "cancelled",
];

// Estados válidos a los que se puede pasar desde cada estado
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["processing", "cancelled"],
  processing: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};
