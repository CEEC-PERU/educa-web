import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/supervisor/SibebarSupervisor';
import { useAuth } from '../../../context/AuthContext';
import { getCoursesBySupervisor } from '../../../services/courseStudent';
import Loader from '../../../components/Loader';
import FileUpload from '../../../components/FileUpload';
import './../../../app/globals.css';

interface Student {
  profile_picture: string;
  name: string;
}

interface Course {
  course_id: number;
  image: string;
  name: string;
  uploaded_materials: boolean;
  description_short: string;
  studentCount: number;
  progressPercentage: number;
  completedPercentage: number;
  approvedPercentage: number;
  students: Student[];
}

const CorporateCourses: React.FC = () => {
  const { user } = useAuth();
  const userId = user ? (user as { id: number; role: number; dni: string; enterprise_id: number }).id : null;

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (userId) {
      const fetchCourses = async () => {
        setLoading(true);
        try {
          const storedUserInfo = localStorage.getItem('userInfo');
          if (!storedUserInfo) throw new Error('No se encontró información del usuario en el localStorage.');
          const { id } = JSON.parse(storedUserInfo);
          const response = await getCoursesBySupervisor(id);
          const filteredCourses = response.filter((course: Course) => course.uploaded_materials === true);
          setCourses(filteredCourses);
        } catch (error) {
          console.error('Error fetching courses:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchCourses();
    }
  }, [userId]);

  const openModal = (course: Course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
    setSelectedFile(null);
  };

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
  };

  

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={true} setShowSidebar={() => {}} />
        <main className="p-6 flex-grow ml-20">
          <h2 className="text-4xl font-bold mb-6 text-[#0010F7]">CURSOS </h2>
          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
              {courses.map((course) => (
                <div key={course.course_id} className="bg-white rounded-2xl shadow-md overflow-hidden">
                  <img src={course.image} alt={course.name} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-[#1E1E1E]">{course.name}</h3>
                    
                    <button
                      className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 mt-4"
                      onClick={() => openModal(course)}
                    >
                      Subir Archivo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* MODAL */}
      {showModal && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-xl p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl"
              onClick={closeModal}
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold text-center text-[#0010F7] mb-4">
              Subir archivo para: {selectedCourse.name}
            </h2>
            <p className="text-center mb-4 text-gray-600">
              Asegúrate de que el archivo esté listo para importarse.
            </p>
            <FileUpload
              onFileChange={handleFileChange}
              onFileRemove={handleFileRemove}
              fileName={selectedFile?.name}
              fileSize={selectedFile ? Number((selectedFile.size / 1024).toFixed(2)) : undefined}
              title="Click para subir."
              description="Arrastra y suelta o selecciona un archivo."
              instructions="Archivos .pdf y .ppt  son compatibles."
            />
            <div className="flex justify-end mt-6">
              <button
                className={`bg-blue-600 text-white px-4 py-2 rounded ${!selectedFile ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => {
                  if (selectedFile) {
                    console.log('Archivo subido:', selectedFile.name, 'para curso', selectedCourse.name);
                    closeModal(); // Puedes reemplazar esto con la lógica real de subida
                  }
                }}
                disabled={!selectedFile}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorporateCourses;
