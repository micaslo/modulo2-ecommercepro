import { useMemo, useState } from "react";
import type { SessionUser, UserRole } from "../../types/auth";

interface UsersTableProps {
  users: SessionUser[];
  currentUserId: string;
  onRequestDelete: (user: SessionUser) => void;
}

function formatDate(isoDate: string): string {
  try {
    return new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}

export default function UsersTable({
  users,
  currentUserId,
  onRequestDelete,
}: UsersTableProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");

  const visibleUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (!query) return true;
      return (
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
      );
    });
  }, [users, search, roleFilter]);

  return (
    <section className="admin-section" aria-label="Tabla de usuarios registrados">
      <div className="admin-toolbar">
        <label className="admin-search">
          <span className="admin-sr-only">Buscar usuario</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nombre o correo..."
          />
        </label>

        <label className="admin-select">
          <span className="admin-sr-only">Filtrar por rol</span>
          <select
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(event.target.value as "all" | UserRole)
            }
          >
            <option value="all">Todos los perfiles</option>
            <option value="guest">Invitado</option>
            <option value="admin">Administrador</option>
          </select>
        </label>

        <span className="admin-toolbar-count">
          {visibleUsers.length} de {users.length} usuarios
        </span>
      </div>

      {visibleUsers.length === 0 ? (
        <div className="admin-empty">
          No se encontraron usuarios con esos filtros.
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Correo electrónico</th>
                <th>Teléfono</th>
                <th>Perfil</th>
                <th>Alta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((entry) => {
                const isSelf = entry.id === currentUserId;
                const cannotDelete = Boolean(entry.isProtected) || isSelf;
                const initials =
                  `${entry.firstName.charAt(0)}${entry.lastName.charAt(0)}`.toUpperCase() ||
                  "U";

                return (
                  <tr key={entry.id}>
                    <td>
                      <div className="admin-user-cell">
                        <span
                          className={`admin-user-avatar ${
                            entry.role === "admin" ? "is-admin" : ""
                          }`}
                          aria-hidden="true"
                        >
                          {initials}
                        </span>
                        <div>
                          <strong>
                            {entry.name}{" "}
                            {isSelf && (
                              <span className="admin-self-tag">(Vos)</span>
                            )}
                          </strong>
                        </div>
                      </div>
                    </td>
                    <td>{entry.email}</td>
                    <td>{entry.phone ?? "—"}</td>
                    <td>
                      <span
                        className={`admin-role-pill ${
                          entry.role === "admin" ? "is-admin" : "is-guest"
                        }`}
                      >
                        {entry.role === "admin" ? "Administrador" : "Invitado"}
                      </span>
                    </td>
                    <td>{formatDate(entry.createdAt)}</td>
                    <td>
                      <button
                        type="button"
                        className="admin-action-btn admin-action-btn--delete"
                        disabled={cannotDelete}
                        title={
                          entry.isProtected
                            ? "El administrador principal está protegido"
                            : isSelf
                              ? "No podés eliminar tu propia cuenta activa"
                              : `Eliminar a ${entry.name}`
                        }
                        onClick={() => onRequestDelete(entry)}
                      >
                        {cannotDelete ? "Protegido" : "Eliminar"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
