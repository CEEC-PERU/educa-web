import React, { useState } from 'react';
import { addModule } from '../../services/moduleService';
import { Module } from '../../interfaces/Module';
import FormField from '../../components/FormField';
import AlertComponent from '../../components/AlertComponent';
import Loader from '../../components/Loader';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import { useEvaluationWizard } from '../../components/Evaluation/hooks/LogicWizard';
import { EvaluationWizard } from '../../components/Evaluation/WizardEvaluation';

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
  const [step, setStep] = useState<
    'form' | 'wizard' | 'processing' | 'success'
  >('form');
  const [moduleName, setModuleName] = useState('');
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  const wizard = useEvaluationWizard();

  const handleStartWizard = () => {
    if (!moduleName.trim()) {
      setTouched(true);
      setError('El nombre del módulo es requerido.');
      return;
    }
    wizard.resetForm();
    wizard.setEvaluationData((prev) => ({ ...prev, name: moduleName }));
    setStep('wizard');
  };

  const handleCompleteEvaluation = async () => {
    try {
      setStep('processing');

      // 1. Crear evaluación
      const evaluationId = await wizard.completeForm();

      // 2. Crear módulo con evaluación
      const newModule: Omit<Module, 'module_id' | 'created_at' | 'updated_at'> =
        {
          name: moduleName,
          evaluation_id: evaluationId,
          is_active: true,
          course_id: courseId,
        };

      await addModule(newModule);

      // 3. Mostrar éxito
      setStep('success');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error al crear módulo con evaluación:', err);
      setStep('form');
      setError('Ocurrió un error al guardar. Intente nuevamente.');
      setShowAlert(true);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <ProtectedRoute>
      <div className="bg-white p-6 w-full max-w-4xl mx-auto">
        {step === 'form' && (
          <>
            {showAlert && error && (
              <AlertComponent
                type="danger"
                message={error}
                onClose={() => {
                  setError(null);
                  setShowAlert(false);
                }}
              />
            )}
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
                  className="bg-blue-600 text-white py-2 px-4 rounded"
                >
                  Crear Evaluación
                </button>
              </div>
            </form>
          </>
        )}

        {step === 'wizard' && (
          <EvaluationWizard
            {...wizard}
            completeForm={handleCompleteEvaluation}
          />
        )}

        {step === 'processing' && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <Loader />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default AddModuleForm;
