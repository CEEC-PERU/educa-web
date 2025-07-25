import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import SidebarPrueba from '../../../components/student/SideBarPrueba';
import { useAuth } from '../../../context/AuthContext';
import Navbar from '../../../components/Navbar';
import MainContentPrueba from '../../../components/student/MainContentPrueba';
import { Profile } from '../../../interfaces/User/UserInterfaces';
import {
  Question,
  ModuleEvaluation,
  ModuleSessions,
  ModuleResults,
} from '../../../interfaces/StudentModule';
import { useModuleDetail } from '../../../hooks/useModuleDetail';
import SidebarDrawer from '../../../components/student/DrawerNavigation';
import { useSesionProgress } from '../../../hooks/useProgressSession';
import {
  useCourseTime,
  useCourseTimeEnd,
} from '../../../hooks/courses/useCourseTime';
import ProtectedRoute from '../../../components/Auth/ProtectedRoute';
import io from 'socket.io-client';
import { API_SOCKET_URL } from '../../../utils/Endpoints';
import './../../../app/globals.css';
import LoadingIndicator from '../../../components/student/LoadingIndicator';
import debounce from 'lodash.debounce';
const socket = io(API_SOCKET_URL);

const Home: React.FC = () => {
  const { logout, user, profileInfo } = useAuth();
  const router = useRouter();
  const { course_id } = router.query;
  const userInfo = user as { id: number };
  const courseIdNumber = Array.isArray(course_id)
    ? parseInt(course_id[0])
    : parseInt(course_id || '0');
  const { courseData, isLoading, error, refetch } =
    useModuleDetail(courseIdNumber);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [selectedSession, setSelectedSession] = useState<{
    video?: string;
    questions?: Question[];
    session_id?: number;
    module_id?: number;
  }>({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [videoProgress, setVideoProgress] = useState<{ [key: string]: number }>(
    {}
  );
  // Nuevo estado para controlar la vista móvil del sidebar
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { createSession_Progress, session_progress } = useSesionProgress();
  const { createCourseTimeStart } = useCourseTime();
  const { createCourseTimeEnd } = useCourseTimeEnd();
  const startTimeRef = useRef<Date | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [hasEnded, setHasEnded] = useState(false);

  let name = '';
  let uri_picture = '';

  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    uri_picture = profile.profile_picture!;
  }

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    let timer = 0;
    const startTime = new Date();

    console.log('Inicio del curso:', startTime);

    let interval: NodeJS.Timeout | null = null;
    let isPageVisible = true;

    const startTimer = () => {
      interval = setInterval(() => {
        if (isPageVisible) {
          timer += 1;
          console.log('Tiempo transcurrido (segundos):', timer);
        }
      }, 1000);
    };

    const handleEndSession = () => {
      const endTime = new Date();
      clearInterval(interval!);

      console.log('Fin del curso:', endTime);
      console.log('Duración total (segundos):', timer);

      createCourseTimeStart({
        course_id: courseIdNumber,
        user_id: userInfo.id,
        startTime: startTime,
        endTime: endTime,
        duration: timer,
      }).catch((error: any) =>
        console.error('Error al registrar el tiempo de inicio:', error)
      );
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        isPageVisible = false;
      } else {
        isPageVisible = true;
      }
    };

    const handlePopState = () => {
      handleEndSession();
    };

    startTimer();

    window.addEventListener('beforeunload', handleEndSession);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('popstate', handlePopState);

    return () => {
      clearInterval(interval!);
      window.removeEventListener('beforeunload', handleEndSession);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [courseIdNumber, userInfo, createCourseTimeStart]);

  const handleSelect = (
    sessionName: string,
    evaluation?: ModuleEvaluation | Question[],
    moduleId?: number
  ) => {
    setSelectedModuleId(moduleId || null);

    if (Array.isArray(evaluation)) {
      setSelectedSession({ questions: evaluation, module_id: moduleId });
    } else if (evaluation && 'questions' in evaluation) {
      setSelectedSession({
        questions: evaluation.questions,
        module_id: moduleId,
      });
    } else {
      const module = courseData?.[0]?.courseModules.find((m) =>
        m.moduleSessions.some((s) => s.name === sessionName)
      );

      if (module) {
        const session = module.moduleSessions.find(
          (s) => s.name === sessionName
        );

        if (session) {
          setSelectedSession({
            video: session.video_enlace,
            session_id: session.session_id,
            module_id: moduleId,
          });
        }
      }
    }

    // Cerrar sidebar en móvil después de seleccionar
    if (isMobile) {
      setShowSidebarMobile(false);
    }
  };

  const toggleSidebar = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Nueva función para toggle del sidebar móvil
  const toggleSidebarMobile = () => {
    setShowSidebarMobile(!showSidebarMobile);
  };

  const handleVideoProgress = async (
    progress: number,
    isCompleted: boolean
  ) => {
    const progressUpdate = Math.round(progress);

    if (selectedSession.video && selectedSession.session_id) {
      const sessionProgress = {
        session_id: selectedSession.session_id,
        progress: progressUpdate,
        is_completed: isCompleted,
        user_id: userInfo.id,
      };

      setVideoProgress((prevProgress) => ({
        ...prevProgress,
        [selectedSession.session_id!]: progressUpdate,
      }));
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsDrawerOpen(false);
        setShowSidebarMobile(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!courseData || courseData.length === 0) {
    return <LoadingIndicator />;
  }

  const handleEvaluationFinish = () => {
    refetch();
  };

  return (
    <ProtectedRoute>
      <div className="relative">
        {/* Navbar con botón para móvil */}
        <div className="relative z-50">
          <Navbar
            bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
            borderColor="border border-stone-300"
            user={user ? { profilePicture: uri_picture } : undefined}
            toggleSidebar={toggleSidebar}
          />

          {/* Botón flotante para mostrar contenido del curso en móvil */}
          {isMobile && (
            <button
              onClick={toggleSidebarMobile}
              className="fixed bottom-4 right-4 z-50 bg-brand-200 text-white p-3 rounded-full shadow-lg lg:hidden"
              aria-label="Ver contenido del curso"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}

          <SidebarDrawer
            isDrawerOpen={isDrawerOpen}
            toggleSidebar={toggleSidebar}
          />
        </div>

        {/* Layout principal */}
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300">
          <div className="flex flex-grow pt-16 relative bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300">
            {/* Contenido principal */}
            <div
              className={`
              flex-1 transition-all duration-300 ease-in-out
              ${isMobile ? 'p-2' : 'p-4'}
              ${!isMobile && isDrawerOpen ? 'ml-64' : ''}
              ${!isMobile ? 'lg:ml-16 lg:mr-96' : ''}
              ${isMobile && showSidebarMobile ? 'opacity-30' : ''}
            `}
            >
              <MainContentPrueba
                sessionVideo={selectedSession.video}
                sessionId={selectedSession.session_id}
                evaluationQuestions={selectedSession.questions}
                onProgress={handleVideoProgress}
                selectedModuleId={selectedModuleId}
                moduleResults={courseData[0].courseModules.flatMap(
                  (module) => module.ModuleResults
                )}
                courseResults={courseData[0].CourseResults}
                onUpdated={handleEvaluationFinish}
              />
            </div>

            {/* Sidebar desktop */}
            {!isMobile && (
              <SidebarPrueba
                courseModules={courseData[0].courseModules}
                courseEvaluation={courseData[0].Evaluation}
                moduleEvaluations={courseData[0].courseModules.map(
                  (module) => module.moduleEvaluation
                )}
                onSelect={handleSelect}
                videoProgress={videoProgress}
              />
            )}

            {/* Sidebar móvil como overlay */}
            {isMobile && (
              <>
                {/* Overlay oscuro */}
                {showSidebarMobile && (
                  <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleSidebarMobile}
                  />
                )}

                {/* Sidebar móvil deslizable */}
                <div
                  className={`
                  fixed top-16 right-0 h-full w-80 max-w-[85vw] z-50
                  transform transition-transform duration-300 ease-in-out
                  ${showSidebarMobile ? 'translate-x-0' : 'translate-x-full'}
                  bg-white shadow-xl overflow-y-auto
                `}
                >
                  {/* Header del sidebar móvil */}
                  <div className="flex items-center justify-between p-4 border-b bg-brand-100">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Contenido del Curso
                    </h3>
                    <button
                      onClick={toggleSidebarMobile}
                      className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                      aria-label="Cerrar menú"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Contenido del sidebar */}
                  <div className="h-full pb-16">
                    <SidebarPrueba
                      courseModules={courseData[0].courseModules}
                      courseEvaluation={courseData[0].Evaluation}
                      moduleEvaluations={courseData[0].courseModules.map(
                        (module) => module.moduleEvaluation
                      )}
                      onSelect={handleSelect}
                      videoProgress={videoProgress}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Home;
