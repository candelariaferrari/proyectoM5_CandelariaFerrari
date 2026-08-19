import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { uploadProductImage } from "../../src/services/upload.services";

// uploadProductImage no usa Firebase para nada -- habla directo con nuestra
// Vercel Function (/api/presign) y después con S3 usando la URL prefirmada
// que esa función devuelve. Por eso acá mockeamos `fetch` a mano en vez de
// usar los mocks globales de Firestore/Auth (que no aplican a este archivo).

const buildFile = (sizeInMb: number, name = "producto.jpg", type = "image/jpeg") => {
  // File real de jsdom, con un tamaño controlado a mano (Blob no permite
  // "pesar" lo que uno quiere directamente, así que se lo redefinimos).
  const file = new File([""], name, { type });
  Object.defineProperty(file, "size", { value: sizeInMb * 1024 * 1024 });
  return file;
};

const jsonResponse = (body: unknown, ok = true) => ({
  ok,
  json: async () => body,
});

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("uploadProductImage", () => {
  it("rechaza archivos de más de 5MB sin llegar a pedir la URL prefirmada", async () => {
    const bigFile = buildFile(6);

    await expect(uploadProductImage(bigFile)).rejects.toThrow(
      "La imagen no puede pesar más de 5MB"
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it("sube la imagen en dos pasos (presign + PUT a S3) y devuelve la URL pública", async () => {
    const file = buildFile(1);
    vi.mocked(fetch)
      .mockResolvedValueOnce(
        jsonResponse({ uploadUrl: "https://s3.fake/put-url", publicUrl: "https://cdn.fake/img.jpg" }) as never
      )
      .mockResolvedValueOnce({ ok: true } as never);

    const publicUrl = await uploadProductImage(file);

    expect(publicUrl).toBe("https://cdn.fake/img.jpg");
    // Paso 1: le pide a nuestra propia función la URL prefirmada.
    expect(fetch).toHaveBeenNthCalledWith(1, "/api/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name, fileType: file.type }),
    });
    // Paso 2: sube el archivo DIRECTO a S3 con esa URL, no a nuestro backend.
    expect(fetch).toHaveBeenNthCalledWith(2, "https://s3.fake/put-url", {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
  });

  it("si /api/presign falla, no llega a intentar subir nada a S3", async () => {
    const file = buildFile(1);
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false } as never);

    await expect(uploadProductImage(file)).rejects.toThrow(
      "No pudimos preparar la subida de la imagen"
    );
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("si la subida a S3 falla, propaga el error correspondiente (no el genérico de presign)", async () => {
    const file = buildFile(1);
    vi.mocked(fetch)
      .mockResolvedValueOnce(
        jsonResponse({ uploadUrl: "https://s3.fake/put-url", publicUrl: "https://cdn.fake/img.jpg" }) as never
      )
      .mockResolvedValueOnce({ ok: false } as never);

    await expect(uploadProductImage(file)).rejects.toThrow("No pudimos subir la imagen a S3");
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
