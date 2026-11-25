import type { FiscalCondition } from "./cart";

export type UserRole = "guest" | "admin";

export interface SavedCard {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
}

export interface RegisteredUser {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  locality?: string;
  province?: string;
  postalCode?: string;
  fiscalCondition?: FiscalCondition;
  dni?: string;
  cuit?: string;
  businessName?: string;
  savedCard?: SavedCard | null;
  password: string;
  role: UserRole;
  createdAt: string;
  isProtected?: boolean;
}

export type SessionUser = Omit<RegisteredUser, "password">;

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
}

export interface ProfileUpdatePayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  locality?: string;
  province?: string;
  postalCode?: string;
  fiscalCondition?: FiscalCondition;
  dni?: string;
  cuit?: string;
  businessName?: string;
}

export type AuthActionResult =
  | { ok: true; user: SessionUser }
  | { ok: false; error: string };

export interface DeleteUserResult {
  ok: boolean;
  error?: string;
}

export interface AuthContextValue {
  user: SessionUser | null;
  users: SessionUser[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  isGuest: boolean;
  login: (email: string, password: string) => AuthActionResult;
  register: (payload: RegisterPayload) => AuthActionResult;
  logout: () => void;
  updateProfile: (payload: ProfileUpdatePayload) => AuthActionResult;
  updateSavedCard: (card: SavedCard | null) => AuthActionResult;
  deleteUser: (userId: string) => DeleteUserResult;
  loginAsDemo: (role: UserRole) => AuthActionResult;
}
