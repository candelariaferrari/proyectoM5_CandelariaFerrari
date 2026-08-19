import { useEffect, useRef, useState } from "react";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";
import { afterEach, describe, expect, it, vi, beforeEach } from "vitest";
import { AuthProvider } from "../../src/contexts/AuthContext";
import { OrdersProvider } from "../../src/contexts/OrdersContext";
import { CartProvider } from "../../src/contexts/CartContext";
import { ToastProvider } from "../../src/contexts/ToastContext";
import { CheckoutConfirmPage } from "../../src/pages/CheckoutConfirmPage";
import { Toast } from "../../src/components/ui/Toast";
import { useCart } from "../../src/hooks/useCart";
import { useAuth } from "../../src/hooks/useAuth";
import {
  createOrder as createOrderService,
  listAllOrders,
  listUserOrders,
  updateOrderStatus,
} from "../../src/services/orders.services";
import { getUsersById } from "../../src/services/users.services";
import { buildProduct, buildUser } from "../fixtures";

// Arranca sin usuario (invitado),
// como en cualquier visita normal a la página.
type AuthStateCallback = (firebaseUser: { uid: string } | null) => void | Promise<void>;
let authStateCallback: AuthStateCallback | null = null;

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: (_auth: unknown, callback: AuthStateCallback) => {
    authStateCallback = callback;
    callback(null);
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

vi.mock("../../src/services/orders.services", () => ({
  listAllOrders: vi.fn(),
  listUserOrders: vi.fn(),
  createOrder: vi.fn(),
  updateOrderStatus: vi.fn(),
}));

const login = async (uid: string) => {
  await act(async () => {
    await authStateCallback?.({ uid });
  });
};

const product = buildProduct({ id: "product-1", name: "Rompecabezas Mundo", price: 5000 });

// muestra el id de la orden recibido por
// location.state y cuántos items quedan en el carrito, para poder
// confirmar en un solo lugar "navegó Y vació el carrito".
const PedidoConfirmadoProbe = () => {
  const location = useLocation();
  const { items } = useCart();
  const state = location.state as { orderId?: string } | null;
  return (
    <p>
      Pedido confirmado: {state?.orderId ?? "sin id"} / carrito: {items.length}
    </p>
  );
};

// Siembra el carrito ANTES de montar las rutas (no se puede "inyectar"
// estado desde afuera: hay que pasar por el hook real, como lo haría la
// persona usuaria agregando un producto desde el catálogo) y recién ahí
// monta CheckoutConfirmPage. Si montáramos las rutas en el mismo render que
// dispara addToCart, CheckoutConfirmPage leería `items.length === 0` en su
// primer render (el reducer todavía no procesó la acción) y redirigiría a
// /carrito antes de que el carrito llegue a tener algo.
//
// `requireUid`, cuando se pasa, hace que la siembra espere a que `login()`
// ya haya terminado -- si sembráramos como invitado y recién después
// logueáramos, CartContext cambia de carrito "guest" a "user-1" y el
// merge (MERGE_GUEST_CART) tarda un render extra en completarse; en el
// medio, CheckoutConfirmPage vería el carrito del usuario nuevo vacío y
// redirigiría por error. Sembrar directo con el usuario ya logueado evita
// esa carrera, que es un artefacto del test, no del comportamiento real.
//
// `ready` es un estado que solo puede pasar de false a true UNA vez: así,
// cuando la compra se confirma y el carrito se vacía de nuevo (items vuelve
// a 0), las rutas siguen montadas -- no queremos que "carrito vacío" oculte
// la pantalla de confirmación que llega DESPUÉS de comprar.
const AppShell = ({
  seedCart,
  quantity,
  requireUid,
}: {
  seedCart: boolean;
  quantity: number;
  requireUid?: string;
}) => {
  const { user } = useAuth();
  const { addToCart, items } = useCart();
  const [ready, setReady] = useState(!seedCart);
  const seededRef = useRef(false);

  useEffect(() => {
    if (!seedCart || seededRef.current) return;
    if (requireUid && user?.uid !== requireUid) return;
    seededRef.current = true;
    addToCart(product, quantity);
  }, [seedCart, quantity, requireUid, user, addToCart]);

  useEffect(() => {

    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (seedCart && items.length > 0) setReady(true);
  }, [seedCart, items.length]);

  if (!ready) return null;

  return (
    <Routes>
      <Route path="/confirmar" element={<CheckoutConfirmPage />} />
      <Route path="/carrito" element={<p>Carrito vacío (test)</p>} />
      <Route path="/pedido-confirmado" element={<PedidoConfirmadoProbe />} />
    </Routes>
  );
};

const renderCheckout = ({
  seedCart = true,
  requireUid,
}: { seedCart?: boolean; requireUid?: string } = {}) =>
  render(
    <MemoryRouter initialEntries={["/confirmar"]}>
      <ToastProvider>
        <AuthProvider>
          <OrdersProvider>
            <CartProvider>
              <AppShell seedCart={seedCart} quantity={2} requireUid={requireUid} />
              <Toast />
            </CartProvider>
          </OrdersProvider>
        </AuthProvider>
      </ToastProvider>
    </MemoryRouter>
  );

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(listAllOrders).mockResolvedValue([]);
  vi.mocked(listUserOrders).mockResolvedValue([]);
});

