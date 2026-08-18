import {
 collection,
  getDocs,
  getCountFromServer,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../config/firebase";
import type { User } from "../types/user.types";

const ADMIN_EMAIL = "mundo@jugueteria.com";

// Obtener todos los Users
export const getUser = async (): Promise<User[]> => {
  const snapshot = await getDocs(collection(db, "users"));

  return snapshot.docs.map(
    (doc) =>
      ({
        uid: doc.id,
        ...doc.data(),
      } as User)
  );
};

// Cuenta cuántos usuarios hay, sin traer los documentos (agregación del
// lado del servidor) -- mismo criterio que `countProducts` en
// products.services.ts, en vez de traer todos los docs de `users` solo
// para contar cuántos son.
export const countUsers = async (): Promise<number> => {
  const snapshot = await getCountFromServer(collection(db, "users"));
  return snapshot.data().count;
};

// Obtener un user por ID
export const getUsersById = async (
  id: string
): Promise<User | null> => {
  const ref = doc(db, "users", id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  return {
    uid: snapshot.id,
    ...snapshot.data(),
  } as User;
};

// Crear perfil de usuario
export const createUserProfile = async (
  uid: string,
  email: string
): Promise<void> => {
  const userRef = doc(db, "users", uid);

  const userData = {
    uid,
    email,
    role: email === ADMIN_EMAIL ? "admin" : "customer",
    createdAt: serverTimestamp(),
  };

  await setDoc(userRef, userData);
};