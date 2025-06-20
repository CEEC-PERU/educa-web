import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Navbar';
import { Enterprise } from '../../../interfaces/Enterprise';
import { User } from '../../../interfaces/UserCourse';
import { Course } from '../../../interfaces/Courses/Course';
import Sidebar from '../../../components/Admin/SideBarAdmin';
import {
  getCompanies,
  getUsersByCompanyAndRole,
} from '../../../services/userService';
import { getCourses } from '../../../services/courseService';
import {
  assignStudentsToCourse,
  getUnassignedStudents,
} from '../../../services/courseStudent';
import FormField from '../../../components/FormField';
import ButtonContent from '../../../components/Content/ButtonContent';
import AlertComponent from '../../../components/AlertComponent';
import Loader from '../../../components/Loader';
import Table from '../../../components/Table';
import './../../../app/globals.css';

const AssignStudents: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [companies, setCompanies] = useState<Enterprise[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [courseId, setCourseId] = useState<number | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alreadyAssigned, setAlreadyAssigned] = useState<User[]>([]);
  const [unassignedStudents, setUnassignedStudents] = useState<User[]>([]);
  const [newlyAssigned, setNewlyAssigned] = useState<User[]>([]);
  const [companyName, setCompanyName] = useState<string>('');
  const [courseName, setCourseName] = useState<string>('');

  const router = useRouter();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companiesData = await getCompanies();
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    const fetchCourses = async () => {
      try {
        const coursesData = await getCourses();
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCompanies();
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      const fetchStudents = async () => {
        try {
          const studentsData = await getUsersByCompanyAndRole(
            selectedCompany,
            2
          );
          setStudents(studentsData);
          // Actualizar nombre de la empresa seleccionada
          const company = companies.find(
            (c) => c.enterprise_id === selectedCompany
          );
          if (company) setCompanyName(company.name);
        } catch (error) {
          console.error('Error fetching students:', error);
        }
      };

      fetchStudents();
    }
  }, [selectedCompany, companies]);

  useEffect(() => {
    if (courseId && selectedCompany) {
      const fetchUnassignedStudents = async () => {
        try {
          const unassignedStudents = await getUnassignedStudents(
            courseId,
            selectedCompany
          );
          setUnassignedStudents(unassignedStudents);
          // Actualizar nombre del curso seleccionado
          const course = courses.find((c) => c.course_id === courseId);
          if (course) setCourseName(course.name);
        } catch (error) {
          console.error('Error fetching unassigned students:', error);
        }
      };

      fetchUnassignedStudents();
    }
  }, [courseId, selectedCompany, courses]);

  const handleCompanyChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.target instanceof HTMLSelectElement) {
      const value = Number(e.target.value);
      setSelectedCompany(value);
      setNewlyAssigned([]);
      setAlreadyAssigned([]);
      setSuccess(null);
      setError(null);
    }
  };

  const handleCourseChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.target instanceof HTMLSelectElement) {
      const value = Number(e.target.value);
      setCourseId(value);
      setNewlyAssigned([]);
      setAlreadyAssigned([]);
      setSuccess(null);
      setError(null);
    }
  };

  const handleAssignStudents = async () => {
    if (!selectedCompany || !courseId) {
      setError('Por favor selecciona una empresa y un curso');
      setShowAlert(true);
      return;
    }

    setLoading(true);
    try {
      const result = await assignStudentsToCourse(selectedCompany, courseId);

      // Estudiantes recién asignados (no estaban antes)
      const newlyAssignedStudents = students.filter((student) =>
        result.newlyAssigned.includes(student.user_id)
      );

      // Estudiantes que ya estaban asignados
      const alreadyAssignedStudents = students.filter((student) =>
        result.alreadyAssigned.includes(student.user_id)
      );

      setNewlyAssigned(newlyAssignedStudents);
      setAlreadyAssigned(alreadyAssignedStudents);

      // Actualizar lista de no asignados
      const updatedUnassigned = await getUnassignedStudents(
        courseId,
        selectedCompany
      );
      setUnassignedStudents(updatedUnassigned);

      // Mostrar mensajes apropiados
      if (newlyAssignedStudents.length > 0) {
        setSuccess(
          `${newlyAssignedStudents.length} estudiantes asignados exitosamente al curso ${courseName}`
        );
      }

      if (alreadyAssignedStudents.length > 0) {
        setError(
          `${alreadyAssignedStudents.length} estudiantes ya estaban asignados previamente al curso`
        );
      }

      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    } catch (error) {
      setError('Error al asignar estudiantes al curso');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  // Configuración de columnas para las tablas
  const studentColumns = [
    { label: 'Nombre', key: 'name', align: 'left' },
    { label: 'DNI', key: 'dni' },
    { label: 'Email', key: 'email', align: 'left' },
  ];

  // Preparar datos para las tablas
  const unassignedRows = unassignedStudents.map((student) => ({
    name: `${student.userProfile?.first_name} ${student.userProfile?.last_name}`,
    dni: student.dni,
    email: student.userProfile?.email,
  }));

  const newlyAssignedRows = newlyAssigned.map((student) => ({
    name: `${student.userProfile?.first_name} ${student.userProfile?.last_name}`,
    dni: student.dni,
    email: student.userProfile?.email,
  }));

  const alreadyAssignedRows = alreadyAssigned.map((student) => ({
    name: `${student.userProfile?.first_name} ${student.userProfile?.last_name}`,
    dni: student.dni,
    email: student.userProfile?.email,
  }));

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main
          className={`p-6 flex-grow transition-all duration-300 ease-in-out ${
            showSidebar ? 'ml-20' : ''
          }`}
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Asignación de Usuarios a Cursos
          </h1>

          {showAlert && (
            <div className="mb-6">
              {success && (
                <AlertComponent
                  type="success"
                  message={success}
                  onClose={() => setShowAlert(false)}
                />
              )}
              {error && (
                <AlertComponent
                  type="warning"
                  message={error}
                  onClose={() => setShowAlert(false)}
                />
              )}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Panel de selección */}
            <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Selección
              </h2>

              <div className="mb-6">
                <FormField
                  id="company"
                  label="Empresa"
                  type="select"
                  value={selectedCompany?.toString() || ''}
                  onChange={handleCompanyChange}
                  options={[
                    { value: '', label: 'Seleccionar Empresa' },
                    ...companies.map((company) => ({
                      value: company.enterprise_id.toString(),
                      label: company.name,
                    })),
                  ]}
                />
              </div>

              <div className="mb-6">
                <FormField
                  id="course"
                  label="Curso"
                  type="select"
                  value={courseId?.toString() || ''}
                  onChange={handleCourseChange}
                  options={[
                    { value: '', label: 'Seleccionar Curso' },
                    ...courses.map((course) => ({
                      value: course.course_id.toString(),
                      label: course.name,
                    })),
                  ]}
                />
              </div>

              <div className="flex justify-center">
                <ButtonContent
                  buttonLabel="Asignar Usuarios"
                  backgroundColor="bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500"
                  textColor="text-white"
                  fontSize="text-sm"
                  buttonSize="py-2 px-4"
                  onClick={handleAssignStudents}
                  className="w-full transition-colors duration-200"
                />
              </div>

              {selectedCompany && courseId && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Resumen</h3>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Empresa:</span> {companyName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Curso:</span> {courseName}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">Usuarios sin asignar:</span>{' '}
                    {unassignedStudents.length}
                  </p>
                </div>
              )}
            </div>

            {/* Panel de resultados */}
            <div className="w-full lg:w-2/3 space-y-6">
              {/* Usuarios no asignados */}
              {unassignedStudents.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">
                      Usuarios sin asignar ({unassignedStudents.length})
                    </h2>
                  </div>
                  <Table columns={studentColumns} rows={unassignedRows} />
                </div>
              )}

              {/* Usuarios recién asignados */}
              {newlyAssigned.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    Usuarios asignados exitosamente ({newlyAssigned.length})
                  </h2>
                  <Table columns={studentColumns} rows={newlyAssignedRows} />
                </div>
              )}

              {/* Usuarios ya asignados */}
              {alreadyAssigned.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    Usuarios corporativos ya asignados previamente (
                    {alreadyAssigned.length})
                  </h2>
                  <Table columns={studentColumns} rows={alreadyAssignedRows} />
                </div>
              )}

              {/* Mensaje cuando no hay usuarios sin asignar */}
              {selectedCompany &&
                courseId &&
                unassignedStudents.length === 0 && (
                  <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <p className="text-gray-600">
                      Todos los usuarios de {companyName} ya están asignados al
                      curso {courseName}
                    </p>
                  </div>
                )}
            </div>
          </div>
        </main>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default AssignStudents;
