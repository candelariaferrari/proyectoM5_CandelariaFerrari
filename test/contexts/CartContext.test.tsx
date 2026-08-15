import { renderHook, act } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import type { ReactNode } from "react";
import { AuthProvider } from "../../src/contexts/AuthContext";
import { CartProvider } from "../../src/contexts/CartContext";
import { useAuth } from "../../src/hooks/useAuth";
import { useCart } from "../../src/hooks/useCart";
import type { Product } from "../../src/types/product.types";

// AuthContext depende 100% de onAuthStateChanged para saber quién está
// logueado (login/logout solo le piden a Firebase que cambie de sesión,
// no tocan el estado ellos mismos). Para simular un login sin pegarle a
// Firebase de verdad, mockeamos ese listener y lo disparamos nosotros a mano.
type AuthStateCallback = (firebaseUser: { uid: string } | null) => void | Promise<void>;
let authStateCallback: AuthStateCallback | null = null;

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: (_auth: unknown, callback: AuthStateCallback) => {
    authStateCallback = callback;
    callback(null); // arranca sin usuario logueado (invitado)
    return () => {}; // "unsubscribe" que useEffect pide al desmontar
  },
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  signOut: vi.fn(),
}));

// Evita que, al "loguearse", AuthContext intente leer/crear el perfil real
// en Firestore (getUsersById/createUserProfile pegan a la red de verdad).
vi.mock("../../src/services/users.services", () => ({
  getUsersById: vi.fn().mockResolvedValue({
    uid: "user-1",
    email: "cliente@mundo.com",
    role: "customer",
  }),
  createUserProfile: vi.fn(),
}));

// Producto de prueba inventado (con la forma real de Product)
const mockProduct: Product = {
  id: "p1",
  name: "Zapatillas Runner Pro",
  description: "Producto de prueba para el test",
  price: 100,
  stock: 10,
  categoryId: "explorar",
  minAge: 3,
  rating: { rate: 4.5, count: 10 },
};

// Envuelve el hook bajo test con los dos providers necesarios.
const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>
    <CartProvider>{children}</CartProvider>
  </AuthProvider>
);

test("el carrito de invitado y el de un usuario logueado están separados", async () => {
  const { result } = renderHook(
    () => ({ auth: useAuth(), cart: useCart() }),
    { wrapper } // componente invisible que llama a los 2 hooks
  );

  // Como invitado, agrega un producto al carrito
  act(() => {
    result.current.cart.addToCart(mockProduct);
  });
  expect(result.current.cart.items).toHaveLength(1);

  // Se loguea: simulamos que Firebase avisó que ahora hay un usuario.
  // Es async porque el handler real de AuthContext hace `await getUsersById(...)`
  // antes de guardar el usuario en el estado.
  await act(async () => {
    await authStateCallback?.({ uid: "user-1" });
  });

  expect(result.current.auth.user?.uid).toBe("user-1");
  // El carrito del usuario logueado es otro carrito (vacío), no el de invitado
  expect(result.current.cart.items).toHaveLength(0);
});
