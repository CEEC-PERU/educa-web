import React, { useState, useEffect } from 'react'; 
import { useRouter } from 'next/router'; 
import SidebarPrueba from '../../../components/student/SideBarPrueba'; 
import { useAuth } from '../../../context/AuthContext'; 
import Navbar from '../../../components/Navbar'; 
import MainContentPrueba from '../../../components/student/MainContentPrueba'; 
import { Profile } from '../../../interfaces/UserInterfaces'; 
import { Question, ModuleEvaluation } from '../../../interfaces/StudentModule'; 
import { useModuleDetail } from '../../../hooks/useModuleDetail'; 
import DrawerNavigation from '../../../components/student/DrawerNavigation'; 

const Home: React.FC = () => {
  const { logout, user, profileInfo } = useAuth(); 
  const router = useRouter(); // Inicializa el hook useRouter para obtener datos de la ruta
  const { course_id } = router.query; 
  const courseIdNumber = Array.isArray(course_id) ? parseInt(course_id[0]) : parseInt(course_id || '0'); // Convierte el ID del curso a número entero
  const { courseData, isLoading, error } = useModuleDetail(courseIdNumber); // Obtiene los datos del curso usando el hook useModuleDetail
  const [selectedSession, setSelectedSession] = useState<{ video?: string, questions?: Question[] }>({}); // Estado para la sesión seleccionada y preguntas de evaluación
  const [isDrawerOpen, setIsDrawerOpen] = useState(true); // Estado para controlar si el menú lateral está abierto o cerrado

  let name = ''; 
  let uri_picture = ''; 

  if (profileInfo) { // Si hay información de perfil disponible
    const profile = profileInfo as Profile; // Convierte el perfil a la interfaz Profile
    name = profile.first_name; // Asigna el nombre del usuario desde el perfil
    uri_picture = profile.profile_picture!; // Asigna la URL de la imagen de perfil desde el perfil
  }

  const handleSelect = (sessionName: string, evaluation?: ModuleEvaluation | Question[]) => {
    if (Array.isArray(evaluation)) { // Si es un array de evaluaciones
      setSelectedSession({ questions: evaluation }); // Establece las preguntas de evaluación seleccionadas
    } else if (evaluation && 'questions' in evaluation) { // Si es un objeto con preguntas de evaluación
      setSelectedSession({ questions: evaluation.questions }); // Establece las preguntas de evaluación seleccionadas
    } else { // Si es una sesión de video
      const module = courseData?.[0]?.courseModules.find(m =>
        m.moduleSessions.some(s => s.name === sessionName)
      ); // Encuentra el módulo que contiene la sesión seleccionada

      if (module) { // Si se encuentra el módulo
        const session = module.moduleSessions.find(s => s.name === sessionName); // Encuentra la sesión específica por nombre
        if (session) {
          setSelectedSession({ video: session.video_enlace }); // Establece el video de la sesión seleccionada
        }
      }
    }
  };

  const toggleSidebar = () => {
    setIsDrawerOpen(!isDrawerOpen); // Función para alternar entre abrir y cerrar el menú lateral
  };

  useEffect(() => {
    const handleResize = () => { // Función para manejar cambios en el tamaño de la ventana
      if (window.innerWidth > 1014) { // Si el ancho de la ventana es mayor que 1014px
        setIsDrawerOpen(true); // Abre el menú lateral
      }
    };

    window.addEventListener('resize', handleResize); // Agrega un evento para escuchar cambios en el tamaño de la ventana

    return () => {
      window.removeEventListener('resize', handleResize); // Remueve el evento cuando el componente se desmonta
    };
  }, []); // Se ejecuta solo una vez al montar el componente

  if (isLoading) { // Si los datos del curso están cargando
    return <div>Loading...</div>; // Muestra un mensaje de carga
  }

  if (error) { // Si hay un error al obtener los datos del curso
    return <div>Error: {error}</div>; // Muestra un mensaje de error
  }

  if (!courseData || courseData.length === 0) { // Si no hay datos del curso o está vacío
    return <div>No course data available.</div>; // Muestra un mensaje indicando que no hay datos de curso disponibles
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300"> {/* Contenedor principal con diseño flexible y fondo gradiente */}
      <div className="fixed w-full z-10"> {/* Barra de navegación fija en la parte superior */}
        <Navbar
          bgColor="bg-gradient-to-r from-brand-100 via-brand-200 to-brand-300" // Color de fondo de la barra de navegación
          borderColor="border border-stone-300" // Color del borde de la barra de navegación
          user={user ? { profilePicture: uri_picture } : undefined} // Proporciona datos del usuario (nombre y foto de perfil)
          toggleSidebar={toggleSidebar} // Función para alternar el menú lateral
        />
      </div>
      <div className="flex flex-grow pt-16 flex-col lg:flex-row relative"> {/* Contenido principal flexible con navegación lateral y barra superior */}
        <DrawerNavigation isDrawerOpen={isDrawerOpen} /> {/* Navegación lateral con estado para abrir/cerrar */}
        <div className={`flex-1 p-4 lg:ml-16 lg:mr-96 z-0 ${isDrawerOpen ? 'ml-64' : 'ml-16'}`}> {/* Contenido principal que se ajusta según el estado del menú lateral */}
          <MainContentPrueba sessionVideo={selectedSession.video} evaluationQuestions={selectedSession.questions} /> {/* Componente principal para mostrar video o preguntas de evaluación */}
        </div>
        <SidebarPrueba
          courseModules={courseData[0].courseModules} // Módulos del curso
          courseEvaluation={courseData[0].Evaluation} // Evaluación final del curso
          moduleEvaluations={courseData[0].courseModules.map(module => module.moduleEvaluation)} // Evaluaciones de cada módulo
          onSelect={handleSelect} // Función para seleccionar sesión o evaluación
        />
      </div>
    </div>
  );
};

export default Home; // Exporta el componente Home para su uso en otras partes de la aplicación
