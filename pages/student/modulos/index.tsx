import React, { useState, useEffect } from 'react'; // Importamos React y hooks de estado y efectos.
import { useRouter } from 'next/router'; // Importamos el hook de enrutamiento de Next.js.
import SidebarPrueba from '../../../components/student/SideBarPrueba'; // Importamos el componente SidebarPrueba.
import { useAuth } from '../../../context/AuthContext'; // Importamos el contexto de autenticación.
import Navbar from '../../../components/Navbar'; // Importamos el componente Navbar.
import MainContentPrueba from '../../../components/student/MainContentPrueba'; // Importamos el componente MainContentPrueba.
import { Profile } from '../../../interfaces/UserInterfaces'; // Importamos la interfaz Profile.
import { Question, ModuleEvaluation, ModuleSessions } from '../../../interfaces/StudentModule'; // Importamos las interfaces relacionadas con los módulos de estudiante.
import { useModuleDetail } from '../../../hooks/useModuleDetail'; // Importamos el hook personalizado para obtener detalles del módulo.
import DrawerNavigation from '../../../components/student/DrawerNavigation'; // Importamos el componente DrawerNavigation.
import io from 'socket.io-client'; // Importamos la biblioteca Socket.io para cliente.
import { API_SOCKET_URL } from '../../../utils/Endpoints'; // Importamos la URL del socket desde los endpoints configurados.
import { progress } from '@material-tailwind/react';
import './../../../app/globals.css';

const socket = io(API_SOCKET_URL); // Inicializamos la conexión al servidor de sockets con la URL definida.

const Home: React.FC = () => {
  const { logout, user, profileInfo } = useAuth(); // Obtenemos funciones y estados del contexto de autenticación.
  const router = useRouter(); 
  const { course_id } = router.query; // Obtenemos el ID del curso desde los parámetros de la URL.
  const userInfo = user as { id: number }; // Tipamos el objeto user para que tenga un campo id.
  const courseIdNumber = Array.isArray(course_id) ? parseInt(course_id[0]) : parseInt(course_id || '0'); // Convertimos el ID del curso en un número, manejando el caso de que sea un array.
  const { courseData, isLoading, error } = useModuleDetail(courseIdNumber); // Usamos nuestro hook personalizado para obtener los datos del curso.
  
  // Estado para almacenar el ID del módulo seleccionado.
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  // Estado para almacenar la sesión seleccionada.
  const [selectedSession, setSelectedSession] = useState<{ video?: string, questions?: Question[], session_id?: number , module_id?: number }>({});
  // Estado para controlar si el drawer (navegación lateral) está abierto.
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  // Estado para rastrear el progreso del video.
  const [videoProgress, setVideoProgress] = useState<{ [key: string]: number }>({});

  let name = ''; // Variable para el nombre del usuario.
  let uri_picture = ''; // Variable para la URL de la imagen de perfil.

  // Si tenemos información del perfil, la almacenamos en las variables correspondientes.
  if (profileInfo) { 
    const profile = profileInfo as Profile; 
    name = profile.first_name; 
    uri_picture = profile.profile_picture!;
  }

  // Función para manejar la selección de una sesión o evaluación.
  const handleSelect = (sessionName: string, evaluation?: ModuleEvaluation | Question[], moduleId?: number) => {
    // Actualizamos el estado del módulo seleccionado con el ID del módulo o null si no hay módulo seleccionado.
    setSelectedModuleId(moduleId || null);

    // Si la evaluación es un array de preguntas, actualizamos el estado de la sesión seleccionada con las preguntas y el ID del módulo.
    if (Array.isArray(evaluation)) {
      setSelectedSession({ questions: evaluation, module_id: moduleId });
    }
    // Si la evaluación es un objeto que contiene preguntas, actualizamos el estado de la sesión seleccionada con las preguntas y el ID del módulo.
    else if (evaluation && 'questions' in evaluation) {
      setSelectedSession({ questions: evaluation.questions, module_id: moduleId });
    }
    // Si no es una evaluación o preguntas, buscamos el módulo que contiene la sesión con el nombre especificado.
    else {
      const module = courseData?.[0]?.courseModules.find(m =>
        m.moduleSessions.some(s => s.name === sessionName)
      );

      // Si encontramos el módulo, buscamos la sesión dentro del módulo con el nombre especificado.
      if (module) {
        const session = module.moduleSessions.find(s => s.name === sessionName);

        // Si encontramos la sesión, actualizamos el estado de la sesión seleccionada con el enlace del video, el ID de la sesión y el ID del módulo.
        if (session) {
          setSelectedSession({
            video: session.video_enlace, // Almacenamos el enlace del video de la sesión.
            session_id: session.session_id, // Almacenamos el ID de la sesión.
            module_id: moduleId // Almacenamos el ID del módulo.
          });
        }
      }
    }
  };

  // Función para alternar el estado del drawer.
  const toggleSidebar = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Función para manejar el progreso del video.
  const handleVideoProgress = (progress: number, isCompleted: boolean) => {
    const progressupdate = Math.round(progress);
  
    if (selectedSession.video && selectedSession.session_id) { // Verifica que session_id esté presente
      const sessionProgress = {
        session_id: selectedSession.session_id, // Usa el session_id dinámico
        progress: progressupdate,
        is_completed: isCompleted,
        user_id: userInfo.id
      };
  
      socket.emit('session', sessionProgress);
      console.log("datos", sessionProgress);
  
      setVideoProgress((prevProgress) => ({
        ...prevProgress,
        [selectedSession.video!]: progress,
      }));
    }
  };

  // Manejo del evento de redimensionamiento de la ventana.
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

  // Condicionales para manejar diferentes estados de carga y error.
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
            onProgress={handleVideoProgress} // Pasamos la función handleVideoProgress como prop.
            selectedModuleId={selectedModuleId}
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
  );
};

export default Home;
