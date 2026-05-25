import React, { useState, useEffect } from "react";
import { useModuleQuery } from "@/features/modules/modules.queries";
import { useUpdateModuleMutation } from "@/features/modules/modules.mutations";
import { useEvaluationsQuery } from "@/features/evaluations/evaluations.queries";
import { getUserFacingMessage } from "@/lib/http/error";
import { Module } from "../../interfaces/Module";
import SidebarSelect from "@components/ui/SidebarSelect";
import { toast } from "sonner";

interface EditModuleFormProps {
  moduleId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const EditModuleForm: React.FC<EditModuleFormProps> = ({
  moduleId,
  onClose,
  onSuccess,
}) => {
  const [module, setModule] = useState<Module | null>(null);
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moduleQuery = useModuleQuery(moduleId);
  const evaluationsQuery = useEvaluationsQuery();
  const updateModuleMutation = useUpdateModuleMutation();

  const evaluations = evaluationsQuery.data ?? [];

  useEffect(() => {
    if (moduleQuery.data) {
      setModule(moduleQuery.data);
    }
  }, [moduleQuery.data]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { id, value } = e.target;
    setModule((prev) => ({
      ...prev!,
      [id]: id === "evaluation_id" ? Number(value) : value,
    }));
  };

  const isValid =
    module !== null &&
    module.name.trim().length > 0 &&
    module.evaluation_id > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      await updateModuleMutation.mutateAsync({ id: moduleId, module: module! });
      onSuccess();
    } catch (err: unknown) {
      toast.error(getUserFacingMessage(err) ?? "Error al actualizar el módulo");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (moduleQuery.isLoading || evaluationsQuery.isLoading || !module) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500 text-sm">
        Cargando...
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="name"
              className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              Nombre del Módulo
            </label>
            <input
              id="name"
              type="text"
              value={module.name}
              onChange={handleChange}
              className={`block w-full rounded-lg border px-3 py-2 text-sm text-gray-900 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors ${
                touched && !module.name.trim()
                  ? "border-red-400"
                  : "border-gray-200"
              }`}
            />
            {touched && !module.name.trim() && (
              <p className="text-xs text-red-500">El nombre es requerido</p>
            )}
          </div>
          <div>
            <SidebarSelect
              id="evaluation_id"
              label="Evaluación"
              value={
                module.evaluation_id === 0
                  ? ""
                  : module.evaluation_id.toString()
              }
              onChange={handleChange}
              options={[
                {
                  value: "",
                  label: evaluationsQuery.isError
                    ? "Error al cargar"
                    : "Seleccionar Evaluación",
                },
                ...evaluations.map((ev) => ({
                  value: ev.evaluation_id.toString(),
                  label: ev.name,
                })),
              ]}
            />
            {touched && module.evaluation_id === 0 && (
              <p className="text-xs text-red-500 mt-1">
                La evaluación es requerida
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-sm font-medium text-gray-500 hover:text-gray-800 disabled:opacity-50 transition-colors"
          >
            Cancelar
          </button>
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
            {isSubmitting ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditModuleForm;
