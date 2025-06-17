import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import Navbar from '../../../../components/Navbar';
import Sidebar from '../../../../components/comercial/ComercialSidebar';
import {
  getCoursesWithGradesByStudent,
  getModulesByCourseId2,
} from '../../../../services/courseStudent';
import { getUserById } from '../../../../services/userService';
import { getEnterprise } from '../../../../services/enterpriseService';
import Loader from '../../../../components/Loader';
import './../../../../app/globals.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Detail: React.FC = () => {
  const router = useRouter();
  const { user_id } = router.query as { user_id: string };
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [finalExam, setFinalExam] = useState<any[]>([]);
  const [student, setStudent] = useState<any>(null);
  const [enterprise, setEnterprise] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user_id) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const studentData = await getUserById(Number(user_id));
          setStudent(studentData);

          const enterpriseData = await getEnterprise(studentData.enterprise_id);
          setEnterprise(enterpriseData);

          const coursesData = await getCoursesWithGradesByStudent(
            Number(user_id)
          );
          setCourses(coursesData);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user_id]);

  const handleViewGrades = async (course: any) => {
    try {
      const modulesData = await getModulesByCourseId2(
        course.course_id,
        Number(user_id)
      );
      setModules(modulesData[0].courseModules);
      setFinalExam(modulesData[0].Evaluation);
      setSelectedCourse(course);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching module data:', error);
    }
  };

  const barChartData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Hours Spent',
        data: [5, 10, 15, 20, 25],
        backgroundColor: 'rgba(128, 0, 128, 0.7)',
      },
    ],
  };

  const doughnutChartData = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        label: 'Course Progress',
        data: [70, 30],
        backgroundColor: ['#8B00FF', '#D3D3D3'],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#F5F8FA] ">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={true} setShowSidebar={() => {}} />
        <main className="flex-grow transition-all duration-300 ease-in-out ml-20 px-4 sm:px-6 lg:px-8">
          {loading ? (
            <Loader />
          ) : (
            <div>
              {enterprise && student && (
                <div className="relative w-full max-w-full">
                  <img
                    src={enterprise.image_fondo}
                    className="w-full h-auto object-cover"
                    alt="Imagen de la empresa"
                  />
                  <div className="flex flex-col sm:flex-row items-center border-t border-b border-[#8282FF] bg-[#FFFFFF] p-4">
                    <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                      <img
                        src={
                          student.userProfile?.profile_picture ||
                          'default_profile_picture.png'
                        }
                        alt="Profile"
                        className="h-32 w-32 rounded-full"
                      />
                    </div>
                    <div className="text-center sm:text-left">
                      <h2 className="text-2xl font-bold text-blue-600 mb-2">
                        {student.userProfile?.first_name}{' '}
                        {student.userProfile?.last_name}
                      </h2>
                      <p className="text-lg text-gray-700">
                        {student.userProfile?.email}
                      </p>
                      <p className="text-md text-gray-500">
                        {student.userProfile?.job_title}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 flex flex-col items-center md:flex-row">
                  <div className="flex-shrink-0 mb-4 md:mb-0">
                    <img
                      className="w-10 h-10"
                      src="https://res.cloudinary.com/dk2red18f/image/upload/v1724705524/WEB_EDUCA/ICON/s5fgvj8kvm26dbjrljze.png"
                      alt="Icon"
                    />
                  </div>
                  <div className="ml-0 md:ml-6 flex-grow text-center md:text-left">
                    <h1 className="text-gray-600">Modulo 1</h1>
                    <p className="font-bold text-3xl">Nota:</p>
                    <p className="text-3xl text-green-900">75</p>
                  </div>
                  <div className="ml-0 md:ml-6 w-full md:w-auto mt-4 md:mt-0">
                    <Bar data={barChartData} options={{ responsive: true }} />
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col lg:flex-row gap-6 ">
                <div className="w-full lg:w-1/2 flex justify-center">
                  <div className="w-full h-80 bg-white p-6">
                    <Doughnut
                      data={doughnutChartData}
                      options={{ responsive: true }}
                    />
                  </div>
                </div>
                <div className="w-full lg:w-1/2 flex flex-col bg-white p-6">
                  <img
                    src="https://res.cloudinary.com/dk2red18f/image/upload/v1724343480/uuhx7zsmvbsn91hcdzex.png"
                    alt="Course"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <h3 className="mt-4 text-xl font-bold">Soft Skills</h3>
                  <p className="text-gray-600">Time Dedicated: 50 hours</p>
                  <p className="text-gray-600">Instructor: John Doe</p>
                  <p className="text-gray-500 mt-2">
                    Course Description: This is a brief description of the
                    course.
                  </p>
                </div>
              </div>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-sm p-6">
                  <h3 className="text-xl font-bold mb-4">Actividad Reciente</h3>
                  <ul className="space-y-4">
                    <li className="flex justify-between">
                      <span>Completed Module 1</span>
                      <span className="text-gray-500">2 hours ago</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Completed Module 2</span>
                      <span className="text-gray-500">4 hours ago</span>
                    </li>
                  </ul>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white rounded-sm p-6">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Calendario</h3>
                    {/* Calendar component can be added here */}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4">Pending Tasks</h3>
                    <ul className="space-y-4">
                      <li>Finish Module 3</li>
                      <li>Start Final Exam</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.back()}
                className="mt-12 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
              >
                Volver a Cursos
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Detail;
