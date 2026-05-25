import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AppLayout from "../../components/layouts/AppLayout";
import type { NextPageWithLayout } from "../../types/next";
import { useCourseModulesQuery } from "@/features/courses/courses.queries";
import { useEvaluationsQuery } from "@/features/evaluations/evaluations.queries";
import {
  useDeleteModuleMutation,
  useUpdateModuleStatusMutation,
} from "@/features/modules/modules.mutations";
import { coursesKeys } from "@/features/courses/courses.query-keys";
import { useQueryClient } from "@tanstack/react-query";
import { getUserFacingMessage } from "@/lib/http/error";
import { deleteSession } from "../../services/sessionService";
import { Session } from "../../interfaces/Session";
import { Disclosure } from "@headlessui/react";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  PencilIcon,
  CheckCircleIcon,
  TrashIcon,
  ClipboardIcon,
  XMarkIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import ModalConfirmation from "../../components/ModalConfirmation";
import useModal from "../../hooks/ui/useModal";
import Modal from "../../components/Admin/Modal";
import AddModuleForm from "./addModule";
import EditModuleForm from "./editModule";
import { toast } from "sonner";

const ModulesPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const courseId = id ? Number(id) : undefined;
  const queryClient = useQueryClient();

  const modulesQuery = useCourseModulesQuery(courseId);
  const evaluationsQuery = useEvaluationsQuery();
  const deleteModuleMutation = useDeleteModuleMutation();
  const updateModuleStatusMutation = useUpdateModuleStatusMutation();

  const modules = modulesQuery.data ?? [];
  const evaluations = evaluationsQuery.data ?? [];

  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [moduleToDelete, setModuleToDelete] = useState<number | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<number | null>(null);
  const [moduleToEdit, setModuleToEdit] = useState<number | null>(null);

  const {
    isVisible: isModuleModalVisible,
    showModal: showModuleModal,
    hideModal: hideModuleModal,
  } = useModal();
  const {
    isVisible: isSessionModalVisible,
    showModal: showSessionModal,
    hideModal: hideSessionModal,
  } = useModal();
  const {
    isVisible: isAddModuleModalVisible,
    showModal: showAddModuleModal,
    hideModal: hideAddModuleModal,
  } = useModal();
  const {
    isVisible: isEditModuleModalVisible,
    showModal: showEditModuleModal,
    hideModal: hideEditModuleModal,
  } = useModal();

  useEffect(() => {
    if (router.isReady && router.query.success) {
      toast.success(router.query.success as string);
      router.replace({ query: { id: router.query.id } }, undefined, {
        shallow: true,
      });
    }
  }, [router.isReady]);

  const handleDeleteModule = async () => {
    if (moduleToDelete === null) return;
    try {
      await deleteModuleMutation.mutateAsync({
        moduleId: moduleToDelete,
        courseId,
      });
      toast.success("Módulo eliminado correctamente");
      setModuleToDelete(null);
      hideModuleModal();
    } catch (err) {
      toast.error(getUserFacingMessage(err) ?? "Error al eliminar el módulo");
    }
  };

  const handleDeleteSession = async () => {
    if (sessionToDelete === null) return;
    try {
      await deleteSession(sessionToDelete);
      if (typeof courseId === "number") {
        queryClient.invalidateQueries({
          queryKey: coursesKeys.modules(courseId),
        });
      }
      toast.success("Sesión eliminada correctamente");
      setSessionToDelete(null);
      setSelectedSession(null);
      hideSessionModal();
    } catch (err) {
      toast.error(getUserFacingMessage(err) ?? "Error al eliminar la sesión");
    }
  };

  const getEvaluationName = (evaluation_id: number) =>
    evaluations.find((e) => e.evaluation_id === evaluation_id)?.name ?? "N/A";

  const handleToggleModuleStatus = async (
    moduleId: number,
    currentStatus: boolean,
  ) => {
    try {
      await updateModuleStatusMutation.mutateAsync({
        moduleId,
        isActive: !currentStatus,
        courseId,
      });
      toast.info(`Módulo ${!currentStatus ? "activado" : "desactivado"}`);
    } catch (err) {
      toast.error(
        getUserFacingMessage(err) ?? "Error al cambiar el estado del módulo",
      );
    }
  };

  if (modulesQuery.isLoading || evaluationsQuery.isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-xl">
            <div className="flex justify-between items-center px-6 py-4">
              <div className="h-4 w-48 bg-gray-200 rounded" />
              <div className="flex gap-2">
                <div className="h-7 w-28 bg-gray-200 rounded-lg" />
                <div className="h-5 w-5 bg-gray-200 rounded" />
                <div className="h-5 w-5 bg-gray-200 rounded" />
                <div className="h-5 w-5 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (modulesQuery.isError) {
    return (
      <p className="text-gray-500 text-center mt-20">
        {getUserFacingMessage(modulesQuery.error) ??
          "Error al cargar los módulos."}
      </p>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Módulos</h2>
        <button
          onClick={showAddModuleModal}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Añadir Módulo
        </button>
      </div>

      {modules.length === 0 ? (
        <p className="text-gray-400 text-center mt-20">
          No hay módulos disponibles.
        </p>
      ) : (
        <div className="flex gap-4">
          <div
            className={`space-y-4 mb-10 transition-all duration-300 ease-in-out ${
              selectedSession ? "w-2/5" : "w-full"
            }`}
          >
            {modules.map((module) => (
              <div
                key={module.module_id}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <Disclosure defaultOpen={true}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex justify-between items-center w-full px-6 py-4 text-sm font-medium text-left bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none">
                        <div className="flex items-center gap-2">
                          {open ? (
                            <ChevronUpIcon className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-gray-900 font-medium">
                            {module.name}
                          </span>
                        </div>
                        <div
                          className="flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Link
                            href={`/content/addSession?moduleId=${module.module_id}`}
                            className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <PlusIcon className="w-3.5 h-3.5" />
                            Añadir Sesión
                          </Link>
                          <button
                            title="Editar módulo"
                            onClick={() => {
                              setModuleToEdit(module.module_id);
                              showEditModuleModal();
                            }}
                          >
                            <PencilIcon className="w-5 h-5 text-blue-500 hover:text-blue-700 transition-colors cursor-pointer" />
                          </button>
                          <button
                            title="Eliminar módulo"
                            onClick={() => {
                              setModuleToDelete(module.module_id);
                              showModuleModal();
                            }}
                          >
                            <TrashIcon className="w-5 h-5 text-red-400 hover:text-red-600 transition-colors cursor-pointer" />
                          </button>
                          <button
                            title={
                              module.is_active
                                ? "Desactivar módulo"
                                : "Activar módulo"
                            }
                            onClick={() =>
                              handleToggleModuleStatus(
                                module.module_id,
                                module.is_active,
                              )
                            }
                          >
                            <CheckCircleIcon
                              className={`w-6 h-6 cursor-pointer transition-colors ${
                                module.is_active
                                  ? "text-green-500 hover:text-green-700"
                                  : "text-gray-400 hover:text-gray-600"
                              }`}
                            />
                          </button>
                        </div>
                      </Disclosure.Button>

                      <Disclosure.Panel className="px-6 py-4 bg-white">
                        <div className="flex flex-col space-y-1">
                          {module.moduleSessions?.length ? (
                            module.moduleSessions.map((session) => (
                              <div
                                key={session.session_id}
                                className={`flex items-center cursor-pointer px-3 py-2 rounded-lg transition-colors ${
                                  selectedSession?.session_id ===
                                  session.session_id
                                    ? "bg-blue-50 text-blue-700"
                                    : "hover:bg-gray-50 text-gray-700"
                                }`}
                                onClick={() => setSelectedSession(session)}
                              >
                                <div className="flex flex-col">
                                  <p className="text-sm font-medium">
                                    {session.name}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {session.duracion_minutos} mins
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-400">
                              No hay sesiones disponibles
                            </p>
                          )}
                        </div>
                        <hr className="my-4 border-gray-100" />
                        <Link
                          href={`/content/evaluation/detailEvaluation?id=${module.evaluation_id}`}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
                        >
                          <ClipboardIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium">
                            {getEvaluationName(module.evaluation_id)}
                          </span>
                        </Link>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </div>
            ))}
          </div>

          {selectedSession && (
            <aside className="w-3/5 bg-white rounded-xl border border-gray-100 shadow-sm p-5 self-start">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-semibold text-gray-900">
                  {selectedSession.name}
                </h2>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/content/editSession?id=${selectedSession.session_id}`}
                    title="Editar sesión"
                  >
                    <PencilIcon className="w-5 h-5 text-blue-500 hover:text-blue-700 transition-colors cursor-pointer" />
                  </Link>
                  <button
                    title="Eliminar sesión"
                    onClick={() => {
                      setSessionToDelete(selectedSession.session_id);
                      showSessionModal();
                    }}
                  >
                    <TrashIcon className="w-5 h-5 text-red-400 hover:text-red-600 transition-colors cursor-pointer" />
                  </button>
                  <button
                    title="Cerrar"
                    onClick={() => setSelectedSession(null)}
                  >
                    <XMarkIcon className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" />
                  </button>
                </div>
              </div>

              {selectedSession.video_enlace ? (
                <video
                  src={selectedSession.video_enlace}
                  controls
                  className="w-full rounded-lg bg-black"
                />
              ) : (
                <p className="text-sm text-gray-400 text-center py-8">
                  Esta sesión no tiene video asociado.
                </p>
              )}

              <p className="text-xs text-gray-400 mt-3">
                {selectedSession.duracion_minutos} min
              </p>
            </aside>
          )}
        </div>
      )}

      <ModalConfirmation
        show={isModuleModalVisible}
        onClose={hideModuleModal}
        onConfirm={handleDeleteModule}
      />
      <ModalConfirmation
        show={isSessionModalVisible}
        onClose={hideSessionModal}
        onConfirm={handleDeleteSession}
      />
      <Modal
        show={isAddModuleModalVisible}
        onClose={hideAddModuleModal}
        title="Añadir Módulo"
      >
        <AddModuleForm
          courseId={Number(id)}
          onClose={hideAddModuleModal}
          onSuccess={() => {
            hideAddModuleModal();
            toast.success("Módulo creado exitosamente");
          }}
        />
      </Modal>
      {moduleToEdit !== null && (
        <Modal
          show={isEditModuleModalVisible}
          onClose={hideEditModuleModal}
          title="Editar Módulo"
        >
          <EditModuleForm
            moduleId={moduleToEdit.toString()}
            onClose={hideEditModuleModal}
            onSuccess={() => {
              hideEditModuleModal();
              toast.success("Módulo actualizado exitosamente");
            }}
          />
        </Modal>
      )}
    </>
  );
};

ModulesPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default ModulesPage;
