import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { createUserProfile, getUsersById } from "../services/users.services";
import type { User } from "../types/user.types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<User | null>;
  login: (email: string, password: string) => Promise<User | null>;
  loginWithGoogle: () => Promise<User | null>;
  logout: () => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
// Props del Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // onAuthStateChanged es la ÚNICA fuente de verdad para actualizar `user`:
  // se dispara al cargar la app (sesión guardada), al loguearse y al desloguearse.
  // Ninguna otra función de este archivo llama a setUser directamente.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let profile = await getUsersById(firebaseUser.uid);

        if (!profile) {
          // Recién se registró: todavía no existe el doc en Firestore, lo creamos.
          await createUserProfile(firebaseUser.uid, firebaseUser.email ?? "");
          profile = await getUsersById(firebaseUser.uid);
        }

        setUser(profile);
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return unsubscribe; // cleanup: deja de escuchar cuando el Provider se desmonta
  }, []);

 
  const signUp = useCallback(async (email: string, password: string) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    return getUsersById(credential.user.uid);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return getUsersById(credential.user.uid);
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const credential = await signInWithPopup(auth, new GoogleAuthProvider());
    return getUsersById(credential.user.uid);
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const isAuthenticated = user !== null;

  const value = useMemo( //fotografia
    () => ({
      user,
      isAuthenticated,
      loading,
      signUp,
      login,
      loginWithGoogle,
      logout,
    }),
    [user, isAuthenticated, loading, signUp, login, loginWithGoogle, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
