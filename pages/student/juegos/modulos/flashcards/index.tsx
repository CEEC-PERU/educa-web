import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import { Profile } from "../../../../../interfaces/User/UserInterfaces";
import { useCourseStudent } from "../../../../../hooks/useCourseStudents";
import CourseCard from "../../../../../components/student/CourseCard";
import FlashcardGame from "../../../../../components/student/FlashcardGame";
import { useRouter } from "next/router";
import "./../../../../../app/globals.css";
import AppLayout from "@/components/layouts/AppLayout";

const Flashcard = () => {
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

  const navigateToCourseDetails = () => {
    router.push({
      pathname: "/student/course-details",
      query: { course_id: selectedCourse.course_id },
    });
    console.log("selectedCourse:", selectedCourse);
    console.log("selectedCourse.course_id:", selectedCourse?.course_id);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r  pb-40 from-brand-100 via-brand-200 to-brand-300 p-4">
      <div className="container mx-auto">
        <FlashcardGame />
      </div>
    </div>
  );
};

Flashcard.getLayout = (page: React.ReactNode) => (
  <AppLayout noPadding>{page}</AppLayout>
);

export default Flashcard;
