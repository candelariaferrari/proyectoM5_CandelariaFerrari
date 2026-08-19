import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { AuthProvider } from "../../src/contexts/AuthContext";
import { useAuth } from "../../src/hooks/useAuth";
import { getUsersById, createUserProfile } from "../../src/services/users.services";
import { buildUser } from "../fixtures";

type AuthStateCallback = (firebaseUser: { uid: string; email?: string | null } | null) => void | Promise<void>;
let authStateCallback: AuthStateCallback | null = null;

const createUserWithEmailAndPassword = vi.fn();
const signInWithEmailAndPassword = vi.fn();
const signInWithPopup = vi.fn();
const signOut = vi.fn();

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({})),
  onAuthStateChanged: (_auth: unknown, callback: AuthStateCallback) => {
    authStateCallback = callback;
    callback(null); // arranca sin sesión, como cualquier visita normal
    return () => {};
  },
  createUserWithEmailAndPassword: (...args: unknown[]) => createUserWithEmailAndPassword(...args),
  signInWithEmailAndPassword: (...args: unknown[]) => signInWithEmailAndPassword(...args),
  signInWithPopup: (...args: unknown[]) => signInWithPopup(...args),
  GoogleAuthProvider: vi.fn(),
  signOut: (...args: unknown[]) => signOut(...args),
}));

vi.mock("../../src/services/users.services", () => ({
  getUsersById: vi.fn(),
  createUserProfile: vi.fn(),
}));

const fireAuthState = async (firebaseUser: { uid: string; email?: string | null } | null) => {
  await act(async () => {
    await authStateCallback?.(firebaseUser);
  });
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("AuthContext", () => {
  it("sin sesión guardada, termina de cargar con user null (no se queda colgado en loading)", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("si Firebase reporta un usuario con perfil YA existente en Firestore, lo carga tal cual (no lo recrea)", async () => {
    const profile = buildUser({ uid: "user-1", role: "customer" });
    vi.mocked(getUsersById).mockResolvedValue(profile);

    const { result } = renderHook(() => useAuth(), { wrapper });
    await fireAuthState({ uid: "user-1", email: "cande@test.com" });

    await waitFor(() => expect(result.current.user).toEqual(profile));
    expect(result.current.isAuthenticated).toBe(true);
    expect(createUserProfile).not.toHaveBeenCalled();
  });

  it("si el perfil todavía no existe en Firestore (recién registrado), lo crea antes de terminar de cargar", async () => {
    const newProfile = buildUser({ uid: "user-2", email: "nuevo@test.com", role: "customer" });
    vi.mocked(getUsersById)
      .mockResolvedValueOnce(null) // primer chequeo: todavía no existe
      .mockResolvedValueOnce(newProfile); // segundo chequeo, ya creado
    vi.mocked(createUserProfile).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper });
    await fireAuthState({ uid: "user-2", email: "nuevo@test.com" });

    await waitFor(() => expect(result.current.user).toEqual(newProfile));
    expect(createUserProfile).toHaveBeenCalledWith("user-2", "nuevo@test.com");
    expect(getUsersById).toHaveBeenCalledTimes(2);
  });

  it("si firebaseUser no tiene email (caso raro), crea el perfil igual con email vacío en vez de explotar", async () => {
    vi.mocked(getUsersById).mockResolvedValueOnce(null).mockResolvedValueOnce(buildUser({ uid: "user-3" }));
    vi.mocked(createUserProfile).mockResolvedValue(undefined);

    renderHook(() => useAuth(), { wrapper });
    await fireAuthState({ uid: "user-3", email: null });

    await waitFor(() => expect(createUserProfile).toHaveBeenCalledWith("user-3", ""));
  });

  it("logout: llama a signOut de Firebase (el listener es quien limpia `user`)", async () => {
    vi.mocked(signOut).mockResolvedValue(undefined);
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.logout();
    });

    expect(signOut).toHaveBeenCalled();
  });

  it("signUp: crea la cuenta en Firebase y devuelve el perfil leído de Firestore (sin tocar `user` directamente)", async () => {
    const profile = buildUser({ uid: "new-uid", role: "customer" });
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({ user: { uid: "new-uid" } });
    vi.mocked(getUsersById).mockResolvedValue(profile);
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    let returned;
    await act(async () => {
      returned = await result.current.signUp("nuevo@test.com", "123456");
    });

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.any(Object),
      "nuevo@test.com",
      "123456"
    );
    expect(returned).toEqual(profile);
  });

  it("login: llama a signInWithEmailAndPassword y devuelve el perfil correspondiente", async () => {
    const profile = buildUser({ uid: "user-1", role: "customer" });
    vi.mocked(signInWithEmailAndPassword).mockResolvedValue({ user: { uid: "user-1" } });
    vi.mocked(getUsersById).mockResolvedValue(profile);
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    let returned;
    await act(async () => {
      returned = await result.current.login("cande@test.com", "123456");
    });

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.any(Object),
      "cande@test.com",
      "123456"
    );
    expect(returned).toEqual(profile);
  });

  it("loginWithGoogle: llama a signInWithPopup y devuelve el perfil correspondiente", async () => {
    const profile = buildUser({ uid: "admin-1", role: "admin" });
    vi.mocked(signInWithPopup).mockResolvedValue({ user: { uid: "admin-1" } });
    vi.mocked(getUsersById).mockResolvedValue(profile);
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    let returned;
    await act(async () => {
      returned = await result.current.loginWithGoogle();
    });

    expect(signInWithPopup).toHaveBeenCalled();
    expect(returned).toEqual(profile);
  });
});
