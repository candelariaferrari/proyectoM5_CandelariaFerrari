
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);

  // Guard: evita usar el contexto fuera del Provider
  if (context === undefined) {
    throw new Error("useAuth debe utilizarse dentro de un AuthProvider");
  }

  return context;
};

