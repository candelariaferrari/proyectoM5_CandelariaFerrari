import { useContext } from "react";
import { OrdersContext } from "../contexts/OrdersContext";

export const useOrders = () => {
  const context = useContext(OrdersContext);

  if (!context) {
    throw new Error("useOrders debe utilizarse dentro de un OrdersProvider");
  }

  return context;
};
