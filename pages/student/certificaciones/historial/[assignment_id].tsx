// pages/student/certificaciones/results/index.tsx
import React from "react";
import AppLayout from "@/components/layouts/AppLayout";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { useCertificationResult } from "@/hooks/resultado/useCertificationResult";
import {
  ErrorStateCertification,
  LoadingStateCertification,
  NoResultsStateCertification,
} from "@/components/Certification/StateComponent";
import AttemptSelectorCertification from "@/components/Certification/AttemptSelector";

const CertificationResults = () => {
  const { attempts, selectedAttempt, loading, error, selectAttemptById } =
    useCertificationResult();

  if (loading) {
    return <LoadingStateCertification />;
  }

  if (error) {
    return <ErrorStateCertification error={error} />;
  }

  if (!selectedAttempt || attempts.length === 0) {
    return <NoResultsStateCertification />;
  }

  // Calcular estadísticas
  const completedAttempts = attempts.filter((a) => a.status === "completed");
  const abandonedAttempts = attempts.filter((a) => a.status === "abandoned");
  const passedAttempts = completedAttempts.filter((a) => a.passed);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Link href="/student/certificaciones">
            <button className="inline-flex items-center gap-2 text-brand-200 hover:text-brand-300 mb-4">
              <ArrowLeftIcon className="h-4 w-4" />
              Volver a Certificaciones
            </button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Historial de Intentos
          </h1>
          <h2 className="text-xl text-gray-600 mb-4">
            {selectedAttempt?.certification?.title}
          </h2>

          {/* Resumen general */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {attempts.length}
              </div>
              <div className="text-sm text-gray-600">Total Intentos</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-green-600">
                {passedAttempts.length}
              </div>
              <div className="text-sm text-gray-600">Aprobados</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-red-600">
                {completedAttempts.length - passedAttempts.length}
              </div>
              <div className="text-sm text-gray-600">Reprobados</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {abandonedAttempts.length}
              </div>
              <div className="text-sm text-gray-600">Abandonados</div>
            </div>
          </div>
        </div>

        <AttemptSelectorCertification
          attempts={attempts}
          selectedAttempt={selectedAttempt}
          onSelectAttempt={selectAttemptById}
        />

        <div className="mt-8 flex justify-center gap-4">
          <Link href="/student/certificaciones">
            <button className="px-4 py-2 bg-brand-200 text-white rounded-lg hover:bg-brand-300 transition-colors duration-200">
              Volver
            </button>
          </Link>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-brand-200 text-white rounded-lg hover:bg-brand-300 transition-colors duration-200"
          >
            Imprimir resultados
          </button>
        </div>
      </div>
    </div>
  );
};

CertificationResults.getLayout = (page: React.ReactNode) => (
  <AppLayout noPadding>{page}</AppLayout>
);

export default CertificationResults;
