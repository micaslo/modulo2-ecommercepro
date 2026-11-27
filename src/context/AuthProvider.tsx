import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthContext } from "./authContext";
import { stripDigits } from "../data/checkoutConfig";
import { clearUserWishlistStorage } from "../utils/wishlist";
import { clearUserCartStorage } from "../utils/cartStorage";
import type {
  AuthActionResult,
  AuthContextValue,
  DeleteUserResult,
  ProfileUpdatePayload,
  RegisteredUser,
  RegisterPayload,
  SavedCard,
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
    email: "admin@tiendaliebre.com",
    phone: "3815550100",
    address: "Av. Aconquija 1200",
    locality: "Yerba Buena",
    province: "Tucumán",
    postalCode: "4107",
    fiscalCondition: "responsable_inscripto",
    dni: "36445120",
    cuit: "27-36445120-4",
    businessName: "Tienda Liebre S.A.",
    savedCard: null,
    password: "Admin1234",
    role: "admin",
    createdAt: "2026-01-15T10:00:00.000Z",
    isProtected: true,
  },
  {
    id: "guest-demo-1",
    firstName: "Micaela",
    lastName: "Soraire",
    name: "Micaela Soraire",
    email: "mmicaslo@gmail.com",
    phone: "3815550240",
    address: "Calle Wallaby 42",
    locality: "San Miguel de Tucumán",
    province: "Tucumán",
    postalCode: "4000",
    fiscalCondition: "consumidor_final",
    dni: "42589123",
    savedCard: {
      number: "4509 9535 6623 1904",
      name: "MICAELA SORAIRE",
      expiry: "08/29",
      cvc: "428",
    },
    password: "Invitado123",
    role: "guest",
    createdAt: "2026-03-20T14:30:00.000Z",
  },
  {
    id: "guest-demo-2",
    firstName: "Juan Pablo",
    lastName: "Reyes",
    name: "Juan Pablo Reyes",
    email: "juan.reyes@gmail.com",
    phone: "3815550891",
    address: "25 de Mayo 450",
    locality: "San Miguel de Tucumán",
    province: "Tucumán",
    postalCode: "4000",
    fiscalCondition: "responsable_inscripto",
    dni: "40112876",
    cuit: "20-40112876-3",
    businessName: "Rorro Pirroro SA",
    savedCard: {
      number: "5425 2334 3010 9903",
      name: "JUAN PABLO REYES",
      expiry: "06/29",
      cvc: "319",
    },
    password: "Invitado456",
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

    let migrated = false;
    const updatedUsers = validUsers.map((u) => {
      if (u.id === "guest-demo-1") {
        const isLegacyGuest1 =
          u.name === "Mateo Gómez" ||
          u.email === "micaela.soraire@detodito.com" ||
          !u.address ||
          u.address === "P. Sherman, Calle Wallaby 42, Sídney.";
        if (isLegacyGuest1) {
          migrated = true;
          return {
            ...DEFAULT_USERS[1],
            savedCard: u.savedCard ?? DEFAULT_USERS[1].savedCard,
          };
        }
      }
      if (u.id === "guest-demo-2") {
        const isLegacyGuest2 =
          u.name === "Valentina Ruiz" ||
          !u.address ||
          u.fiscalCondition !== "responsable_inscripto" ||
          !u.cuit ||
          !u.businessName;
        if (isLegacyGuest2) {
          migrated = true;
          return {
            ...DEFAULT_USERS[2],
            savedCard: u.savedCard ?? DEFAULT_USERS[2].savedCard,
          };
        }
      }
      if (u.id === "admin-root-1") {
        const isLegacyAdmin =
          !u.address ||
          u.email === "admin@detodito.com" ||
          u.businessName === "Detodito Market S.A.";
        if (isLegacyAdmin) {
          migrated = true;
          return {
            ...DEFAULT_USERS[0],
            savedCard: null,
          };
        }
      }
      if (u.role === "admin" && u.savedCard) {
        migrated = true;
        return {
          ...u,
          savedCard: null,
        };
      }
      return u;
    });

    const hasRootAdmin = updatedUsers.some((u) => u.id === DEFAULT_USERS[0].id);
    if (!hasRootAdmin) {
      const merged = [DEFAULT_USERS[0], ...updatedUsers];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }

    if (migrated) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    }

    return updatedUsers;
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
    const cleanPhone = payload.phone ? stripDigits(payload.phone) : "";
    const newUser: RegisteredUser = {
      id: generateUserId(),
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
      email: normalizedEmail,
      phone: cleanPhone || undefined,
      fiscalCondition: "consumidor_final",
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

  const resetPassword = useCallback(
    (email: string, newPassword: string): AuthActionResult => {
      const currentUsers = loadUsers();
      const targetEmail = normalizeEmail(email);
      const targetIndex = currentUsers.findIndex(
        (u) => normalizeEmail(u.email) === targetEmail,
      );

      if (targetIndex === -1) {
        return {
          ok: false,
          error:
            "No encontramos ninguna cuenta registrada con ese correo electrónico.",
        };
      }

      const updatedUser: RegisteredUser = {
        ...currentUsers[targetIndex],
        password: newPassword,
      };
      const nextUsers = currentUsers.map((u, idx) =>
        idx === targetIndex ? updatedUser : u,
      );
      saveUsers(nextUsers);
      setRegisteredUsers(nextUsers);

      return { ok: true, user: stripPassword(updatedUser) };
    },
    [],
  );

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

      const normalizedEmail = normalizeEmail(payload.email);
      const emailTaken = currentUsers.some(
        (u) =>
          u.id !== sessionUserId && normalizeEmail(u.email) === normalizedEmail,
      );
      if (emailTaken) {
        return {
          ok: false,
          error: "Ya existe otro usuario registrado con ese correo electrónico.",
        };
      }

      const firstName = payload.firstName.trim();
      const lastName = payload.lastName.trim();
      const cleanPhone = payload.phone ? stripDigits(payload.phone) : "";
      const fiscalCondition = payload.fiscalCondition ?? "consumidor_final";

      const updatedUser: RegisteredUser = {
        ...currentUsers[targetIndex],
        firstName,
        lastName,
        name: `${firstName} ${lastName}`.trim(),
        email: normalizedEmail,
        phone: cleanPhone || undefined,
        address: payload.address?.trim() || undefined,
        locality: payload.locality?.trim() || undefined,
        province: payload.province?.trim() || undefined,
        postalCode: payload.postalCode?.trim().toUpperCase() || undefined,
        fiscalCondition,
        dni: payload.dni ? stripDigits(payload.dni) : undefined,
        cuit:
          fiscalCondition === "consumidor_final"
            ? undefined
            : payload.cuit?.trim() || undefined,
        businessName:
          fiscalCondition === "responsable_inscripto" ||
          fiscalCondition === "exento"
            ? payload.businessName?.trim() || undefined
            : undefined,
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

  const updateSavedCard = useCallback(
    (card: SavedCard | null): AuthActionResult => {
      if (!sessionUserId) {
        return { ok: false, error: "No hay una sesión activa." };
      }

      const currentUsers = loadUsers();
      const targetIndex = currentUsers.findIndex((u) => u.id === sessionUserId);
      if (targetIndex === -1) {
        return { ok: false, error: "No se encontró el usuario activo." };
      }
      if (currentUsers[targetIndex].role === "admin") {
        return {
          ok: false,
          error: "Las cuentas de administrador no tienen tarjeta asociada.",
        };
      }

      const updatedUser: RegisteredUser = {
        ...currentUsers[targetIndex],
        savedCard: card,
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
      clearUserCartStorage(userId);

      return { ok: true };
    },
    [sessionUserId],
  );

  const loginAsDemo = useCallback(
    (role: UserRole, userId?: string): AuthActionResult => {
      const currentUsers = loadUsers();
      const target = userId
        ? currentUsers.find((u) => u.id === userId) ??
          DEFAULT_USERS.find((u) => u.id === userId)
        : role === "admin"
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
      login,
      register,
      resetPassword,
      logout,
      updateProfile,
      updateSavedCard,
      deleteUser,
      loginAsDemo,
    }),
    [
      user,
      users,
      login,
      register,
      resetPassword,
      logout,
      updateProfile,
      updateSavedCard,
      deleteUser,
      loginAsDemo,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
