import { createContext, useState, type ReactNode } from "react";
import type { User, UserRole } from "../types/user.types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

// Contexto
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Props del Provider
interface AuthProviderProps {
  children: ReactNode;
}

// Provider
export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Estado mockeado
  const [user, setUser] = useState<User | null>(null);

  // Login mockeado
  const login = (role: UserRole) => {
    setUser({
      uid: "1",
      displayName: "Candelaria",
      email: "cande@example.com",
      role,
    });
  };

  // Logout
  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};