import React, { useState } from 'react';
import { useRouter } from 'next/router';
import SidebarPrueba from '../../../components/student/SideBarPrueba';
import { useAuth } from '../../../context/AuthContext';
import Navbar from '../../../components/Navbar';
import MainContentPrueba from '../../../components/student/MainContentPrueba';
import { Profile } from '../../../interfaces/UserInterfaces';
import { Course, Question, ModuleEvaluation } from '../../../interfaces/StudentModule';
import { useModuleDetail } from '../../../hooks/useModuleDetail';
import DrawerNavigation from '../../../components/student/DrawerNavigation';

const Home: React.FC = () => {
  const { logout, user, profileInfo } = useAuth();
  const router = useRouter();
  const { course_id } = router.query;
  const courseIdNumber = Array.isArray(course_id) ? parseInt(course_id[0]) : parseInt(course_id || '0');
  const { courseData, isLoading, error } = useModuleDetail(courseIdNumber);
  const [selectedSession, setSelectedSession] = useState<{ video?: string, questions?: Question[] }>({});

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
        />
      </div>
      <div className="flex flex-grow pt-16"> {/* pt-16 to offset the fixed Navbar height */}
        <DrawerNavigation />
        <div className="ml-16 mr-80 w-full p-4"> {/* Adjusted margins to accommodate DrawerNavigation and SidebarPrueba */}
          <MainContentPrueba sessionVideo={selectedSession.video} evaluationQuestions={selectedSession.questions} />
        </div>
        <SidebarPrueba
          courseModules={courseData[0].courseModules}
          courseEvaluation={courseData[0].Evaluation}
          moduleEvaluations={courseData[0].courseModules.map(module => module.moduleEvaluation)}
          onSelect={handleSelect}
        />
      </div>
    </div>
  );
};

export default Home;
