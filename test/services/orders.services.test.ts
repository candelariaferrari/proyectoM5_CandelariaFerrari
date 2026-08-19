import { describe, expect, it, vi, beforeEach } from "vitest";
import { collection, doc, getDocs, addDoc, updateDoc, query, where, orderBy } from "firebase/firestore";
import { createOrder, listAllOrders, listUserOrders, updateOrderStatus } from "../../src/services/orders.services";
import { buildOrderItemSnapshot } from "../fixtures";

// firebase/firestore ya está mockeado GLOBALMENTE (test/setupTests.ts) --
// acá no hace falta un vi.mock propio, solo reconfiguramos por test qué
// devuelven addDoc/getDocs/updateDoc, para poder chequear la lógica PROPIA
// de orders.services.ts (qué query arma, cómo transforma lo que Firestore
// le devuelve) sin pegarle a la red real.

// Fabrica un "doc snapshot" con la misma forma que usa `docToOrder` adentro
// del service: `.id` y `.data()`. `createdAt`/`updatedAt` se simulan como
// Timestamp de Firestore de verdad (un objeto con `.toDate()`), porque
// justamente esa conversión es la parte con más lógica de todo el archivo.
const buildDocSnap = (id: string, data: Record<string, unknown>) => ({
  id,
  data: () => data,
});

const asTimestamp = (date: Date) => ({ toDate: () => date });

beforeEach(() => {
  vi.clearAllMocks();
});

describe("orders.services", () => {
  describe("createOrder", () => {
    it("guarda la orden con status inicial 'pending' y devuelve el id generado", async () => {
      vi.mocked(addDoc).mockResolvedValueOnce({ id: "new-order-id" } as never);
      const items = [buildOrderItemSnapshot()];

      const orderId = await createOrder("user-1", items, 5000);

      expect(orderId).toBe("new-order-id");
      // El primer argumento de addDoc es la referencia de colección que
      // devuelve `collection(...)` -- acá está mockeada y no representa
      // nada real, así que lo que importa es el PAYLOAD (segundo argumento).
      const [, payload] = vi.mocked(addDoc).mock.calls[0];
      expect(payload).toMatchObject({ userId: "user-1", items, total: 5000, status: "pending" });
    });
  });

  describe("listUserOrders", () => {
    it("filtra por userId y transforma cada doc en un Order (con createdAt ya como Date)", async () => {
      const createdAt = new Date("2026-01-01T12:00:00Z");
      vi.mocked(getDocs).mockResolvedValueOnce({
        docs: [
          buildDocSnap("order-1", {
            userId: "user-1",
            items: [buildOrderItemSnapshot()],
            total: 5000,
            status: "pending",
            createdAt: asTimestamp(createdAt),
          }),
        ],
      } as never);

      const orders = await listUserOrders("user-1");

      // La query se arma filtrada por ESTE usuario -- es lo que hace que
      // OrdersContext pueda confiar en "listUserOrders ya me trae solo lo mío".
      expect(where).toHaveBeenCalledWith("userId", "==", "user-1");
      expect(orderBy).toHaveBeenCalledWith("createdAt", "desc");
      expect(orders).toEqual([
        {
          id: "order-1",
          userId: "user-1",
          items: [buildOrderItemSnapshot()],
          total: 5000,
          status: "pending",
          createdAt,
        },
      ]);
    });

    it("incluye updatedAt solo cuando el documento lo tiene (no lo inventa)", async () => {
      const createdAt = new Date("2026-01-01T12:00:00Z");
      const updatedAt = new Date("2026-01-02T12:00:00Z");
      vi.mocked(getDocs).mockResolvedValueOnce({
        docs: [
          buildDocSnap("order-1", {
            userId: "user-1",
            items: [],
            total: 0,
            status: "processing",
            createdAt: asTimestamp(createdAt),
            updatedAt: asTimestamp(updatedAt),
          }),
        ],
      } as never);

      const [order] = await listUserOrders("user-1");

      expect(order.updatedAt).toEqual(updatedAt);
    });

    it("si el doc no tiene createdAt (caso raro), no explota: cae a la fecha actual", async () => {
      vi.mocked(getDocs).mockResolvedValueOnce({
        docs: [
          buildDocSnap("order-1", {
            userId: "user-1",
            items: [],
            total: 0,
            status: "pending",
            // sin createdAt
          }),
        ],
      } as never);

      const [order] = await listUserOrders("user-1");

      expect(order.createdAt).toBeInstanceOf(Date);
    });
  });

  describe("listAllOrders", () => {
    it("arma la query SIN filtro de usuario (para que el admin vea todas)", async () => {
      vi.mocked(getDocs).mockResolvedValueOnce({ docs: [] } as never);

      const orders = await listAllOrders();

      expect(where).not.toHaveBeenCalled();
      expect(orderBy).toHaveBeenCalledWith("createdAt", "desc");
      expect(orders).toEqual([]);
    });
  });

  describe("updateOrderStatus", () => {
    it("actualiza el documento correcto con el nuevo status", async () => {
      vi.mocked(updateDoc).mockResolvedValueOnce(undefined as never);

      await updateOrderStatus("order-1", "completed");

      expect(doc).toHaveBeenCalledWith(expect.any(Object), "orders", "order-1");
      const [, payload] = vi.mocked(updateDoc).mock.calls[0];
      expect(payload).toMatchObject({ status: "completed" });
    });
  });
});

// collection/query se usan indirectamente en todos los métodos de arriba --
// este test aparte solo confirma que apuntan a la colección "orders" (y no,
// por error de tipeo, a otra).
describe("orders.services: colección", () => {
  it("todas las operaciones apuntan a la colección 'orders'", async () => {
    vi.mocked(getDocs).mockResolvedValueOnce({ docs: [] } as never);
    await listAllOrders();
    expect(collection).toHaveBeenCalledWith(expect.anything(), "orders");
    expect(query).toHaveBeenCalled();
  });
});
