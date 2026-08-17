import type { OrderStatus } from "../types/order.types";

// Fuente única de info de estados de orden (label, colores)
// Mapeo de color pensado para que respete el significado que ya tiene cada color en el resto de MUNDO 
// - pending: mostaza (acción pendiente, recién creada)
// - processing: azul-cobalto (en curso)
// - completed: verde-menta (éxito / estado positivo)
// - cancelled: danger / rosa-coral 
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

// Estados válidos a los que se puede pasar desde cada estado (máquina de estados simple): pending y processing avanzan; completed y cancelled son terminales y no tienen transiciones.
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["processing", "cancelled"],
  processing: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};
