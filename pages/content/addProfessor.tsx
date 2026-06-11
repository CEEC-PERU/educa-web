import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AppLayout from "../../components/layouts/AppLayout";
import type { NextPageWithLayout } from "../../types/next";
import { Professor } from "../../interfaces/Professor";
import { useLevelsQuery } from "@/features/professors/professors.queries";
import { useCreateProfessorMutation } from "@/features/professors/professors.mutations";
import { getUserFacingMessage } from "@/lib/http/error";
import MediaUploadPreview from "../../components/MediaUploadPreview";
import FormField from "../../components/FormField";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import SectionCard from "@components/ui/SectionCard";
import SidebarSelect from "@components/ui/SidebarSelect";
import { toast } from "sonner";

const AddProfessors: NextPageWithLayout = () => {
  const router = useRouter();

  const [profesor, setProfesor] = useState<
    Omit<Professor, "professor_id" | "created_at" | "updated_at">
  >({
    full_name: "",
    image: "",
    especialitation: "",
    description: "",
    level_id: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const levelsQuery = useLevelsQuery();
  const createProfessorMutation = useCreateProfessorMutation();

  const levels = levelsQuery.data ?? [];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { id, value } = e.target;
    setProfesor((prev) => ({
      ...prev,
      [id]: id === "level_id" ? Number(value) : value,
    }));
  };

  const isValid =
    profesor.full_name.trim().length > 0 &&
    profesor.especialitation.trim().length > 0 &&
    profesor.description.trim().length > 0 &&
    profesor.level_id > 0 &&
    imageFile !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      await createProfessorMutation.mutateAsync({
        professor: profesor,
        imageFile: imageFile!,
      });
      toast.success("Profesor agregado exitosamente");
      router.push("/content/professors");
    } catch (err: unknown) {
      toast.error(getUserFacingMessage(err) ?? "Error al agregar el profesor");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/content/professors"
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Volver
      </Link>

      <SectionCard title="Nuevo Profesor">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            id="full_name"
            label="Nombre Completo"
            type="text"
            value={profesor.full_name}
            onChange={handleChange}
            error={touched && !profesor.full_name.trim()}
            touched={touched}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagen
            </label>
            <MediaUploadPreview
              onMediaUpload={(file) => setImageFile(file)}
              accept="image/*"
              label="Subir Imagen"
            />
            {touched && !imageFile && (
              <p className="text-xs text-red-500 mt-1">
                La imagen es requerida
              </p>
            )}
          </div>

          <FormField
            id="especialitation"
            label="Especialización"
            type="text"
            value={profesor.especialitation}
            onChange={handleChange}
            error={touched && !profesor.especialitation.trim()}
            touched={touched}
            required
          />

          <FormField
            id="description"
            label="Descripción"
            type="textarea"
            value={profesor.description}
            onChange={handleChange}
            rows={4}
            error={touched && !profesor.description.trim()}
            touched={touched}
            required
          />

          <div>
            <SidebarSelect
              id="level_id"
              label="Nivel"
              value={
                profesor.level_id === 0 ? "" : profesor.level_id.toString()
              }
              onChange={handleChange}
              options={[
                {
                  value: "",
                  label: levelsQuery.isLoading
                    ? "Cargando..."
                    : "Seleccionar Nivel",
                },
                ...levels.map((level) => ({
                  value: level.level_id.toString(),
                  label: level.name,
                })),
              ]}
            />
            {touched && profesor.level_id === 0 && (
              <p className="text-xs text-red-500 mt-1">El nivel es requerido</p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting && (
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
              {isSubmitting ? "Guardando..." : "Guardar profesor"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="text-sm font-medium text-gray-500 hover:text-gray-800 disabled:opacity-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
};

AddProfessors.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default AddProfessors;
