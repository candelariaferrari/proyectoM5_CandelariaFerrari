import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

// Guarda de rutas reutilizable
export const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Mientras Firebase todavía no confirmó si hay una sesión guardada, no
  // redirigimos: si lo hiciéramos, un admin que refresca /admin rebotaría a
  // "/" un instante antes de que onAuthStateChanged responda.
  if (loading) {
    return <p className="p-6 text-center text-azul-noche">Verificando sesión...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
