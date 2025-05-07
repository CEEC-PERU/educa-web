import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/supervisor/SibebarSupervisor';
import { useAuth } from '../../../context/AuthContext';
import { getCoursesBySupervisor } from '../../../services/courseStudent';
import Loader from '../../../components/Loader';
import { API_MATERIALS } from '../../../utils/Endpoints';
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
  const userId = user ? (user as { id: number }).id : null;

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (userId) {
      const fetchCourses = async () => {
        setLoading(true);
        try {
          const storedUserInfo = localStorage.getItem('userInfo');
          if (!storedUserInfo)
            throw new Error(
              'No se encontró información del usuario en el localStorage.'
            );
          const { id } = JSON.parse(storedUserInfo);
          const response = await getCoursesBySupervisor(id);
          const filteredCourses = response.filter(
            (course: Course) => course.uploaded_materials === true
          );
          setCourses(filteredCourses);
        } catch (error) {
          console.error('Error fetching courses:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchCourses();
    }
  }, [userId, showSuccess]); // Actualizar cursos cuando se muestra éxito

  const openModal = (course: Course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
    setSelectedFiles([]);
  };

  const handleFilesChange = (files: File[]) => {
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleFileRemove = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!selectedCourse || selectedFiles.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('materials', file);
    });
    formData.append('course_id', selectedCourse.course_id.toString());

    try {
      const response = await fetch(`${API_MATERIALS}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Error al subir archivos');

      // Mostrar notificación de éxito
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); // Ocultar después de 3 segundos

      closeModal();
    } catch (error) {
      console.error('Error al subir archivos:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50">
      {/* Notificación de éxito */}
      {showSuccess && (
        <div className="fixed top-20 right-4 z-50">
          <div className="bg-green-500  text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-fade-in-up">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <div>
              <p className="font-semibold">¡Éxito!</p>
              <p className="text-sm">
                Los archivos se han subido correctamente.
              </p>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="ml-4 text-white hover:text-green-100"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <Navbar bgColor="bg-gradient-to-r from-blue-600 to-indigo-700" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={true} setShowSidebar={() => {}} />

        <main className="p-6 flex-grow ml-20">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Gestión de Cursos
              </h1>
              <p className="text-gray-600 mt-2">
                Administra los materiales de tus cursos
              </p>
            </div>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course) => (
                <div
                  key={course.course_id}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative">
                    <img
                      src={course.image || '/default-course.jpg'}
                      alt={course.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          '/default-course.jpg';
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-xl font-bold text-white">
                        {course.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {course.description_short || 'Sin descripción disponible'}
                    </p>

                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-gray-500 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                        <span className="text-sm text-gray-600">
                          {course.studentCount || 0} estudiantes
                        </span>
                      </div>
                    </div>
                    {/* Notificación de éxito 
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Progreso</span>
                        <span>{course.progressPercentage || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${course.progressPercentage || 0}%` }}
                        ></div>
                      </div>
                    </div>*/}

                    <button
                      onClick={() => openModal(course)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      Subir Materiales
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {showModal && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  Subir materiales para:{' '}
                  <span className="font-bold">{selectedCourse.name}</span>
                </h2>
                <button
                  className="text-white hover:text-gray-200 text-2xl"
                  onClick={closeModal}
                >
                  &times;
                </button>
              </div>
            </div>

            <div className="p-6">
              <FileUpload
                onFilesChange={handleFilesChange}
                onFileRemove={handleFileRemove}
                files={selectedFiles}
              />

              {selectedFiles.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <h3 className="font-medium text-gray-700 mb-2">
                    Archivos seleccionados:
                  </h3>
                  <ul className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center bg-gray-50 p-2 rounded"
                      >
                        <span className="text-sm text-gray-600 truncate flex-1">
                          <svg
                            className="w-4 h-4 inline mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500 mr-2">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                        <button
                          onClick={() => handleFileRemove(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Botón para agregar más archivos */}
              <div className="flex justify-start pt-4">
                <label className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-lg shadow hover:bg-indigo-200 cursor-pointer transition-colors">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Agregar archivo
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept=".pdf,.ppt,.pptx"
                    onChange={(e) => {
                      if (e.target.files) {
                        const allowedExtensions = ['pdf', 'ppt', 'pptx'];
                        const validFiles = Array.from(e.target.files).filter(
                          (file) => {
                            const ext = file.name
                              .split('.')
                              .pop()
                              ?.toLowerCase();
                            return ext && allowedExtensions.includes(ext);
                          }
                        );

                        if (validFiles.length !== e.target.files.length) {
                          alert(
                            'Solo se permiten archivos PDF y PowerPoint (.pdf, .ppt, .pptx)'
                          );
                        }

                        handleFilesChange(validFiles);
                        e.target.value = '';
                      }
                    }}
                  />
                </label>
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpload}
                  disabled={selectedFiles.length === 0 || uploading}
                  className={`px-4 py-2 rounded-lg text-white transition-colors flex items-center ${
                    selectedFiles.length === 0 || uploading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {uploading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Subir Archivos
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorporateCourses;
