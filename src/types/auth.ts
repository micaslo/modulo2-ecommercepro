export type UserRole = "guest" | "admin";

export interface RegisteredUser {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone?: string;
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
  phone?: string;
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
  deleteUser: (userId: string) => DeleteUserResult;
  loginAsDemo: (role: UserRole) => AuthActionResult;
}
