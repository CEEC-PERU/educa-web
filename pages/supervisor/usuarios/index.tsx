import React, { useState, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/router";
import FormField from "@/components/FormField";
import UserForm from "@/components/supervisor/UserForm";
import Modal from "@/components/Admin/Modal";
import ModalConfirmation from "@/components/ModalConfirmation";
import { Student } from "@/interfaces/User/UsuariosSupervisor";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  UserGroupIcon,
  EyeIcon,
  TrashIcon,
  ArrowPathIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import {
  useClassroomStudentsQuery,
  useUserCountQuery,
} from "@/features/users/users.queries";
import {
  useDeleteUserMutation,
  useReactivateUserMutation,
  useResetPasswordMutation,
} from "@/features/users/users.mutations";
import AppLayout from "../../../components/layouts/AppLayout";
import type { NextPageWithLayout } from "../../../types/next";

const STUDENT_ROLE_ID = 1;

const Usuarios: NextPageWithLayout = () => {
  const router = useRouter();
  const { user } = useAuth();
  const userInfo = user as { id: number; enterprise_id: number } | null;

  const userId = userInfo?.id;
  const enterpriseId = userInfo?.enterprise_id;

  const studentsQuery = useClassroomStudentsQuery(userId, enterpriseId);
  const userCountQuery = useUserCountQuery(enterpriseId);
  const deleteUserMutation = useDeleteUserMutation(userId, enterpriseId);
  const reactivateUserMutation = useReactivateUserMutation(userId, enterpriseId);
  const resetPasswordMutation = useResetPasswordMutation(userId, enterpriseId);

  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [showActive, setShowActive] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Student | null>(null);
  const [userToReactivate, setUserToReactivate] = useState<Student | null>(null);
  const [userToReset, setUserToReset] = useState<Student | null>(null);

  const PAGE_SIZE = 20;

  const userCountResult = userCountQuery.data ?? null;
  const isLoading = studentsQuery.isLoading || userCountQuery.isLoading;

  const filteredStudents =
    studentsQuery.data?.students?.filter(
      (student) =>
        student.User.is_active === showActive &&
        (student.User.userProfile?.first_name
          ?.toLowerCase()
          .includes(filter.toLowerCase()) ||
          student.User.userProfile?.last_name
            ?.toLowerCase()
            .includes(filter.toLowerCase()) ||
          student.User.dni.includes(filter)),
    ) ?? [];

  const totalPages = Math.ceil(filteredStudents.length / PAGE_SIZE);
  const paginatedStudents = filteredStudents.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE,
  );

  useEffect(() => {
    setPage(0);
  }, [filter, showActive]);

  const slotsAvailable = userCountResult
    ? Number(userCountResult.maxUserCount) - userCountResult.UserCount
    : 0;

  const handleUserCreateSuccess = async () => {
    setIsModalOpen(false);
    toast.success("Usuario registrado correctamente.");
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    try {
      await deleteUserMutation.mutateAsync(userToDelete.User.user_id);
      toast.success("Usuario desactivado correctamente.");
    } catch {
      toast.error("Error al desactivar el usuario.");
    } finally {
      setUserToDelete(null);
    }
  };

  const handleResetPasswordConfirm = async () => {
    if (!userToReset) return;
    try {
      await resetPasswordMutation.mutateAsync(userToReset.User.user_id);
      toast.success("Contraseña restablecida al DNI del usuario.");
    } catch {
      toast.error("Error al restablecer la contraseña.");
    } finally {
      setUserToReset(null);
    }
  };

  const handleReactivateConfirm = async () => {
    if (!userToReactivate) return;
    try {
      await reactivateUserMutation.mutateAsync(userToReactivate.User.user_id);
      toast.success("Usuario reactivado correctamente.");
    } catch {
      toast.error("Error al reactivar el usuario.");
    } finally {
      setUserToReactivate(null);
    }
  };

  const handleFilterChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setFilter(e.target.value);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          {userCountResult && (
            <p className="mt-1 text-sm text-gray-500">
              {userCountResult.UserCount} de {userCountResult.maxUserCount}{" "}
              licencias utilizadas
            </p>
          )}
        </div>

        {userCountResult && (
          <div className="flex items-center gap-4">
            <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 flex items-center gap-3 shadow-sm">
              <UserGroupIcon className="h-6 w-6 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Licencias</p>
                <p className="text-xl font-bold text-gray-900">
                  {userCountResult.UserCount}
                  <span className="text-gray-400 font-normal text-base">
                    {" "}
                    / {userCountResult.maxUserCount}
                  </span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              disabled={slotsAvailable <= 0}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              + Agregar Usuario
            </button>
          </div>
        )}
      </div>

      <div className="mb-4 flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
        <button
          onClick={() => setShowActive(true)}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
            showActive
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Activos
        </button>
        <button
          onClick={() => setShowActive(false)}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
            !showActive
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Inactivos
        </button>
      </div>

      <div className="mb-6 max-w-sm">
        <FormField
          id="filter"
          label="Buscar por nombre, apellido o DNI"
          type="text"
          value={filter}
          className="text-black"
          onChange={handleFilterChange}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <UserGroupIcon className="mx-auto h-10 w-10 mb-3 text-gray-300" />
            <p className="text-sm">
              {filter
                ? "No se encontraron usuarios con ese criterio."
                : showActive
                  ? "No hay usuarios activos."
                  : "No hay usuarios inactivos."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12" />
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Apellido
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DNI
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Perfil
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedStudents.map((student) => {
                  const profile = student.User.userProfile;
                  return (
                    <tr
                      key={student.User.user_id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="h-9 w-9 shrink-0 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                          {profile?.profile_picture ? (
                            <img
                              src={profile.profile_picture}
                              alt="Foto"
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://res.cloudinary.com/dk2red18f/image/upload/v1713896612/CEEC/PERFIL/egwjjcrs2aon5hhtxabj.png";
                              }}
                            />
                          ) : (
                            <UserGroupIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 uppercase">
                        {profile?.first_name ?? (
                          <span className="text-gray-300 normal-case">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 uppercase">
                        {profile?.last_name ?? (
                          <span className="text-gray-300 normal-case">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 font-mono">
                        {student.User.dni}
                      </td>
                      <td className="px-4 py-3">
                        {profile ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Completo
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            Pendiente
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {profile && (
                            <button
                              onClick={() =>
                                router.push(
                                  `/supervisor/usuarios/view-user/${student.User.user_id}`,
                                )
                              }
                              className="text-blue-500 hover:text-blue-700 transition-colors"
                              title="Ver perfil"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                          )}
                          {student.User.is_active && profile && (
                            <button
                              onClick={() => setUserToReset(student)}
                              className="text-amber-500 hover:text-amber-700 transition-colors"
                              title="Restablecer contraseña"
                            >
                              <KeyIcon className="h-4 w-4" />
                            </button>
                          )}
                          {student.User.is_active ? (
                            <button
                              onClick={() => setUserToDelete(student)}
                              className="text-red-400 hover:text-red-600 transition-colors"
                              title="Desactivar"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => setUserToReactivate(student)}
                              className="text-green-500 hover:text-green-700 transition-colors"
                              title="Reactivar"
                            >
                              <ArrowPathIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && filteredStudents.length > PAGE_SIZE && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              {page * PAGE_SIZE + 1}–
              {Math.min((page + 1) * PAGE_SIZE, filteredStudents.length)} de{" "}
              {filteredStudents.length} usuarios
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 0}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                    i === page
                      ? "bg-blue-600 text-white font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages - 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar nuevo usuario"
      >
        {userCountResult && (
          <UserForm
            roleId={STUDENT_ROLE_ID}
            maxUsersAllowed={slotsAvailable}
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleUserCreateSuccess}
          />
        )}
      </Modal>

      <ModalConfirmation
        show={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />

      <ModalConfirmation
        show={!!userToReactivate}
        onClose={() => setUserToReactivate(null)}
        onConfirm={handleReactivateConfirm}
        message="¿Estás seguro que deseas reactivar este usuario?"
        confirmLabel="Sí, reactivar"
        confirmClassName="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 focus:outline-none"
      />

      <ModalConfirmation
        show={!!userToReset}
        onClose={() => setUserToReset(null)}
        onConfirm={handleResetPasswordConfirm}
        message={`¿Restablecer la contraseña de ${userToReset?.User.userProfile?.first_name ?? "este usuario"}? Se usará su DNI como nueva contraseña.`}
        confirmLabel="Sí, restablecer"
        confirmClassName="text-white bg-amber-500 hover:bg-amber-700 focus:ring-4 focus:ring-amber-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 focus:outline-none"
      />
    </>
  );
};

Usuarios.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Usuarios;
