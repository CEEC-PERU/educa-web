import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import React, { useState, useEffect } from 'react';
import { Profile } from '@/interfaces/User/UserInterfaces';
import Navbar from '@/components/Navbar';
import SidebarDrawer from '@/components/student/DrawerNavigation';
import Link from 'next/link';
import { ArrowLeftIcon, XCircleIcon } from 'lucide-react';
import { API_STUDENT_CERTIFICATIONS } from '@/utils/Endpoints';

interface QuestionResult {
  question_id: number;
  question_text: string;
  type_id: number;
  points_value: number;
}

interface Certification {
  certification_id: number;
  title: string;
  description: string;
  passing_percentage: number;
}

interface QuestionAnswer {
  question_id: number;
  is_correct: boolean;
  points_earned: number;
}

interface CertificationResult {
  attempt_id: number;
  certification: Certification;
  answers: QuestionAnswer[];
  attempt_number: number;
  status: string;
  started_at: string;
  submitted_at: string;
  time_spent_minutes: number;
  score_obtained: number;
  total_points_available: number;
  passed: boolean;
  questions: QuestionResult[];
}

const ResultadosPage = () => {
  const router = useRouter();
  const { attempt_id } = router.query;
  const { profileInfo } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [certificationResult, setCertificationResult] =
    useState<CertificationResult | null>(null);

  let name = '';
  let uri_picture = '';
  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    uri_picture = profile.profile_picture!;
  }

  const toggleSidebar = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const getScoreBgColorClass = (passed: boolean | undefined) => {
    if (passed === undefined) return 'bg-gray-100 border-gray-300';
    return passed
      ? 'bg-green-100 border-green-400'
      : 'bg-red-100 border-red-400';
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (!attempt_id) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_STUDENT_CERTIFICATIONS}/attempt/${attempt_id}/results`
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Resultados obtenidos:', data);

        if (!data.success) {
          throw new Error(data.message || 'Error al cargar los resultados');
        }
        // Guardar los resultados en el estado
        setCertificationResult(data.data);
      } catch (error) {
        console.error('Error fetching results:', error);
        setError(
          'No se pudieron cargar los resultados. Por favor, inténtalo de nuevo más tarde.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [attempt_id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-200 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando resultados...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error al cargar los resultados
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-brand-200 text-white rounded-lg hover:bg-brand-300 transition-colors duration-200"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative z-10">
        <Navbar
          bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
          borderColor="border border-stone-300"
          user={uri_picture ? { profilePicture: uri_picture } : undefined}
          toggleSidebar={toggleSidebar}
        />
        <SidebarDrawer
          isDrawerOpen={isDrawerOpen}
          toggleSidebar={toggleSidebar}
        />
      </div>

      <div className="pt-16">
        <div
          className={`transition-all duration-300 ${
            isDrawerOpen ? 'ml-64' : 'ml-0'
          }`}
        >
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8">
              <Link href="/student/certificaciones">
                <button className="inline-flex items-center gap-2 text-bran-200 hover:text-brand-300 mb-4">
                  <ArrowLeftIcon className="h-4 w-4" />
                  Volver a Certificaciones
                </button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Resultados del Examen
              </h1>
            </div>

            <div
              className={`rounded-lg border-2 p-8 mb-8 ${getScoreBgColorClass(
                certificationResult?.passed
              )}`}
            >
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold mb-2 uppercase">
                  {certificationResult?.passed ? '¡Aprobado!' : 'No Aprobado'}
                </h1>
                <div className="flex justify-center items-center gap-4">
                  <div className="text-6xl font-bold">
                    {Math.round(
                      ((certificationResult?.score_obtained || 0) /
                        (certificationResult?.total_points_available || 1)) *
                        100
                    )}
                    %
                  </div>
                  <div className="text-gray-600">
                    <div>
                      Puntuación: {certificationResult?.score_obtained}/
                      {certificationResult?.total_points_available}
                    </div>
                    <div>
                      Mínimo requerido:{' '}
                      {certificationResult?.certification.passing_percentage}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-white/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {certificationResult?.attempt_number}
                  </div>
                  <div className="text-sm text-gray-600">Intento</div>
                </div>
                <div className="bg-white/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {certificationResult?.time_spent_minutes}
                  </div>
                  <div className="text-sm text-gray-600">Minutos</div>
                </div>
                <div className="bg-white/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {
                      certificationResult?.answers.filter(
                        (ans) => ans.is_correct
                      ).length
                    }
                  </div>
                  <div className="text-sm text-gray-600">Correctas</div>
                </div>
                <div className="bg-white/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {certificationResult?.answers.length}
                  </div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
              </div>
            </div>
            <div
              className={`rounded-lg border-2 p-8 mb-8 mt-2 ${getScoreBgColorClass(
                certificationResult?.passed
              )}`}
            >
              <h2 className="text-2xl font-semibold mb-4">
                Detalles de las Preguntas
              </h2>
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-2xl font-semibold mb-6">
                  Revisión de Respuestas
                </h2>
                <div className="space-y-4">
                  {certificationResult?.questions.map((question, index) => {
                    const answer = certificationResult.answers.find(
                      (ans) => ans.question_id === question.question_id
                    );

                    return (
                      <div
                        key={question.question_id}
                        className={`p-6 border-l-4 rounded-r-lg ${
                          answer?.is_correct
                            ? 'border-l-green-500 bg-green-50'
                            : 'border-l-red-500 bg-red-50'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-medium text-gray-900">
                            Pregunta {index + 1}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                answer?.is_correct
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {answer?.is_correct ? 'Correcta' : 'Incorrecta'}
                            </span>
                            <span className="text-sm text-gray-600">
                              {answer?.points_earned}/{question.points_value}{' '}
                              pts
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-800 mb-4">
                          {question.question_text}
                        </p>

                        {/* Agregar feedback visual */}
                        <div className="flex items-center gap-2 text-sm">
                          {answer?.is_correct ? (
                            <div className="flex items-center gap-1 text-green-700">
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span>Respuesta correcta</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-red-700">
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span>Respuesta incorrecta</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href="/student/certificaciones">
                <button className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2">
                  <ArrowLeftIcon className="h-4 w-4" />
                  Volver a Certificaciones
                </button>
              </Link>

              {/*imprimir hoja */}
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-brand-200 text-white rounded-lg hover:bg-brand-300 transition-colors duration-200"
              >
                Imprimir Resultados
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultadosPage;
