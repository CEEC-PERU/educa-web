import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  useProfessorQuery,
  useLevelsQuery,
} from "@/features/professors/professors.queries";
import {
  useUpdateProfessorMutation,
  useDeleteProfessorMutation,
} from "@/features/professors/professors.mutations";
import { getUserFacingMessage } from "@/lib/http/error";
import AppLayout from "../../components/layouts/AppLayout";
import type { NextPageWithLayout } from "../../types/next";
import { uploadImage } from "../../services/imageService";
import MediaUploadPreview from "../../components/MediaUploadPreview";
import FormField from "../../components/FormField";
import { Professor } from "../../interfaces/Professor";
import {
  ArrowLeftIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import ModalConfirmation from "../../components/ModalConfirmation";
import useModal from "../../hooks/ui/useModal";
import SectionCard from "@components/ui/SectionCard";
import SidebarSelect from "@components/ui/SidebarSelect";
import { toast } from "sonner";

const DetailProfessor: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const professorId = id ? Number(id) : undefined;

  const [isEditing, setIsEditing] = useState(false);
  const [editDraft, setEditDraft] = useState<Professor | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { isVisible, showModal, hideModal } = useModal();

  const professorQuery = useProfessorQuery(professorId);
  const levelsQuery = useLevelsQuery();
  const updateProfessorMutation = useUpdateProfessorMutation();
  const deleteProfessorMutation = useDeleteProfessorMutation();

  const professor = professorQuery.data ?? null;
  const levels = levelsQuery.data ?? [];
  const isLoading = professorQuery.isLoading || levelsQuery.isLoading;
  const isSaving = updateProfessorMutation.isPending;

  const getLevelName = (levelId: number) =>
    levels.find((l) => l.level_id === levelId)?.name ?? "N/A";

  const handleEdit = () => {
    if (professor) {
      setEditDraft({ ...professor });
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setEditDraft(null);
    setImageFile(null);
    setIsEditing(false);
  };

  const handleDraftChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { id, value } = e.target;
    setEditDraft((prev) =>
      prev
        ? { ...prev, [id]: id === "level_id" ? Number(value) : value }
        : null,
    );
  };

  const handleDelete = async () => {
    if (!professor) return;
    try {
      await deleteProfessorMutation.mutateAsync(professor.professor_id);
      toast.success("Profesor eliminado correctamente");
      router.push("/content/professors");
    } catch (err) {
      toast.error(getUserFacingMessage(err) ?? "Error al eliminar el profesor");
      hideModal();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDraft) return;
    try {
      let imageUrl = editDraft.image;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, "Profesores");
      }
      await updateProfessorMutation.mutateAsync({
        professorId: editDraft.professor_id,
        professor: { ...editDraft, image: imageUrl },
      });
      toast.success("Profesor actualizado exitosamente");
      setIsEditing(false);
      setEditDraft(null);
      setImageFile(null);
    } catch (err) {
      toast.error(
        getUserFacingMessage(err) ?? "Error al actualizar el profesor",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
        <div className="h-5 w-20 bg-gray-200 rounded" />
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gray-200" />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-gray-200 rounded" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!professor) {
    return (
      <p className="text-gray-500 text-center mt-20">
        {getUserFacingMessage(professorQuery.error) ??
          "No se encontró el profesor."}
      </p>
    );
  }

  const display = isEditing && editDraft ? editDraft : professor;

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3">
          <Link
            href="/content/professors"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Volver
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-400">Profesores</span>
        </div>

        {/* Profile header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <img
                src={display.image}
                alt={display.full_name}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-gray-100 shadow-sm"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {display.full_name}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {display.especialitation}
                </p>
                <span className="mt-1.5 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  {getLevelName(display.level_id)}
                </span>
              </div>
            </div>

            {!isEditing && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium px-3 py-2 rounded-lg transition-colors"
                >
                  <PencilSquareIcon className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={showModal}
                  className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium px-3 py-2 rounded-lg transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Detail / Edit */}
        <SectionCard title={isEditing ? "Editar Profesor" : "Información"}>
          {!isEditing ? (
            <>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Descripción
                </p>
                <p className="text-gray-700">
                  {professor.description || (
                    <span className="text-gray-400 italic">
                      Sin descripción
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Especialización
                </p>
                <p className="text-gray-700">{professor.especialitation}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Nivel
                </p>
                <p className="text-gray-700">
                  {getLevelName(professor.level_id)}
                </p>
              </div>
            </>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <FormField
                id="full_name"
                label="Nombre Completo"
                type="text"
                value={editDraft!.full_name}
                onChange={handleDraftChange}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagen
                </label>
                <MediaUploadPreview
                  onMediaUpload={(file) => setImageFile(file)}
                  accept="image/*"
                  label="Subir Imagen"
                  initialPreview={editDraft!.image}
                />
              </div>
              <FormField
                id="especialitation"
                label="Especialización"
                type="text"
                value={editDraft!.especialitation}
                onChange={handleDraftChange}
              />
              <FormField
                id="description"
                label="Descripción"
                type="textarea"
                value={editDraft!.description}
                onChange={handleDraftChange}
              />
              <SidebarSelect
                id="level_id"
                label="Nivel"
                value={editDraft!.level_id.toString()}
                onChange={handleDraftChange}
                options={levels.map((level) => ({
                  value: level.level_id.toString(),
                  label: level.name,
                }))}
              />
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSaving && (
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                  )}
                  {isSaving ? "Guardando..." : "Guardar cambios"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="text-sm font-medium text-gray-500 hover:text-gray-800 disabled:opacity-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </SectionCard>
      </div>

      <ModalConfirmation
        show={isVisible}
        onClose={hideModal}
        onConfirm={handleDelete}
      />
    </>
  );
};

DetailProfessor.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default DetailProfessor;
