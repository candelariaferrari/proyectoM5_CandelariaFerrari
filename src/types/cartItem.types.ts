import type { Product } from "./product.types";

// El carrito es un array de CartItem: cada item guarda el producto completo
export type CartItem = {
  product: Product;
  quantity: number;
};
