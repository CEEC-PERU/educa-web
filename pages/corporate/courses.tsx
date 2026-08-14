import React, { useState, useEffect } from 'react';
import type { NextPageWithLayout } from '../../types/next';
import AppLayout from "@/components/layouts/AppLayout";
import { useAuth } from '../../context/AuthContext';
import { getCoursesByEnterpriseCalidad } from '../../services/courses/courseStudent';
import Loader from '../../components/Loader';
import CourseCard from './../../components/CourseCard';
import './../../app/globals.css';

const CorporateCourses: NextPageWithLayout = () => {
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
    <div>
      <h2 className="text-4xl font-bold mb-6 text-[#0010F7]">CURSOS</h2>
      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} redirectPath="nota" />
          ))}
        </div>
      )}
    </div>
  );
};

CorporateCourses.getLayout = (page: React.ReactNode) => (
  <AppLayout>{page}</AppLayout>
);

export default CorporateCourses;
