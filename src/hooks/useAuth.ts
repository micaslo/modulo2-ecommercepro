import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import type { AuthContextValue } from "../types/auth";

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de un AuthProvider.");
  }
  return context;
}
