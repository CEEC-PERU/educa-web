import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/comercial/ComercialSidebar';
import { useAuth } from '../../context/AuthContext';
import { getCoursesByEnterpriseCalidad } from '../../services/courses/courseStudent';
import Loader from '../../components/Loader';
import CourseCard from './../../components/CourseCard';
import './../../app/globals.css';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';

const CorporateCourses: React.FC = () => {
  const { user } = useAuth();
  const enterpriseId = user
    ? (user as { id: number; role: number; dni: string; enterprise_id: number })
        .enterprise_id
    : null;
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (enterpriseId) {
      const fetchCourses = async () => {
        setLoading(true);
        try {
          const response = await getCoursesByEnterpriseCalidad(enterpriseId);
          console.log('Courses data:', response); // Verify that the data is correct
          setCourses(response);
        } catch (error) {
          console.error('Error fetching courses:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchCourses();
    }
  }, [enterpriseId]);

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
        <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
        <div className="flex flex-1 pt-16">
          <Sidebar showSidebar={true} setShowSidebar={() => {}} />
          <main
            className={`p-6 flex-grow transition-all duration-300 ease-in-out ml-20`}
          >
            <h2 className="text-4xl font-bold mb-6 text-[#0010F7]">CURSOS</h2>
            {loading ? (
              <Loader />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    redirectPath="nota"
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CorporateCourses;
