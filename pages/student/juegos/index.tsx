import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import AppLayout from "@/components/layouts/AppLayout";
import { Profile } from "../../../interfaces/User/UserInterfaces";
import { useCourseStudent } from "../../../hooks/useCourseStudents";
import CourseCard from "../../../components/student/CourseCard";
import FlashcardGame from "../../../components/student/FlashcardGame";
import { useRouter } from "next/router";
import "./../../../app/globals.css";

const JuegosIndex = () => {
  const { logout, user, profileInfo } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const { courseStudent, isLoading } = useCourseStudent();
  const router = useRouter();
  let name = "";
  let uri_picture = "";

  if (profileInfo) {
    const profile = profileInfo as Profile;
    name = profile.first_name;
    uri_picture = profile.profile_picture!;
  }

  const navigateToCourseDetails = (courseid: number) => {
    router.push({
      pathname: "/student/juegos/modulos",
      query: { courseid },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brandazul-600 pt-40 pb-40 p-4">
      <div className="flex flex-col lg:flex-row items-center p-8 rounded-lg shadow-md w-full max-w-screen-lg pb-20">
        <img
          src="https://res.cloudinary.com/dk2red18f/image/upload/v1721710871/WEB_EDUCA/fdlrrlouggyv3b7yvaag.gif"
          alt="Header Image"
          className="w-350 h-48 object-cover"
        />
      </div>
      <div className="w-full max-w-screen-lg mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {courseStudent.map((courseStudent) => (
          <CourseCard
            key={courseStudent.Course.course_id}
            name={courseStudent.Course.name}
            description={courseStudent.Course.description_short}
            image={courseStudent.Course.image}
            profesor={courseStudent.Course.courseProfessor.full_name}
            categoria={courseStudent.Course.courseCategory.name}
            course_id={courseStudent.Course.course_id}
            onClick={() =>
              navigateToCourseDetails(courseStudent.Course.course_id)
            }
            isJuegosIndex={false}
          />
        ))}
      </div>
    </div>
  );
};

JuegosIndex.getLayout = (page: React.ReactNode) => (
  <AppLayout noPadding>{page}</AppLayout>
);

export default JuegosIndex;
