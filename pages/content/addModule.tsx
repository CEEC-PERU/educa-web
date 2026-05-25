import React, { useState } from "react";
import { useCreateModuleMutation } from "@/features/modules/modules.mutations";
import { getUserFacingMessage } from "@/lib/http/error";
import { Module } from "../../interfaces/Module";
import FormField from "../../components/FormField";
import { useEvaluationWizard } from "../../components/Evaluation/hooks/LogicWizard";
import { EvaluationWizard } from "../../components/Evaluation/WizardEvaluation";
import { toast } from "sonner";

interface AddModuleFormProps {
  courseId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const AddModuleForm: React.FC<AddModuleFormProps> = ({
  courseId,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<"form" | "wizard">("form");
  const [moduleName, setModuleName] = useState("");
  const [touched, setTouched] = useState(false);

  const wizard = useEvaluationWizard();
  const createModuleMutation = useCreateModuleMutation();

  const handleStartWizard = () => {
    if (!moduleName.trim()) {
      setTouched(true);
      return;
    }
    wizard.resetForm();
    wizard.setEvaluationData((prev) => ({ ...prev, name: moduleName }));
    setStep("wizard");
  };

  const handleCompleteEvaluation = async () => {
    try {
      const evaluationId = await wizard.completeForm();

      const newModule: Omit<Module, "module_id" | "created_at" | "updated_at"> =
        {
          name: moduleName,
          evaluation_id: evaluationId,
          is_active: true,
          course_id: courseId,
        };

      await createModuleMutation.mutateAsync(newModule);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      toast.error(getUserFacingMessage(err) ?? "Error al crear el módulo");
      setStep("form");
    }
  };

  return (
    <div className="w-full">
      {step === "form" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleStartWizard();
          }}
          className="space-y-4"
        >
          <FormField
            id="moduleName"
            label="Nombre del Módulo"
            type="text"
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
            onBlur={() => setTouched(true)}
            error={!moduleName && touched}
            touched={touched}
            required
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors px-4 py-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Crear Evaluación
            </button>
          </div>
        </form>
      )}

      {step === "wizard" && (
        <EvaluationWizard {...wizard} completeForm={handleCompleteEvaluation} />
      )}
    </div>
  );
};

export default AddModuleForm;
