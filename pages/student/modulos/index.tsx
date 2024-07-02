import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SidebarPrueba from '../../../components/student/SideBarPrueba';
import { useAuth } from '../../../context/AuthContext';
import Navbar from '../../../components/Navbar';
import MainContentPrueba from '../../../components/student/MainContentPrueba';
import { Profile } from '../../../interfaces/UserInterfaces';
import { Question, ModuleEvaluation, ModuleSessions } from '../../../interfaces/StudentModule';
import { useModuleDetail } from '../../../hooks/useModuleDetail';
import DrawerNavigation from '../../../components/student/DrawerNavigation';
import io from 'socket.io-client';
import { API_SOCKET_URL } from '../../../utils/Endpoints';
const socket = io(API_SOCKET_URL);
const Home: React.FC = () => {
  const { logout, user, profileInfo } = useAuth();
  const router = useRouter();
  const { course_id } = router.query;
    const userInfo = user as { id: number };
  const courseIdNumber = Array.isArray(course_id) ? parseInt(course_id[0]) : parseInt(course_id || '0');
  const { courseData, isLoading, error } = useModuleDetail(courseIdNumber);
  const [selectedSession, setSelectedSession] = useState<{ video?: string, questions?: Question[] }>({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [videoProgress, setVideoProgress] = useState<{ [key: string]: number }>({}); // State to track video progress

  let name = '';
  let uri_picture = '';

  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    uri_picture = profile.profile_picture!;
  }

  const handleSelect = (sessionName: string, evaluation?: ModuleEvaluation | Question[]) => {
    if (Array.isArray(evaluation)) {
      setSelectedSession({ questions: evaluation });
    } else if (evaluation && 'questions' in evaluation) {
      setSelectedSession({ questions: evaluation.questions });
    } else {
      const module = courseData?.[0]?.courseModules.find(m =>
        m.moduleSessions.some(s => s.name === sessionName)
      );

      if (module) {
        const session = module.moduleSessions.find(s => s.name === sessionName);
        if (session) {
          setSelectedSession({ video: session.video_enlace });
        }
      }
    }
  };

  const handleContinue = () => {
    const currentModule = courseData?.[0]?.courseModules.find(m =>
      m.moduleSessions.some(s => s.video_enlace === selectedSession.video)
    );

    if (!currentModule) return;

    const currentSessionIndex = currentModule.moduleSessions.findIndex(s => s.video_enlace === selectedSession.video);

    if (currentSessionIndex === -1) return;

    const nextSession = currentModule.moduleSessions[currentSessionIndex + 1];

    if (nextSession) {
      setSelectedSession({ video: nextSession.video_enlace });
    } else {
      setSelectedSession({ questions: currentModule.moduleEvaluation.questions });
    }
  };

  const toggleSidebar = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleVideoProgress = (progress: number, isCompleted: boolean) => {
    if (selectedSession.video) {
      const sessionProgress = {
        session_id : 2,
        progress,
        is_completed: isCompleted,
        user_id : userInfo.id
      };

      socket.emit('session-progress', sessionProgress);

      setVideoProgress((prevProgress) => ({
        ...prevProgress,
        [selectedSession.video!]: progress,
      }));
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1014) {
        setIsDrawerOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!courseData || courseData.length === 0) {
    return <div>No course data available.</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300">
      <div className="fixed w-full z-10">
        <Navbar
          bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"
          borderColor="border border-stone-300"
          user={user ? { profilePicture: uri_picture } : undefined}
          toggleSidebar={toggleSidebar}
        />
      </div>
      <div className="flex flex-grow pt-16 flex-col lg:flex-row relative">
        <DrawerNavigation isDrawerOpen={isDrawerOpen} />
        <div className={`flex-1 p-4 lg:ml-16 lg:mr-96 z-0 ${isDrawerOpen ? 'ml-64' : 'ml-16'}`}>
          <MainContentPrueba
            sessionVideo={selectedSession.video}
            evaluationQuestions={selectedSession.questions}
            onContinue={handleContinue}
            onProgress={handleVideoProgress} // Pass the handleVideoProgress function
          />
        </div>
        <SidebarPrueba
          courseModules={courseData[0].courseModules}
          courseEvaluation={courseData[0].Evaluation}
          moduleEvaluations={courseData[0].courseModules.map(module => module.moduleEvaluation)}
          onSelect={handleSelect}
          videoProgress={videoProgress} // Pass the video progress
        />
      </div>
    </div>
  );
};

export default Home;
