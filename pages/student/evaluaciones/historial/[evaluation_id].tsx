import React from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import AppLayout from "@/components/layouts/AppLayout";

// Componentes modulares
import EvaluationScoreOverview from "../../../../components/Evaluation/EvaluationScoreOverview";
import EvaluationStatsCards from "../../../../components/Evaluation/EvaluationStatsCards";
import AttemptSelector from "../../../../components/Evaluation/AttemptSelector";
import DetailedQuestionReview from "../../../../components/Evaluation/DetailedQuestionReview";
import {
  LoadingState,
  ErrorState,
  NoResultsState,
} from "../../../../components/Evaluation/StateComponents";

// Hooks personalizados
import { useEvaluationResults } from "../../../../hooks/resultado/useEvaluationResult";

// Utilidades
import { calculateEvaluationStats } from "../../../../utils/evaluation/questionAnalysis";

const EvaluationResults = () => {
  const { attempts, selectedAttempt, loading, error, selectAttemptById } =
    useEvaluationResults();

  // Estados de carga y error
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!selectedAttempt) {
    return <NoResultsState />;
  }

  // Calcular estadísticas
  const stats = calculateEvaluationStats(selectedAttempt);

  return (
    <div className="min-h-screen bg-gray-50">
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
  );
};

EvaluationResults.getLayout = (page: React.ReactNode) => (
  <AppLayout noPadding>{page}</AppLayout>
);

export default EvaluationResults;
