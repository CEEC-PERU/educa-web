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

const socket = io(API_SOCKET_URL); // Inicializamos la conexión al servidor de sockets con la URL definida.

const Home: React.FC = () => {
  const { logout, user, profileInfo } = useAuth(); // Obtenemos funciones y estados del contexto de autenticación.
  const router = useRouter(); 
  const { course_id } = router.query; // Obtenemos el ID del curso desde los parámetros de la URL.
  const userInfo = user as { id: number }; // Tipamos el objeto `user` para que tenga un campo `id`.
  const courseIdNumber = Array.isArray(course_id) ? parseInt(course_id[0]) : parseInt(course_id || '0'); // Convertimos el ID del curso en un número, manejando el caso de que sea un array.
  const { courseData, isLoading, error } = useModuleDetail(courseIdNumber); // Usamos nuestro hook personalizado para obtener los datos del curso.

  const [selectedSession, setSelectedSession] = useState<{ video?: string, questions?: Question[], session_id?: number }>({});

  const [isDrawerOpen, setIsDrawerOpen] = useState(true); // Estado para controlar si el drawer (navegación lateral) está abierto.
  const [videoProgress, setVideoProgress] = useState<{ [key: string]: number }>({}); // Estado para rastrear el progreso del video.

  let name = ''; // Variable para el nombre del usuario.
  let uri_picture = ''; // Variable para la URL de la imagen de perfil.

  if (profileInfo) { // Si tenemos información del perfil...
    const profile = profileInfo as Profile; // Tipamos la información del perfil.
    name = profile.first_name; // Obtenemos el primer nombre.
    uri_picture = profile.profile_picture!; // Obtenemos la URL de la imagen de perfil.
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
          setSelectedSession({ 
            video: session.video_enlace, 
            session_id: session.session_id // Almacena session_id aquí
          });
        }
      }
    }
  };
  
  const handleContinue = () => { // Función para manejar el botón de continuar.
    const currentModule = courseData?.[0]?.courseModules.find(m =>
      m.moduleSessions.some(s => s.video_enlace === selectedSession.video)
    );

    if (!currentModule) return;

    const currentSessionIndex = currentModule.moduleSessions.findIndex(s => s.video_enlace === selectedSession.video);

    if (currentSessionIndex === -1) return;

    const nextSession = currentModule.moduleSessions[currentSessionIndex + 1];

    if (nextSession) {
      setSelectedSession({ video: nextSession.video_enlace }); // Actualizamos el estado con el video de la siguiente sesión.
    } else {
      setSelectedSession({ questions: currentModule.moduleEvaluation.questions }); // Si no hay más sesiones, mostramos las preguntas de evaluación del módulo.
    }
  };

  const toggleSidebar = () => { // Función para alternar el estado del drawer.
    setIsDrawerOpen(!isDrawerOpen);
  };

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
  
  useEffect(() => {
    const handleResize = () => { // Función para manejar el redimensionamiento de la ventana.
      if (window.innerWidth > 1014) {
        setIsDrawerOpen(true); // Abrimos el drawer si el ancho de la ventana es mayor a 1014px.
      }
    };

    window.addEventListener('resize', handleResize); // Añadimos un listener al evento de redimensionamiento.

    return () => {
      window.removeEventListener('resize', handleResize); // Eliminamos el listener cuando el componente se desmonte.
    };
  }, []);

  if (isLoading) { // Si los datos están cargando...
    return <div>Loading...</div>; // Mostramos un mensaje de carga.
  }

  if (error) { // Si hubo un error...
    return <div>Error: {error}</div>; // Mostramos el error.
  }

  if (!courseData || courseData.length === 0) { // Si no hay datos del curso...
    return <div>No course data available.</div>; // Mostramos un mensaje indicando que no hay datos del curso.
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
            onProgress={handleVideoProgress} // Pasamos la función handleVideoProgress como prop.
            
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
