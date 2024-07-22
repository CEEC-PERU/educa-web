import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Corporate/CorporateSideBar';
import { useAuth } from '../../context/AuthContext';
import { getCoursesByEnterprise } from '../../services/courseStudent';
import Loader from '../../components/Loader';
import './../../app/globals.css';

const CorporateCourses: React.FC = () => {
  const { user } = useAuth();
  const enterpriseId = user ? (user as { id: number; role: number; dni: string; enterprise_id: number }).enterprise_id : null;
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (enterpriseId) {
      const fetchCourses = async () => {
        setLoading(true);
        try {
          const response = await getCoursesByEnterprise(enterpriseId);
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
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b">
      <Navbar bgColor="bg-gradient-to-r from-blue-500 to-violet-500 opacity-90" />
      <div className="flex flex-1 pt-16">
        <Sidebar showSidebar={true} setShowSidebar={() => {}} />
        <main className={`p-6 flex-grow transition-all duration-300 ease-in-out ml-20`}>
          <h2 className="text-2xl font-bold mb-6">Cursos de la Empresa</h2>
          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
               <p>cursos</p>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CorporateCourses;
