// Extiende `expect` de Vitest con los matchers de jest-dom
// (toBeInTheDocument, toHaveTextContent, etc.), y limpia el DOM
// entre tests para que no se pisen entre sí.
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mocks GLOBALES de Firebase: ningún test de este proyecto debe depender de
// una conexión real a Firebase (ni Auth ni Firestore). Van acá, en el
// archivo de setup, para que se apliquen automáticamente a TODOS los
// archivos de test sin tener que repetir `vi.mock` en cada uno.
//
// Por defecto simulan "sin usuario logueado" y "colección vacía": son la
// base neutra que sirve para la mayoría de los tests. Un test puntual que
// necesite otro escenario (ej. un usuario ya logueado, o un producto
// puntual) mockea la función del SERVICE correspondiente
// (users.services / products.services / orders.services) directamente en
// su propio archivo, en vez de tocar estos mocks de más bajo nivel.

vi.mock("firebase/app", () => ({
  initializeApp: vi.fn(() => ({})),
}));

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({})),
  // onAuthStateChanged llama al callback una sola vez, de forma sincrónica,
  // con "sin usuario" (null) — y devuelve un unsubscribe que no hace nada.
  onAuthStateChanged: (_auth: unknown, callback: (user: null) => void) => {
    callback(null);
    return () => {};
  },
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  GoogleAuthProvider: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn(),
  doc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  startAt: vi.fn(),
  endAt: vi.fn(),
  startAfter: vi.fn(),
  limit: vi.fn(),
  serverTimestamp: vi.fn(),
  getDocs: vi.fn(async () => ({ docs: [] })),
  getDoc: vi.fn(async () => ({ exists: () => false })),
  getCountFromServer: vi.fn(async () => ({ data: () => ({ count: 0 }) })),
  setDoc: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
}));
