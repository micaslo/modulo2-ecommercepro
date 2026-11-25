import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthContext } from "./authContext";
import { clearUserWishlistStorage } from "../utils/wishlist";
import type {
  AuthActionResult,
  AuthContextValue,
  DeleteUserResult,
  ProfileUpdatePayload,
  RegisteredUser,
  RegisterPayload,
  SessionUser,
  UserRole,
} from "../types/auth";

const USERS_STORAGE_KEY = "detodito_users_v1";
const SESSION_STORAGE_KEY = "detodito_session_v1";

const DEFAULT_USERS: RegisteredUser[] = [
  {
    id: "admin-root-1",
    firstName: "Sofía",
    lastName: "Admin",
    name: "Sofía Admin",
    email: "admin@detodito.com",
    phone: "+54 9 381 555 0100",
    password: "Admin1234",
    role: "admin",
    createdAt: "2026-01-15T10:00:00.000Z",
    isProtected: true,
  },
  {
    id: "guest-demo-1",
    firstName: "Mateo",
    lastName: "Gómez",
    name: "Mateo Gómez",
    email: "invitado@detodito.com",
    phone: "+54 9 381 555 0240",
    password: "Invitado123",
    role: "guest",
    createdAt: "2026-03-20T14:30:00.000Z",
  },
  {
    id: "guest-demo-2",
    firstName: "Valentina",
    lastName: "Ruiz",
    name: "Valentina Ruiz",
    email: "valentina.ruiz@correo.com",
    phone: "+54 9 381 555 0891",
    password: "Valen2026",
    role: "guest",
    createdAt: "2026-05-08T18:15:00.000Z",
  },
];

function stripPassword(user: RegisteredUser): SessionUser {
  const { password: _password, ...sessionUser } = user;
  void _password;
  return sessionUser;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function generateUserId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function loadUsers(): RegisteredUser[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }

    const validUsers = parsed.filter(
      (u): u is RegisteredUser =>
        Boolean(u) &&
        typeof u.id === "string" &&
        typeof u.email === "string" &&
        typeof u.password === "string" &&
        (u.role === "admin" || u.role === "guest"),
    );

    const hasRootAdmin = validUsers.some((u) => u.id === DEFAULT_USERS[0].id);
    if (!hasRootAdmin) {
      const merged = [DEFAULT_USERS[0], ...validUsers];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }

    return validUsers;
  } catch {
    return DEFAULT_USERS;
  }
}

function saveUsers(users: RegisteredUser[]) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("No se pudieron guardar los usuarios en localStorage", error);
  }
}

function loadSessionUserId(): string | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === "object" &&
      "userId" in parsed &&
      typeof (parsed as { userId: unknown }).userId === "string"
    ) {
      return (parsed as { userId: string }).userId;
    }
    return null;
  } catch {
    return null;
  }
}

