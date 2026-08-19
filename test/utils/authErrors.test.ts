import { describe, expect, it } from "vitest";
import { getFirebaseAuthErrorMessage } from "../../src/utils/authErrors";

const FALLBACK = "Ocurrió un error inesperado. Probá de nuevo.";

describe("getFirebaseAuthErrorMessage", () => {
  it.each([
    ["auth/email-already-in-use", "Ya existe una cuenta registrada con ese email."],
    ["auth/invalid-email", "El email no tiene un formato válido."],
    ["auth/weak-password", "La contraseña es muy débil: usá al menos 6 caracteres."],
    ["auth/invalid-credential", "Email o contraseña incorrectos."],
    ["auth/wrong-password", "Email o contraseña incorrectos."],
    ["auth/user-not-found", "No encontramos ninguna cuenta con ese email."],
    ["auth/user-disabled", "Esta cuenta fue deshabilitada."],
    ["auth/too-many-requests", "Demasiados intentos. Esperá un momento y volvé a intentar."],
    [
      "auth/network-request-failed",
      "Hubo un problema de conexión. Revisá tu internet e intentá de nuevo.",
    ],
    [
      "auth/popup-closed-by-user",
      "Cerraste la ventana antes de terminar de iniciar sesión con Google.",
    ],
  ])("traduce el código %s al mensaje en español correspondiente", (code, expected) => {
    expect(getFirebaseAuthErrorMessage({ code }, FALLBACK)).toBe(expected);
  });

  it("si el código no está en el mapa, devuelve el fallback (no un código técnico sin traducir)", () => {
    expect(getFirebaseAuthErrorMessage({ code: "auth/algo-que-no-mapeamos" }, FALLBACK)).toBe(
      FALLBACK
    );
  });

  it("si el error no tiene forma de FirebaseError (sin `code`), devuelve el fallback", () => {
    expect(getFirebaseAuthErrorMessage(new Error("network down"), FALLBACK)).toBe(FALLBACK);
  });

  it("si el error es null/undefined/un string suelto, devuelve el fallback sin explotar", () => {
    expect(getFirebaseAuthErrorMessage(null, FALLBACK)).toBe(FALLBACK);
    expect(getFirebaseAuthErrorMessage(undefined, FALLBACK)).toBe(FALLBACK);
    expect(getFirebaseAuthErrorMessage("auth/invalid-email", FALLBACK)).toBe(FALLBACK);
  });

  it("si `code` no es un string (duck typing incompleto), devuelve el fallback", () => {
    expect(getFirebaseAuthErrorMessage({ code: 404 }, FALLBACK)).toBe(FALLBACK);
  });
});
