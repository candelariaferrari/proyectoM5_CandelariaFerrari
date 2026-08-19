import { formatCurrency } from "../../utils/format";
import type { OrderItemSnapshot } from "../../types/order.types";
//presentacional

interface OrderItemsSummaryProps {
  items: OrderItemSnapshot[];
  total: number;
}

export const OrderItemsSummary = ({ items, total }: OrderItemsSummaryProps) => (
  <div className="flex flex-col gap-2">
    {items.map((item) => (
      <div key={item.productId} className="flex items-center justify-between text-sm">
        <span className="text-azul-noche/80">
          {item.quantity}x {item.name}
        </span>
        <span className="font-bold text-azul-noche">
          {formatCurrency(item.priceAtPurchase * item.quantity)}
        </span>
      </div>
    ))}

    <div className="h-px bg-azul-noche/10 my-1" />

    <div className="flex items-center justify-between font-extrabold text-azul-noche">
      <span>Total</span>
      <span>{formatCurrency(total)}</span>
    </div>
  </div>
);
