import React from 'react';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Content/SideBar';
import ProtectedRoute from '../../../components/Auth/ProtectedRoute';
import { useEvaluationWizard } from '../../../components/Evaluation/hooks/LogicWizard';
import { EvaluationWizard } from '../../../components/Evaluation/WizardEvaluation';
import './../../../app/globals.css';

const CreateEvaluationWizardPage = () => {
  const [showSidebar, setShowSidebar] = React.useState(true);
  const wizard = useEvaluationWizard();

  // Adaptamos la función completeForm para cumplir con la interfaz
  const adaptedCompleteForm = async () => {
    try {
      await wizard.completeForm();
      // Podrías agregar aquí lógica adicional si es necesario
    } catch (error) {
      console.error('Error completing evaluation:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
        <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
        <div className="flex flex-1 pt-16">
          <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
          <main
            className={`flex-grow p-6 transition-all duration-300 ease-in-out ${
              showSidebar ? 'ml-20' : 'ml-0'
            }`}
          >
            <EvaluationWizard {...wizard} completeForm={adaptedCompleteForm} />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CreateEvaluationWizardPage;
