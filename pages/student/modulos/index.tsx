import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SidebarPrueba from '../../../components/student/SideBarPrueba';
import { useAuth } from '../../../context/AuthContext';
import Navbar from '../../../components/Navbar';
import MainContentPrueba from '../../../components/student/MainContentPrueba';
import { Profile } from '../../../interfaces/UserInterfaces';
import { Question, ModuleEvaluation, ModuleSessions, ModuleResults } from '../../../interfaces/StudentModule';
import { useModuleDetail } from '../../../hooks/useModuleDetail';
import SidebarDrawer from '../../../components/student/DrawerNavigation';

import ProtectedRoute from '../../../components/Auth/ProtectedRoute';
import io from 'socket.io-client';
import { API_SOCKET_URL } from '../../../utils/Endpoints';
import './../../../app/globals.css';
import LoadingIndicator from '../../../components/student/LoadingIndicator'; 
const socket = io(API_SOCKET_URL);


const Home: React.FC = () => {
  const { logout, user, profileInfo } = useAuth();
  const router = useRouter();
  const { course_id } = router.query;
  const userInfo = user as { id: number };
  const courseIdNumber = Array.isArray(course_id) ? parseInt(course_id[0]) : parseInt(course_id || '0');
  const { courseData, isLoading, error } = useModuleDetail(courseIdNumber);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [selectedSession, setSelectedSession] = useState<{ video?: string, questions?: Question[], session_id?: number , module_id?: number }>({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [videoProgress, setVideoProgress] = useState<{ [key: string]: number }>({});

  let name = '';
  let uri_picture = '';

  if (profileInfo) { 
    const profile = profileInfo as Profile; 
    name = profile.first_name; 
    uri_picture = profile.profile_picture!;
  }

  const handleSelect = (sessionName: string, evaluation?: ModuleEvaluation | Question[], moduleId?: number) => {
    setSelectedModuleId(moduleId || null);

    if (Array.isArray(evaluation)) {
      setSelectedSession({ questions: evaluation, module_id: moduleId });
    } else if (evaluation && 'questions' in evaluation) {
      setSelectedSession({ questions: evaluation.questions, module_id: moduleId });
    } else {
      const module = courseData?.[0]?.courseModules.find(m =>
        m.moduleSessions.some(s => s.name === sessionName)
      );

      if (module) {
        const session = module.moduleSessions.find(s => s.name === sessionName);

        if (session) {
          setSelectedSession({
            video: session.video_enlace,
            session_id: session.session_id,
            module_id: moduleId
          });
        }
      }
    }
  };

  const toggleSidebar = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  

  
  const handleVideoProgress = (progress: number, isCompleted: boolean) => {
    const progressUpdate = Math.round(progress); // Redondea el progreso

    if (selectedSession.video && selectedSession.session_id) {
      const sessionProgress = {
        session_id: selectedSession.session_id,
        progress: progressUpdate,
        is_completed: isCompleted,
        user_id: userInfo.id
      };

      socket.emit('session', sessionProgress); // Enviar datos de progreso por socket

      // *** Actualización del estado `videoProgress` para la sesión actual ***
      setVideoProgress((prevProgress) => ({
        ...prevProgress,
        [selectedSession.session_id!]: progressUpdate,  // Se utiliza el `session_id` como clave para el progreso
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
         <SidebarDrawer isDrawerOpen={isDrawerOpen} toggleSidebar={toggleSidebar} />
      </div>
    <div className="flex flex-col h-screen bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300">
     
      <div className="flex flex-grow pt-16 flex-col lg:flex-row relative bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300">
        <div className={`flex-1 p-4 lg:ml-16 lg:mr-96 z-0 ${isDrawerOpen ? 'ml-64' : 'ml-16'}`}>
          <MainContentPrueba
            sessionVideo={selectedSession.video}
            evaluationQuestions={selectedSession.questions}
            onProgress={handleVideoProgress}
            selectedModuleId={selectedModuleId}
            moduleResults={courseData[0].courseModules.flatMap(module => module.ModuleResults)}
            courseResults={courseData[0].CourseResults}
          />
        </div>
        <SidebarPrueba
          courseModules={courseData[0].courseModules}
          courseEvaluation={courseData[0].Evaluation}
          moduleEvaluations={courseData[0].courseModules.map(module => module.moduleEvaluation)}
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




