import { act, cleanup, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi, beforeEach } from "vitest";
import { renderWithProviders } from "../renderWithProviders";
import { AppRoutes } from "../../src/routes/AppRoutes";
import { getUsersById } from "../../src/services/users.services";
import { buildUser } from "../fixtures";

// tabla de ruteo real de la app: qué componente
// corresponde a cada path, y cuáles están protegidas (con o sin
// `adminOnly`). Lo único que sí controlamos a mano es el login, porque de
// eso depende a dónde redirige cada ProtectedRoute.
type AuthStateCallback = (firebaseUser: { uid: string } | null) => void | Promise<void>;
let authStateCallback: AuthStateCallback | null = null;

// Se deja el Provider en su estado inicial (loading) hasta que cada test decide
// explícitamente si es un login (`login`) o una sesión inexistente (`logout`).
vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({})),
  onAuthStateChanged: (_auth: unknown, callback: AuthStateCallback) => {
    authStateCallback = callback;
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
  // AdminDashboardPage (countUsers) y AdminOrdersPage (getUser, para armar
  // customersById)  si no los mockeamos acá,
  // explotan apenas se monta el panel de admin.
  countUsers: vi.fn().mockResolvedValue(0),
  getUser: vi.fn().mockResolvedValue([]),
}));

const login = async (uid: string) => {
  await act(async () => {
    await authStateCallback?.({ uid });
  });
};

const logout = async () => {
  await act(async () => {
    await authStateCallback?.(null);
  });
};

beforeEach(() => {
  vi.clearAllMocks();
});

// render() Sin esto, cada test deja
// montado el árbol anterior y los `findBy*` empiezan a matchear contra
// contenido de tests previos.
afterEach(() => {
  cleanup();
});

describe("AppRoutes: páginas públicas", () => {
  it("'/' renderiza la Home", async () => {
    renderWithProviders(<AppRoutes />, { route: "/" });

    expect(await screen.findByText("Envíos a todo el país")).toBeInTheDocument();
  });

  it("'/productos' renderiza el catálogo", async () => {
    renderWithProviders(<AppRoutes />, { route: "/productos" });

    expect(await screen.findByText(/Todos los juguetes/)).toBeInTheDocument();
  });

  it("'/producto/:id' renderiza el detalle (con Firestore vacío, muestra 'no encontrado' en vez de explotar)", async () => {
    renderWithProviders(<AppRoutes />, { route: "/producto/no-existe" });

    expect(await screen.findByText("No encontramos este producto.")).toBeInTheDocument();
  });

  it("'/carrito' renderiza el carrito, vacío por defecto", async () => {
    renderWithProviders(<AppRoutes />, { route: "/carrito" });

    expect(await screen.findByText("Tu carrito está vacío")).toBeInTheDocument();
  });
});

describe("AppRoutes: rutas protegidas sin sesión", () => {
  it("mientras Firebase no confirmó la sesión, se queda en 'Verificando sesión...' (no redirige todavía)", async () => {
    renderWithProviders(<AppRoutes />, { route: "/pedidos" });

    expect(await screen.findByText("Verificando sesión...")).toBeInTheDocument();
  });

  it("'/confirmar-compra' sin sesión redirige a Home", async () => {
    renderWithProviders(<AppRoutes />, { route: "/confirmar-compra" });
    await logout();

    expect(await screen.findByText("Envíos a todo el país")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Confirmar compra" })).not.toBeInTheDocument();
  });

  it("'/pedidos' sin sesión redirige a Home", async () => {
    renderWithProviders(<AppRoutes />, { route: "/pedidos" });
    await logout();

    expect(await screen.findByText("Envíos a todo el país")).toBeInTheDocument();
  });

  it("'/admin' sin sesión redirige a Home (ni siquiera llega a pedir el rol)", async () => {
    renderWithProviders(<AppRoutes />, { route: "/admin" });
    await logout();

    expect(await screen.findByText("Envíos a todo el país")).toBeInTheDocument();
  });
});

describe("AppRoutes: /admin según el rol", () => {
  it("logueado como customer, '/admin' redirige a Home -- no puede entrar al panel", async () => {
    vi.mocked(getUsersById).mockResolvedValue(buildUser({ uid: "user-1", role: "customer" }));
    renderWithProviders(<AppRoutes />, { route: "/admin" });

    await login("user-1");

    expect(await screen.findByText("Envíos a todo el país")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Dashboard" })).not.toBeInTheDocument();
  });

  it("logueado como admin, '/admin' renderiza el Dashboard dentro del layout de admin", async () => {
    vi.mocked(getUsersById).mockResolvedValue(buildUser({ uid: "admin-1", role: "admin" }));
    renderWithProviders(<AppRoutes />, { route: "/admin" });

    await login("admin-1");

    expect(await screen.findByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
  });

  it("logueado como admin, '/admin/productos' renderiza el listado de productos del panel", async () => {
    vi.mocked(getUsersById).mockResolvedValue(buildUser({ uid: "admin-1", role: "admin" }));
    renderWithProviders(<AppRoutes />, { route: "/admin/productos" });

    await login("admin-1");

    expect(await screen.findByRole("heading", { name: "Productos" })).toBeInTheDocument();
  });

  it("logueado como admin, '/admin/ordenes' renderiza el panel de órdenes (vacío por defecto)", async () => {
    vi.mocked(getUsersById).mockResolvedValue(buildUser({ uid: "admin-1", role: "admin" }));
    renderWithProviders(<AppRoutes />, { route: "/admin/ordenes" });

    await login("admin-1");

    expect(await screen.findByRole("heading", { name: "No hay órdenes todavía" })).toBeInTheDocument();
  });
});

describe("AppRoutes: /confirmar-compra logueado", () => {
  it("logueado pero con el carrito vacío, ProtectedRoute lo deja pasar y CheckoutConfirmPage lo redirige a /carrito", async () => {
    vi.mocked(getUsersById).mockResolvedValue(buildUser({ uid: "user-1", role: "customer" }));
    renderWithProviders(<AppRoutes />, { route: "/confirmar-compra" });

    await login("user-1");

    await waitFor(() => {
      expect(screen.getByText("Tu carrito está vacío")).toBeInTheDocument();
    });
  });
});
