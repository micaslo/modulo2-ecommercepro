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
    <section className="adminSection" aria-label="Tabla de usuarios registrados">
      <div className="adminToolbar">
        <label className="adminSearch">
          <span className="adminSrOnly">Buscar usuario</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nombre o correo..."
          />
        </label>

        <label className="adminSelect">
          <span className="adminSrOnly">Filtrar por rol</span>
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

        <span className="adminToolbarCount">
          {visibleUsers.length} de {users.length} usuarios
        </span>
      </div>

      {visibleUsers.length === 0 ? (
        <div className="adminEmpty">
          No se encontraron usuarios con esos filtros.
        </div>
      ) : (
        <div className="adminTableWrap">
          <table className="adminTable">
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
                      <div className="adminUserCell">
                        <span
                          className={`adminUserAvatar ${
                            entry.role === "admin" ? "isAdmin" : ""
                          }`}
                          aria-hidden="true"
                        >
                          {initials}
                        </span>
                        <div>
                          <strong>
                            {entry.name}{" "}
                            {isSelf && (
                              <span className="adminSelfTag">(Vos)</span>
                            )}
                          </strong>
                        </div>
                      </div>
                    </td>
                    <td>{entry.email}</td>
                    <td>{entry.phone ?? "—"}</td>
                    <td>
                      <span
                        className={`adminRolePill ${
                          entry.role === "admin" ? "isAdmin" : "isGuest"
                        }`}
                      >
                        {entry.role === "admin" ? "Administrador" : "Invitado"}
                      </span>
                    </td>
                    <td>{formatDate(entry.createdAt)}</td>
                    <td>
                      <button
                        type="button"
                        className="adminActionBtn adminActionBtnDelete"
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