function saveSessionUserId(userId: string | null) {
  try {
    if (!userId) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      return;
    }
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ userId }));
  } catch (error) {
    console.error("No se pudo persistir la sesión en localStorage", error);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(loadUsers);
  const [sessionUserId, setSessionUserId] = useState<string | null>(loadSessionUserId);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === USERS_STORAGE_KEY) {
        setRegisteredUsers(loadUsers());
      }
      if (event.key === null || event.key === SESSION_STORAGE_KEY) {
        setSessionUserId(loadSessionUserId());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const user = useMemo<SessionUser | null>(() => {
    if (!sessionUserId) return null;
    const found = registeredUsers.find((u) => u.id === sessionUserId);
    return found ? stripPassword(found) : null;
  }, [registeredUsers, sessionUserId]);

  const users = useMemo<SessionUser[]>(
    () => registeredUsers.map(stripPassword),
    [registeredUsers],
  );

  const login = useCallback((email: string, password: string): AuthActionResult => {
    const currentUsers = loadUsers();
    const targetEmail = normalizeEmail(email);
    const match = currentUsers.find(
      (u) => normalizeEmail(u.email) === targetEmail && u.password === password,
    );

    if (!match) {
      return { ok: false, error: "Correo electrónico o contraseña incorrectos." };
    }

    setRegisteredUsers(currentUsers);
    saveSessionUserId(match.id);
    setSessionUserId(match.id);
    return { ok: true, user: stripPassword(match) };
  }, []);

  const register = useCallback((payload: RegisterPayload): AuthActionResult => {
    const currentUsers = loadUsers();
    const normalizedEmail = normalizeEmail(payload.email);

    const alreadyExists = currentUsers.some(
      (u) => normalizeEmail(u.email) === normalizedEmail,
    );
    if (alreadyExists) {
      return {
        ok: false,
        error: "Ya existe una cuenta registrada con ese correo electrónico.",
      };
    }

    const firstName = payload.firstName.trim();
    const lastName = payload.lastName.trim();
    const newUser: RegisteredUser = {
      id: generateUserId(),
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
      email: normalizedEmail,
      phone: payload.phone?.trim() || undefined,
      password: payload.password,
      role: "guest",
      createdAt: new Date().toISOString(),
    };

    const nextUsers = [...currentUsers, newUser];
    saveUsers(nextUsers);
    setRegisteredUsers(nextUsers);
    saveSessionUserId(newUser.id);
    setSessionUserId(newUser.id);

    return { ok: true, user: stripPassword(newUser) };
  }, []);

  const logout = useCallback(() => {
    saveSessionUserId(null);
    setSessionUserId(null);
  }, []);

  const updateProfile = useCallback(
    (payload: ProfileUpdatePayload): AuthActionResult => {
      if (!sessionUserId) {
        return { ok: false, error: "No hay una sesión activa." };
      }

      const currentUsers = loadUsers();
      const targetIndex = currentUsers.findIndex((u) => u.id === sessionUserId);
      if (targetIndex === -1) {
        return { ok: false, error: "No se encontró el usuario activo." };
      }

      const firstName = payload.firstName.trim();
      const lastName = payload.lastName.trim();
      const updatedUser: RegisteredUser = {
        ...currentUsers[targetIndex],
        firstName,
        lastName,
        name: `${firstName} ${lastName}`.trim(),
        phone: payload.phone?.trim() || undefined,
      };

      const nextUsers = currentUsers.map((u, idx) =>
        idx === targetIndex ? updatedUser : u,
      );
      saveUsers(nextUsers);
      setRegisteredUsers(nextUsers);

      return { ok: true, user: stripPassword(updatedUser) };
    },
    [sessionUserId],
  );

  const deleteUser = useCallback(
    (userId: string): DeleteUserResult => {
      const currentUsers = loadUsers();
      const target = currentUsers.find((u) => u.id === userId);
      if (!target) {
        return { ok: false, error: "El usuario ya no existe." };
      }
      if (target.isProtected) {
        return {
          ok: false,
          error: "No se puede eliminar al administrador principal.",
        };
      }
      if (target.id === sessionUserId) {
        return {
          ok: false,
          error: "No podés eliminar tu propia cuenta mientras la sesión está activa.",
        };
      }

      const nextUsers = currentUsers.filter((u) => u.id !== userId);
      saveUsers(nextUsers);
      setRegisteredUsers(nextUsers);
      clearUserWishlistStorage(userId);

      return { ok: true };
    },
    [sessionUserId],
  );

  const loginAsDemo = useCallback((role: UserRole): AuthActionResult => {
    const currentUsers = loadUsers();
    const target =
      role === "admin"
        ? currentUsers.find((u) => u.role === "admin")
        : currentUsers.find((u) => u.role === "guest") ?? DEFAULT_USERS[1];

    if (!target) {
      return { ok: false, error: "No hay un perfil demo disponible para ese rol." };
    }

    const existsInStore = currentUsers.some((u) => u.id === target.id);
    const nextUsers = existsInStore ? currentUsers : [...currentUsers, target];
    if (!existsInStore) {
      saveUsers(nextUsers);
    }

    setRegisteredUsers(nextUsers);
    saveSessionUserId(target.id);
    setSessionUserId(target.id);

    return { ok: true, user: stripPassword(target) };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      users,
      isAuthenticated: user !== null,
      isAdmin: user?.role === "admin",
      isGuest: user?.role === "guest",
      login,
      register,
      logout,
      updateProfile,
      deleteUser,
      loginAsDemo,
    }),
    [user, users, login, register, logout, updateProfile, deleteUser, loginAsDemo],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
