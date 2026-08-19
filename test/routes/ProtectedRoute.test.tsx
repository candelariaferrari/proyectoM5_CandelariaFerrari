import { act, cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "../../src/contexts/AuthContext";
import { ProtectedRoute } from "../../src/routes/ProtectedRoute";
import { getUsersById } from "../../src/services/users.services";
import { buildUser } from "../fixtures";

// el Provider se queda en su estado inicial (loading: true) hasta que el test decida
// simular que Firebase ya respondió -- es lo único que nos deja probar la
// pantalla de "Verificando sesión...".
type AuthStateCallback = (firebaseUser: { uid: string } | null) => void | Promise<void>;
let authStateCallback: AuthStateCallback | null = null;

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
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
}));

const resolveAuth = async (firebaseUser: { uid: string } | null) => {
  await act(async () => {
    await authStateCallback?.(firebaseUser);
  });
};

// usamos render() + screen para poder chequear qué texto
// terminó en pantalla -- pero render() no se desmonta solo entre tests
// así que hay que hacerlo a mano o el DOM de un test se mezcla con el del
// siguiente.
afterEach(() => {
  cleanup();
});

// Arma una ruta protegida de prueba, con una ruta pública de "fallback"
// para poder distinguir "se quedó" de "lo mandó para /" mirando qué texto
// terminó en pantalla 
const renderProtected = (adminOnly: boolean, initialEntry = "/privado") => {
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<p>Home pública</p>} />
          <Route
            path="/privado"
            element={
              <ProtectedRoute adminOnly={adminOnly}>
                <p>Contenido protegido</p>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe("ProtectedRoute", () => {
  it("mientras Firebase no confirmó la sesión, muestra 'Verificando sesión...' (no redirige todavía)", () => {
    renderProtected(false);

    expect(screen.getByText("Verificando sesión...")).toBeInTheDocument();
    expect(screen.queryByText("Contenido protegido")).not.toBeInTheDocument();
    expect(screen.queryByText("Home pública")).not.toBeInTheDocument();
  });

  it("sin sesión, redirige a '/' y no muestra el contenido protegido", async () => {
    renderProtected(false);

    await resolveAuth(null);

    expect(screen.getByText("Home pública")).toBeInTheDocument();
    expect(screen.queryByText("Contenido protegido")).not.toBeInTheDocument();
  });

  it("logueado como customer, entra a una ruta protegida normal (sin adminOnly)", async () => {
    vi.mocked(getUsersById).mockResolvedValue(buildUser({ uid: "user-1", role: "customer" }));
    renderProtected(false);

    await resolveAuth({ uid: "user-1" });

    expect(screen.getByText("Contenido protegido")).toBeInTheDocument();
  });

  it("logueado como customer, NO entra a una ruta adminOnly: lo redirige a '/'", async () => {
    vi.mocked(getUsersById).mockResolvedValue(buildUser({ uid: "user-1", role: "customer" }));
    renderProtected(true);

    await resolveAuth({ uid: "user-1" });

    expect(screen.getByText("Home pública")).toBeInTheDocument();
    expect(screen.queryByText("Contenido protegido")).not.toBeInTheDocument();
  });

  it("logueado como admin, SÍ entra a una ruta adminOnly", async () => {
    vi.mocked(getUsersById).mockResolvedValue(buildUser({ uid: "admin-1", role: "admin" }));
    renderProtected(true);

    await resolveAuth({ uid: "admin-1" });

    expect(screen.getByText("Contenido protegido")).toBeInTheDocument();
  });
});
