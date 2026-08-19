import { describe, expect, it, vi, beforeEach } from "vitest";
import { collection, getDocs, getCountFromServer, doc, getDoc, setDoc } from "firebase/firestore";
import { getUser, countUsers, getUsersById, createUserProfile } from "../../src/services/users.services";

// firebase/firestore ya está mockeado GLOBALMENTE (test/setupTests.ts).

const buildDocSnap = (id: string, data: Record<string, unknown>) => ({
  id,
  data: () => data,
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("users.services", () => {
  describe("getUser", () => {
    it("mapea cada doc de la colección a un User, con uid = id del documento", async () => {
      vi.mocked(getDocs).mockResolvedValueOnce({
        docs: [
          buildDocSnap("user-1", { email: "cande@mundo.com", role: "customer" }),
          buildDocSnap("admin-1", { email: "mundo@jugueteria.com", role: "admin" }),
        ],
      } as never);

      const users = await getUser();

      expect(collection).toHaveBeenCalledWith(expect.any(Object), "users");
      expect(users).toEqual([
        { uid: "user-1", email: "cande@mundo.com", role: "customer" },
        { uid: "admin-1", email: "mundo@jugueteria.com", role: "admin" },
      ]);
    });
  });

  describe("countUsers", () => {
    it("devuelve el count de la agregación del servidor, sin traer los documentos", async () => {
      vi.mocked(getCountFromServer).mockResolvedValueOnce({ data: () => ({ count: 42 }) } as never);

      const count = await countUsers();

      expect(count).toBe(42);
      expect(collection).toHaveBeenCalledWith(expect.any(Object), "users");
      // La agregación no debería traer los docs -- si alguien la cambia por
      // getDocs "para simplificar", este test lo marca.
      expect(getDocs).not.toHaveBeenCalled();
    });
  });

  describe("getUsersById", () => {
    it("devuelve null si el documento no existe", async () => {
      vi.mocked(getDoc).mockResolvedValueOnce({ exists: () => false } as never);

      const user = await getUsersById("no-existe");

      expect(user).toBeNull();
    });

    it("devuelve el User con uid = id del documento cuando existe", async () => {
      vi.mocked(getDoc).mockResolvedValueOnce({
        exists: () => true,
        id: "user-1",
        data: () => ({ email: "cande@mundo.com", role: "customer" }),
      } as never);

      const user = await getUsersById("user-1");

      expect(doc).toHaveBeenCalledWith(expect.any(Object), "users", "user-1");
      expect(user).toEqual({ uid: "user-1", email: "cande@mundo.com", role: "customer" });
    });
  });

  describe("createUserProfile", () => {
    // Test de regresión del fix de seguridad: antes, un perfil nuevo se
    // creaba como "admin" si el email coincidía con un email hardcodeado en
    // el código (ADMIN_EMAIL). Ahora TODO perfil nuevo se crea como
    // "customer", sin excepción -- el rol admin se asigna a mano en la
    // consola de Firebase, nunca desde el flujo público de registro. Si
    // alguien reintroduce ese hardcodeo, este test lo detecta.
    it("crea el perfil siempre como 'customer', sin importar el email", async () => {
      vi.mocked(setDoc).mockResolvedValueOnce(undefined as never);

      await createUserProfile("nuevo-uid", "mundo@jugueteria.com");

      const [, payload] = vi.mocked(setDoc).mock.calls[0];
      expect(payload).toMatchObject({
        uid: "nuevo-uid",
        email: "mundo@jugueteria.com",
        role: "customer",
      });
    });

    it("también crea como 'customer' a un email cualquiera (no solo al caso especial)", async () => {
      vi.mocked(setDoc).mockResolvedValueOnce(undefined as never);

      await createUserProfile("otro-uid", "alguien@test.com");

      const [, payload] = vi.mocked(setDoc).mock.calls[0];
      expect(payload).toMatchObject({ role: "customer" });
    });

    it("guarda el perfil en el documento con id = uid", async () => {
      vi.mocked(setDoc).mockResolvedValueOnce(undefined as never);

      await createUserProfile("user-1", "cande@mundo.com");

      expect(doc).toHaveBeenCalledWith(expect.any(Object), "users", "user-1");
    });
  });
});
