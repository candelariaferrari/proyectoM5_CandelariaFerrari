// Roles autenticados solamente. Un "guest" no es un User: es la ausencia de sesión, representada en AuthContext como `user: null`.
export type UserRole = "admin" | "customer";

export type User = {
  uid: string;  // Firebase Authentication cuando se conecte el servicio real.
  displayName?: string;
  email: string;
  role: UserRole;
  
};
