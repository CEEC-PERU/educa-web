import React, { useState } from "react";
import { useRouter } from "next/router";
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
import ButtonComponent from "../../components/ButtonComponent";
import { Module } from "../../interfaces/Module";
import Link from "next/link";
import { Disclosure } from "@headlessui/react";
import FloatingButton from "../../components/FloatingButton";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  PencilIcon,
  CheckCircleIcon,
  TrashIcon,
  ClipboardIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import ModalConfirmation from "../../components/ModalConfirmation";
import useModal from "../../hooks/ui/useModal";
import AlertComponent from "../../components/AlertComponent";
import Modal from "../../components/Admin/Modal";
import AddModuleForm from "./addModule";
import EditModuleForm from "./editModule";
import ReactTooltip from "react-tooltip";
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

  const [error, setError] = useState<string | null>(
    modulesQuery.isError || evaluationsQuery.isError
      ? "Error fetching modules and evaluations"
      : null,
  );
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [moduleToDelete, setModuleToDelete] = useState<number | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<number | null>(null);
  const [moduleToEdit, setModuleToEdit] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
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

  React.useEffect(() => {
    if (router.query.success) {
      setSuccessMessage(router.query.success as string);
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  }, [router.query.success]);

  const handleDeleteModule = async () => {
    if (moduleToDelete !== null) {
      try {
        await deleteModuleMutation.mutateAsync({
          moduleId: moduleToDelete,
          courseId,
        });
        setSuccessMessage("Registro eliminado correctamente");
        setTimeout(() => setSuccessMessage(null), 5000);
        setModuleToDelete(null);
        hideModuleModal();
      } catch (err) {
        console.error("Error deleting module:", err);
        setError(getUserFacingMessage(err));
      }
    }
  };

  const handleDeleteSession = async () => {
    if (sessionToDelete !== null) {
      try {
        await deleteSession(sessionToDelete);
        if (typeof courseId === "number") {
          queryClient.invalidateQueries({
            queryKey: coursesKeys.modules(courseId),
          });
        }
        setSuccessMessage("Registro eliminado correctamente");
        setTimeout(() => setSuccessMessage(null), 5000);
        setSessionToDelete(null);
        hideSessionModal();
      } catch (err) {
        console.error("Error deleting session:", err);
        setError(getUserFacingMessage(err));
      }
    }
  };

  const getEvaluationName = (evaluation_id: number) => {
    const evaluation = evaluations.find(
      (e) => e.evaluation_id === evaluation_id,
    );
    return evaluation ? evaluation.name : "N/A";
  };

  const handleCloseSession = () => {
    setSelectedSession(null);
  };

  const handleAddModuleSuccess = () => {
    hideAddModuleModal();
    setSuccessMessage("Módulo creado exitosamente.");
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleEditModuleSuccess = () => {
    hideEditModuleModal();
    setSuccessMessage("Módulo actualizado exitosamente.");
    setTimeout(() => setSuccessMessage(null), 5000);
  };

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
      setStatusMessage(`Módulo ${!currentStatus ? "activado" : "desactivado"}`);
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err) {
      console.error("Error updating module status:", err);
      setError(getUserFacingMessage(err));
    }
  };

  return (
    <>
      {successMessage && (
        <AlertComponent
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
      {statusMessage && (
        <AlertComponent
          type="info" // Azul para información
          message={statusMessage}
          onClose={() => setStatusMessage(null)}
        />
      )}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Módulos</h2>
        <FloatingButton onClick={showAddModuleModal} label="Añadir Módulo" />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex">
        <div
          className={`space-y-4 mb-10 transition-all duration-300 ease-in-out ${
            selectedSession ? "w-2/5" : "w-full"
          }`}
        >
          {modules.map((module) => (
            <div
              key={module.module_id}
              className="border border-gray-300 rounded-lg"
            >
              <Disclosure defaultOpen={true}>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex justify-between items-center w-full px-6 py-4 text-sm font-medium text-left text-purple-1000 bg-gradient-purple focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 rounded-t-lg">
                      <div className="flex items-center">
                        {open ? (
                          <ChevronUpIcon className="w-5 h-5 text-purple-500 mr-2" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 text-purple-500 mr-2" />
                        )}
                        <span className="flex-grow">{module.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex justify-between items-center mr-2">
                          <ButtonComponent
                            buttonLabel="Añadir Sesión"
                            buttonroute={`/content/addSession?moduleId=${module.module_id}`}
                            backgroundColor="bg-gradient-blue"
                            textColor="text-white"
                            fontSize="text-xs"
                            buttonSize="py-2 px-7"
                          />
                        </div>
                        <button
                          onClick={() => {
                            setModuleToEdit(module.module_id);
                            showEditModuleModal();
                          }}
                        >
                          <PencilIcon className="w-6 h-5 text-blue-500 cursor-pointer" />
                        </button>
                        <button
                          onClick={() => {
                            setModuleToDelete(module.module_id);
                            showModuleModal();
                          }}
                        >
                          <TrashIcon className="w-6 h-5 text-red-500 cursor-pointer" />
                        </button>
                        <button
                          onClick={() =>
                            handleToggleModuleStatus(
                              module.module_id,
                              module.is_active,
                            )
                          }
                          data-tooltip-id={`statusTooltip-${module.module_id}`}
                          data-tooltip-content={
                            module.is_active ? "Desactivar" : "Activar"
                          }
                        >
                          {module.is_active ? (
                            <CheckCircleIcon className="w-7 h-7 text-green-500 cursor-pointer" />
                          ) : (
                            <CheckCircleIcon className="w-7 h-7 text-gray-500 cursor-pointer" />
                          )}
                        </button>
                        <ReactTooltip
                          id={`statusTooltip-${module.module_id}`}
                          place="top"
                        />
                      </div>
                    </Disclosure.Button>
                    <Disclosure.Panel className="text-m text-gray-700 px-6 py-4 rounded-b-lg">
                      <div className="flex flex-col space-y-2">
                        {module.moduleSessions?.length ? (
                          module.moduleSessions.map((session) => (
                            <div
                              key={session.session_id}
                              className={`flex items-center cursor-pointer hover:bg-purple-100 p-2 rounded ${
                                selectedSession?.session_id ===
                                session.session_id
                                  ? "bg-purple-200"
                                  : ""
                              }`}
                              onClick={() => setSelectedSession(session)}
                            >
                              <div className="flex flex-col">
                                <p className="font-medium">{session.name}</p>
                                <p className="text-xs text-gray-500">
                                  {session.duracion_minutos} mins
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p>No hay sesiones disponibles</p>
                        )}
                      </div>
                      <hr className="my-4" />
                      <Link
                        href={`/content/evaluation/detailEvaluation?id=${module.evaluation_id}`}
                      >
                        <p className="flex items-center py-4 px-6 mt-6 hover:bg-gray-100 rounded-lg">
                          <ClipboardIcon className="w-5 h-5 text-gray-500 mr-2" />
                          <strong>
                            <span className="ml-2">
                              {getEvaluationName(module.evaluation_id)}
                            </span>
                          </strong>
                        </p>
                      </Link>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>
          ))}
        </div>
        {selectedSession && (
          <aside className="w-3/5 bg-white p-4 border-l border-gray-300 shadow-lg ml-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedSession.name}</h2>
              <div className="flex items-center space-x-2">
                <Link
                  href={`/content/editSession?id=${selectedSession.session_id}`}
                >
                  <PencilIcon className="w-6 h-5 text-blue-500 cursor-pointer" />
                </Link>
                <button
                  onClick={() => {
                    setSessionToDelete(selectedSession.session_id);
                    showSessionModal();
                  }}
                >
                  <TrashIcon className="w-6 h-5 text-red-500 cursor-pointer" />
                </button>
                <button onClick={handleCloseSession}>
                  <XMarkIcon className="w-6 h-5 text-gray-500 cursor-pointer" />
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
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
          onSuccess={handleAddModuleSuccess}
        />
      </Modal>
      {moduleToEdit !== null && ( // Asegúrate de que moduleToEdit no sea null
        <Modal
          show={isEditModuleModalVisible}
          onClose={hideEditModuleModal}
          title="Editar Módulo"
        >
          <EditModuleForm
            moduleId={moduleToEdit.toString()}
            onClose={hideEditModuleModal}
            onSuccess={handleEditModuleSuccess}
          />
        </Modal>
      )}
    </>
  );
};

ModulesPage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default ModulesPage;