describe("CheckoutConfirmPage", () => {
  it("con el carrito vacío, redirige a /carrito en vez de mostrar la confirmación", () => {
    renderCheckout({ seedCart: false });

    expect(screen.getByText("Carrito vacío (test)")).toBeInTheDocument();
    expect(screen.queryByText("Confirmar compra")).not.toBeInTheDocument();
  });

  it("con productos en el carrito, muestra el resumen y el total", async () => {
    renderCheckout();

    expect(await screen.findByText("2x Rompecabezas Mundo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirmar compra" })).toBeInTheDocument();
  });

  it("sin usuario logueado, tocar 'Confirmar compra' no crea ninguna orden", async () => {
    renderCheckout();
    const confirmButton = await screen.findByRole("button", { name: "Confirmar compra" });

    fireEvent.click(confirmButton);

    expect(createOrderService).not.toHaveBeenCalled();
    // Sigue en la misma pantalla, no navegó a ningún lado.
    expect(screen.getByRole("heading", { name: "Confirmar compra" })).toBeInTheDocument();
  });

  it("logueado, confirma la compra: crea la orden, navega a la confirmación y vacía el carrito", async () => {
    vi.mocked(getUsersById).mockResolvedValue(buildUser({ uid: "user-1", role: "customer" }));
    vi.mocked(createOrderService).mockResolvedValue("order-123");
    renderCheckout({ requireUid: "user-1" });
    await login("user-1");
    const confirmButton = await screen.findByRole("button", { name: "Confirmar compra" });

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText("Pedido confirmado: order-123 / carrito: 0")).toBeInTheDocument();
    });
    expect(createOrderService).toHaveBeenCalledWith(
      "user-1",
      [{ productId: "product-1", name: "Rompecabezas Mundo", priceAtPurchase: 5000, quantity: 2 }],
      10000
    );
    expect(await screen.findByText("¡Compra realizada con éxito!")).toBeInTheDocument();
  });

  it("evita el doble-submit: dos clicks rápidos solo crean una orden", async () => {
    vi.mocked(getUsersById).mockResolvedValue(buildUser({ uid: "user-1", role: "customer" }));

    let resolveCreate: (id: string) => void = () => {};
    vi.mocked(createOrderService).mockImplementation(
      () => new Promise((resolve) => { resolveCreate = resolve; })
    );
    renderCheckout({ requireUid: "user-1" });
    await login("user-1");
    const confirmButton = await screen.findByRole("button", { name: "Confirmar compra" });

    fireEvent.click(confirmButton);
    fireEvent.click(confirmButton);
    fireEvent.click(confirmButton);

    // el botón queda deshabilitado y muestra el estado de carga -- los clicks de más no deberían hacer nada.
    expect(screen.getByRole("button", { name: "Procesando..." })).toBeDisabled();
    expect(createOrderService).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveCreate("order-999");
    });

    await waitFor(() => {
      expect(screen.getByText("Pedido confirmado: order-999 / carrito: 0")).toBeInTheDocument();
    });
    // Sigue habiendo un solo llamado, incluso después de que se resolvió.
    expect(createOrderService).toHaveBeenCalledTimes(1);
  });

  it("si falla la creación de la orden, muestra un toast de error, no navega y reactiva el botón", async () => {
    vi.mocked(getUsersById).mockResolvedValue(buildUser({ uid: "user-1", role: "customer" }));
    vi.mocked(createOrderService).mockRejectedValue(new Error("network"));
    renderCheckout({ requireUid: "user-1" });
    await login("user-1");
    const confirmButton = await screen.findByRole("button", { name: "Confirmar compra" });

    fireEvent.click(confirmButton);

    expect(await screen.findByText("No pudimos procesar tu compra. Probá de nuevo.")).toBeInTheDocument();
    // No navegó: seguimos viendo la pantalla de confirmación, no la de destino.
    expect(screen.queryByText(/Pedido confirmado/)).not.toBeInTheDocument();
    // El botón se reactiva -- una persona puede reintentar sin refrescar.
    expect(screen.getByRole("button", { name: "Confirmar compra" })).not.toBeDisabled();
  });
});

// Chequeo directo de que updateOrderStatus/listAllOrders/listUserOrders
// están mockeados en este archivo
describe("mocks de orders.services", () => {
  it("no se llaman funciones reales de Firestore -- todo pasa por el mock", () => {
    expect(vi.isMockFunction(updateOrderStatus)).toBe(true);
  });
});
