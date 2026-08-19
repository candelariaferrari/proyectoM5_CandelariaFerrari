// Traduce los códigos de error de Firebase Auth (ej. "auth/email-already-in-use")
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use": "Ya existe una cuenta registrada con ese email.",
  "auth/invalid-email": "El email no tiene un formato válido.",
  "auth/weak-password": "La contraseña es muy débil: usá al menos 6 caracteres.",
  "auth/invalid-credential": "Email o contraseña incorrectos.",
  "auth/wrong-password": "Email o contraseña incorrectos.",
  "auth/user-not-found": "No encontramos ninguna cuenta con ese email.",
  "auth/user-disabled": "Esta cuenta fue deshabilitada.",
  "auth/too-many-requests": "Demasiados intentos. Esperá un momento y volvé a intentar.",
  "auth/network-request-failed": "Hubo un problema de conexión. Revisá tu internet e intentá de nuevo.",
  "auth/popup-closed-by-user": "Cerraste la ventana antes de terminar de iniciar sesión con Google.",
};

const isFirebaseAuthErrorCode = (error: unknown): error is { code: string } =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  typeof (error as { code: unknown }).code === "string";

// `fallback` es el mensaje genérico 
export const getFirebaseAuthErrorMessage = (error: unknown, fallback: string): string => {
  if (isFirebaseAuthErrorCode(error) && error.code in AUTH_ERROR_MESSAGES) {
    return AUTH_ERROR_MESSAGES[error.code];
  }
  return fallback;
};
