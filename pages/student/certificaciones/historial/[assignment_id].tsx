import SidebarDrawer from '@/components/student/DrawerNavigation';
import Navbar from '@/components/Navbar';
import { useEvaluationUI } from '@/hooks/ui/useEvaluationUI';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';
import { useCertificationResult } from '@/hooks/resultado/useCertificationResult';
import {
  ErrorStateCertification,
  LoadingStateCertification,
  NoResultsStateCertification,
} from '@/components/Certification/StateComponent';
import AttemptSelectorCertification from '@/components/Certification/AttemptSelector';

const CertificationResults = () => {
  const { attempts, selectedAttempt, loading, error, selectAttemptById } =
    useCertificationResult();
  console.log('Assignment ID from hook:', selectedAttempt);
  console.log('All attempts from hook:', attempts);

  const { isDrawerOpen, toggleSidebar, userProfile } = useEvaluationUI();

  if (loading) {
    return (
      <LoadingStateCertification
        userProfile={userProfile}
        toggleSidebar={toggleSidebar}
        isDrawerOpen={isDrawerOpen}
      />
    );
  }

  if (error) {
    return (
      <ErrorStateCertification
        error={error}
        userProfile={userProfile}
        toggleSidebar={toggleSidebar}
        isDrawerOpen={isDrawerOpen}
      />
    );
  }

  if (!selectedAttempt) {
    return (
      <NoResultsStateCertification
        userProfile={userProfile}
        toggleSidebar={toggleSidebar}
        isDrawerOpen={isDrawerOpen}
      />
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="relative z-10">
          <Navbar
            bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
            borderColor="border border-stone-300"
            user={
              userProfile.uri_picture
                ? { profilePicture: userProfile.uri_picture }
                : undefined
            }
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
              isDrawerOpen ? 'lg:ml-64' : 'lg:ml-16'
            }`}
          >
            <div className="container mx-auto px-4 py-8 max-w-6xl">
              <div className="mb-6">
                <Link href="/student/certificaciones">
                  <button className="inline-flex items-center gap-2 text-bran-200 hover:text-brand-300 mb-4">
                    <ArrowLeftIcon className="h-4 w-4" />
                    Volver a Certificaciones
                  </button>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Historial de Intentos
                </h1>
                <h2 className="text-xl text-gray-600">
                  {selectedAttempt?.certification.title}
                </h2>
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
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CertificationResults;
