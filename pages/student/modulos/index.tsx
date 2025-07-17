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

  useEffect(() => {
    let timer = 0; // Contador en segundos
    const startTime = new Date(); // Hora exacta de inicio

    console.log('Inicio del curso:', startTime);

    let interval: NodeJS.Timeout | null = null;
    let isPageVisible = true; // Flag para verificar si la página es visible

    const startTimer = () => {
      // Incrementar el timer cada segundo
      interval = setInterval(() => {
        if (isPageVisible) {
          // Solo incrementar si la página está visible
          timer += 1;
          console.log('Tiempo transcurrido (segundos):', timer);
        }
      }, 1000);
    };

    const handleEndSession = () => {
      const endTime = new Date(); // Hora exacta de finalización
      clearInterval(interval!); // Detener el timer

      console.log('Fin del curso:', endTime);
      console.log('Duración total (segundos):', timer);

      // Llamada al backend para registrar el tiempo de la sesión
      createCourseTimeStart({
        course_id: courseIdNumber,
        user_id: userInfo.id,
        startTime: startTime,
        endTime: endTime,
        duration: timer, // Incluye el tiempo transcurrido
      }).catch((error: any) =>
        console.error('Error al registrar el tiempo de inicio:', error)
      );
    };

    // Cuando la página gana o pierde visibilidad
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Si la pestaña pierde visibilidad, no incrementar el tiempo
        isPageVisible = false;
      } else {
        // Si la pestaña gana visibilidad, reanudar el temporizador
        isPageVisible = true;
      }
    };

    // Detectar cuando el usuario navega hacia atrás o adelante en el historial
    const handlePopState = () => {
      handleEndSession(); // Llamar a la función para finalizar la sesión cuando retroceda de página
    };

    // Empezar el temporizador
    startTimer();

    // Registrar la finalización al cerrar la ventana
    window.addEventListener('beforeunload', handleEndSession);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('popstate', handlePopState); // Detectar retroceso en el historial

    // Cleanup para eliminar el intervalo y el listener
    return () => {
      clearInterval(interval!); // Limpiar el intervalo
      window.removeEventListener('beforeunload', handleEndSession);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handlePopState); // Eliminar el listener del retroceso
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
  };

  const toggleSidebar = () => {
    setIsDrawerOpen(!isDrawerOpen);
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

      // Actualizar el estado local para reflejar el progreso
      setVideoProgress((prevProgress) => ({
        ...prevProgress,
        [selectedSession.session_id!]: progressUpdate,
      }));
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1014) {
        setIsDrawerOpen(false);
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
      <div>
        <div className="relative z-10">
          <Navbar
            bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
            borderColor="border border-stone-300"
            user={user ? { profilePicture: uri_picture } : undefined}
            toggleSidebar={toggleSidebar}
          />
          <SidebarDrawer
            isDrawerOpen={isDrawerOpen}
            toggleSidebar={toggleSidebar}
          />
        </div>
        <div className="flex flex-col h-screen bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300">
          <div className="flex flex-grow pt-16 flex-col lg:flex-row relative bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300">
            <div
              className={`flex-1 p-4 lg:ml-16 lg:mr-96 z-0 ${
                isDrawerOpen ? 'ml-64' : 'ml-16'
              }`}
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
      </div>
    </ProtectedRoute>
  );
};

export default Home;
