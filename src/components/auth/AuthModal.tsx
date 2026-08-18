import { useState, type FormEvent } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Modal } from "../ui/Modal";
import { FormField, fieldInputClassName } from "../ui/FormField";
import { GoogleIcon } from "../ui/icons";
import { MundoLogo } from "../ui/MundoLogo";
import { Button } from "../ui/Button";

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
  const isLogin = tab === "login";

  // Cambiar de modo es "empezar de nuevo": limpiamos errores viejos, que ya
  // no tienen sentido (ej. "contraseña muy corta" no aplica hasta que
  // vuelva a intentar enviar el form en el modo nuevo).
  const switchTab = () => {
    setTab(isLogin ? "signup" : "login");
    setError(null);
    setFieldErrors({});
  };

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
      if (isLogin) {
        await login(email, password);
      } else {
        await signUp(email, password);
      }
      onClose();
    } catch {
      setError(
        isLogin
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
      <div className="p-6 flex flex-col gap-5">
        <div>
          <MundoLogo lettersClassName="text-xl" showTagline={false} />
          <h2 className="font-heading font-extrabold text-2xl text-azul-noche mt-3">
            {isLogin ? "¡Hola de nuevo!" : "Creá tu cuenta"}
          </h2>
          <p className="text-sm text-azul-noche/60 mt-1">
            {isLogin ? "Iniciá sesión para seguir comprando." : "Registrate para empezar a comprar en MUNDO."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          className="flex items-center justify-center gap-2.5 border border-gris-claro rounded-pill py-3 text-sm font-bold text-azul-noche hover:bg-card-surface"
        >
          <GoogleIcon size={18} />
          Continuar con Google
        </button>

        <div className="flex items-center gap-3 text-xs font-semibold text-azul-noche/40">
          <span className="flex-1 h-px bg-gris-claro" />
          o {isLogin ? "iniciá sesión" : "creá tu cuenta"} con tu email
          <span className="flex-1 h-px bg-gris-claro" />
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

          <Button type="submit" disabled={submitting} size="form" className="mt-1">
            {submitting ? "Un momento..." : isLogin ? "Iniciar sesión" : "Crear cuenta"}
          </Button>
        </form>

        <p className="text-center text-sm text-azul-noche/60">
          {isLogin ? "¿No tenés cuenta? " : "¿Ya tenés cuenta? "}
          <button type="button" onClick={switchTab} className="font-bold text-azul-cobalto">
            {isLogin ? "Registrate" : "Iniciá sesión"}
          </button>
        </p>
      </div>
    </Modal>
  );
};
