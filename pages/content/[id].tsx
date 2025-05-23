import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getCourse, deleteCourse } from '../../services/courseService';
import { getEvaluations } from '../../services/evaluationService';
import { Course } from '../../interfaces/Courses/Course';
import { Evaluation } from '../../interfaces/Evaluation';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Content/SideBar';
import DetailView from '../../components/DetailView';
import ActionButtons from '../../components/Content/ActionButtons';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Loader from '../../components/Loader';
import ModalConfirmation from '../../components/ModalConfirmation';
import AlertComponent from '../../components/AlertComponent';
import useModal from '../../hooks/useModal';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import './../../app/globals.css';

const CourseDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [course, setCourse] = useState<Course | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [loading, setLoading] = useState(true);
  const { isVisible, showModal, hideModal } = useModal();
  const [success, setSuccess] = useState<string | null>(null);

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
        setLoading(false);
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

  const evaluationName =
    evaluations.find(
      (evaluation) => evaluation.evaluation_id === course.evaluation_id
    )?.name || 'No asignado';

  const courseDetails = [
    { value: course.description_short },
    { value: course.description_large },
    { label: 'Evaluación:', value: evaluationName },
    { label: 'Duración del curso:', value: course.duration_course },
    { label: 'Activo:', value: course.is_active ? 'Sí' : 'No' },
  ];

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
        <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
        <div className="flex flex-1 pt-16">
          <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
          <main
            className={`p-6 flex-grow transition-all duration-300 ease-in-out ${
              showSidebar ? 'ml-20' : ''
            }`}
          >
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
            <div className="flex flex-col md:flex-row p-2 flex-1">
              <DetailView
                title={course.name}
                imageUrl={course.image}
                details={courseDetails}
                videoUrl={course.intro_video}
              />
              <div className="md:ml-8 mt-4 md:mt-0 bg-white rounded-md flex-shrink-0">
                <ActionButtons
                  onEdit={handleEdit}
                  onDelete={showModal}
                  customSize={true}
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
    </ProtectedRoute>
  );
};

export default CourseDetail;
