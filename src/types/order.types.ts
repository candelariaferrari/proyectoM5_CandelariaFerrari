export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

export type OrderItemSnapshot = {
  productId: string;
  name: string;
  priceAtPurchase: number;
  quantity: number;
};

export type Order = {
  id: string;
  userId: string;
  items: OrderItemSnapshot[];
  total: number;
  status: OrderStatus;
  createdAt: Date; // Timestamp de Firestore, convertido en el service
  updatedAt?: Date;
};