import type { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { AuthProvider } from "../../src/contexts/AuthContext";
import { OrdersProvider } from "../../src/contexts/OrdersContext";
import { useOrders } from "../../src/hooks/useOrders";
import { getUsersById } from "../../src/services/users.services";
import {
  listAllOrders,
  listUserOrders,
  createOrder as createOrderService,
  updateOrderStatus as updateOrderStatusService,
} from "../../src/services/orders.services";
import { buildOrder, buildOrderItemSnapshot, buildUser } from "../fixtures";

// mockeamos onAuthStateChanged para
// poder "loguear" a mano durante el test
type AuthStateCallback = (firebaseUser: { uid: string } | null) => void | Promise<void>;
let authStateCallback: AuthStateCallback | null = null;

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: (_auth: unknown, callback: AuthStateCallback) => {
    authStateCallback = callback;
    callback(null); // arranca sin usuario logueado (invitado)
    return () => {};
  },
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("../../src/services/users.services", () => ({
  getUsersById: vi.fn(),
  createUserProfile: vi.fn(),
}));

// probamos es la LÓGICA de OrdersContext (a quién le pide qué, cuándo actualiza optimista, cuándo
// refetchea)]
vi.mock("../../src/services/orders.services", () => ({
  listAllOrders: vi.fn(),
  listUserOrders: vi.fn(),
  createOrder: vi.fn(),
  updateOrderStatus: vi.fn(),
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>
    <OrdersProvider>{children}</OrdersProvider>
  </AuthProvider>
);

// Dispara el callback de auth simulando que Firebase avisó que ahora hay
// sesión -- es async porque AuthContext hace `await getUsersById(...)`
// antes de guardar el usuario en su estado.
const login = async (uid: string) => {
  await act(async () => {
    await authStateCallback?.({ uid });
  });
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(listAllOrders).mockResolvedValue([]);
  vi.mocked(listUserOrders).mockResolvedValue([]);
});

describe("OrdersContext", () => {
  it("un customer logueado trae SOLO sus propias órdenes (listUserOrders, no listAllOrders)", async () => {
    vi.mocked(getUsersById).mockResolvedValue(buildUser({ uid: "user-1", role: "customer" }));
    const myOrder = buildOrder({ id: "order-1", userId: "user-1" });
    vi.mocked(listUserOrders).mockResolvedValue([myOrder]);

    const { result } = renderHook(() => useOrders(), { wrapper });
    await login("user-1");

    await waitFor(() => expect(result.current.orders).toEqual([myOrder]));
    expect(listUserOrders).toHaveBeenCalledWith("user-1");
    expect(listAllOrders).not.toHaveBeenCalled();
  });

  it("un admin logueado trae TODAS las órdenes (listAllOrders, no listUserOrders)", async () => {
    vi.mocked(getUsersById).mockResolvedValue(buildUser({ uid: "admin-1", role: "admin" }));
    const allOrders = [
      buildOrder({ id: "order-1", userId: "user-1" }),
      buildOrder({ id: "order-2", userId: "user-2" }),
    ];
    vi.mocked(listAllOrders).mockResolvedValue(allOrders);

    const { result } = renderHook(() => useOrders(), { wrapper });
    await login("admin-1");

    await waitFor(() => expect(result.current.orders).toEqual(allOrders));
    expect(listAllOrders).toHaveBeenCalled();
    expect(listUserOrders).not.toHaveBeenCalled();
  });

  it("si falla la carga, error queda en true y orders no explota", async () => {
    vi.mocked(getUsersById).mockResolvedValue(buildUser({ uid: "user-1", role: "customer" }));
    vi.mocked(listUserOrders).mockRejectedValue(new Error("network"));

    const { result } = renderHook(() => useOrders(), { wrapper });
    await login("user-1");

    await waitFor(() => expect(result.current.error).toBe(true));
    expect(result.current.orders).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it("createOrder crea la orden y vuelve a pedir la lista actualizada (no la arma a mano)", async () => {
    vi.mocked(getUsersById).mockResolvedValue(buildUser({ uid: "user-1", role: "customer" }));
    vi.mocked(listUserOrders).mockResolvedValueOnce([]); // carga inicial: sin pedidos
    vi.mocked(createOrderService).mockResolvedValue("new-order-id");
    const newOrder = buildOrder({ id: "new-order-id", userId: "user-1" });
    vi.mocked(listUserOrders).mockResolvedValueOnce([newOrder]); // refetch después de crear

    const { result } = renderHook(() => useOrders(), { wrapper });
    await login("user-1");
    await waitFor(() => expect(listUserOrders).toHaveBeenCalledTimes(1));

    let createdId: string | undefined;
    await act(async () => {
      createdId = await result.current.createOrder([buildOrderItemSnapshot()], 5000);
    });

    expect(createdId).toBe("new-order-id");
    expect(createOrderService).toHaveBeenCalledWith("user-1", [buildOrderItemSnapshot()], 5000);
    // El array final viene de Firestore (vía el refetch), no reconstruido acá.
    expect(result.current.orders).toEqual([newOrder]);
    expect(listUserOrders).toHaveBeenCalledTimes(2);
  });

  it("updateOrderStatus actualiza el estado local al instante, sin esperar un refetch", async () => {
    vi.mocked(getUsersById).mockResolvedValue(buildUser({ uid: "admin-1", role: "admin" }));
    const order = buildOrder({ id: "order-1", status: "pending" });
    vi.mocked(listAllOrders).mockResolvedValue([order]);
    vi.mocked(updateOrderStatusService).mockResolvedValue(undefined);

    const { result } = renderHook(() => useOrders(), { wrapper });
    await login("admin-1");
    await waitFor(() => expect(result.current.orders).toEqual([order]));

    await act(async () => {
      await result.current.updateOrderStatus("order-1", "processing");
    });

    expect(updateOrderStatusService).toHaveBeenCalledWith("order-1", "processing");
    expect(result.current.orders[0].status).toBe("processing");
    // Update optimista: no se vuelve a pedir la lista para reflejar el cambio.
    expect(listAllOrders).toHaveBeenCalledTimes(1);
  });
});
