import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Navbar';
import { Enterprise } from '../../../interfaces/Enterprise';
import { User } from '../../../interfaces/UserCourse';
import { Course } from '../../../interfaces/Course';
import Sidebar from '../../../components/Admin/SideBarAdmin';
import { getCompanies, getUsersByCompanyAndRole } from '../../../services/userService';
import { getCourses } from '../../../services/courseService';
import { assignStudentsToCourse } from '../../../services/courseStudent';
import FormField from '../../../components/FormField';
import ButtonComponent from '../../../components/ButtonDelete';
import AlertComponent from '../../../components/AlertComponent';
import Loader from '../../../components/Loader';

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
          const studentsData = await getUsersByCompanyAndRole(selectedCompany, 1); // 1 es el role_id para estudiantes
          setStudents(studentsData);
        } catch (error) {
          console.error('Error fetching students:', error);
        }
      };

      fetchStudents();
    }
  }, [selectedCompany]);

  const handleCompanyChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target instanceof HTMLSelectElement || e.target instanceof HTMLInputElement) {
      setSelectedCompany(Number(e.target.value));
    }
  };

  const handleCourseChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target instanceof HTMLSelectElement || e.target instanceof HTMLInputElement) {
      setCourseId(Number(e.target.value));
    }
  };

  const handleAssignStudents = async () => {
    if (!selectedCompany || !courseId) {
      setError('Selecciona una empresa y un curso');
      return;
    }
    setLoading(true);
    try {
      const result = await assignStudentsToCourse(selectedCompany, courseId);
      setSuccess('Estudiantes asignados correctamente al curso');
      if (result.alreadyAssigned.length > 0) {
        const alreadyAssignedStudents = students.filter(student => result.alreadyAssigned.includes(student.user_id));
        setAlreadyAssigned(alreadyAssignedStudents);
        setError('Algunos estudiantes ya estaban asignados al curso');
      }
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setSuccess(null);
        setError(null);
      }, 3000);
    } catch (error) {
      setError('Error asignando estudiantes al curso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className={`p-6 flex-grow transition-all duration-300 ease-in-out ${showSidebar ? 'ml-20' : ''}`}>
          {showAlert && (
            <AlertComponent
              type="success"
              message="Estudiantes asignados correctamente al curso"
              onClose={() => setShowAlert(false)}
            />
          )}
          {error && (
            <AlertComponent
              type="danger"
              message={error}
              onClose={() => setError(null)}
            />
          )}
          <h2 className="text-2xl font-bold mb-6">Asignar Estudiantes a Curso</h2>
          <div className="mb-4">
            <FormField
              id="company"
              label="Selecciona Empresa"
              type="select"
              value={selectedCompany?.toString() || ''}
              onChange={handleCompanyChange}
              options={[{ value: '', label: 'Seleccionar Empresa' }, ...companies.map(company => ({ value: company.enterprise_id.toString(), label: company.name }))]}
            />
          </div>
          <div className="mb-4">
            <FormField
              id="course"
              label="Selecciona Curso"
              type="select"
              value={courseId?.toString() || ''}
              onChange={handleCourseChange}
              options={[{ value: '', label: 'Seleccionar Curso' }, ...courses.map(course => ({ value: course.course_id.toString(), label: course.name }))]}
            />
          </div>
          <ButtonComponent
            buttonLabel="Asignar Estudiantes"
            backgroundColor="bg-gradient-to-r from-green-500 to-green-400"
            textColor="text-white"
            fontSize="text-xs"
            buttonSize="py-2 px-7"
            onClick={handleAssignStudents}
          />
          {success && <p className="text-green-500 mt-4">{success}</p>}
          {alreadyAssigned.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-4">Estudiantes ya asignados</h3>
              {alreadyAssigned.map(student => (
                <div key={student.user_id} className="mb-2">
                  {student.userProfile?.first_name} {student.userProfile?.last_name} ({student.dni})
                </div>
              ))}
            </div>
          )}
          {students.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Estudiantes de la Empresa</h3>
              {students.map(student => (
                <div key={student.user_id} className="mb-2">
                  {student.userProfile?.first_name} {student.userProfile?.last_name} ({student.dni})
                </div>
              ))}
            </div>
          )}
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