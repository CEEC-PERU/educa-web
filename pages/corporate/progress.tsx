// pages/corporate/progress.tsx
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Corporate/CorporateSideBar';
import { useAuth } from '../../context/AuthContext';
import { getCoursesByEnterprise } from '../../services/courseStudent';
import Loader from '../../components/Loader';
import CircularBar from '../../components/Corporate/CircularBar';
import './../../app/globals.css';

const CorporateCourses: React.FC = () => {
  const { user } = useAuth();
  const enterpriseId = (user && typeof user !== 'string' && 'enterprise_id' in user) ? user.enterprise_id : null;
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (enterpriseId) {
      const fetchCourses = async () => {
        setLoading(true);
        try {
          const response = await getCoursesByEnterprise(enterpriseId);
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
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={true} setShowSidebar={() => {}} />
        <main className={`p-6 flex-grow transition-all duration-300 ease-in-out ml-20`}>
          <h2 className="text-2xl font-bold mb-6">Cursos de la Empresa</h2>
          {loading ? (
            <Loader />
          ) : (
            <ul>
              {courses.map(course => (
                <li key={course.course_id} className="mb-4">
                  <div className="flex items-center">
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold">{course.name}</h3>
                      <p>{course.description_short}</p>
                    </div>
                    <CircularBar percentage={course.progressPercentage} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
};

export default CorporateCourses;