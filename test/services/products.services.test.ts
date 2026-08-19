import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  getCountFromServer,
  addDoc,
  updateDoc,
  deleteDoc,
  where,
  orderBy,
  startAt,
  startAfter,
  limit,
} from "firebase/firestore";
import {
  getProducts,
  getProductsById,
  listProducts,
  countProducts,
  listLowStockProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../src/services/products.services";
import { buildProduct } from "../fixtures";

// firebase/firestore ya está mockeado GLOBALMENTE (test/setupTests.ts) --
// where/orderBy/startAt/startAfter/limit no arman una query real, solo
// registran con qué se los llamó. Eso alcanza para probar la lógica PROPIA
// de products.services.ts (qué filtros arma según los params, no cómo los
// ejecuta Firestore).

const buildDocSnap = (id: string, data: Record<string, unknown>) => ({ id, data: () => data });

beforeEach(() => {
  vi.clearAllMocks();
});

describe("products.services", () => {
  describe("getProducts", () => {
    it("trae toda la colección (sin filtrar) y mapea cada doc a un Product", async () => {
      vi.mocked(getDocs).mockResolvedValueOnce({
        docs: [buildDocSnap("product-1", { name: "Rompecabezas", price: 5000, stock: 10 })],
      } as never);

      const products = await getProducts();

      expect(collection).toHaveBeenCalledWith(expect.any(Object), "products");
      expect(products).toEqual([{ id: "product-1", name: "Rompecabezas", price: 5000, stock: 10 }]);
    });
  });

  describe("getProductsById", () => {
    it("devuelve null si el producto no existe", async () => {
      vi.mocked(getDoc).mockResolvedValueOnce({ exists: () => false } as never);

      const product = await getProductsById("no-existe");

      expect(product).toBeNull();
    });

    it("devuelve el Product con id = id del documento cuando existe", async () => {
      vi.mocked(getDoc).mockResolvedValueOnce({
        exists: () => true,
        id: "product-1",
        data: () => ({ name: "Rompecabezas", price: 5000, stock: 10 }),
      } as never);

      const product = await getProductsById("product-1");

      expect(doc).toHaveBeenCalledWith(expect.any(Object), "products", "product-1");
      expect(product).toEqual({ id: "product-1", name: "Rompecabezas", price: 5000, stock: 10 });
    });
  });

  describe("listProducts", () => {
    it("sin filtros: ordena por nameLower y no arma ningún where", async () => {
      vi.mocked(getDocs).mockResolvedValueOnce({ docs: [] } as never);

      await listProducts({});

      expect(orderBy).toHaveBeenCalledWith("nameLower");
      expect(where).not.toHaveBeenCalled();
      expect(startAt).not.toHaveBeenCalled();
    });

    it("con búsqueda: ordena por nameLower y arma el rango de prefijo (startAt/endAt)", async () => {
      vi.mocked(getDocs).mockResolvedValueOnce({ docs: [] } as never);

      await listProducts({ searchPrefix: "rompe" });

      expect(orderBy).toHaveBeenCalledWith("nameLower");
      expect(startAt).toHaveBeenCalledWith("rompe");
      // La búsqueda no filtra por categoría -- son mutuamente excluyentes.
      expect(where).not.toHaveBeenCalled();
    });

    it("con categoría: filtra por categoryId y ordena por precio (mismo índice compuesto de siempre)", async () => {
      vi.mocked(getDocs).mockResolvedValueOnce({ docs: [] } as never);

      await listProducts({ categoryId: "pensar" });

      expect(where).toHaveBeenCalledWith("categoryId", "==", "pensar");
      expect(orderBy).toHaveBeenCalledWith("price", "asc");
    });

    it("con cursor: agrega startAfter con el último doc de la página anterior", async () => {
      vi.mocked(getDocs).mockResolvedValueOnce({ docs: [] } as never);
      const cursorDoc = buildDocSnap("product-12", { name: "Último de la página 1" });

      await listProducts({ cursor: cursorDoc as never });

      expect(startAfter).toHaveBeenCalledWith(cursorDoc);
    });

    it("usa pageSize (o el default de 12) como límite de la consulta", async () => {
      vi.mocked(getDocs).mockResolvedValueOnce({ docs: [] } as never);

      await listProducts({ pageSize: 5 });
      expect(limit).toHaveBeenCalledWith(5);

      await listProducts({});
      expect(limit).toHaveBeenCalledWith(12);
    });

    it("si trae menos productos que pageSize, nextCursor es null (no hay más páginas)", async () => {
      vi.mocked(getDocs).mockResolvedValueOnce({
        docs: [buildDocSnap("product-1", { name: "A" })],
      } as never);

      const { nextCursor } = await listProducts({ pageSize: 12 });

      expect(nextCursor).toBeNull();
    });

    it("si trae exactamente pageSize productos, nextCursor apunta al último doc traído", async () => {
      const lastDoc = buildDocSnap("product-2", { name: "B" });
      vi.mocked(getDocs).mockResolvedValueOnce({
        docs: [buildDocSnap("product-1", { name: "A" }), lastDoc],
      } as never);

      const { nextCursor, products } = await listProducts({ pageSize: 2 });

      expect(nextCursor).toEqual(lastDoc);
      expect(products).toHaveLength(2);
    });
  });

  describe("countProducts", () => {
    it("usa la agregación del servidor (no getDocs) y respeta el mismo filtro que listProducts", async () => {
      vi.mocked(getCountFromServer).mockResolvedValueOnce({ data: () => ({ count: 7 }) } as never);

      const count = await countProducts({ categoryId: "pensar" });

      expect(count).toBe(7);
      expect(where).toHaveBeenCalledWith("categoryId", "==", "pensar");
      expect(getDocs).not.toHaveBeenCalled();
    });
  });

  describe("listLowStockProducts", () => {
    it("filtra por stock menor al umbral y ordena ascendente (el más urgente primero)", async () => {
      vi.mocked(getDocs).mockResolvedValueOnce({
        docs: [buildDocSnap("product-1", { name: "Bajo stock", stock: 2 })],
      } as never);

      const products = await listLowStockProducts();

      expect(where).toHaveBeenCalledWith("stock", "<", 5); // LOW_STOCK_THRESHOLD
      expect(orderBy).toHaveBeenCalledWith("stock", "asc");
      expect(limit).toHaveBeenCalledWith(5); // maxResults default
      expect(products).toEqual([{ id: "product-1", name: "Bajo stock", stock: 2 }]);
    });

    it("acepta un umbral y un maxResults distintos al default", async () => {
      vi.mocked(getDocs).mockResolvedValueOnce({ docs: [] } as never);

      await listLowStockProducts(10, 3);

      expect(where).toHaveBeenCalledWith("stock", "<", 3);
      expect(limit).toHaveBeenCalledWith(10);
    });
  });

  describe("createProduct", () => {
    it("guarda el producto y calcula nameLower en minúsculas a partir del nombre", async () => {
      vi.mocked(addDoc).mockResolvedValueOnce({ id: "new-id" } as never);
      const data = buildProduct({ name: "Rompecabezas MUNDO" });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...withoutId } = data;

      await createProduct(withoutId);

      const [, payload] = vi.mocked(addDoc).mock.calls[0];
      expect(payload).toMatchObject({ name: "Rompecabezas MUNDO", nameLower: "rompecabezas mundo" });
    });
  });

  describe("updateProduct", () => {
    it("si viene name, recalcula nameLower para no desincronizar la búsqueda", async () => {
      vi.mocked(updateDoc).mockResolvedValueOnce(undefined as never);

      await updateProduct("product-1", { name: "Nuevo Nombre" });

      expect(doc).toHaveBeenCalledWith(expect.any(Object), "products", "product-1");
      const [, payload] = vi.mocked(updateDoc).mock.calls[0];
      expect(payload).toMatchObject({ name: "Nuevo Nombre", nameLower: "nuevo nombre" });
    });

    it("si NO viene name, no inventa un nameLower (deja el campo afuera del payload)", async () => {
      vi.mocked(updateDoc).mockResolvedValueOnce(undefined as never);

      await updateProduct("product-1", { stock: 3 });

      const [, payload] = vi.mocked(updateDoc).mock.calls[0];
      expect(payload).toEqual({ stock: 3 });
      expect(payload).not.toHaveProperty("nameLower");
    });
  });

  describe("deleteProduct", () => {
    it("borra el documento correcto de la colección 'products'", async () => {
      vi.mocked(deleteDoc).mockResolvedValueOnce(undefined as never);

      await deleteProduct("product-1");

      expect(doc).toHaveBeenCalledWith(expect.any(Object), "products", "product-1");
      expect(deleteDoc).toHaveBeenCalled();
    });
  });
});
