import { useState, type FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import { Modal } from "./ui/Modal";

type AuthTab = "login" | "signup";

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal = ({ onClose }: AuthModalProps) => {
  const { login, signUp, loginWithGoogle } = useAuth();
  const [tab, setTab] = useState<AuthTab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="nombre@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gris-claro rounded-input px-3 py-2 text-sm"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gris-claro rounded-input px-3 py-2 text-sm"
          />

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
