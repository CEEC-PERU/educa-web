import React, { useState, useEffect } from "react";
import { useModuleQuery } from "@/features/modules/modules.queries";
import { useUpdateModuleMutation } from "@/features/modules/modules.mutations";
import { useAvailableEvaluationsQuery } from "@/features/evaluations/evaluations.queries";
import { getUserFacingMessage } from "@/lib/http/error";
import { Module } from "../../interfaces/Module";
import FormField from "../../components/FormField";
import AlertComponent from "../../components/AlertComponent";
import Loader from "../../components/Loader";
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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [touchedFields, setTouchedFields] = useState<{
    [key in keyof Module]?: boolean;
  }>({});

  const moduleQuery = useModuleQuery(moduleId);
  const evaluationsQuery = useAvailableEvaluationsQuery();
  const updateModuleMutation = useUpdateModuleMutation();

  const evaluations = evaluationsQuery.data ?? [];
  const loading = moduleQuery.isLoading || evaluationsQuery.isLoading;
  const formLoading = updateModuleMutation.isPending;

  useEffect(() => {
    if (moduleQuery.data) {
      setModule(moduleQuery.data);
    }
  }, [moduleQuery.data]);

  useEffect(() => {
    if (moduleQuery.isError || evaluationsQuery.isError) {
      setError("Error fetching module and evaluations");
      setShowAlert(true);
    }
  }, [moduleQuery.isError, evaluationsQuery.isError]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { id, value, type, checked } = e.target as HTMLInputElement;
    setModule((prevModule) => ({
      ...prevModule!,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { id } = e.target;
    setTouchedFields((prevState) => ({
      ...prevState,
      [id]: true,
    }));
  };

  const requiredFields: (keyof Module)[] = ["name", "evaluation_id"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newTouchedFields: { [key in keyof Module]?: boolean } = {};
    requiredFields.forEach((field) => {
      if (!module?.[field]) {
        newTouchedFields[field] = true;
      }
    });

    const hasEmptyFields = requiredFields.some((field) => !module?.[field]);

    if (hasEmptyFields) {
      setTouchedFields((prev) => ({ ...prev, ...newTouchedFields }));
      setError("Por favor, complete todos los campos requeridos.");
      setShowAlert(true);
      return;
    }

    try {
      await updateModuleMutation.mutateAsync({
        id: moduleId,
        module: module!,
      });
      setShowAlert(true);
      setError(null);
      setSuccess("Módulo actualizado exitosamente.");
      onSuccess();
    } catch (err) {
      console.error("Error updating module:", err);
      setError(getUserFacingMessage(err));
      setShowAlert(true);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (loading || !module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 w-full max-w-4xl mx-auto">
      {showAlert && (
        <AlertComponent
          type={error ? "danger" : "success"}
          message={error || success || ""}
          onClose={() => setShowAlert(false)}
        />
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            id="name"
            label="Nombre del Módulo"
            type="text"
            value={module.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!module.name && touchedFields["name"]}
            touched={touchedFields["name"]}
            required
          />
          <FormField
            id="evaluation_id"
            label="Evaluación"
            type="select"
            value={module.evaluation_id.toString()}
            onChange={handleChange}
            onBlur={handleBlur}
            options={evaluations.map((evaluation) => ({
              value: evaluation.evaluation_id.toString(),
              label: evaluation.name,
            }))}
            error={module.evaluation_id === 0 && touchedFields["evaluation_id"]}
            touched={touchedFields["evaluation_id"]}
            required
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 text-white py-2 px-4 rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Guardar
          </button>
        </div>
      </form>
      {formLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default EditModuleForm;
