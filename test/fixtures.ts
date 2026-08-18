// Datos falsos reutilizables para tests: un lugar único para crear cada
// "tipo" de dato que usa la app (producto, usuario, item de carrito, orden),
// en vez de repetir objetos sueltos en cada archivo de test.
//
// Cada `buildX` acepta un `overrides` parcial: la mayoría de los tests usa
// el fixture tal cual, y el que necesita variar un campo puntual (otro
// stock, otro precio, otro rol) no tiene que reconstruir el objeto entero.
import type { CartItem } from "../src/types/cartItem.types";
import type { Order, OrderItemSnapshot } from "../src/types/order.types";
import type { Product } from "../src/types/product.types";
import type { User } from "../src/types/user.types";

export const buildProduct = (overrides: Partial<Product> = {}): Product => ({
  id: "product-1",
  name: "Rompecabezas Mundo",
  description: "Rompecabezas de madera de 24 piezas.",
  price: 5000,
  stock: 10,
  categoryId: "pensar",
  minAge: 3,
  rating: { rate: 4.5, count: 12 },
  ...overrides,
});

export const buildUser = (overrides: Partial<User> = {}): User => ({
  uid: "user-1",
  email: "cande@test.com",
  displayName: "Cande",
  role: "customer",
  ...overrides,
});

export const buildCartItem = (overrides: Partial<CartItem> = {}): CartItem => ({
  product: buildProduct(),
  quantity: 1,
  ...overrides,
});

export const buildOrderItemSnapshot = (
  overrides: Partial<OrderItemSnapshot> = {}
): OrderItemSnapshot => ({
  productId: "product-1",
  name: "Rompecabezas Mundo",
  priceAtPurchase: 5000,
  quantity: 1,
  ...overrides,
});

export const buildOrder = (overrides: Partial<Order> = {}): Order => ({
  id: "order-1",
  userId: "user-1",
  items: [buildOrderItemSnapshot()],
  total: 5000,
  status: "pending",
  createdAt: new Date("2026-01-01T12:00:00Z"),
  ...overrides,
});
