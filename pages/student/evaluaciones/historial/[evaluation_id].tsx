import React from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

import SidebarDrawer from '../../../../components/student/DrawerNavigation';
import Navbar from '../../../../components/Navbar';
import ProtectedRoute from '../../../../components/Auth/ProtectedRoute';

// Componentes modulares
import EvaluationScoreOverview from '../../../../components/Evaluation/EvaluationScoreOverview';
import EvaluationStatsCards from '../../../../components/Evaluation/EvaluationStatsCards';
import AttemptSelector from '../../../../components/Evaluation/AttemptSelector';
import DetailedQuestionReview from '../../../../components/Evaluation/DetailedQuestionReview';
import { LoadingState, ErrorState, NoResultsState } from '../../../../components/Evaluation/StateComponents';

// Hooks personalizados
import { useEvaluationResults } from '../../../../hooks/resultado/useEvaluationResult';
import { useEvaluationUI } from '../../../../hooks/ui/useEvaluationUI';

// Utilidades
import { calculateEvaluationStats } from '../../../../utils/evaluation/questionAnalysis';

const EvaluationResults = () => {
  const { 
    attempts, 
    selectedAttempt, 
    loading, 
    error, 
    selectAttemptById 
  } = useEvaluationResults();
  
  const { 
    isDrawerOpen, 
    toggleSidebar, 
    userProfile 
  } = useEvaluationUI();

  // Estados de carga y error
  if (loading) {
    return (
      <LoadingState 
        userProfile={userProfile} 
        toggleSidebar={toggleSidebar} 
        isDrawerOpen={isDrawerOpen} 
      />
    );
  }
  
  if (error) {
    return (
      <ErrorState 
        error={error} 
        userProfile={userProfile} 
        toggleSidebar={toggleSidebar} 
        isDrawerOpen={isDrawerOpen} 
      />
    );
  }
  
  if (!selectedAttempt) {
    return (
      <NoResultsState 
        userProfile={userProfile} 
        toggleSidebar={toggleSidebar} 
        isDrawerOpen={isDrawerOpen} 
      />
    );
  }

  // Calcular estadísticas
  const stats = calculateEvaluationStats(selectedAttempt);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="relative z-10">
          <Navbar
            bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
            borderColor="border border-stone-300"
            user={userProfile.uri_picture ? { profilePicture: userProfile.uri_picture } : undefined}
            toggleSidebar={toggleSidebar}
          />
          <SidebarDrawer isDrawerOpen={isDrawerOpen} toggleSidebar={toggleSidebar} />
        </div>

        <div className="pt-16">
          <div className={`transition-all duration-300 ${isDrawerOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
            <div className="container mx-auto px-4 py-8 max-w-6xl">
              
              {/* Header */}
              <div className="mb-6">
                <Link href="/student/evaluaciones">
                  <button className="inline-flex items-center gap-2 text-brand-200 hover:text-brand-300 font-medium mb-4">
                    <ArrowLeftIcon className="h-4 w-4" />
                    Volver a Evaluaciones
                  </button>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Resultados de Evaluación
                </h1>
                <h2 className="text-xl text-gray-600">
                  {selectedAttempt.evaluation.title}
                </h2>
              </div>

              {/* Selector de intentos */}
              <AttemptSelector
                attempts={attempts}
                selectedAttempt={selectedAttempt}
                onSelectAttempt={selectAttemptById}
              />

              {/* Resumen de puntuación */}
              <EvaluationScoreOverview
                selectedAttempt={selectedAttempt}
                percentage={stats.percentage}
                correctAnswers={stats.correctAnswers}
                totalQuestions={stats.totalQuestions}
                passingScore={stats.passingScore}
                isPassed={stats.isPassed}
              />

              {/* Estadísticas */}
              <EvaluationStatsCards selectedAttempt={selectedAttempt} />

              {/* Revisión detallada de preguntas */}
              <DetailedQuestionReview selectedAttempt={selectedAttempt} />

              {/* Botones de acción */}
              <div className="mt-8 flex justify-center gap-4">
                <Link href="/student/evaluaciones">
                  <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    Volver a Evaluaciones
                  </button>
                </Link>
                <button
                  onClick={() => window.print()}
                  className="px-6 py-3 bg-brand-200 text-white rounded-lg hover:bg-brand-300 transition-colors font-medium"
                >
                  Imprimir Resultados
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default EvaluationResults;