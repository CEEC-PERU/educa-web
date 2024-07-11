import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getCourse, deleteCourse } from '../../services/courseService';
import { getEvaluations } from '../../services/evaluationService';
import { Course } from '../../interfaces/Course';
import { Evaluation } from '../../interfaces/Evaluation';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Content/SideBar';
import DetailView from '../../components/DetailView';
import ActionButtons from '../../components/ActionButtons';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Loader from '../../components/Loader'; // Importar el componente Loader
import ModalConfirmation from '../../components/ModalConfirmation';
import AlertComponent from '../../components/AlertComponent'; // Importar el componente AlertComponent
import useModal from '../../hooks/useModal';
import './../../app/globals.css';

const CourseDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [course, setCourse] = useState<Course | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [loading, setLoading] = useState(true); // Estado de carga
  const { isVisible, showModal, hideModal } = useModal();
  const [success, setSuccess] = useState<string | null>(null); // Estado para mensaje de éxito

  useEffect(() => {
    if (id) {
      const fetchCourse = async () => {
        try {
          const courseData = await getCourse(id);
          setCourse(courseData);
        } catch (error) {
          console.error('Error fetching course details:', error);
        }
      };

      const fetchEvaluations = async () => {
        try {
          const evaluationsData = await getEvaluations();
          setEvaluations(evaluationsData);
        } catch (error) {
          console.error('Error fetching evaluations:', error);
        }
      };

      Promise.all([fetchCourse(), fetchEvaluations()]).then(() => {
        setLoading(false); // Finaliza la carga
      });
    }
  }, [id]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    localStorage.setItem('sidebarState', JSON.stringify(!showSidebar));
  };

  const handleEdit = () => {
    if (course) {
      router.push(`/content/editCourse?id=${course.course_id}`);
    }
  };

  const handleDelete = async () => {
    if (course) {
      try {
        await deleteCourse(course.course_id.toString());
        setSuccess('Registro eliminado correctamente');
        router.push('/content');
      } catch (error) {
        console.error('Error eliminando el curso:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!course) {
    return <p>Loading...</p>;
  }

  const evaluationName = evaluations.find(evaluation => evaluation.evaluation_id === course.evaluation_id)?.name || 'No asignado';

  const courseDetails = [
    { value: course.description_short },
    { value: course.description_large },
    { label: 'Evaluación:', value: evaluationName },
    { label: 'Duración del curso:', value: course.duration_course },
    { label: 'Activo:', value: course.is_active ? 'Sí' : 'No' },
  ];

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90"/>
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`p-6 flex-grow transition-all duration-300 ease-in-out ${showSidebar ? 'ml-20' : ''}`}>
          {success && (
            <AlertComponent
              type="success"
              message={success}
              onClose={() => setSuccess(null)}
            />
          )}
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center text-purple-600 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Volver
          </button>
          <div className="flex p-2">
            <DetailView
              title={course.name}
              imageUrl={course.image}
              details={courseDetails}
              videoUrl={course.intro_video}
            />
            <div className="ml-8 bg-white rounded-md">
              <ActionButtons
                onEdit={handleEdit}
                onDelete={showModal}
              />
            </div>
          </div>
        </main>
      </div>
      <ModalConfirmation
        show={isVisible}
        onClose={hideModal}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default CourseDetail;
