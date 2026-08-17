import { useState, type FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import { Modal } from "./ui/Modal";
import { FormField, fieldInputClassName } from "./ui/FormField";

type AuthTab = "login" | "signup";

interface AuthModalProps {
  onClose: () => void;
}

// Mismo chequeo simple de forma de email que alcanza para este proyecto:
// no busca cubrir el 100% del RFC, solo detectar los casos obvios de "esto
// no es un email" (sin @, sin dominio) antes de mandarlo a Firebase.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

type AuthFormErrors = Partial<Record<"email" | "password", string>>;

export const AuthModal = ({ onClose }: AuthModalProps) => {
  const { login, signUp, loginWithGoogle } = useAuth();
  const [tab, setTab] = useState<AuthTab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<AuthFormErrors>({});

  const validate = (): AuthFormErrors => {
    const nextErrors: AuthFormErrors = {};

    if (!email.trim()) {
      nextErrors.email = "El email es obligatorio.";
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = "Ingresá un email válido.";
    }

    if (!password) {
      nextErrors.password = "La contraseña es obligatoria.";
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      nextErrors.password = `La contraseña tiene que tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
    }

    return nextErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationErrors = validate();
    setFieldErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      if (tab === "login") {
        await login(email, password);
      } else {
        await signUp(email, password);
      }
      onClose();
    } catch {
      setError(
        tab === "login"
          ? "No pudimos iniciar sesión. Revisá tu email y contraseña."
          : "No pudimos crear la cuenta. Probá con otro email."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    try {
      await loginWithGoogle();
      onClose();
    } catch {
      setError("No pudimos iniciar sesión con Google.");
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="p-6">
        <div className="font-heading font-extrabold text-2xl mb-4 text-azul-noche">
          MUNDO
        </div>

        <div className="flex gap-4 mb-4 text-sm font-bold">
          <button
            type="button"
            onClick={() => setTab("login")}
            className={tab === "login" ? "text-azul-noche" : "text-azul-noche/40"}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={() => setTab("signup")}
            className={tab === "signup" ? "text-azul-noche" : "text-azul-noche/40"}
          >
            Crear cuenta
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
          <FormField label="Email" error={fieldErrors.email}>
            <input
              type="email"
              placeholder="nombre@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldInputClassName(!!fieldErrors.email)}
            />
          </FormField>

          <FormField label="Contraseña" error={fieldErrors.password}>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={fieldInputClassName(!!fieldErrors.password)}
            />
          </FormField>

          {error && <p className="text-danger text-xs">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="bg-mostaza text-white font-bold rounded-pill py-2 mt-1 disabled:opacity-50"
          >
            {submitting ? "Un momento..." : "Ingresar"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleGoogle}
          className="w-full text-center text-sm text-azul-cobalto font-bold mt-3"
        >
          Continuar con Google
        </button>
      </div>
    </Modal>
  );
};
